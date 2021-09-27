import * as React from 'react';
import Message from './mqtt-message';
import { MqttMessageType } from './mqtt-connection';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';

export interface MqttMessageListProps {
    msg: MqttMessageType | null;
}

const MqttMessageList: React.FC<MqttMessageListProps> = ({ msg }) => {
    const [msgLst, setMessageLst] = useState<MqttMessageType[]>([]);

    useEffect(() => {
        if (msg) {
            setMessageLst((prevState) => [...prevState, msg]);
        } else {
            setMessageLst([]);
        }
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
