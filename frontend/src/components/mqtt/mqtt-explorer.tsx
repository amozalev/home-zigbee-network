import * as React from 'react';
import {
    ConnectionStatusType,
    MemoMqttConnectionForm,
    MqttMessageType
} from './mqtt-connection';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { IConnectPacket, IPublishPacket, Packet } from 'mqtt-packet';
import MqttMessageList from './mqtt-message-list';
import { MqttClient } from 'mqtt';
import * as mqtt from 'mqtt';
import { IClientOptions } from 'mqtt/types/lib/client-options';
import { ISubscriptionGrant } from 'mqtt/types/lib/client';
import * as mqttReducer from './mqtt-reducer';
import * as actions from './mqtt-actions';
import {
    subscribeTopicAction,
    unsubscribeTopicAction,
    updateConnectionStatusAction
} from './mqtt-actions';

export interface MqttExplorerProps {
    defaultHost?: string | undefined;
    defaultPort: number | undefined;
}

const MqttExplorer: React.FC<MqttExplorerProps> = ({
    defaultHost,
    defaultPort
}) => {
    const [client, setClient] = useState<MqttClient | null>(null);
    const [state, dispatch] = useReducer(
        mqttReducer.reducer,
        mqttReducer.initialState
    );
    const connAttempts = useRef<number>(0);

    const mqttConnect = useCallback((url: string, options: IClientOptions) => {
        setClient(mqtt.connect(url, options));
        console.log('==mqttConnect client', client);
    }, []);

    const mqttDisconnect = useCallback(() => {
        if (client) client.end();
    }, [client]);

    const subscribeTopic = useCallback(
        (topic: string) => {
            console.log('==subscribeTopic');
            if (client) client?.subscribe(topic, onTopicSubscription);
        },
        [client]
    );

    const unsubscribeTopic = useCallback(() => {
        console.log('==unsubscribeTopic', state.topic);
        if (client && state.topic)
            client?.unsubscribe(state.topic, onTopicUnsubscription);
    }, [client, state.topic]);

    useEffect(() => {
        console.log('==useEffect');

        const onConnect = (packet: IConnectPacket) => {
            console.log('==onConnect');
            dispatch(
                updateConnectionStatusAction(ConnectionStatusType.CONNECTED)
            );
        };

        const onReconnect = () => {
            console.log('==onReconnect');

            connAttempts.current++;
            dispatch(
                updateConnectionStatusAction(ConnectionStatusType.RECONNECTING)
            );
            if (connAttempts.current >= 2) {
                client?.end();
                connAttempts.current = 0;
            }
        };

        const onMessage = (
            topic: string,
            payload: Buffer,
            packet: IPublishPacket
        ): void => {
            const msg: MqttMessageType = {
                topic,
                message: payload.toString()
            };
            console.log('==onMessage', msg);
            dispatch(actions.addMessage(msg));
        };

        const onError = (err: Error) => {
            client?.end();
        };

        const onEnd = () => {
            console.log('==onEnd');
            dispatch(
                actions.disconnectAction(ConnectionStatusType.DISCONNECTED)
            );
        };

        if (client) {
            if (client) {
                client.on('connect', onConnect);
                client.on('reconnect', onReconnect);
                client.on('message', onMessage);
                client.on('error', onError);
                client.on('end', onEnd);
            }
        }
    }, [client]);

    const onPublishMessage = (msg: MqttMessageType): void => {};

    const onTopicSubscription = (err: Error, granted: ISubscriptionGrant[]) => {
        console.log('==subscribed', granted);
        //TODO temporarily used 1st array element
        dispatch(subscribeTopicAction(granted[0].topic));
    };

    const onTopicUnsubscription = (error?: Error, packet?: Packet) => {
        dispatch(unsubscribeTopicAction());
    };

    return (
        <>
            <MemoMqttConnectionForm
                defaultHost={defaultHost}
                defaultPort={defaultPort}
                connectionStatus={state.connectionStatus}
                isSubscribed={!!state.topic}
                mqttConnect={mqttConnect}
                mqttDisconnect={mqttDisconnect}
                subscribeTopic={subscribeTopic}
                unsubscribeTopic={unsubscribeTopic}
            />
            <MqttMessageList messages={state.messages} />
        </>
    );
};
export default MqttExplorer;
