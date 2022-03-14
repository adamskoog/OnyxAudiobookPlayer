import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';
import reportWebVitals from './reportWebVitals';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import allReducers from './context/reducers';
import { Provider } from 'react-redux';
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(allReducers, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Main />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
