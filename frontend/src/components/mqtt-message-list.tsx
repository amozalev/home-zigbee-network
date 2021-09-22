import * as React from 'react';
import Message from './mqtt-message';
import { MqttMessageType } from './mqtt-client';

export interface MqttMessageListProps {
    msgLst: MqttMessageType[];
}

const MqttMessageList: React.FC<MqttMessageListProps> = ({ msgLst }) => {
    return (
        <>
            {msgLst.map((el, ind) => (
                <Message msg={el} key={ind} />
            ))}
        </>
    );
};

export default MqttMessageList;
