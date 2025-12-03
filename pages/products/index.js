import React, { useState, useMemo } from 'react';
import { Table, Space, Button, Modal, Image, Input, Select, message, Layout } from 'antd';
import { ExclamationCircleFilled, SyncOutlined, SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import EditForm from '../components/EditForm';
import AddForm from '../components/AddForm';

const { confirm } = Modal;
const { Option } = Select;

function ProductList({ productData }) {
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [products, setProducts] = useState(productData);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);


    const uniqueCategories = useMemo(() => {
        const categories = products.map(p => p.category);
        return [...new Set(categories)].filter(Boolean);
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const name = product.name ? product.name.toLowerCase() : '';
            const category = product.category ? product.category.toLowerCase() : '';
            const search = searchTerm.toLowerCase();

            const matchesSearch = name.includes(search) || category.includes(search);

            const matchesCategory = selectedCategory ? product.category === selectedCategory : true;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, selectedCategory]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/route');
            const data = await response.json();
            const fetchedProducts = data?.body?.data || [];
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error fetching product data:', error);
            message.error('Failed to refresh data from external API.');
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = (updatedProduct) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === updatedProduct.id ? updatedProduct : product
            )
        );
    };

    const handleEdit = (record) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleViewDetail = (record) => {
        router.push(`/products/${record.id}`); 
    };

    const handleDelete = (record) => {
        confirm({
            title: 'Are you sure you want to delete this product?',
            icon: <ExclamationCircleFilled />,
            content: `Product: ${record.name} (ID: ${record.id}) will be permanently removed locally.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    const newProducts = products.filter(item => item.id !== record.id);
                    setProducts(newProducts);
                    message.success(`Product "${record.name}" deleted successfully (Local State Only).`);
                } catch (error) {
                    console.error('Error deleting product:', error);
                    message.error(`Failed to delete product "${record.name}".`);
                }
            },
            onCancel() {
                console.log('Deletion cancelled');
            },
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (imageUrl) => (
                <Image
                    src={imageUrl}
                    alt="Product"
                    width={50}
                    height={50}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: (a, b) => a.category.localeCompare(b.category),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            sorter: (a, b) => a.stock - b.stock,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => handleViewDetail(record)}>
                        View Detail
                    </Button>
                    
                    <Button
                        type="primary"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>

                    <Button
                        type="danger"
                        onClick={() => handleDelete(record)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} onCollapse={onCollapse} />
            <Layout>
                <Layout.Content style={{ padding: '20px' }}>
                    <h1 style={{ marginBottom: 20 }}>Product Management Dashboard</h1>
                    <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                Add New Product
                            </Button>
                            <Button
                                icon={<SyncOutlined />}
                                onClick={fetchProducts}
                                loading={loading}
                            >
                                Refresh Data
                            </Button>
                        </Space>

                        <Space>
                            <Select
                                placeholder="Filter by Category"
                                allowClear
                                style={{ width: 200 }}
                                onChange={value => setSelectedCategory(value)}
                                value={selectedCategory}
                            >
                                {uniqueCategories.map(category => (
                                    <Option key={category} value={category}>{category}</Option>
                                ))}
                            </Select>

                            <Input
                                placeholder="Search by Name or Category"
                                prefix={<SearchOutlined />}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ width: 300 }}
                                allowClear
                            />
                        </Space>
                    </Space>

                    <Table
                        dataSource={filteredProducts}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />

                    <EditForm
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        selectedRecord={selectedRecord}
                        updateProduct={updateProduct}
                        fetchProducts={fetchProducts}
                    />
                    <AddForm
                        isModalOpen={isAddModalOpen}
                        setIsAddModalOpen={setIsAddModalOpen}
                        fetchProducts={fetchProducts}
                    />
                </Layout.Content>
            </Layout>
        </Layout>
    );
}

export const getServerSideProps = async () => {
    try {
        const response = await fetch('https://course.summitglobal.id/products');
        const data = await response.json();

        const products = data?.body?.data || [];

        return {
            props: {
                productData: products,
            },
        };
    } catch (error) {
        console.error('Error fetching product data:', error);
        return {
            props: {
                productData: [],
            },
        };
    }
};

export default ProductList;