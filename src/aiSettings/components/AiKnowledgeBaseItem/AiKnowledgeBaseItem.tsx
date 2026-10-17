import React, { useMemo } from "react";
import styles from "./AiKnowledgeBaseItem.less";
import {
  Collapse,
  Descriptions,
  Popconfirm,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useI18n, IconButton, Tip } from "../../../flowsdk";
import type { KnowledgeBaseItem, ModelItem } from "../../../hostTypes/ai";

interface AiKnowledgeBaseItemProps {
  item: KnowledgeBaseItem;
  models: ModelItem[];
  onEdit: (item: KnowledgeBaseItem) => void;
  onDelete: (id: string) => void;
  onDocs: (item: KnowledgeBaseItem) => void;
}

const AiKnowledgeBaseItem = (props: AiKnowledgeBaseItemProps) => {
  const { item, models, onEdit, onDelete, onDocs } = props;
  const i18n = useI18n();

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const embeddingModelName = useMemo(() => {
    const id = item.embedding?.modelId;
    if (!id) return "-";
    return models.find((m) => m.id === id)?.name || id;
  }, [item.embedding?.modelId, models]);

  const meta = (() => {
    const indexName = item.storage?.indexName || "-";
    return `${embeddingModelName} · ${indexName}`;
  })();

  const header = (
    <div className={styles.panelHeader}>
      <div className={styles.panelMain}>
        <div className={styles.panelTitle}>
          <Typography.Text strong ellipsis={{ tooltip: item.name }}>
            {item.name}
          </Typography.Text>
        </div>
        <div className={styles.panelMeta}>
          <Typography.Text type="secondary" ellipsis={{ tooltip: meta }}>
            {meta}
          </Typography.Text>
        </div>
      </div>
    </div>
  );

  const extra = (
    <Space size={4} onClick={(e) => e.stopPropagation()}>
      <Tip type={"tooltip"} title={i18n.text("ai.kb.docs.action.manage")}>
        <IconButton type={"icon"} size={24} onClick={() => onDocs(item)}>
          <FileTextOutlined />
        </IconButton>
      </Tip>
      <Tip type={"tooltip"} title={i18n.text("common.edit")}>
        <IconButton type={"icon"} size={24} onClick={() => onEdit(item)}>
          <EditOutlined />
        </IconButton>
      </Tip>
      <Popconfirm
        title={i18n.text("ai.settings.delete.confirm.title")}
        okText={i18n.text("common.ok")}
        cancelText={i18n.text("common.cancel")}
        onConfirm={() => onDelete(item.id)}
      >
        <Tip type={"tooltip"} title={i18n.text("common.delete")}>
          <IconButton type={"icon"} size={24} danger>
            <DeleteOutlined />
          </IconButton>
        </Tip>
      </Popconfirm>
      <Tooltip title={i18n.text("ai.settings.action.drag")}>
        <span
          ref={setActivatorNodeRef}
          className={styles.dragHandle}
          {...attributes}
          {...listeners}
          onPointerDown={(e) => {
            e.stopPropagation();
            listeners?.onPointerDown?.(e);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            listeners?.onKeyDown?.(e);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <HolderOutlined />
        </span>
      </Tooltip>
    </Space>
  );

  const chunkSize = item.chunking?.chunkSize;
  const chunkOverlap = item.chunking?.chunkOverlap;
  const hasChunking = chunkSize !== undefined || chunkOverlap !== undefined;
  const chunkingText = hasChunking
    ? `${chunkSize ?? "-"} / ${chunkOverlap ?? "-"}`
    : "-";

  const topK = item.retrieval?.topK;
  const scoreThreshold = item.retrieval?.scoreThreshold;
  const hasRetrieval = topK !== undefined || scoreThreshold !== undefined;
  const retrievalText = hasRetrieval
    ? `${topK ?? "-"} / ${scoreThreshold ?? "-"}`
    : "-";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.container} ${isDragging ? styles.dragging : ""}`}
    >
      <Collapse
        size="small"
        ghost={true}
        collapsible="header"
        style={{ borderRadius: 8 }}
        items={[
          {
            key: item.id,
            label: header,
            extra: extra,
            style: { borderRadius: 8 },
            children: (
              <Descriptions size="small" column={1}>
                <Descriptions.Item label={i18n.text("ai.settings.column.id")}>
                  <Typography.Text ellipsis={{ tooltip: item.id }}>
                    {item.id}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={i18n.text("ai.kb.field.embeddingModel")}
                >
                  <Typography.Text ellipsis={{ tooltip: embeddingModelName }}>
                    {embeddingModelName}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label={i18n.text("ai.kb.field.indexName")}>
                  <Typography.Text
                    ellipsis={{ tooltip: item.storage?.indexName || "-" }}
                  >
                    {item.storage?.indexName || "-"}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label={i18n.text("ai.kb.field.storagePath")}>
                  {item.storage?.path ? (
                    <Typography.Text ellipsis={{ tooltip: item.storage.path }}>
                      {item.storage.path}
                    </Typography.Text>
                  ) : (
                    <Typography.Text type="secondary">-</Typography.Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label={i18n.text("ai.kb.field.chunking")}>
                  {chunkingText}
                </Descriptions.Item>
                <Descriptions.Item label={i18n.text("ai.kb.field.retrieval")}>
                  {retrievalText}
                </Descriptions.Item>
                <Descriptions.Item label={i18n.text("ai.kb.field.description")}>
                  {item.description ? (
                    <Typography.Text ellipsis={{ tooltip: item.description }}>
                      {item.description}
                    </Typography.Text>
                  ) : (
                    <Typography.Text type="secondary">-</Typography.Text>
                  )}
                </Descriptions.Item>
              </Descriptions>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AiKnowledgeBaseItem;
