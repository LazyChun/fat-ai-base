import React, { useState, useMemo, useEffect } from "react";
import styles from "./AiOcrSettings.less";
import { Button, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  addOcr,
  deleteOcr,
  editOcr,
  fetchAiConf,
  reorderOcrs,
  useI18n,
  useAppDispatch,
  useAppSelector,
} from "../flowsdk";
import type { OcrItem } from "../hostTypes/ai";
import AiOcrModal from "./components/AiOcrModal/AiOcrModal";
import OcrItemComp from "./components/OcrItem/OcrItem";
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

const DEFAULT_WINDOWS_OCR_ID = "windows_ocr";

const AiOcrSettings = () => {
  const i18n = useI18n();
  const dispatch = useAppDispatch();
  const { ocrs, loading } = useAppSelector((state) => state.ai);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OcrItem | null>(null);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return i18n.text("common.error.unknown");
  };

  const idsSig = useMemo(() => ocrs.map((it) => it.id).join("|"), [ocrs]);
  useEffect(() => {
    setOrderedIds(ocrs.map((it) => it.id));
  }, [idsSig, ocrs]);

  const itemsById = useMemo(() => {
    return new Map(ocrs.map((it) => [it.id, it]));
  }, [ocrs]);

  const orderedItems = useMemo(() => {
    const list = orderedIds
      .map((id) => itemsById.get(id))
      .filter(Boolean) as OcrItem[];
    ocrs.forEach((it) => {
      if (!orderedIds.includes(it.id)) list.push(it);
    });
    return list;
  }, [ocrs, itemsById, orderedIds]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const openAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: OcrItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteOcr(id)).unwrap();
      message.success(i18n.text("ai.settings.delete.success"));
    } catch (e) {
      message.error(getErrorMessage(e));
    }
  };

  const handleReorder = async (ids: string[]) => {
    try {
      await dispatch(reorderOcrs(ids)).unwrap();
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

  const handleSubmit = async (item: OcrItem) => {
    try {
      if (editingItem) {
        await dispatch(editOcr({ ...editingItem, ...item })).unwrap();
        message.success(i18n.text("ai.settings.edit.success"));
      } else {
        await dispatch(addOcr(item)).unwrap();
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
        <div className={styles.title}>{i18n.text("ai.settings.title.ocr")}</div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          {i18n.text("ai.settings.add.ocr")}
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
                <OcrItemComp
                  key={item.id}
                  item={item}
                  isDefault={!!item.isDefault}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
          )}
        </Spin>
      </div>
      <AiOcrModal
        open={modalOpen}
        item={editingItem}
        onCancel={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AiOcrSettings;
