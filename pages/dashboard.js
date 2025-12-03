import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Select, Button, Spin, Skeleton, Image, Tag, Divider, message, Layout } from 'antd';
import { SyncOutlined, ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons';
import Head from 'next/head';
import { useThemeContext } from '../context/ThemeContext';
import Sidebar from './components/Sidebar';

const { Title, Text, Option } = Typography;
const { Content } = Layout;

// Random Product Card Component
function RandomProductCard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [randomProduct, setRandomProduct] = useState(null);

    const fetchRandomProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/route`);
            if (!response.ok) throw new Error('Failed to fetch random product');
            const data = await response.json();
            const products = data?.body?.data || [];

            const randomIndex = Math.floor(Math.random() * products.length);
            setRandomProduct(products[randomIndex]);
        } catch (error) {
            console.error('Error fetching random product:', error);
            message.error('Failed to load random product.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomProduct();
    }, []);

    if (loading) {
        return (
            <Card title="✨ Product Highlight (Client-side)" style={{ height: '100%' }}>
                <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
        );
    }

    const isOutOfStock = randomProduct?.stock <= 0;

    return (
        <Card
            title="✨ Product Highlight (Client-side)"
            style={{
                height: '100%',
                borderColor: isOutOfStock ? '#ff7875' : undefined,
                backgroundColor: isOutOfStock ? '#fff0f6' : undefined
            }}
            actions={[
                <Button
                    key="view"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    disabled={isOutOfStock}
                    onClick={() => router.push('/products')}
                >
                    Go to Products
                </Button>,
                <Button key="refresh" icon={<SyncOutlined />} onClick={fetchRandomProduct} loading={loading}>
                    New Random
                </Button>,
            ]}
        >
            <Row gutter={16}>
                <Col span={8}>
                    {randomProduct?.image ? (
                        <Image src={randomProduct.image} alt={randomProduct.name} style={{ width: '100%', height: 100, borderRadius: '8px', objectFit: 'cover' }} />
                    ) : (
                        <div style={{ height: 100, backgroundColor: '#f0f0f0', borderRadius: 8 }}></div>
                    )}
                </Col>
                <Col span={16}>
                    <Title level={4}>{randomProduct?.name || 'N/A'}</Title>
                    <Text type="secondary">Category: {randomProduct?.category || 'N/A'}</Text>
                    <Divider style={{ margin: '12px 0' }} />
                    <Title level={5}>${randomProduct?.price?.toFixed(2) || '0.00'}</Title>
                    <Tag color={isOutOfStock ? 'red' : 'green'}>
                        {isOutOfStock ? 'OUT OF STOCK' : `In Stock: ${randomProduct.stock}`}
                    </Tag>
                </Col>
            </Row>
        </Card>
    );
}


// --- Main Dashboard Component ---
export default function Dashboard({ totalProducts, categories }) {
    const { theme, setTheme, selectedCategory, setSelectedCategory } = useThemeContext();
    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = (collapsed) => {
        setCollapsed(collapsed);
    };

    return (
        <>
            <Head>
                <title>Product Dashboard</title>
            </Head>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar collapsed={collapsed} onCollapse={onCollapse} />
                <Layout>
                    <Content style={{ padding: '24px', backgroundColor: theme === 'dark' ? '#141414' : '#f0f2f5' }}>
                        <Title level={2} style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Product Dashboard</Title>

                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col xs={24} sm={12} lg={8}>
                                <Card title="📦 Total Products (SSR)" bordered={false} hoverable>
                                    <Title level={3} style={{ margin: 0 }}>
                                        {totalProducts.toLocaleString()}
                                    </Title>
                                    <Text type="secondary">Fetched server-side for speed.</Text>
                                </Card>
                            </Col>

                            <Col xs={24} sm={12} lg={8}>
                                <Card title="🏷️ Categories List" bordered={false} hoverable>
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Filter Products by Category"
                                        value={selectedCategory}
                                        onChange={setSelectedCategory}
                                        allowClear
                                    >
                                        {categories.map(cat => (
                                            <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                                        ))}
                                    </Select>
                                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                                        Selected Category: **{selectedCategory || 'None'}**
                                    </Text>
                                </Card>
                            </Col>

                            <Col xs={24} sm={12} lg={8}>
                                <Card title="🎨 Global Theme" bordered={false} hoverable>
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Select Theme"
                                        value={theme}
                                        onChange={setTheme}
                                    >
                                        <Select.Option value="light">Light</Select.Option>
                                        <Select.Option value="dark">Dark</Select.Option>
                                    </Select>
                                    <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                                        Current theme: **{theme}**
                                    </Text>
                                </Card>
                            </Col>
                        </Row>

                        {/* Random Product Card (Client Fetch) */}
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <RandomProductCard />
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dummyjson.com/products';

export async function getServerSideProps(context) {
    try {
        const response = await fetch(PUBLIC_API_URL);
        const data = await response.json();
        const products = data?.products || [];

        const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean);

        return {
            props: {
                totalProducts: products.length,
                categories: uniqueCategories
            },
        };
    } catch (error) {
        console.error('Data Fetching Error:', error);
        return {
            props: {
                totalProducts: 0,
                categories: []
            },
        };
    }
}
