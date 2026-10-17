import React, { useEffect, useMemo } from "react";
import { Form, Input, InputNumber, Modal, Select, Space } from "antd";
import { useI18n } from "../../../flowsdk";
import type { KnowledgeBaseItem, ModelItem } from "../../../hostTypes/ai";

interface AiKnowledgeBaseModalProps {
  open: boolean;
  item: KnowledgeBaseItem | null;
  models: ModelItem[];
  onCancel: () => void;
  onSubmit: (item: KnowledgeBaseItem) => void;
}

const AiKnowledgeBaseModal = (props: AiKnowledgeBaseModalProps) => {
  const { open, item, models, onCancel, onSubmit } = props;
  const i18n = useI18n();
  const [form] = Form.useForm();

  const isEdit = !!item;

  const title = isEdit
    ? i18n.text("ai.settings.edit.kb")
    : i18n.text("ai.settings.add.kb");

  const modelOptions = useMemo(() => {
    return models.map((m) => ({ label: m.name, value: m.id }));
  }, [models]);

  useEffect(() => {
    if (!open) return;
    const kb = item || null;
    form.setFieldsValue({
      id: kb?.id,
      name: kb?.name || "",
      description: kb?.description || "",
      tags: kb?.tags || [],
      langs: kb?.langs || [],
      embeddingModelId: kb?.embedding?.modelId || undefined,
      indexName: kb?.storage?.indexName || "",
      storagePath: kb?.storage?.path || "",
      chunkSize: kb?.chunking?.chunkSize,
      chunkOverlap: kb?.chunking?.chunkOverlap,
      topK: kb?.retrieval?.topK,
      scoreThreshold: kb?.retrieval?.scoreThreshold,
    });
  }, [form, item, open]);

  return (
    <Modal
      open={open}
      title={title}
      okText={i18n.text("common.ok")}
      cancelText={i18n.text("common.cancel")}
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields();

        const storagePath = String(values.storagePath || "").trim();
        const indexName = String(values.indexName || "").trim();
        const embeddingModelId = String(values.embeddingModelId || "").trim();

        const chunkSize =
          typeof values.chunkSize === "number" ? values.chunkSize : undefined;
        const chunkOverlap =
          typeof values.chunkOverlap === "number"
            ? values.chunkOverlap
            : undefined;

        const topK = typeof values.topK === "number" ? values.topK : undefined;
        const scoreThreshold =
          typeof values.scoreThreshold === "number"
            ? values.scoreThreshold
            : undefined;

        const payload: KnowledgeBaseItem = {
          id: isEdit ? (values.id as string) : "new",
          name: values.name as string,
          description: String(values.description || "").trim() || undefined,
          tags: values.tags as string[],
          langs: values.langs as string[],
          visibility: item?.visibility,
          status: item?.status,
          createdAt: item?.createdAt,
          updatedAt: item?.updatedAt,
          storage: {
            type: "vector",
            indexName: indexName,
            path: storagePath || undefined,
          },
          embedding: {
            modelId: embeddingModelId,
          },
          chunking:
            chunkSize !== undefined || chunkOverlap !== undefined
              ? {
                  chunkSize,
                  chunkOverlap,
                }
              : undefined,
          retrieval:
            topK !== undefined || scoreThreshold !== undefined
              ? {
                  topK,
                  scoreThreshold,
                }
              : undefined,
          stats: item?.stats,
          sources: item?.sources,
        };

        onSubmit(payload);
      }}
      destroyOnClose={true}
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="id" hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          name="name"
          label={i18n.text("ai.settings.form.name")}
          rules={[
            {
              required: true,
              message: i18n.text("ai.settings.form.name.required"),
            },
          ]}
        >
          <Input
            placeholder={i18n.text("ai.settings.form.name.placeholder")}
            allowClear={true}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={i18n.text("ai.kb.field.description")}
        >
          <Input.TextArea
            placeholder={i18n.text("ai.kb.form.description.placeholder")}
            autoSize={{ minRows: 2, maxRows: 6 }}
            allowClear={true}
          />
        </Form.Item>

        <Form.Item name="tags" label={i18n.text("ai.kb.form.tags")}>
          <Select
            mode="tags"
            tokenSeparators={[",", " "]}
            placeholder={i18n.text("ai.kb.form.tags.placeholder")}
            options={[]}
          />
        </Form.Item>

        <Form.Item
          name="langs"
          label={i18n.text("ai.settings.form.langs")}
          tooltip={i18n.text("ai.settings.form.langs.hint")}
        >
          <Select
            mode="tags"
            tokenSeparators={[",", " "]}
            placeholder={i18n.text("ai.settings.form.langs.placeholder")}
            options={[]}
          />
        </Form.Item>

        <Form.Item
          name="embeddingModelId"
          label={i18n.text("ai.kb.form.embeddingModel")}
          rules={[
            {
              required: true,
              message: i18n.text("ai.kb.form.embeddingModel.required"),
            },
          ]}
        >
          <Select
            showSearch={true}
            placeholder={i18n.text("ai.kb.form.embeddingModel.placeholder")}
            options={modelOptions}
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item name="indexName" label={i18n.text("ai.kb.form.indexName")}>
          <Input
            placeholder={i18n.text("ai.kb.form.indexName.placeholder")}
            allowClear={true}
          />
        </Form.Item>

        <Form.Item
          name="storagePath"
          label={i18n.text("ai.kb.form.storagePath")}
        >
          <Input
            placeholder={i18n.text("ai.kb.form.storagePath.placeholder")}
            allowClear={true}
          />
        </Form.Item>

        <Form.Item label={i18n.text("ai.kb.form.chunking")}>
          <Space.Compact>
            <Form.Item name="chunkSize" noStyle={true}>
              <InputNumber
                min={0}
                style={{ width: "50%" }}
                placeholder={i18n.text("ai.kb.form.chunkSize.placeholder")}
              />
            </Form.Item>
            <Form.Item name="chunkOverlap" noStyle={true}>
              <InputNumber
                min={0}
                style={{ width: "50%" }}
                placeholder={i18n.text("ai.kb.form.chunkOverlap.placeholder")}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item label={i18n.text("ai.kb.form.retrieval")}>
          <Space.Compact>
            <Form.Item name="topK" noStyle={true}>
              <InputNumber
                min={0}
                style={{ width: "50%" }}
                placeholder={i18n.text("ai.kb.form.topK.placeholder")}
              />
            </Form.Item>
            <Form.Item name="scoreThreshold" noStyle={true}>
              <InputNumber
                min={0}
                max={1}
                step={0.01}
                style={{ width: "50%" }}
                placeholder={i18n.text("ai.kb.form.scoreThreshold.placeholder")}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AiKnowledgeBaseModal;
