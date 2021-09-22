import * as React from 'react';
import Layout, { Content } from 'antd/lib/layout/layout';
import MqttExplorer from '../components/mqtt-explorer';
import { Breadcrumb, Menu } from 'antd';
import 'antd/dist/antd.css';
import './home.css';
import SideMenu from '../components/side-menu';
import PageHeader from '../components/page-header';

const HomePage: React.FC<any> = () => {
    return (
        <Layout>
            <PageHeader />
            <Layout>
                <SideMenu />
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280
                        }}
                    >
                        <MqttExplorer
                            defaultHost={process.env.REACT_APP_MQTT_BROKER}
                            defaultPort={parseInt(
                                process.env.REACT_APP_MQTT_PORT as string
                            )}
                        />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default HomePage;