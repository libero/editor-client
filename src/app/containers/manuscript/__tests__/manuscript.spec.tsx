import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Backdrop, CircularProgress, Hidden, Container } from '@material-ui/core';

import { getInitialHistory, getLoadableStateProgress, getLoadableStateSuccess } from '../../../utils/state.utils';
import { ManuscriptContainer } from '../index';
import { EditorState } from 'prosemirror-state';

jest.mock('@material-ui/core');

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
    const mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      keywordGroups: {},
      authors: []
    });
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
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
