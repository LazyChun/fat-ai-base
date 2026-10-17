import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import {
  useI18n,
  requests,
  getServerBase,
  TIME_FORMAT,
} from "../../../flowsdk";
import type { KnowledgeBaseItem } from "../../../hostTypes/ai";

interface KnowledgeBaseDoc {
  id: string;
  kbId: string;
  fileName: string;
  mimeType?: string;
  fileSize?: number;
  status?: string;
  error?: string | null;
  createdAt?: string;
  updatedAt?: string;
  chunkCount?: number;
  embeddingModelId?: string | null;
}

interface AiKnowledgeBaseDocsModalProps {
  open: boolean;
  kb: KnowledgeBaseItem | null;
  onCancel: () => void;
}

const ensureOk = <T,>(resp: Resp<T>) => {
  if (!resp.isOk) throw new Error(resp.message || "Request failed");
  return resp.data;
};

const kbDocStatusTag = (
  i18n: ReturnType<typeof useI18n>,
  doc: KnowledgeBaseDoc,
) => {
  const status = (doc.status || "").toLowerCase();
  if (status === "ready")
    return <Tag color="green">{i18n.text("ai.kb.docs.status.ready")}</Tag>;
  if (status === "processing")
    return <Tag color="blue">{i18n.text("ai.kb.docs.status.processing")}</Tag>;
  if (status === "queued")
    return <Tag color="default">{i18n.text("ai.kb.docs.status.queued")}</Tag>;
  if (status === "error")
    return <Tag color="red">{i18n.text("ai.kb.docs.status.error")}</Tag>;
  return <Tag>{status || "-"}</Tag>;
};

const AiKnowledgeBaseDocsModal = (props: AiKnowledgeBaseDocsModalProps) => {
  const { open, kb, onCancel } = props;
  const i18n = useI18n();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docs, setDocs] = useState<KnowledgeBaseDoc[]>([]);

  const kbId = kb?.id || "";

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return i18n.text("common.error.unknown");
  };

  const refresh = async () => {
    if (!kbId) return;
    setLoading(true);
    try {
      const resp = await requests.post<KnowledgeBaseDoc[]>(
        "/app/ai/getKnowledgeBaseDocs",
        {
          kbId,
        },
      );
      setDocs(ensureOk(resp) || []);
    } catch (e) {
      message.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    refresh();
  }, [open, kbId]);

  const shouldPoll = useMemo(() => {
    return docs.some((d) => {
      const status = (d.status || "").toLowerCase();
      return status === "queued" || status === "processing";
    });
  }, [docs]);

  useEffect(() => {
    if (!open) return;
    if (!shouldPoll) return;
    const timer = window.setInterval(() => refresh(), 2000);
    return () => window.clearInterval(timer);
  }, [open, shouldPoll, kbId]);

  const handleUpload = async (file: File) => {
    if (!kbId) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("kbId", kbId);
      form.append("file", file);

      const resp = await axios.post<Resp<KnowledgeBaseDoc>>(
        getServerBase() + "/app/ai/uploadKnowledgeBaseDoc",
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      ensureOk(resp.data);
      message.success(i18n.text("ai.kb.docs.upload.success"));
      refresh();
    } catch (e) {
      message.error(getErrorMessage(e));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!kbId) return;
    try {
      const resp = await requests.post("/app/ai/deleteKnowledgeBaseDoc", {
        kbId,
        docId,
      });
      ensureOk(resp);
      message.success(i18n.text("ai.kb.docs.delete.success"));
      refresh();
    } catch (e) {
      message.error(getErrorMessage(e));
    }
  };

  const handleReindex = async (docId: string) => {
    if (!kbId) return;
    try {
      const resp = await requests.post("/app/ai/reindexKnowledgeBaseDoc", {
        kbId,
        docId,
      });
      ensureOk(resp);
      message.success(i18n.text("ai.kb.docs.reindex.queued"));
      refresh();
    } catch (e) {
      message.error(getErrorMessage(e));
    }
  };

  const columns: ColumnsType<KnowledgeBaseDoc> = [
    {
      title: i18n.text("ai.kb.docs.column.name"),
      dataIndex: "fileName",
      key: "fileName",
      ellipsis: true,
    },
    {
      title: i18n.text("ai.kb.docs.column.status"),
      key: "status",
      width: 110,
      render: (_, record) => kbDocStatusTag(i18n, record),
    },
    {
      title: i18n.text("ai.kb.docs.column.chunks"),
      dataIndex: "chunkCount",
      key: "chunkCount",
      width: 90,
      render: (v) => (typeof v === "number" ? v : "-"),
    },
    {
      title: i18n.text("ai.kb.docs.column.updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: (v) => {
        if (!v) return "-";
        const d = dayjs(String(v));
        return d.isValid() ? d.format(TIME_FORMAT) : String(v);
      },
    },
    {
      title: i18n.text("ai.kb.docs.column.actions"),
      key: "actions",
      width: 220,
      render: (_, record) => {
        const status = (record.status || "").toLowerCase();
        const isProcessing = status === "queued" || status === "processing";
        const url = `${getServerBase()}/app/ai/downloadKnowledgeBaseDoc?kbId=${encodeURIComponent(
          kbId,
        )}&docId=${encodeURIComponent(record.id)}`;
        return (
          <Space size={8}>
            <Button size="small" onClick={() => window.open(url)}>
              {i18n.text("ai.kb.docs.action.open")}
            </Button>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              loading={isProcessing}
              disabled={!kbId || isProcessing}
              onClick={() => handleReindex(record.id)}
            >
              {i18n.text("ai.kb.docs.action.reindex")}
            </Button>
            <Popconfirm
              title={i18n.text("ai.kb.docs.delete.confirm")}
              okText={i18n.text("common.ok")}
              cancelText={i18n.text("common.cancel")}
              onConfirm={() => handleDelete(record.id)}
            >
              <Button danger size="small">
                {i18n.text("common.delete")}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Modal
      open={open}
      title={i18n.text("ai.kb.docs.title")}
      okText={i18n.text("common.ok")}
      cancelText={i18n.text("common.cancel")}
      onCancel={onCancel}
      onOk={onCancel}
      width={980}
      destroyOnClose={true}
      maskClosable={false}
    >
      <div
        style={{
          width: "100%",
          marginBottom: 12,
          marginTop: 8,
          paddingTop: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <Space size={12} wrap={true}>
          <Upload.Dragger
            multiple={true}
            showUploadList={false}
            disabled={!kbId || uploading}
            beforeUpload={(file) => {
              handleUpload(file as File);
              return false;
            }}
            style={{ width: 320, padding: 0 }}
          >
            <Space>
              <UploadOutlined />
              {i18n.text("ai.kb.docs.upload")}
            </Space>
          </Upload.Dragger>
        </Space>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refresh()}
            disabled={!kbId}
            size="small"
          >
            {i18n.text("common.refresh")}
          </Button>
          {kb ? (
            <Tag style={{ marginInlineEnd: 0 }}>
              {i18n.text("ai.kb.docs.kb")}: {kb.name}
            </Tag>
          ) : (
            <span />
          )}
        </Space>
      </div>

      <Table
        rowKey={(r) => r.id}
        size="small"
        loading={loading}
        columns={columns}
        dataSource={docs}
        pagination={{ pageSize: 8 }}
        expandable={{
          expandedRowRender: (record) =>
            record.error ? (
              <div style={{ color: "#cf1322" }}>{String(record.error)}</div>
            ) : null,
          rowExpandable: (record) => !!record.error,
        }}
      />
    </Modal>
  );
};

export default AiKnowledgeBaseDocsModal;
