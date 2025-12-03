import React, { useEffect } from 'react';
import { Button, Modal, Form, Input, Space, message } from 'antd';
import axios from 'axios';

const EditForm = ({ isModalOpen, setIsModalOpen, selectedRecord, fetchProducts }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedRecord) {
            form.setFieldsValue(selectedRecord);
        }
    }, [selectedRecord, form]);

    const handleFinish = async (values) => {
        try {
            const putData = { ...selectedRecord, ...values };
            console.log('Sending PUT request with data:', putData);
            const response = await axios.put('/api/route', putData);
            console.log('PUT response:', response);
            if (response.status === 200) {
                message.success('Product updated successfully!');
                fetchProducts();
                setIsModalOpen(false);
            } else {
                message.error(`Failed to update product: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                message.error(`Error updating product: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`);
            } else {
                message.error('Network error occurred while updating product.');
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const modalFooter = (
        <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
                type="primary"
                onClick={() => form.submit()}
            >
                Submit
            </Button>
        </Space>
    );

    return (
        <Modal
            title="Product Details Form"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={modalFooter}
        >
            <Form
                form={form}
                name="product-form-standalone"
                layout="vertical"
                onFinish={handleFinish}
                style={{ maxWidth: '100%' }}
                autoComplete="off"
            >
                <Form.Item
                    label="Image URL"
                    name="image"
                    rules={[{ required: true, message: 'Please input the Image Link!' }]}
                >
                    <Input placeholder="e.g., https://placehold.co/100x100" />
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your product Name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please input your Category!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please input your Price!' }, { type: 'number', transform: (value) => Number(value), message: 'Price must be a number' }]}
                >
                    <Input type="number" min={0} step="0.01" /> 
                </Form.Item>

                <Form.Item
                    label="Stock"
                    name="stock"
                    rules={[{ type: 'integer', transform: (value) => Number(value), message: 'Stock must be an integer' }]}
                >
                    <Input type="number" min={0} step={1} />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default EditForm;