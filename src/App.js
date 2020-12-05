import React from 'react';
import './App.css';

import Main from './components/Main';
import { createStore, applyMiddleware } from 'redux';
import allReducers from './context/reducers';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

function App() {

    const store = createStore(allReducers, applyMiddleware(thunk));

    return (
        <div className="App">
            <Provider store={store}>
                <Main />
            </Provider>
        </div>
    ); 
}

export default App;
