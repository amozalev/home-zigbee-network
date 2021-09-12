import * as React from 'react';
import * as mqtt from 'mqtt';
import { useEffect } from 'react';
import { IClientOptions } from 'mqtt/types/lib/client-options';

export interface MqttClientProps {
    host: string | undefined;
    port: number | undefined;
    topic: string;
    onConnectionChange: (
        clientId: string,
        connectionStatus: ConnectionStatus,
        err?: Error
    ) => void;
    onMessage: (msg: MqttMessage) => void;
}

export interface MqttMessage {
    topic: string;
    message: string;
}

export enum ConnectionStatus {
    CONNECTED = 'Connected',
    RECONNECTING = 'Reconnecting',
    DISCONNECTED = 'Disconeccted'
}

const MqttClient: React.FC<MqttClientProps> = ({
    host,
    port,
    topic,
    onConnectionChange,
    onMessage
}) => {
    const url = `${host}:${port}/mqtt`;
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

    const client = mqtt.connect(url, options);

    useEffect(() => {
        if (client) {
            console.log(client);
            client.on('connect', () => {
                onConnectionChange(clientId, ConnectionStatus.CONNECTED);
                client.subscribe(topic);
            });
            client.on('error', (err) => {
                onConnectionChange(
                    clientId,
                    ConnectionStatus.DISCONNECTED,
                    err
                );
                client.end();
            });
            client.on('reconnect', () => {
                onConnectionChange(clientId, ConnectionStatus.RECONNECTING);
                client.unsubscribe(topic);
            });
            client.on('message', (topic, message, packet) => {
                const payload: MqttMessage = {
                    topic,
                    message: message.toString()
                };
                console.log('message:', payload, packet);
                onMessage(payload);
            });
        }
    }, [host, port]);

    return <></>;
};

export default MqttClient;
