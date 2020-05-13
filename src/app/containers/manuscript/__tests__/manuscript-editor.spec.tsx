import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { ManuscriptEditor } from '../manuscript-editor';
import { getInitialHistory, getLoadableStateSuccess } from '../../../utils/state.utils';
import { RichTextEditor } from '../../../components/rich-text-editor';
import {updateAbstractAction, updateKeywordAction, updateTitleAction} from '../../../actions/manuscript.actions';
import { EditorState } from 'prosemirror-state';
import {KeywordsEditor} from "../../../components/keywords";

describe('manuscript editor', () => {
  const mockStore = configureMockStore([]);

  it('should render', () => {
    const mockEditorState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
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

  it('should dispatch changes for title', () => {
    const mockEditorState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
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

    wrapper.root.findByProps({ label: 'Title' }).props.onChange(changeArg);

    expect(store.dispatch).toBeCalledWith({ payload: changeArg, type: updateTitleAction.type });
  });

  it('should dispatch changes for abstract', () => {
    const mockEditorState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
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

    wrapper.root.findByProps({ label: 'Abstract' }).props.onChange(changeArg);
    expect(store.dispatch).toBeCalledWith({ payload: changeArg, type: updateAbstractAction.type });
  });
});
