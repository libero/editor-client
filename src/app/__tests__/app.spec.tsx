import React from 'react';
import { create } from 'react-test-renderer';
import { App } from '../app';

jest.mock('react-redux', () => {
  return {
    Provider: ({ children }) => <>{children}</>
  };
});

jest.mock('react-router-dom', () => {
  return {
    BrowserRouter: ({ children }) => <div data-cmp="BrowserRouter">{children}</div>,
    Switch: ({ children }) => <div data-cmp="Switch">{children}</div>,
    Route: ({ children }) => <div data-cmp="Route">{children}</div>
  };
});

jest.mock('../containers/manuscript', () => {
  return {
    ManuscriptContainer: () => <div data-cmp="manuscript"></div>
  };
});

describe('App container', () => {
  it('renders', () => {
    const component = create(<App />);
    expect(component).toMatchSnapshot();
  });
});
