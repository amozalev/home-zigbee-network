import * as React from 'react';
import { useEffect } from 'react';
import {
    IClientOptions,
    IClientPublishOptions
} from 'mqtt/types/lib/client-options';
import { Button, Col, Divider, Form, Input, Row } from 'antd';
import { ValidateStatus } from 'antd/lib/form/FormItem';
import {
    CheckCircleFilled,
    CloseCircleFilled,
    CheckCircleTwoTone,
    CloseCircleTwoTone,
    SyncOutlined
} from '@ant-design/icons';

export interface MqttClientProps {
    defaultHost: string | undefined;
    defaultPort: number | undefined;
    connectionStatus: ConnectionStatusType;
    mqttConnect: (url: string, options: IClientOptions) => void;
    mqttDisconnect: () => void;
    subscribeTopic: (topic: string) => void;
    unsubscribeTopic: (topic: string) => void;
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
    path: string;
    connectionStatus: string;
    topic: string;
}

const MyMqttClient: React.FC<MqttClientProps> = ({
    defaultHost,
    defaultPort,
    connectionStatus,
    mqttConnect,
    mqttDisconnect,
    subscribeTopic,
    unsubscribeTopic
}: MqttClientProps) => {
    const [form] = Form.useForm<FormFieldsType>();

    useEffect(() => {
        form.setFieldsValue({ connectionStatus });
    }, [connectionStatus]);

    const onSubmit = ({ host, port, path }: FormFieldsType) => {
        const url = `ws://${host}:${port}${path}`;
        const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
        const options: IClientOptions = {
            // host: host,
            // hostname: 'broker.emqx.io',
            // port: port,
            // protocol: 'ws',
            clientId: clientId,
            keepalive: 60,
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

    const getConnectionStatusIcon = (
        connectionStatus: ConnectionStatusType
    ): React.ReactNode => {
        const { CONNECTED, RECONNECTING, DISCONNECTED } = ConnectionStatusType;
        const style = { fontSize: '26px' };
        switch (connectionStatus) {
            case CONNECTED:
                return (
                    <CheckCircleTwoTone twoToneColor="#52c41a" style={style} />
                );
            case RECONNECTING:
                return (
                    <SyncOutlined
                        spin={true}
                        twoToneColor="#eb2f96"
                        style={style}
                    />
                );
            case DISCONNECTED:
                return (
                    <CloseCircleTwoTone twoToneColor="#eb2f96" style={style} />
                );
        }
    };
    console.log('==Rerender=============');
    return (
        <>
            <Divider orientation="left">MQTT Connection</Divider>
            <Form
                form={form}
                name="connectionForm"
                layout={'inline'}
                onFinish={onSubmit}
                initialValues={{
                    host: defaultHost,
                    port: defaultPort,
                    path: '/mqtt',
                    connectionStatus: ConnectionStatusType.DISCONNECTED,
                    topic: 'testyTestClient'
                }}
            >
                <Row style={{ alignItems: 'center' }} gutter={[1, 6]}>
                    <Col span={6}>
                        <Form.Item
                            name={'host'}
                            label="Host"
                            rules={[{ required: true }]}
                        >
                            <Input
                                disabled={
                                    connectionStatus ==
                                    ConnectionStatusType.CONNECTED
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            wrapperCol={{ span: 12, offset: 0 }}
                            labelCol={{ span: 15, offset: 0 }}
                            name={'port'}
                            label="Port"
                            rules={[{ required: true }]}
                        >
                            <Input
                                disabled={
                                    connectionStatus ==
                                    ConnectionStatusType.CONNECTED
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            wrapperCol={{ span: 15, offset: 0 }}
                            labelCol={{ span: 15, offset: 0 }}
                            name={'path'}
                            label="Path"
                        >
                            <Input
                                disabled={
                                    connectionStatus ==
                                    ConnectionStatusType.CONNECTED
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {[
                                    ConnectionStatusType.CONNECTED,
                                    ConnectionStatusType.RECONNECTING
                                ].includes(
                                    connectionStatus as ConnectionStatusType
                                )
                                    ? 'Disconnect'
                                    : 'Connect'}
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col>{getConnectionStatusIcon(connectionStatus)}</Col>
                </Row>
                <Divider orientation="left">Subscription</Divider>
                <Row>
                    <Col>
                        <Form.Item name={'topic'} label="Topic">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="button"
                                onClick={onTopicSubscription}
                            >
                                Subscribe
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

function myMqttClientPropsAreEqual(
    prev: MqttClientProps,
    next: MqttClientProps
) {
    console.log(
        '==equalProps',
        prev.defaultHost === next.defaultHost,
        prev.defaultPort === next.defaultPort,
        prev.connectionStatus === next.connectionStatus,
        prev.mqttConnect === next.mqttConnect,
        prev.mqttDisconnect === next.mqttDisconnect,
        prev.subscribeTopic === next.subscribeTopic,
        prev.unsubscribeTopic === next.unsubscribeTopic
    );
    return (
        prev.defaultHost === next.defaultHost &&
        prev.defaultPort === next.defaultPort &&
        prev.connectionStatus === next.connectionStatus &&
        prev.mqttConnect === next.mqttConnect &&
        prev.mqttDisconnect === next.mqttDisconnect &&
        prev.subscribeTopic === next.subscribeTopic &&
        prev.unsubscribeTopic === next.unsubscribeTopic
    );
}

export const MemoizedMyMqttClient = React.memo(
    MyMqttClient
    // myMqttClientPropsAreEqual
);
