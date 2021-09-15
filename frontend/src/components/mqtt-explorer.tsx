import * as React from 'react';
import MyMqttClient, { ConnectionStatusType, MqttMessage } from './mqtt-client';
import { useCallback, useState } from 'react';
import { Button, Divider, Form, Input } from 'antd';
import { IPublishPacket } from 'mqtt-packet';
import {
    SyncOutlined,
    BulbOutlined,
    BulbTwoTone,
    StopTwoTone
} from '@ant-design/icons';

export interface MqttExplorerProps {
    defaultHost?: string | undefined;
    defaultPort: number | undefined;
}

const MqttExplorer: React.FC<MqttExplorerProps> = ({
    defaultHost,
    defaultPort
}) => {
    const [host, setHost] = useState<string | undefined>(undefined);
    const [port, setPort] = useState<number | undefined>(undefined);
    const [message, setMessage] = useState<MqttMessage | null>(null);
    const [newMessage, setNewMessage] = useState<MqttMessage | null>(null);
    const [clientId, setClientId] = useState<string>('');
    const [connectionStatus, setConnectStatus] = useState<ConnectionStatusType>(
        ConnectionStatusType.DISCONNECTED
    );
    const [form] = Form.useForm();

    const topic = 'testyTestClient';

    const layout = {
        labelCol: { span: 8, offset: 0 },
        wrapperCol: { span: 16, offset: 0 }
    };

    const connectionHandler = useCallback(
        (
            clientId: string,
            connectionStatus: ConnectionStatusType,
            err?: Error
        ): void => {
            setClientId(clientId);
            setConnectStatus(connectionStatus);
            // console.error('Connection error: ', err);
            form.setFieldsValue({
                clientId: clientId,
                connectionStatus: connectionStatus,
                status: connectionStatus
            });
        },
        [form]
    );

    const getMessageHandler = useCallback(
        (topic: string, payload: Buffer, packet: IPublishPacket): void => {
            const msg: MqttMessage = {
                topic,
                message: payload.toString()
            };
            // console.log('message:', payload.toString(), packet);
            setMessage(msg);

            const formFields = form.getFieldsValue();
            // console.log('==formFields', formFields);
            form.setFieldsValue({
                topic,
                message: payload.toString()
            });
        },
        [form]
    );

    const onPublishMessage = (msg: MqttMessage): void => {};

    const onSubmit = (values: any) => {
        console.log(values);
        if (connectionStatus == ConnectionStatusType.CONNECTED) {
            form.setFieldsValue({
                host: null,
                port: null,
                status: ConnectionStatusType.DISCONNECTED
            });
            setHost(undefined);
            setPort(undefined);
        } else if (
            connectionStatus == ConnectionStatusType.DISCONNECTED &&
            values['host'] &&
            values['port']
        ) {
            setHost(values['host']);
            setPort(parseInt(values['port']));
        }
    };

    const getConnectionStatusIcon = (
        connectionStatus: ConnectionStatusType
    ) => {
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

    return (
        <>
            <MyMqttClient
                host={host}
                port={port}
                topic={topic}
                newMessage={newMessage}
                onConnectionChange={connectionHandler}
                onMessage={getMessageHandler}
            />
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
                    status: connectionStatus
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
                        name={'port'}
                        label="Port"
                        // rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name={'status'}
                        label="Status"
                        hasFeedback
                        validateStatus={getConnectionStatusIcon(
                            connectionStatus
                        )}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 0 }}>
                        <Button type="primary" htmlType="submit">
                            {[
                                ConnectionStatusType.CONNECTED,
                                ConnectionStatusType.RECONNECTING
                            ].includes(connectionStatus as ConnectionStatusType)
                                ? 'Disconnect'
                                : 'Connect'}
                        </Button>
                    </Form.Item>
                </Input.Group>
            </Form>
            <Divider orientation="left">Results</Divider>
            //TODO Temporary info
            <p>Client id: {clientId}</p>
            <p>Connection status: {connectionStatus}</p>
            <p>Topic: {message?.topic}</p>
            <p>Message: {message?.message}</p>
            {/*<Form {...layout} name="mqtt-results" form={form}>*/}
            {/*    <Form.Item name={'clientId'} label="Client id">*/}
            {/*        <Input />*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name={'connectionStatus'} label="Connection status">*/}
            {/*        <Input value={connectionStatus} />*/}
            {/*    </Form.Item>*/}
            {/*    <Form.Item name={'message'} label="Message">*/}
            {/*        <Input />*/}
            {/*    </Form.Item>*/}
            {/*</Form>*/}
        </>
    );
};

export default MqttExplorer;
