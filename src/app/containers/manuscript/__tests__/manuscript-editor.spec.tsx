import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { ManuscriptEditor } from '../manuscript-editor';
import { getInitialHistory, getInitialLoadableState, getLoadableStateSuccess } from '../../../utils/state.utils';
import { RichTextEditor } from '../../../components/rich-text-editor';
import { updateTitleAction } from '../../../actions/manuscript.actions';
import { EditorState } from 'prosemirror-state';

describe('manuscript editor', () => {
  const mockStore = configureMockStore([]);

  it('should render', () => {
    const mockEditorState = getInitialHistory({
      title: new EditorState(),
      keywords: {}
    });
    const store = mockStore({ manuscript: getLoadableStateSuccess(mockEditorState) });
    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should dispatch changes', () => {
    const mockEditorState = getInitialHistory({
      title: new EditorState(),
      keywords: {}
    });
    const store = mockStore({ manuscript: getLoadableStateSuccess(mockEditorState) });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );
    const changeArg = Symbol();

    wrapper.root.findByType(RichTextEditor).props.onChange(changeArg);

    expect(store.dispatch).toBeCalledWith({ payload: changeArg, type: updateTitleAction.type });
  });
});
