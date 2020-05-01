import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Backdrop, CircularProgress } from '@material-ui/core';

import { getInitialHistory, getLoadableStateProgress, getLoadableStateSuccess } from '../../../utils/state.utils';
import { ManuscriptContainer } from '../index';
import { EditorState } from 'prosemirror-state';

jest.mock('@material-ui/core');

describe('Manuscript container', () => {
  const mockStore = configureMockStore([]);

  it('renders when data is loaded', () => {
    const mockState = getInitialHistory({
      title: new EditorState(),
      keywords: {}
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
