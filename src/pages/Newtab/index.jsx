import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Newtab from './Newtab';
import './index.css';
import { store } from '../Background/store';

render(
  <Provider store={store}>
    <Newtab />
  </Provider>,
  window.document.querySelector('#app-container')
);
