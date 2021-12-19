import React from 'react';
import { hot } from 'react-hot-loader';
import HomePage from './pages/home';

function App() {
    return (
        <div className="App">
            <HomePage />
        </div>
    );
}

export default hot(module)(App);
