import { AppRegistry } from 'react-native';
import App from './app/App';

import React, { Component } from 'react'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import configureStore from './app/Redux';

const { store, persistor } = configureStore();

export default class Bootstrap extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App/>
                </PersistGate>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('AwesomeNote4Kids', () => Bootstrap);
