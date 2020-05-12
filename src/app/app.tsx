import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './app.scss';
import { ManuscriptContainer } from './containers/manuscript';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './styles/theme';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <main className="app-container" role="application">
            <Switch>
              <Route path="/">
                <ManuscriptContainer />
              </Route>
            </Switch>
          </main>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};
