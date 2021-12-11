import * as React from 'react';
import Sider from 'antd/lib/layout/Sider';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined
} from '@ant-design/icons';
import style from './side-menu.css';


const SideMenu: React.FC<any> = () => {
    return (
      <div className={style.siteLayoutBackground} >
        <Sider width={200}>
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <SubMenu
                    key="sub1"
                    icon={<LaptopOutlined />}
                    title="Admin page"
                >
                    <Menu.Item key="5">option5</Menu.Item>
                    <Menu.Item key="6">option6</Menu.Item>
                    <Menu.Item key="7">option7</Menu.Item>
                    <Menu.Item key="8">option8</Menu.Item>
                </SubMenu>
            </Menu>
        </Sider>
      </div>
    );
};

export default SideMenu;
