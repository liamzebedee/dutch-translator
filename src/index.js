import React from 'react';
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import App from './components/App';
import { render } from 'react-dom'
import { Provider } from 'react-redux'


/*
MARCEL (CONT’D) 5.000 Euro gewonnen! Van harte
gefeliciteerd!
*/

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
    )
)
 
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.body
)