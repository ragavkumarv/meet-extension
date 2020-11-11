import { createStore, applyMiddleware } from 'redux';
import { meetReducer } from './index';
import thunk from 'redux-thunk';

export const store = createStore(meetReducer, applyMiddleware(thunk));
