import React from "react";
import styles from "./OcrItem.less";
import {
  Collapse,
  Descriptions,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  HolderOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useI18n,
  useAppDispatch,
  IconButton,
  Tip,
  setDefaultOcr,
} from "../../../flowsdk";
import type { OcrItem } from "../../../hostTypes/ai";

interface OcrItemProps {
  item: OcrItem;
  isDefault: boolean;
  onEdit: (item: OcrItem) => void;
  onDelete: (id: string) => void;
}

const OcrItemComp = (props: OcrItemProps) => {
  const { item, isDefault, onEdit, onDelete } = props;
  const i18n = useI18n();
  const dispatch = useAppDispatch();

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

  const meta = (() => {
    const langs = item.langs || [];
    const langsText = langs.length ? langs.join(", ") : "-";
    return `${item.id} · ${langsText}`;
  })();

  const header = (
    <div className={styles.panelHeader}>
      <div className={styles.panelMain}>
        <div className={styles.panelTitle}>
          <Typography.Text strong ellipsis={{ tooltip: item.name }}>
            {item.name}
          </Typography.Text>
          {isDefault ? (
            <Tag color="blue">{i18n.text("ai.settings.tag.default")}</Tag>
          ) : null}
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
      {!isDefault && (
        <Tip
          type={"tooltip"}
          title={i18n.text("ai.settings.action.setDefault")}
        >
          <IconButton
            type={"icon"}
            size={24}
            onClick={() => dispatch(setDefaultOcr(item.id))}
          >
            <CheckOutlined />
          </IconButton>
        </Tip>
      )}
      {item.id !== "windows_ocr" && (
        <Tip type={"tooltip"} title={i18n.text("common.edit")}>
          <IconButton type={"icon"} size={24} onClick={() => onEdit(item)}>
            <EditOutlined />
          </IconButton>
        </Tip>
      )}
      {item.id !== "windows_ocr" && (
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
      )}
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.container} ${isDragging ? styles.dragging : ""}`}
    >
      <Collapse
        size="small"
        ghost={true}
        style={{ borderRadius: 8 }}
        collapsible="header"
        items={[
          {
            key: item.id,
            label: header,
            style: { borderRadius: 8 },
            extra: extra,
            children: (
              <Descriptions size="small" column={1}>
                <Descriptions.Item label={i18n.text("ai.settings.column.id")}>
                  <Typography.Text ellipsis={{ tooltip: item.id }}>
                    {item.id}
                  </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={i18n.text("ai.settings.column.langs")}
                >
                  {(item.langs || []).length ? (
                    <Space size={4} wrap>
                      {(item.langs || []).map((lang) => (
                        <Tag key={lang}>{lang}</Tag>
                      ))}
                    </Space>
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

export default OcrItemComp;
