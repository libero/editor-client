import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './app.scss';
import { ManuscriptContainer } from './containers/manuscript';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <main className="app-container" role="application">
          <Switch>
            <Route path="/">
              <ManuscriptContainer />
            </Route>
          </Switch>
        </main>
      </Router>
    </Provider>
  );
};
