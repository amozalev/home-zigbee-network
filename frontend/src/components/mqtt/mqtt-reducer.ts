import { ConnectionStatusType, MqttMessageType } from './mqtt-connection';
import {
    MQTT_ADD_MESSAGE,
    MQTT_DISCONNECT,
    MQTT_SET_CONNECTION_STATUS,
    MQTT_TOPIC_SUBSCRIBE,
    MQTT_TOPIC_UNSUBSCRIBE
} from './mqtt-actions';
import { PayloadAction } from 'typesafe-actions';

export interface State {
    messages: MqttMessageType[];
    connectionStatus: ConnectionStatusType;
    topic: string | null;
}

export const initialState: State = {
    messages: [],
    connectionStatus: ConnectionStatusType.DISCONNECTED,
    topic: null
};

export const reducer = (
    state = initialState,
    action: PayloadAction<any, any>
) => {
    switch (action.type) {
        case MQTT_TOPIC_SUBSCRIBE:
            return {
                ...state,
                topic: action.payload.topic
            };
        case MQTT_TOPIC_UNSUBSCRIBE:
            return {
                ...state,
                topic: action.payload.topic,
                message: action.payload.message
            };
        case MQTT_DISCONNECT:
            return {
                ...state,
                connectionStatus: action.payload.connectionStatus,
                topic: action.payload.topic,
                messages: []
            };
        case MQTT_SET_CONNECTION_STATUS:
            return {
                ...state,
                connectionStatus: action.payload.connectionStatus
            };
        case MQTT_ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload.message]
            };
        default:
            return state;
    }
};
