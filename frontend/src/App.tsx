import React from 'react';
import './App.css';
import MqttClient from "./components/mqtt-client";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <MqttClient host={process.env.REACT_APP_MQTT_BROKER}
                            port={parseInt(process.env.REACT_APP_MQTT_PORT as string)}/>
            </header>
        </div>
    );
}

export default App;
