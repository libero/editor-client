import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { ManuscriptEditor } from '../manuscript-editor';
import {
  addNewKeywordAction,
  deleteKeywordAction,
  updateAbstractAction,
  updateAcknowledgementsAction,
  updateImpactStatementAction,
  updateKeywordAction,
  updateNewKeywordAction,
  updateTitleAction
} from '../../../actions/manuscript.actions';
import { givenState } from '../../../test-utils/reducer-test-helpers';
import { removeFocusAction, setFocusAction } from '../../../actions/manuscript-editor.actions';
import { Keyword } from '../../../models/keyword';

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
          keywords: [new Keyword()],
          newKeyword: new Keyword()
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
          keywords: [new Keyword()],
          newKeyword: new Keyword()
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

    const change = mockEditorState.data.present.keywordGroups.group.keywords[0].content.tr;

    wrapper.root
      .findByProps({ name: 'group' })
      .props.onChange('group', mockEditorState.data.present.keywordGroups.group.keywords[0].id, change);

    expect(store.dispatch).toBeCalledWith(
      updateKeywordAction({
        keywordGroup: 'group',
        id: mockEditorState.data.present.keywordGroups.group.keywords[0].id,
        change
      })
    );
  });

  it('should focus keyword', () => {
    const mockEditorState = givenState({
      keywordGroups: {
        group: {
          title: 'test',
          keywords: [new Keyword()],
          newKeyword: new Keyword()
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

    wrapper.root.findByProps({ name: 'group' }).props.onFocus(null, 'keywordGroups.group.keywords.0');
    expect(store.dispatch).toBeCalledWith(setFocusAction('keywordGroups.group.keywords.0'));
  });

  it('should blur keyword', () => {
    const mockEditorState = givenState({
      keywordGroups: {
        group: {
          title: 'test',
          keywords: [new Keyword()],
          newKeyword: new Keyword()
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
          keywords: [new Keyword()],
          newKeyword: new Keyword()
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
      .props.onDelete('group', mockEditorState.data.present.keywordGroups.group.keywords[0]);
    expect(store.dispatch).toBeCalledWith(
      deleteKeywordAction({
        keywordGroup: 'group',
        keyword: mockEditorState.data.present.keywordGroups.group.keywords[0]
      })
    );
  });

  it('should update new keyword', () => {
    const mockEditorState = givenState({
      keywordGroups: {
        group: {
          title: 'test',
          keywords: [new Keyword()],
          newKeyword: new Keyword()
        }
      }
    });
    const store = mockStore({ manuscript: mockEditorState });
    jest.spyOn(store, 'dispatch');

    const change = mockEditorState.data.present.keywordGroups.group.newKeyword.content.tr;

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
