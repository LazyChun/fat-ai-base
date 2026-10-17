import React, { useEffect, useMemo, useRef } from "react";
import styles from "./KnowledgeRetrievalNodeEdit.less";
import {
  ActionsAfterDone,
  BlockLine,
  ErrorHandle,
  FlowCollapse,
  VarsInputs,
  VarsOutputs,
} from "../../flowsdk";
import { useFlowNode, useI18n } from "../../flowsdk";
import { FatForm } from "../../flowsdk";
import { Input, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../flowsdk";
import { fetchAiConf } from "../../flowsdk";
import { basic } from "../../flowsdk";

const KnowledgeRetrievalNodeEdit = () => {
  const i18n = useI18n();
  const dispatch = useAppDispatch();
  const { knowledgeBases, loading } = useAppSelector((state) => state.ai);
  const didTryFetchRef = useRef(false);
  const { preNodes, node, onUpdateNode } =
    useFlowNode<LogicFlow.KnowledgeRetrievalNode>();

  useEffect(() => {
    if (knowledgeBases.length > 0) return;
    if (loading) return;
    if (didTryFetchRef.current) return;
    didTryFetchRef.current = true;
    dispatch(fetchAiConf());
  }, [dispatch, knowledgeBases.length, loading]);

  const knowledgeBaseOptions = useMemo(() => {
    return knowledgeBases.map((kb) => ({
      label: kb.name || kb.id,
      value: kb.id,
    }));
  }, [knowledgeBases]);

  useEffect(() => {
    const patch: Partial<LogicFlow.KnowledgeRetrievalNode> & { id: string } = {
      id: node.id,
    };
    let changed = false;

    if (node.knowledgeBaseIds === undefined || node.knowledgeBaseIds === null) {
      patch.knowledgeBaseIds = [];
      changed = true;
    }
    if (node.queryText === undefined || node.queryText === null) {
      patch.queryText = "";
      changed = true;
    }
    if (node.delayAfterAction === undefined || node.delayAfterAction === null) {
      patch.delayAfterAction = 0;
      changed = true;
    }

    const requiredOutputs: Array<{ key: string; dataType: string }> = [
      { key: "passages", dataType: "arrObject" },
      { key: "content", dataType: "string" },
      { key: "raw", dataType: "object" },
      { key: "time_used(ms)", dataType: "number" },
    ];

    const outParams = (node.outParams || []).map((p) => {
      if (p.path && p.path.length > 0) return p;
      changed = true;
      return { ...p, path: [p.id] };
    });

    const hasKey = (k: string) =>
      outParams.some((p) => p.name === k || p.fieldKey === k);
    const missing = requiredOutputs.filter((r) => !hasKey(r.key));
    if (missing.length > 0) {
      changed = true;
      for (const r of missing) {
        const oid = basic.uuid();
        outParams.push({
          id: oid,
          path: [oid],
          dataType: r.dataType,
          name: r.key,
          fieldKey: r.key,
        });
      }
    }

    if (changed) {
      patch.outParams = outParams;
      onUpdateNode(patch);
    }
  }, [node.id]);

  return (
    <div className={styles.container}>
      <VarsInputs defaultExpand={true} preNodes={preNodes} nodeInfo={node} />
      <BlockLine />
      <FlowCollapse
        defaultExpand={true}
        title={i18n.text("block.flow.node.config.knowledgeRetrieval.title")}
      >
        <FatForm className={styles.form}>
          <FatForm.Item
            style={{ marginBottom: 8 }}
            label={i18n.text(
              "block.flow.node.config.knowledgeRetrieval.knowledgeBases",
            )}
          >
            <Select
              size="small"
              mode="multiple"
              value={node.knowledgeBaseIds || []}
              onChange={(value) =>
                onUpdateNode({ id: node.id, knowledgeBaseIds: value })
              }
              options={knowledgeBaseOptions}
              placeholder={i18n.text(
                "block.flow.node.config.knowledgeRetrieval.knowledgeBases.placeholder",
              )}
            />
          </FatForm.Item>

          <FatForm.Item
            style={{ marginBottom: 0 }}
            label={i18n.text("block.flow.node.config.knowledgeRetrieval.queryText")}
            extra={i18n.text(
              "block.flow.node.config.knowledgeRetrieval.queryText.hint",
            )}
          >
            <Input.TextArea
              value={node.queryText || ""}
              onChange={(e) =>
                onUpdateNode({ id: node.id, queryText: e.target.value })
              }
              placeholder={i18n.text(
                "block.flow.node.config.knowledgeRetrieval.queryText.placeholder",
              )}
              autoSize={{ minRows: 3, maxRows: 10 }}
            />
          </FatForm.Item>
        </FatForm>
      </FlowCollapse>
      <BlockLine />
      <ActionsAfterDone />
      <BlockLine />
      <VarsOutputs
        defaultExpand={true}
        nodeInfo={node}
        editable={false}
        showFieldKey={false}
        createOutParamsByInParams={false}
        showErrorOutput={
          node.errorHandling && node.errorHandling?.exceptionHandling !== "break"
        }
      />
      <BlockLine />
      <ErrorHandle />
    </div>
  );
};

export default KnowledgeRetrievalNodeEdit;
