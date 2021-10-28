import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { getInitialHistory, getLoadableStateSuccess } from '../../../utils/state.utils';
import { EditorState } from 'prosemirror-state';
import { mount } from 'enzyme';
import { HotKeyBindings } from '../hot-keys';
import { GlobalHotKeys } from 'react-hotkeys';
import { undoAction } from '../../../actions/manuscript.actions';

jest.mock('react-hotkeys', () => ({
  configure: jest.fn(),
  GlobalHotKeys: () => <div></div>
}));

describe('Manuscript HotKeys', () => {
  const mockStore = configureMockStore([]);

  it('should dispatch an action', () => {
    const mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      keywordGroups: {},
      affiliations: [],
      authors: []
    });

    mockState.past = [{}];
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    jest.spyOn(store, 'dispatch');
    const wrapper = mount(
      <Provider store={store}>
        <HotKeyBindings />
      </Provider>
    );

    const handlers = wrapper.find(GlobalHotKeys).prop('handlers');
    handlers['UNDO']();
    expect(store.dispatch).toHaveBeenCalledWith(undoAction());
  });

  it('should not dispatch dispatch an action', () => {
    const mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      keywordGroups: {},
      affiliations: [],
      authors: []
    });

    mockState.past = [];
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    jest.spyOn(store, 'dispatch');
    const wrapper = mount(
      <Provider store={store}>
        <HotKeyBindings />
      </Provider>
    );

    const handlers = wrapper.find(GlobalHotKeys).prop('handlers');
    handlers['UNDO']();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
