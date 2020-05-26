import React from 'react';
import { create } from 'react-test-renderer';
import { App } from 'app/app';

jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn()
  };
});

jest.mock('react-redux', () => {
  return {
    Provider: ({ children }) => <>{children}</>
  };
});

jest.mock('react-router-dom', () => {
  return {
    Switch: ({ children }) => <div data-cmp="Switch">{children}</div>,
    Route: ({ children }) => <div data-cmp="Route">{children}</div>
  };
});

jest.mock('connected-react-router', () => {
  return {
    ConnectedRouter: ({ children }) => <div data-cmp="ConnectedRouter">{children}</div>
  };
});

jest.mock('../containers/modal-container', () => {
  return {
    ModalContainer: () => <div data-cmp="ModalContainer"></div>
  };
});

jest.mock('../containers/manuscript', () => {
  return {
    ManuscriptContainer: () => <div data-cmp="manuscript"></div>
  };
});

jest.mock('../store', () => {
  return {};
});

describe('App container', () => {
  it('renders', () => {
    const component = create(<App />);
    expect(component).toMatchSnapshot();
  });
});
