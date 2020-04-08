import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {Provider} from 'react-redux';
import {store} from './store';
import './app.scss';
import {Manuscript} from "./containers/manuscript";

function App() {
  return (
    <Provider store={store}>
      <Router>
          <div className='app-container'>
            <Switch>
              <Route path="/">
                <Manuscript />
              </Route>
            </Switch>
          </div>
      </Router>
    </Provider>
  );
}

export default App;
