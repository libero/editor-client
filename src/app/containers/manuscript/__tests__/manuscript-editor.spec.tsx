import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { ManuscriptEditor } from 'app/containers/manuscript/manuscript-editor';
import { updateAbstractAction, updateTitleAction } from 'app/actions/manuscript.actions';
import { givenState } from 'app/test-utils/reducer-test-helpers';

jest.mock('app/components/rich-text-input', () => ({
  RichTextInput: () => <div data-cmp="rich-text-input"></div>
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

    wrapper.root.findByProps({ label: 'Abstract' }).props.onChange(changeArg);
    expect(store.dispatch).toBeCalledWith(updateAbstractAction(changeArg));
  });
});
