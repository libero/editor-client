import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { ManuscriptEditor } from 'app/containers/manuscript/manuscript-editor';
import {
  addNewKeywordAction,
  deleteKeywordAction,
  updateAbstractAction,
  updateAcknowledgementsAction,
  updateImpactStatementAction,
  updateKeywordAction,
  updateNewKeywordAction,
  updateTitleAction
} from 'app/actions/manuscript.actions';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { removeFocusAction, setFocusAction } from 'app/actions/manuscript-editor.actions';
import { createNewKeywordState } from 'app/models/manuscript-state.factory';

jest.mock('app/components/rich-text-input', () => ({
  RichTextInput: () => <div data-cmp="rich-text-input"></div>
}));

jest.mock('app/components/rich-text-editor', () => ({
  RichTextEditor: () => <div data-cmp="rich-text-editor"></div>
}));

jest.mock('app/components/reference-citation', () => ({
  ReferenceCitationEditorPopup: () => <div data-cmp="ReferenceCitationEditorPopup"></div>
}));

describe('manuscript editor', () => {
  const mockStore = configureMockStore([]);

  it('should render', () => {
    const mockEditorState = givenState({});
    const store = mockStore({ manuscript: mockEditorState });
    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should dispatch changes for title', () => {
    const mockEditorState = givenState({});
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    const changeArg = mockEditorState.data.present.title.tr;

    wrapper.root.findByProps({ label: 'Title' }).props.onChange(changeArg);

    expect(store.dispatch).toBeCalledWith(updateTitleAction(changeArg));
  });

  it('should dispatch changes for abstract', () => {
    const mockEditorState = givenState({});
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );
    const changeArg = mockEditorState.data.present.abstract.tr;

    wrapper.root.findByProps({ name: 'abstract' }).props.onChange(changeArg);
    expect(store.dispatch).toBeCalledWith(updateAbstractAction(changeArg));
  });

  it('should dispatch changes for acknowledgements', () => {
    const mockEditorState = givenState({});
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );
    const changeArg = mockEditorState.data.present.acknowledgements.tr;

    wrapper.root.findByProps({ name: 'acknowledgements' }).props.onChange(changeArg);
    expect(store.dispatch).toBeCalledWith(updateAcknowledgementsAction(changeArg));
  });

  it('should dispatch changes for impact statement', () => {
    const mockEditorState = givenState({});
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );
    const changeArg = mockEditorState.data.present.abstract.tr;

    wrapper.root.findByProps({ name: 'impactStatement' }).props.onChange(changeArg);
    expect(store.dispatch).toBeCalledWith(updateImpactStatementAction(changeArg));
  });

  it('should set focus', () => {
    const mockEditorState = givenState({});
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    wrapper.root.findByProps({ name: 'abstract' }).props.onFocus(null, 'abstract');
    expect(store.dispatch).toBeCalledWith(setFocusAction('abstract'));
  });

  it('should add keyword', () => {
    const mockEditorState = givenState({
      keywordGroups: {
        group: {
          title: 'test',
          keywords: [createNewKeywordState()],
          newKeyword: createNewKeywordState()
        }
      }
    });
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    wrapper.root
      .findByProps({ name: 'group' })
      .props.onAdd('group', mockEditorState.data.present.keywordGroups.group.newKeyword);
    expect(store.dispatch).toBeCalledWith(
      addNewKeywordAction({
        keywordGroup: 'group',
        keyword: mockEditorState.data.present.keywordGroups.group.newKeyword
      })
    );
  });

  it('should update keyword', () => {
    const mockEditorState = givenState({
      keywordGroups: {
        group: {
          title: 'test',
          keywords: [createNewKeywordState()],
          newKeyword: createNewKeywordState()
        }
      }
    });
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    const change = mockEditorState.data.present.keywordGroups.group.keywords[0].tr;

    wrapper.root.findByProps({ name: 'group' }).props.onChange('group', 0, change);
    expect(store.dispatch).toBeCalledWith(
      updateKeywordAction({
        keywordGroup: 'group',
        index: 0,
        change
      })
    );
  });

  it('should focus keyword', () => {
    const mockEditorState = givenState({
      keywordGroups: {
        group: {
          title: 'test',
          keywords: [createNewKeywordState()],
          newKeyword: createNewKeywordState()
        }
      }
    });
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    wrapper.root.findByProps({ name: 'group' }).props.onFocus('group', 0, false);
    expect(store.dispatch).toBeCalledWith(setFocusAction('keywordGroups.group.keywords.0'));
  });

  it('should blur keyword', () => {
    const mockEditorState = givenState({
      keywordGroups: {
        group: {
          title: 'test',
          keywords: [createNewKeywordState()],
          newKeyword: createNewKeywordState()
        }
      }
    });
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    wrapper.root.findByProps({ name: 'group' }).props.onBlur();
    expect(store.dispatch).toBeCalledWith(removeFocusAction());
  });

  it('should delete keyword', () => {
    const mockEditorState = givenState({
      keywordGroups: {
        group: {
          title: 'test',
          keywords: [createNewKeywordState()],
          newKeyword: createNewKeywordState()
        }
      }
    });
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    wrapper.root.findByProps({ name: 'group' }).props.onDelete('group', 0);
    expect(store.dispatch).toBeCalledWith(deleteKeywordAction({ keywordGroup: 'group', index: 0 }));
  });

  it('should update new keyword', () => {
    const mockEditorState = givenState({
      keywordGroups: {
        group: {
          title: 'test',
          keywords: [createNewKeywordState()],
          newKeyword: createNewKeywordState()
        }
      }
    });
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const change = mockEditorState.data.present.keywordGroups.group.newKeyword.tr;

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    wrapper.root.findByProps({ name: 'group' }).props.onNewKeywordChange('group', change);
    expect(store.dispatch).toBeCalledWith(updateNewKeywordAction({ keywordGroup: 'group', change }));
  });

  it('should clear focus on clickout', () => {
    const mockEditorState = givenState({});
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const wrapper = create(
      <Provider store={store}>
        <ManuscriptEditor />
      </Provider>
    );

    wrapper.root.findByProps({ 'data-test-id': 'container-wrapper' }).props.onClick();
    expect(store.dispatch).toBeCalledWith(removeFocusAction());
  });
});
