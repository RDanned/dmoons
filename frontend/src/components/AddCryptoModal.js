import { jsx as _jsx } from "react/jsx-runtime";
import { Modal, Form, Input } from 'antd';
const AddCryptoModal = ({ visible, onCancel, onAdd }) => {
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
    return (_jsx(Modal, { open: visible, title: "Add Crypto", okText: "Add", onCancel: onCancel, onOk: handleOk, children: _jsx(Form, { form: form, layout: "vertical", children: _jsx(Form.Item, { name: "cryptoName", label: "Crypto Symbol", rules: [{ required: true, message: 'Please enter a crypto symbol!' }], children: _jsx(Input, { placeholder: "e.g., BTC" }) }) }) }));
};
export default AddCryptoModal;
