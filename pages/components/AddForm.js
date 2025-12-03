import React from 'react';
import { Button, Modal, Form, Input, Space, message } from 'antd';
// Removed: import axios from 'axios';

const AddForm = ({ isModalOpen, setIsModalOpen, fetchProducts }) => {
    const [form] = Form.useForm();
    
    const handleFinish = async (values) => {
        try {
            console.log("Attempting POST request to /api/route with values:", values);

            const response = await fetch('/api/route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    price: parseFloat(values.price), // Convert string input to float
                    stock: parseInt(values.stock, 10), // Convert string input to integer
                }),
            });

            if (response.ok) {
                message.success('Product added successfully!');
                fetchProducts();
                setIsModalOpen(false);
                form.resetFields();
            } else {
                const errorData = await response.json().catch(() => ({}));
                const status = response.status;

                console.error('Add failed. Status:', status, 'Data:', errorData);
                message.error(`Failed to add product (${status}): ${errorData.error || response.statusText || 'Server error.'}`);
            }

        } catch (error) {
            console.error('Network Error:', error);
            message.error('Network error occurred while adding product.');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
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
            title="Add New Product"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={modalFooter}
        >
            <Form
                form={form}
                name="add-product-form"
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
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input the product description!' }]}
                >
                    <Input.TextArea />
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
                    rules={[{ required: true, message: 'Please input your Stock!' }, { type: 'integer', transform: (value) => Number(value), message: 'Stock must be an integer' }]}
                >
                    <Input type="number" min={0} step={1} />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default AddForm;