import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, Button, Typography, Image, Tag, Descriptions, Row, Col, Skeleton, Space } from 'antd';
import { ArrowLeftOutlined, ShoppingCartOutlined, DollarCircleOutlined, TagsOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
export default function ProductDetail({ product }) {
    const router = useRouter();

    const isLoading = router.isFallback || !product;

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
                <title>{product.name || 'Product'} | Product Detail</title>
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
                            src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                            alt={product.name || 'Product'}
                            style={{ width: '100%', height: 'auto', borderRadius: 8, objectFit: 'contain' }}
                        />
                    </Col>

                    <Col xs={24} lg={14}>
                        <Title level={2} style={{ marginTop: 0 }}>{product.name || 'Unnamed Product'}</Title>

                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <Descriptions bordered column={1} size="small">
                                <Descriptions.Item label={<DollarCircleOutlined />}>
                                    <Title level={3} style={{ margin: 0 }}>${product.price ? product.price.toFixed(2) : 'N/A'}</Title>
                                </Descriptions.Item>

                                <Descriptions.Item label={<TagsOutlined />}>
                                    <Tag color="blue">{product.category || 'Uncategorized'}</Tag>
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

export async function getStaticPaths() {
    try {
        const response = await fetch('https://course.summitglobal.id/products');
        const data = await response.json();
        const products = data?.body?.data || [];

        // Generate paths for all existing product IDs
        const paths = products.map(product => ({
            params: { id: product.id.toString() },
        }));

        return {
            paths,
            fallback: 'blocking', 
        };
    } catch (error) {
        console.error('Error fetching paths for SSG:', error);
        return {
            paths: [],
            fallback: 'blocking',
        };
    }
}

export async function getStaticProps(context) {
    const productId = context.params.id;

    try {
        const allProductsResponse = await fetch('https://course.summitglobal.id/products');

        if (!allProductsResponse.ok) {
            throw new Error(`Failed to fetch product list. Status: ${allProductsResponse.status}`);
        }

        const data = await allProductsResponse.json();
        const products = data?.body?.data || [];

        const product = products.find(p => p.id === parseInt(productId));

        if (!product) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                product,
            },
            revalidate: 60,
        };
    } catch (error) {
        console.error(`Error fetching product data for ID ${productId}:`, error);

        return {
            notFound: true,
        };
    }
}