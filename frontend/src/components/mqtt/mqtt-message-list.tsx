import * as React from 'react';
import Message from './mqtt-message';
import { MqttMessageType } from './mqtt-connection';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';

export interface MqttMessageListProps {
    messages: MqttMessageType[];
}

const MqttMessageList: React.FC<MqttMessageListProps> = ({ messages }) => {
    return (
        <>
            <Divider orientation="left">Results</Divider>
            {messages.map((el, ind) => (
                <Message msg={el} key={ind} />
            ))}
        </>
    );
};

export default MqttMessageList;
