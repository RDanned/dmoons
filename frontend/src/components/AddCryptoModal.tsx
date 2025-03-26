import React from 'react';
import { Modal, Form, Input } from 'antd';

interface AddCryptoModalProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: (cryptoName: string) => void;
}

const AddCryptoModal: React.FC<AddCryptoModalProps> = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        onAdd(values.cryptoName);
        form.resetFields();
      })
      .catch(info => {
        console.error('Validate Failed:', info);
      });
  };

  return (
    <Modal
      open={visible}
      title="Add Crypto"
      okText="Add"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="cryptoName"
          label="Crypto Symbol"
          rules={[{ required: true, message: 'Please enter a crypto symbol!' }]}
        >
          <Input placeholder="e.g., BTC" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCryptoModal;
