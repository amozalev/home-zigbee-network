import * as React from 'react';
import MqttClient, { ConnectionStatus, MqttMessage } from './mqtt-client';
import { useState } from 'react';

export interface MqttExplorerProps {
    host: string | undefined;
    port: number | undefined;
}

const MqttExplorer: React.FC<MqttExplorerProps> = ({ host, port }) => {
    const [message, setMessage] = useState<MqttMessage | null>(null);
    const [clientId, setClientId] = useState<string>('');
    const [connectionStatus, setConnectStatus] =
        useState<string>('Disconnected');

    const connectionHandler = (
        clientId: string,
        connectionStatus: ConnectionStatus,
        err?: Error
    ): void => {
        setClientId(clientId);
        setConnectStatus(connectionStatus);
        console.error('Connection error: ', err);
    };

    const getMessage = (msg: MqttMessage): void => {
        setMessage(msg);
    };

    return (
        <>
            <MqttClient
                host={host}
                port={port}
                topic={'testyTestClient'}
                onConnectionChange={connectionHandler}
                onMessage={getMessage}
            />
            <p>Client id: {clientId}</p>
            <p>Connection status: {connectionStatus}</p>
            <p>Topic: {message?.topic}</p>
            <p>Message: {message?.message}</p>
        </>
    );
};

export default MqttExplorer;
