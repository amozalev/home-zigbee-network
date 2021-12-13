import { ConnectionStatusType, MqttMessageType } from './mqtt-connection';
import { Reducer } from 'react';

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

export type ActionTypes =
    | 'disconnect'
    | 'setConnectionStatus'
    | 'addMessage'
    | 'topicSubscribe'
    | 'topicUnsubscribe';

export interface ActionBase<TType extends ActionTypes, TPayload> {
    type: TType;
    payload: TPayload;
}

export type Action =
    | ActionBase<'disconnect', { connectionStatus: ConnectionStatusType }>
    | ActionBase<
          'setConnectionStatus',
          { connectionStatus: ConnectionStatusType }
      >
    | ActionBase<'addMessage', { message: MqttMessageType }>
    | ActionBase<'topicSubscribe', { topic: string }>
    | ActionBase<'topicUnsubscribe', { topic: string | null }>;

export const reducer: Reducer<State, Action> = (
    state: State,
    action: Action
): State => {
    switch (action.type) {
        case 'disconnect':
            return {
                ...state,
                connectionStatus: action.payload.connectionStatus,
                // topic: action.payload.topic,
                messages: []
            };
        case 'setConnectionStatus':
            return {
                ...state,
                connectionStatus: action.payload.connectionStatus
            };
        case 'addMessage':
            return {
                ...state,
                messages: [...state.messages, action.payload.message]
            };
        case 'topicSubscribe':
            return {
                ...state,
                topic: action.payload.topic
            };
        case 'topicUnsubscribe':
            return {
                ...state,
                topic: action.payload.topic,
                messages: []
            };
        default:
            return state;
    }
};
