import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';

import { store } from './store';
import { history } from './store/history';
import './app.scss';
import { ManuscriptContainer } from './containers/manuscript';
import { theme } from './styles/theme';
import { ConnectedRouter } from 'connected-react-router';
import { ModalContainer } from './containers/modal-container';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ModalContainer />
        <ConnectedRouter history={history}>
          <main className="app-container" role="application">
            <Switch>
              <Route path="/">
                <ManuscriptContainer />
              </Route>
            </Switch>
          </main>
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>
  );
};
