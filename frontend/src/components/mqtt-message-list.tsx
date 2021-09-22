import * as React from 'react';
import Message from './mqtt-message';
import { MqttMessageType } from './mqtt-client';
import { Divider } from 'antd';

export interface MqttMessageListProps {
    msgLst: MqttMessageType[];
}

const MqttMessageList: React.FC<MqttMessageListProps> = ({ msgLst }) => {
    return (
        <>
            <Divider orientation="left">Results</Divider>
            {msgLst.map((el, ind) => (
                <Message msg={el} key={ind} />
            ))}
        </>
    );
};

export default MqttMessageList;
