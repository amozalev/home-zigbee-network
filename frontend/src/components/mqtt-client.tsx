import * as React from 'react'
import * as mqtt from 'mqtt'
import {useEffect, useState} from "react";
import {IClientOptions} from "mqtt/types/lib/client-options";

export interface MqttClientProps {
    host: string | undefined;
    port: number | undefined;
}

export interface MqttMessage {
    topic: string,
    message: string
}

const MqttClient: React.FC<MqttClientProps> = ({host, port}) => {
    const [connectionStatus, setConnectStatus] = useState<string>('Disconnected')
    const [message, setMessage] = useState<MqttMessage | null>(null)

    const url = `${host}:${port}/mqtt`
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
        },
        // will: {
        //     topic: '#',
        //     payload: '',
        //     qos: 1,
        //     retain: true
        // }
    }

    const client = mqtt.connect(url, options);


    useEffect(() => {
        if (client) {
            console.log(client)
            client.on('connect', () => {
                setConnectStatus('Connected');
                client.subscribe('testyTestClient');
            });
            client.on('error', (err) => {
                console.error('Connection error: ', err);
                client.end();
            });
            client.on('reconnect', () => {
                setConnectStatus('Reconnecting');
                client.unsubscribe('testyTestClient');
            });
            client.on('message', (topic, message, packet) => {
                const payload = {topic, message: message.toString()};
                console.log('message:', payload)
                setMessage(payload);
            });
        }
    }, [host, port]);

    return <>
        <p>Client id: {clientId}</p>
        <p>Connection status: {connectionStatus}</p>
        <p>Topic: {message?.topic}</p>
        <p>Message: {message?.message}</p>
    </>
}

export default MqttClient