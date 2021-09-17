import * as React from 'react';
import MyMqttClient, { ConnectionStatusType, MqttMessage } from './mqtt-client';
import { Profiler, useCallback, useState } from 'react';
import { Button, Divider, Form, Input } from 'antd';
import { IPublishPacket } from 'mqtt-packet';
import { ValidateStatus } from 'antd/lib/form/FormItem';
import { onRenderCallback } from '../utils/utils';

export interface MqttExplorerProps {
    defaultHost?: string | undefined;
    defaultPort: number | undefined;
}

const MqttExplorer: React.FC<MqttExplorerProps> = ({
    defaultHost,
    defaultPort
}) => {
    const [hostPort, setHostPort] = useState<{
        host: string | undefined;
        port: number | undefined;
    }>({
        host: undefined,
        port: undefined
    });
    const [message, setMessage] = useState<MqttMessage | null>(null);
    const [newMessage, setNewMessage] = useState<MqttMessage | null>(null);
    const [topic, setTopic] = useState<string | undefined>(undefined);
    const [clientId, setClientId] = useState<string>('');
    const [connectionStatus, setConnectStatus] = useState<ConnectionStatusType>(
        ConnectionStatusType.DISCONNECTED
    );
    const [form] = Form.useForm();

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
            form.setFieldsValue({
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

            // const formFields = form.getFieldsValue();
            // console.log('==formFields', formFields);
            form.setFieldsValue({
                topic,
                message: payload.toString()
            });
        },
        [form]
    );

    const onPublishMessage = (msg: MqttMessage): void => {};

    const onTopicSubmit = (e: any) => {
        const formFields = form.getFieldsValue();
        const topic = formFields?.['topic'];
        if (topic) setTopic(topic);
    };

    const onSubmit = (values: any) => {
        console.log(values);
        if (connectionStatus == ConnectionStatusType.CONNECTED) {
            form.setFieldsValue({
                host: null,
                port: null,
                status: ConnectionStatusType.DISCONNECTED
            });
            setHostPort({ host: undefined, port: undefined });
        } else if (
            connectionStatus == ConnectionStatusType.DISCONNECTED &&
            values['host'] &&
            values['port']
        ) {
            setHostPort({
                host: values['host'],
                port: parseInt(values['port'])
            });
        }
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

    return (
        <>
            <Profiler id="MyMqttClient" onRender={onRenderCallback}>
                <MyMqttClient
                    host={hostPort.host}
                    port={hostPort.port}
                    topic={topic}
                    newMessage={newMessage}
                    onConnectionChange={connectionHandler}
                    onMessage={getMessageHandler}
                />
            </Profiler>
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
                    status: ConnectionStatusType.DISCONNECTED,
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
                            onClick={onTopicSubmit}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Input.Group>
            </Form>
            <Divider orientation="left">Results</Divider>
            //TODO Temporary info
            <p>Client id: {clientId}</p>
            <p>Topic: {message?.topic}</p>
            <p>Message: {message?.message}</p>
        </>
    );
};

export default MqttExplorer;
