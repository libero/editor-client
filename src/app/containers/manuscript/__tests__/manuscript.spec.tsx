import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Backdrop, CircularProgress, IconButton } from '@material-ui/core';
import { mount } from 'enzyme';

import { getInitialHistory, getLoadableStateProgress, getLoadableStateSuccess } from '../../../utils/state.utils';
import { ManuscriptContainer } from '../index';
import * as manuscriptActions from '../../../actions/manuscript.actions';
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

  it('dispatches an event on undoClick', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess({
        past: [{}],
        present: {
          keywords: {}
        },
        future: [{}]
      })
    });
    jest.spyOn(store, 'dispatch');

    (IconButton['render'] as jest.Mock).mockImplementationOnce(({ children }) => <div data-cmp="icon-button"></div>);
    const wrapper = mount(
      <Provider store={store}>
        <ManuscriptContainer />
      </Provider>
    );

    const undoBtnProps = wrapper.find(IconButton).at(0).props();

    expect(undoBtnProps.disabled).toBeFalsy();
    //call undo
    undoBtnProps.onClick(null);

    expect(store.dispatch).toBeCalledWith(manuscriptActions.undoAction());
  });

  it('dispatches an event on redoClick', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess({
        past: [{}],
        present: {
          keywords: {}
        },
        future: [{}]
      })
    });
    jest.spyOn(store, 'dispatch');

    (IconButton['render'] as jest.Mock).mockImplementationOnce(({ children }) => <div data-cmp="icon-button"></div>);
    const wrapper = mount(
      <Provider store={store}>
        <ManuscriptContainer />
      </Provider>
    );

    const redoBtnProps = wrapper.find(IconButton).at(1).props();

    expect(redoBtnProps.disabled).toBeFalsy();
    //call redo
    redoBtnProps.onClick(null);

    expect(store.dispatch).toBeCalledWith(manuscriptActions.redoAction());
  });
});
