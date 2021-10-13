import { action } from 'typesafe-actions';
import { ConnectionStatusType, MqttMessageType } from './mqtt-connection';

export const MQTT_CONNECT = 'mqtt/connect';

export const MQTT_DISCONNECT = 'mqtt/disconnect';

export const MQTT_ADD_MESSAGE = 'mqtt/set_message';

export const MQTT_SET_CONNECTION_STATUS = 'mqtt/set_connection_status';

export const MQTT_TOPIC_SUBSCRIBE = 'mqtt/topic_subscribe';

export const MQTT_TOPIC_UNSUBSCRIBE = 'mqtt/topic_unsubscribe';

export const disconnectAction = (
    connectionStatus: ConnectionStatusType,
    message: string | null = null,
    topic: string | null = null
) => action(MQTT_DISCONNECT, { connectionStatus, topic, message });

export const addMessage = (message: MqttMessageType) =>
    action(MQTT_ADD_MESSAGE, { message });

export const updateConnectionStatusAction = (
    connectionStatus: ConnectionStatusType
) => action(MQTT_SET_CONNECTION_STATUS, { connectionStatus });

export const subscribeTopicAction = (topic: string) =>
    action(MQTT_TOPIC_SUBSCRIBE, { topic });

export const unsubscribeTopicAction = (topic: string | null = null) =>
    action(MQTT_TOPIC_UNSUBSCRIBE, { topic, message: null });
