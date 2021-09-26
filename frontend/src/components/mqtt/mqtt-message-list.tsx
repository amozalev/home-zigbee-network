import * as React from 'react';
import Message from './mqtt-message';
import { MqttMessageType } from './mqtt-client';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';

export interface MqttMessageListProps {
    msg: MqttMessageType;
}

const MqttMessageList: React.FC<MqttMessageListProps> = ({ msg }) => {
    const [msgLst, setMessageLst] = useState<MqttMessageType[]>([]);

    useEffect(() => {
        setMessageLst((prevState) => [...prevState, msg]);
    }, [msg]);

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
