import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Backdrop, CircularProgress, Hidden, Container } from '@material-ui/core';

import { getLoadableStateProgress } from 'app/utils/state.utils';
import { ManuscriptContainer } from 'app/containers/manuscript/index';
import { givenState } from 'app/test-utils/reducer-test-helpers';

jest.mock('@material-ui/core');
jest.mock('app/components/rich-text-input', () => ({
  RichTextInput: () => <div data-cmp="rich-text-input"></div>
}));

jest.mock('app/components/keywords', () => ({
  KeywordEditor: () => <div data-cmp="keyword editor"></div>
}));

jest.mock('app/containers/manuscript/references-list', () => ({
  ReferenceList: () => <div data-cmp="ReferenceList"></div>
}));

jest.mock('@material-ui/lab', () => ({
  ToggleButtonGroup: ({ children }) => <div data-cmp="ToggleButtonGroup">{children}</div>,
  ToggleButton: ({ children }) => <div data-cmp="ToggleButton">{children}</div>,
}));

jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles,
    withStyles: jest.requireActual('@material-ui/core/styles').withStyles
  };
});

describe('Manuscript container', () => {
  const mockStore = configureMockStore([]);

  beforeEach(() => {
    (Hidden as jest.Mock).mockImplementation(({ children }) => <div data-cmp="hidden">{children}</div>);
    (Container['render'] as jest.Mock).mockImplementation(({ children }) => <div data-cmp="container">{children}</div>);
  });

  afterEach(() => {
    (Hidden as jest.Mock).mockReset();
    (Container['render'] as jest.Mock).mockReset();
  });

  it('renders when data is loaded', () => {
    const mockState = givenState({});
    const store = mockStore({
      manuscript: mockState
    });
    const wrapper = create(
      <Provider store={store}>
        <ManuscriptContainer />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('renders loading spinner when manuscript is loading', () => {
    (Backdrop['render'] as jest.Mock).mockImplementationOnce(({ children }) => (
      <div data-cmp="backdrop">{children}</div>
    ));
    (CircularProgress['render'] as jest.Mock).mockImplementationOnce(() => <div data-cmp="circular-progress"></div>);

    const store = mockStore({ manuscript: getLoadableStateProgress() });
    const wrapper = create(
      <Provider store={store}>
        <ManuscriptContainer />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();

    (Backdrop['render'] as jest.Mock).mockReset();
    (CircularProgress['render'] as jest.Mock).mockReset();
  });
});
