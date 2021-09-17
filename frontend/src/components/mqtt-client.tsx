import * as React from 'react';
import * as mqtt from 'mqtt';
import { useEffect, useState } from 'react';
import {
    IClientOptions,
    IClientPublishOptions
} from 'mqtt/types/lib/client-options';
import { IPublishPacket } from 'mqtt-packet';
import { MqttClient } from 'mqtt';

export interface MqttClientProps {
    host: string | undefined;
    port: number | undefined;
    topic: string | undefined;
    newMessage: MqttMessage | null;
    onConnectionChange: (
        clientId: string,
        connectionStatus: ConnectionStatusType,
        err?: Error
    ) => void;
    onMessage: (topic: string, payload: Buffer, packet: IPublishPacket) => void;
    // connect: (client: MqttClient) => void;
}

export interface MqttMessage {
    topic: string;
    message: string;
    options?: IClientPublishOptions;
}

export enum ConnectionStatusType {
    CONNECTED = 'Connected',
    RECONNECTING = 'Reconnecting',
    DISCONNECTED = 'Disconnected'
}

const MyMqttClient: React.FC<MqttClientProps> = ({
    host,
    port,
    topic,
    newMessage,
    onConnectionChange,
    onMessage
}) => {
    const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
    const [client, setClient] = useState<MqttClient | null>(null);

    useEffect(() => {
        const url = `ws://${host}:${port}/mqtt`;
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

        if (port && host) {
            const newClient = mqtt.connect(url, options);
            setClient(newClient);
        } else if (client && (!host || !port)) {
            client.end();
        }
    }, [host, port]);

    useEffect(() => {
        if (client) {
            // console.log(client);
            client.on('connect', () => {
                onConnectionChange(clientId, ConnectionStatusType.CONNECTED);
            });
            client.on('error', (err) => {
                onConnectionChange(
                    clientId,
                    ConnectionStatusType.DISCONNECTED,
                    err
                );
                client.end();
            });
            client.on('reconnect', () => {
                onConnectionChange(clientId, ConnectionStatusType.RECONNECTING);
                if (topic) client.unsubscribe(topic);
            });
            client.on('end', () => {
                if (topic) client.unsubscribe(topic);
                onConnectionChange(clientId, ConnectionStatusType.DISCONNECTED);
            });
            client.on('message', onMessage);
        }
    }, [client, onConnectionChange, onMessage]);

    useEffect(() => {
        if (client?.connected && topic) {
            client.subscribe(topic);
        }
        return () => {
            if (topic) client?.unsubscribe(topic);
        };
    }, [topic]);

    useEffect(() => {
        if (newMessage) {
            client?.publish(
                newMessage.message,
                newMessage.message,
                newMessage.options || {}
            );
        }
    }, [newMessage]);

    return <></>;
};

export default MyMqttClient;
