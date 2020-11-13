import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';
import './index.css';

import { store } from '../Background/store';
import Newtab from '../Newtab/Newtab';

render(
  <Provider store={store}>
    <Newtab />
  </Provider>,
  window.document.querySelector('#app-container')
);
