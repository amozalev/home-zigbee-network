import * as React from 'react';
import { useEffect } from 'react';
import {
    IClientOptions,
    IClientPublishOptions
} from 'mqtt/types/lib/client-options';
import { Button, Divider, Form, Input, Space } from 'antd';
import { ValidateStatus } from 'antd/lib/form/FormItem';
import {
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    SyncOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import style from './mqtt-connection.css';

export interface MqttClientProps {
    defaultHost: string | undefined;
    defaultPort: number | undefined;
    connectionStatus: ConnectionStatusType;
    isSubscribed: boolean;
    mqttConnect: (url: string, options: IClientOptions) => void;
    mqttDisconnect: () => void;
    subscribeTopic: (topic: string) => void;
    unsubscribeTopic: () => void;
}

export interface MqttMessageType {
    topic: string;
    message: string;
    options?: IClientPublishOptions;
}

export enum ConnectionStatusType {
    CONNECTED = 'Connected',
    RECONNECTING = 'Reconnecting',
    DISCONNECTED = 'Disconnected'
}

export interface FormFieldsType {
    host: string;
    port: number;
    username: string;
    password: string;
    path: string;
    connectionStatus: string;
    topic: string;
}

const MqttConnectionForm: React.FC<MqttClientProps> = ({
    defaultHost,
    defaultPort,
    connectionStatus,
    isSubscribed,
    mqttConnect,
    mqttDisconnect,
    subscribeTopic,
    unsubscribeTopic
}: MqttClientProps) => {
    const [form] = Form.useForm<FormFieldsType>();

    useEffect(() => {
        form.setFieldsValue({ connectionStatus });
    }, [connectionStatus]);

    const onSubmit = ({
        host,
        port,
        path,
        username,
        password
    }: FormFieldsType) => {
        const url = `ws://${host}:${port}${path}`;
        const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        const options: IClientOptions = {
            // host: host,
            // hostname: 'broker.emqx.io',
            // port: port,
            // protocol: 'ws',
            clientId: clientId,
            keepalive: 60,
            protocol: 'ws',
            protocolId: 'MQTT',
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30 * 1000,
            will: {
                topic: 'WillMsg',
                payload: 'Connection Closed abnormally..!',
                qos: 0,
                retain: false
            }
            // will: {
            //     topic: '#',
            //     payload: '',
            //     qos: 1,
            //     retain: true
            // }
        };
        options.username = username;
        options.password = password;

        if (connectionStatus == ConnectionStatusType.DISCONNECTED) {
            mqttConnect(url, options);
        } else if (connectionStatus == ConnectionStatusType.CONNECTED) {
            mqttDisconnect();
        }
    };

    const onTopicSubscription = (e: any) => {
        const formFields: FormFieldsType = form.getFieldsValue();
        const topic = formFields?.['topic'];
        if (topic) subscribeTopic(topic);
    };

    const onTopicUnsubscription = (e: any) => {
        unsubscribeTopic();
    };

    const getConnectionStatusIcon = (
        connectionStatus: ConnectionStatusType
    ): React.ReactNode => {
        const { CONNECTED, RECONNECTING, DISCONNECTED } = ConnectionStatusType;
        switch (connectionStatus) {
            case CONNECTED:
                return (
                    <CheckCircleTwoTone
                        twoToneColor="#52c41a"
                        className={style.dividerSpanIcon}
                    />
                );
            case RECONNECTING:
                return (
                    <SyncOutlined
                        spin={true}
                        twoToneColor="#eb2f96"
                        className={style.dividerSpanIcon}
                    />
                );
            case DISCONNECTED:
                return (
                    <CloseCircleTwoTone
                        twoToneColor="#eb2f96"
                        className={style.dividerSpanIcon}
                    />
                );
        }
    };

    const getSubscriptionBtn = (
        isSubscribed: boolean,
        onTopicSubscription: (e: any) => void,
        onTopicUnsubscription: (e: any) => void
    ) => {
        return (
            <Button
                type="primary"
                htmlType="button"
                onClick={
                    isSubscribed ? onTopicUnsubscription : onTopicSubscription
                }
                disabled={connectionStatus !== ConnectionStatusType.CONNECTED}
            >
                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </Button>
        );
    };

    console.log('==Rerender=============');
    return (
        <>
            <Form
                form={form}
                name="connectionForm"
                layout={'horizontal'}
                labelCol={{ span: 4, offset: 0 }}
                wrapperCol={{ span: 13 }}
                onFinish={onSubmit}
                initialValues={{
                    host: defaultHost,
                    port: defaultPort,
                    path: '/mqtt',
                    connectionStatus: ConnectionStatusType.DISCONNECTED,
                    topic: process.env.REACT_APP_DEFAULT_TOPIC || ''
                }}
            >
                <Divider orientation="left">
                    <span className={style.dividerSpan}>
                        MQTT Connection{' '}
                        {getConnectionStatusIcon(connectionStatus)}
                    </span>
                </Divider>
                <Form.Item
                    name={'host'}
                    label="Host"
                    rules={[{ required: true }]}
                >
                    <Input
                        disabled={
                            connectionStatus == ConnectionStatusType.CONNECTED
                        }
                    />
                </Form.Item>
                <Form.Item
                    // wrapperCol={{ span: 12, offset: 0 }}
                    // labelCol={{ span: 15, offset: 0 }}
                    name={'port'}
                    label="Port"
                    rules={[{ required: true }]}
                >
                    <Input
                        disabled={
                            connectionStatus == ConnectionStatusType.CONNECTED
                        }
                    />
                </Form.Item>
                <Form.Item
                    // wrapperCol={{ span: 15, offset: 0 }}
                    // labelCol={{ span: 15, offset: 0 }}
                    name={'path'}
                    label="Path"
                >
                    <Input
                        disabled={
                            connectionStatus == ConnectionStatusType.CONNECTED
                        }
                    />
                </Form.Item>
                <Form.Item name={'user'} label="Username">
                    <Input
                        disabled={
                            connectionStatus == ConnectionStatusType.CONNECTED
                        }
                    />
                </Form.Item>
                <Form.Item name={'password'} label="Password">
                    <Input
                        type={'password'}
                        disabled={
                            connectionStatus == ConnectionStatusType.CONNECTED
                        }
                    />
                </Form.Item>
                <Form.Item name={'topic'} label="Topic">
                    <Input
                        disabled={
                            connectionStatus !==
                                ConnectionStatusType.CONNECTED || isSubscribed
                        }
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24, offset: 4 }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            {[
                                ConnectionStatusType.CONNECTED,
                                ConnectionStatusType.RECONNECTING
                            ].includes(connectionStatus as ConnectionStatusType)
                                ? 'Disconnect'
                                : 'Connect'}
                        </Button>
                        {getSubscriptionBtn(
                            isSubscribed,
                            onTopicSubscription,
                            onTopicUnsubscription
                        )}
                    </Space>
                </Form.Item>
            </Form>
        </>
    );
};

export const MemoMqttConnectionForm = React.memo(MqttConnectionForm);
