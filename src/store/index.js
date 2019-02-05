import { createStore, combineReducers, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import modsReducer from '../reducers/modsReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({
  store: modsReducer
});

const persistConfig = {
  key: 'root',
  storage
};


const persistedReducer = persistReducer(persistConfig, reducer);
export const store = createStore(persistedReducer, composeEnhancers());
export const persistor = persistStore(store);
