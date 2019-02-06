
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { AsyncStorage } from 'react-native';
import { LOGOUT_USER } from '../actions/auth';

import Config from 'react-native-config';

const { APP_BUILD } = Config;

import rootReducer from '../reducers';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
    let store = createStore(persistedReducer, applyMiddleware(thunk));
    let persistor = persistStore(store);

    workOutVersion(store);

    if (module.hot) {
        module.hot.accept(() => {
            // This fetch the new state of the above reducers.
            const nextRootReducer = require('../reducers');
            store.replaceReducer(
            persistReducer(persistConfig, nextRootReducer)
            );
        });
    }

    return { store, persistor };
};

const workOutVersion = async (store) => {
    try {
        console.log('------------WORKING OUT VERSION---------------');
        const appVersion = await AsyncStorage.getItem('APP_VERSION');
        let manifestVersion = APP_BUILD;
        console.log('App Version in app: ', appVersion, '  Manifest version: ', manifestVersion);
        /*
         * Workaround for now. Since environment properties are not getting read in Windows
        */
        if (!manifestVersion) {
            return;
        }
        if (!appVersion || appVersion != manifestVersion) {
            // Clear all data
            console.log('Clearing ALL DATA');
           // await persistor.purge();
           store.dispatch({
                type: LOGOUT_USER,
            });
            await AsyncStorage.setItem('APP_VERSION', manifestVersion);
        }
    } catch (e) {
        console.error('Error in Working Out Version', e);
    }
};
