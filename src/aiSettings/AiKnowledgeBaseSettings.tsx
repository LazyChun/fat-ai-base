import React, { useEffect, useMemo, useState } from "react";
import styles from "./AiKnowledgeBaseSettings.less";
import { Button, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  addKnowledgeBase,
  deleteKnowledgeBase,
  editKnowledgeBase,
  fetchAiConf,
  reorderKnowledgeBases,
  useI18n,
  useAppDispatch,
  useAppSelector,
} from "../flowsdk";
import type { KnowledgeBaseItem } from "../hostTypes/ai";
import {
  AiKnowledgeBaseDocsModal,
  AiKnowledgeBaseItem,
  AiKnowledgeBaseModal,
} from "./components";
import { AiSettingsEmpty } from "../flowsdk";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";

const AiKnowledgeBaseSettings = () => {
  const i18n = useI18n();
  const dispatch = useAppDispatch();
  const { knowledgeBases, models, loading } = useAppSelector(
    (state) => state.ai,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeBaseItem | null>(
    null,
  );
  const [docsOpen, setDocsOpen] = useState(false);
  const [docsKb, setDocsKb] = useState<KnowledgeBaseItem | null>(null);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return i18n.text("common.error.unknown");
  };

  const idsSig = useMemo(
    () => knowledgeBases.map((it) => it.id).join("|"),
    [knowledgeBases],
  );

  useEffect(() => {
    setOrderedIds(knowledgeBases.map((it) => it.id));
  }, [idsSig, knowledgeBases]);

  const itemsById = useMemo(() => {
    return new Map(knowledgeBases.map((it) => [it.id, it]));
  }, [knowledgeBases]);

  const orderedItems = useMemo(() => {
    const list = orderedIds
      .map((id) => itemsById.get(id))
      .filter(Boolean) as KnowledgeBaseItem[];
    knowledgeBases.forEach((it) => {
      if (!orderedIds.includes(it.id)) list.push(it);
    });
    return list;
  }, [knowledgeBases, itemsById, orderedIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const openAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: KnowledgeBaseItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const openDocs = (item: KnowledgeBaseItem) => {
    setDocsKb(item);
    setDocsOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteKnowledgeBase(id)).unwrap();
      message.success(i18n.text("ai.settings.delete.success"));
    } catch (e) {
      message.error(getErrorMessage(e));
    }
  };

  const handleReorder = async (ids: string[]) => {
    try {
      await dispatch(reorderKnowledgeBases(ids)).unwrap();
    } catch (e) {
      message.error(getErrorMessage(e));
      dispatch(fetchAiConf());
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const oldIndex = orderedIds.indexOf(String(active.id));
    const newIndex = orderedIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const newIds = arrayMove(orderedIds, oldIndex, newIndex);
    setOrderedIds(newIds);
    handleReorder(newIds);
  };

  const handleSubmit = async (values: KnowledgeBaseItem) => {
    try {
      if (editingItem) {
        await dispatch(editKnowledgeBase(values)).unwrap();
        message.success(i18n.text("ai.settings.edit.success"));
      } else {
        await dispatch(addKnowledgeBase(values)).unwrap();
        message.success(i18n.text("ai.settings.add.success"));
      }
      setModalOpen(false);
      setEditingItem(null);
    } catch (e) {
      message.error(getErrorMessage(e));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{i18n.text("ai.settings.title.kb")}</div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          {i18n.text("ai.settings.add.kb")}
        </Button>
      </div>
      <div className={styles.body}>
        <Spin spinning={!!loading}>
          {orderedItems.length === 0 ? (
            <AiSettingsEmpty description={i18n.text("ai.settings.empty")} />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext items={orderedIds}>
                <div>
                  {orderedItems.map((item) => (
                    <AiKnowledgeBaseItem
                      key={item.id}
                      item={item}
                      models={models}
                      onEdit={openEdit}
                      onDocs={openDocs}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </Spin>
      </div>
      <AiKnowledgeBaseModal
        open={modalOpen}
        item={editingItem}
        models={models}
        onCancel={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
      />
      <AiKnowledgeBaseDocsModal
        open={docsOpen}
        kb={docsKb}
        onCancel={() => {
          setDocsOpen(false);
          setDocsKb(null);
        }}
      />
    </div>
  );
};

export default AiKnowledgeBaseSettings;
