import React, { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import { useI18n } from "../../../flowsdk";
import type { OcrItem } from "../../../hostTypes/ai";

interface AiOcrModalProps {
  open: boolean;
  item: OcrItem | null;
  onCancel: () => void;
  onSubmit: (item: OcrItem) => void;
}

const AiOcrModal = (props: AiOcrModalProps) => {
  const { open, item, onCancel, onSubmit } = props;
  const i18n = useI18n();
  const [form] = Form.useForm();

  const isEdit = !!item;

  const title = isEdit
    ? i18n.text("ai.settings.edit.ocr")
    : i18n.text("ai.settings.add.ocr");

  useEffect(() => {
    if (!open) return;
    const ocr = item || null;
    form.setFieldsValue({
      id: ocr?.id,
      name: ocr?.name || "",
      langs: ocr?.langs || [],
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
        const payload: OcrItem = {
          id: isEdit ? (values.id as string) : "new",
          name: values.name as string,
          langs: values.langs as string[],
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
      </Form>
    </Modal>
  );
};

export default AiOcrModal;
