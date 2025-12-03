import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, Button, Typography, Image, Tag, Descriptions, Row, Col, Skeleton, Space } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined, DollarCircleOutlined, TagsOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function ProductDetail({ product }) {
    const router = useRouter();
    const { id } = router.query;

    const isLoading = !product;

    if (isLoading) {
        return (
            <div style={{ padding: '40px' }}>
                <Head><title>Loading Product...</title></Head>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                    style={{ marginBottom: 20 }}
                >
                    Back
                </Button>
                <Card variant="default">
                    <Row gutter={24}>
                        <Col span={10}>
                            <Skeleton.Image style={{ width: '100%', height: 400 }} active />
                        </Col>
                        <Col span={14}>
                            <Skeleton active paragraph={{ rows: 6 }} title={true} />
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }

    const isOutOfStock = product.stock <= 0;
    const stockColor = isOutOfStock ? 'red' : 'green';
    const stockStatus = isOutOfStock ? 'OUT OF STOCK' : `In Stock: ${product.stock}`;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <Head>
                <title>{product.name} | Product Detail</title>
            </Head>

            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                type="default"
                style={{ marginBottom: 20 }}
            >
                Back to List
            </Button>

            <Card style={{ borderRadius: 8 }}>
                <Row gutter={32}>
                    <Col xs={24} lg={10}>
                        <Image
                            src={product.image}
                            alt={product.name}
                            style={{ width: '100%', height: 'auto', borderRadius: 8, objectFit: 'contain' }}
                        />
                    </Col>

                    <Col xs={24} lg={14}>
                        <Title level={2} style={{ marginTop: 0 }}>{product.name}</Title>

                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Descriptions bordered column={1} size="small">
                                <Descriptions.Item label={<DollarCircleOutlined />}>
                                    <Title level={3} style={{ margin: 0 }}>${product.price.toFixed(2)}</Title>
                                </Descriptions.Item>

                                <Descriptions.Item label={<TagsOutlined />}>
                                    <Tag color="blue">{product.category}</Tag>
                                </Descriptions.Item>

                                <Descriptions.Item label="Stock Status">
                                    <Tag color={stockColor} style={{ fontSize: '14px', padding: '4px 8px' }}>
                                        {stockStatus}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>

                            <Title level={4}>Description</Title>
                            <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                                {product.description || 'No description available for this product.'}
                            </Paragraph>

                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingCartOutlined />}
                                disabled={isOutOfStock}
                                style={{ marginTop: 20 }}
                            >
                                {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}

export async function getServerSideProps(context) {
    const { id } = context.params;

    try {
        const response = await fetch('https://course.summitglobal.id/products');

        if (!response.ok) {
            throw new Error(`Failed to fetch products. Status: ${response.status}`);
        }

        const data = await response.json();
        const products = data?.body?.data || [];

        const product = products.find(p => p.id === parseInt(id));

        if (!product) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                product,
            },
        };
    } catch (error) {
        console.error(`Error fetching product with ID ${id} from external API:`, error);

        return {
            props: {
                product: null,
            },
        };
    }
}