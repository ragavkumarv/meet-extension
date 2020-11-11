import { createStore, applyMiddleware } from 'redux';
import { meetReducer } from './meetReducer';
import thunk from 'redux-thunk';

export const store = createStore(meetReducer, applyMiddleware(thunk));
