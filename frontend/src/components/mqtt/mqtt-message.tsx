import * as React from 'react';
import { MqttMessageType } from './mqtt-connection';

export interface MqttMessageProps {
    msg: MqttMessageType;
}

const Message: React.FC<MqttMessageProps> = ({ msg }) => {
    return (
        <p>
            <b>Topic</b>: {msg.topic}, <b>Message</b>: {msg.message}
        </p>
    );
};

export default Message;
