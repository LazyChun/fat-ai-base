import React, { useEffect, useMemo, useRef } from "react";
import styles from "./KnowledgeRetrievalNode.less";
import { InputTags, OutputTags } from "../../flowsdk";
import { useAppDispatch, useAppSelector } from "../../flowsdk";
import { useI18n } from "../../flowsdk";
import { fetchAiConf } from "../../flowsdk";

interface KnowledgeRetrievalNodeProps {
  node?: LogicFlow.KnowledgeRetrievalNode;
}

const KnowledgeRetrievalNode = (props: KnowledgeRetrievalNodeProps) => {
  const { node } = props;
  const i18n = useI18n();
  const dispatch = useAppDispatch();
  const { knowledgeBases, loading } = useAppSelector((state) => state.ai);
  const didTryFetchRef = useRef(false);

  useEffect(() => {
    if (knowledgeBases.length > 0) return;
    if (loading) return;
    if (didTryFetchRef.current) return;
    didTryFetchRef.current = true;
    dispatch(fetchAiConf());
  }, [dispatch, knowledgeBases.length, loading]);

  const knowledgeBaseNames = useMemo(() => {
    const ids = node?.knowledgeBaseIds || [];
    if (!ids.length) return "-";
    const nameById = new Map(knowledgeBases.map((kb) => [kb.id, kb.name]));
    return ids
      .map((id) => nameById.get(id) || id)
      .filter((x) => String(x || "").trim().length > 0)
      .join(", ");
  }, [knowledgeBases, node?.knowledgeBaseIds]);

  const knowledgeBaseNamesTitle = useMemo(() => {
    return knowledgeBaseNames === "-" ? "" : knowledgeBaseNames;
  }, [knowledgeBaseNames]);

  const valueClassName = useMemo(() => {
    return knowledgeBaseNames === "-"
      ? `${styles.value} ${styles.valueEmpty}`
      : styles.value;
  }, [knowledgeBaseNames]);

  const queryText = useMemo(() => {
    const t = String(node?.queryText || "").trim();
    return t || "-";
  }, [node?.queryText]);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.label}>
          {i18n.text(
            "block.flow.node.config.knowledgeRetrieval.knowledgeBases",
          )}
        </span>
        <span className={valueClassName} title={knowledgeBaseNamesTitle}>
          {knowledgeBaseNames}
        </span>
      </div>

      <InputTags inParams={node?.inParams} />
      <OutputTags outParams={node?.outParams} />
    </div>
  );
};

export default KnowledgeRetrievalNode;
