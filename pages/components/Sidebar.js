import React, { useState } from 'react';
import { Menu, Layout, Button } from 'antd'; // Removed Tooltip as it's not needed for the final button style
import { 
    HomeOutlined, 
    ShoppingOutlined, 
    SunOutlined, 
    MoonOutlined 
} from '@ant-design/icons';
import { useRouter } from 'next/router';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => {
    const router = useRouter();
    const [theme, setTheme] = useState('light'); 

    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    const themeIcon = theme === 'light' ? <MoonOutlined /> : <SunOutlined />;
    const themeLabel = theme === 'light' ? 'Dark Mode' : 'Light Mode';
    const menuTheme = theme; 

    return (
        <Sider 
            collapsible 
            collapsed={collapsed} 
            onCollapse={onCollapse} 
            width={200} 
            style={{ 
                backgroundColor: menuTheme === 'dark' ? '#001529' : '#fff',
                transition: 'background-color 0.3s'
            }}
        >
            <div 
                className="logo" 
                style={{ 
                    height: 32, 
                    margin: 16, 
                    borderRadius: 6,
                    backgroundColor: menuTheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                }} 
            />
            
            <Menu
                mode="inline"
                theme={menuTheme} 
                defaultSelectedKeys={[router.pathname === '/products' ? 'products' : 'dashboard']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item 
                    key="dashboard" 
                    icon={<HomeOutlined />}
                    onClick={() => router.push('/dashboard')}
                >
                    {!collapsed && 'Dashboard'}
                </Menu.Item>
                
                <Menu.Item 
                    key="products" 
                    icon={<ShoppingOutlined />}
                    onClick={() => router.push('/products')}
                >
                    {!collapsed && 'Products'}
                </Menu.Item>

                <Menu.Item
                    key="theme-toggle"
                    icon={themeIcon}
                    onClick={toggleTheme}
                    style={{ 
                        marginTop: 10,
                        backgroundColor: 'transparent',
                        color: menuTheme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
                    }}
                >                    {!collapsed && themeLabel}
                </Menu.Item>

            </Menu>
            
        </Sider>
    );
};

export default Sidebar;