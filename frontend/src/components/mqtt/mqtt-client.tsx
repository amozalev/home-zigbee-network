import * as React from 'react';
import * as mqtt from 'mqtt';
import { useEffect, useRef, useState } from 'react';
import {
    IClientOptions,
    IClientPublishOptions
} from 'mqtt/types/lib/client-options';
import { IConnectPacket, IPublishPacket } from 'mqtt-packet';
import { MqttClient } from 'mqtt';
import { Button, Divider, Form, Input } from 'antd';
import { ValidateStatus } from 'antd/lib/form/FormItem';

export interface MqttClientProps {
    defaultHost: string | undefined;
    defaultPort: number | undefined;
    connectionStatus: ConnectionStatusType;
    mqttConnect: (url: string, options: IClientOptions) => void;
    mqttDisconnect: () => void;
    subscribeTopic: (topic: string) => void;
    unsubscribeTopic: (topic: string) => void;
    // topic: string | undefined;
    // newMessage: MqttMessageType | null;
    // onConnectionChange: (
    //     clientId: string,
    //     connectionStatus: ConnectionStatusType,
    //     err?: Error
    // ) => void;
    // onMessage: (topic: string, payload: Buffer, packet: IPublishPacket) => void;
    // connect: (client: MqttClient) => void;
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
    const layout = {
        labelCol: { span: 8, offset: 0 },
        wrapperCol: { span: 16, offset: 0 }
    };

    const [form] = Form.useForm<FormFieldsType>();

    // useEffect(() => {
    //     form.setFieldsValue({ connectionStatus });
    // }, [connectionStatus]);

    const onSubmit = ({ host, port, connectionStatus }: FormFieldsType) => {
        const url = `ws://${host}:${port}/mqtt`;
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
        mqttConnect(url, options);
    };

    const onTopicSubscription = (e: any) => {
        const formFields: FormFieldsType = form.getFieldsValue();
        const topic = formFields?.['topic'];
        if (topic) subscribeTopic(topic);
    };

    const getConnectionStatusIcon = (
        connectionStatus: ConnectionStatusType
    ): ValidateStatus => {
        const { CONNECTED, RECONNECTING, DISCONNECTED } = ConnectionStatusType;
        switch (connectionStatus) {
            case CONNECTED:
                return 'success';
            case RECONNECTING:
                return 'validating';
            case DISCONNECTED:
                return 'error';
        }
    };
    console.log('==Rerender=============');
    return (
        <>
            <Divider orientation="left">MQTT Connection</Divider>
            <Form
                {...layout}
                form={form}
                name="connectionForm"
                layout={'inline'}
                onFinish={onSubmit}
                initialValues={{
                    host: defaultHost,
                    port: defaultPort,
                    connectionStatus: ConnectionStatusType.DISCONNECTED,
                    topic: 'testyTestClient'
                }}
            >
                <Input.Group compact>
                    <Form.Item
                        name={'host'}
                        label="Host"
                        // rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ span: 6, offset: 0 }}
                        name={'port'}
                        label="Port"
                        // rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 0, offset: 0 }}
                        wrapperCol={{ span: 35, offset: 0 }}
                        name={'connectionStatus'}
                        label="Status"
                        hasFeedback
                        // validateStatus={getConnectionStatusIcon(
                        //     connectionStatus
                        // )}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 0 }}>
                        <Button type="primary" htmlType="submit">
                            {/*{[*/}
                            {/*    ConnectionStatusType.CONNECTED,*/}
                            {/*    ConnectionStatusType.RECONNECTING*/}
                            {/*].includes(connectionStatus as ConnectionStatusType)*/}
                            {/*    ? 'Disconnect'*/}
                            {/*    : 'Connect'}*/}
                            Connect
                        </Button>
                    </Form.Item>
                </Input.Group>
                <Input.Group compact>
                    <Form.Item
                        name={'topic'}
                        label="Topic"
                        // rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 0 }}>
                        <Button
                            type="default"
                            htmlType="button"
                            onClick={onTopicSubscription}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Input.Group>
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
    MyMqttClient,
    myMqttClientPropsAreEqual
);
