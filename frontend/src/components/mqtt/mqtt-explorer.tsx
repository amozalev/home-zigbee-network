import * as React from 'react';
import {
    ConnectionStatusType,
    MemoizedMyMqttClient,
    MqttMessageType
} from './mqtt-client';
import { Profiler, useCallback, useEffect, useRef, useState } from 'react';
import { IConnectPacket, IPublishPacket } from 'mqtt-packet';
import { ValidateStatus } from 'antd/lib/form/FormItem';
import { onRenderCallback } from '../../utils/utils';
import { MqttMessageProps } from './mqtt-message';
import MqttMessageList from './mqtt-message-list';
import { MqttClient } from 'mqtt';
import * as mqtt from 'mqtt';
import { IClientOptions } from 'mqtt/types/lib/client-options';
import { ISubscriptionGrant } from 'mqtt/types/lib/client';

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
    const [client, setClient] = useState<MqttClient | null>(null);
    const [message, setMessage] = useState<MqttMessageType | null>(null);
    const [newMessage, setNewMessage] = useState<MqttMessageType | null>(null);
    const [topic, setTopic] = useState<string | undefined>(undefined);
    const [clientId, setClientId] = useState<string>('');
    const [connectionStatus, setConnectStatus] = useState<ConnectionStatusType>(
        ConnectionStatusType.DISCONNECTED
    );
    const [msgLst, setMessageLst] = useState<MqttMessageType[]>([]);
    const connAttempts = useRef<number>(0);

    const mqttConnect = useCallback((url: string, options: IClientOptions) => {
        setClient(mqtt.connect(url, options));
        console.log('==mqttConnect client', client);
    }, []);

    const mqttDisconnect = useCallback(() => {
        if (client) client.end();
    }, [client]);

    const subscribeTopic = useCallback(
        (topic: string) => {
            console.log('==subscribeTopic client', client);
            if (client) client?.subscribe(topic, onTopicSubscription);
        },
        [client]
    );

    const unsubscribeTopic = useCallback(
        (topic: string) => {
            if (client) client?.unsubscribe(topic);
        },
        [client]
    );

    useEffect(() => {
        console.log('==useEffect');

        const onConnect = (packet: IConnectPacket) => {
            console.log('==onConnect');
            // setConnectStatus(ConnectionStatusType.CONNECTED);
        };

        const onReconnect = () => {
            console.log('==onReconnect');

            connAttempts.current++;
            // setConnectStatus(ConnectionStatusType.RECONNECTING);
            if (topic) client?.unsubscribe(topic);
            if (connAttempts.current >= 10) {
                client?.end();
                connAttempts.current = 0;
            }
        };

        const onMessage = (
            topic: string,
            payload: Buffer,
            packet: IPublishPacket
        ): void => {
            const msg: MqttMessageType = {
                topic,
                message: payload.toString()
            };
            console.log('==onMessage', msg);
            // setMessage(msg);
            setMessageLst((prevState) => [...prevState, msg]);
        };

        const onError = (err: Error) => {
            client?.end();
            setConnectStatus(ConnectionStatusType.DISCONNECTED);
        };

        const onEnd = () => {
            console.log('==onEnd');

            if (topic) client?.unsubscribe(topic);
            setConnectStatus(ConnectionStatusType.DISCONNECTED);
        };

        if (client) {
            if (client) {
                client.on('connect', onConnect);
                client.on('reconnect', onReconnect);
                client.on('message', onMessage);
                client.on('error', onError);
                client.on('end', onEnd);
            }
        }
    }, [client]);

    const onPublishMessage = (msg: MqttMessageType): void => {};

    const onTopicSubscription = (err: Error, granted: ISubscriptionGrant[]) => {
        console.log('==subscribed');
    };

    return (
        <>
            <Profiler id="MyMqttClient" onRender={onRenderCallback}>
                <MemoizedMyMqttClient
                    defaultHost={defaultHost}
                    defaultPort={defaultPort}
                    connectionStatus={connectionStatus}
                    mqttConnect={mqttConnect}
                    mqttDisconnect={mqttDisconnect}
                    subscribeTopic={subscribeTopic}
                    unsubscribeTopic={unsubscribeTopic}
                />
            </Profiler>
            <MqttMessageList msgLst={msgLst} />
        </>
    );
};
export default MqttExplorer;
