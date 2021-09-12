import * as React from 'react';
import MqttClient from './mqtt-client';

export interface MqttExplorerProps {
    host: string | undefined;
    port: number | undefined;
}

const MqttExplorer: React.FC<MqttExplorerProps> = ({ host, port }) => {
    return (
        <>
            <MqttClient host={host} port={port} />
        </>
    );
};

export default MqttExplorer;
