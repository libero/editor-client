import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { AuthorsInfoDetails } from '../';
import { EditorState } from 'prosemirror-state';
import { create } from 'react-test-renderer';
import { mount } from 'enzyme';
import * as manuscriptEditorActions from '../../../../actions/manuscript-editor.actions';
import { AuthorFormDialog } from '../../../author-form-dialog';
import { IconButton } from '@material-ui/core';
import { ActionButton } from '../../../../components/action-button';
import { Person } from '../../../../models/person';
import { givenState } from '../../../../test-utils/reducer-test-helpers';

jest.mock('@material-ui/core', () => ({
  Button: ({ label }) => <div data-cmp="Button">{label}</div>,
  IconButton: () => <div data-cmp="IconButton"></div>
}));

jest.mock('app/components/rich-text-input', () => ({
  RichTextInput: () => <div data-cmp="rich-text-input"></div>
}));

const AUTHORS: Person[] = [
  new Person({
    id: '4d53e405-5225-4858-a87a-aec902ae50b6',
    firstName: 'Fred',
    lastName: 'Atherden',
    email: 'test@example.com',
    isCorrespondingAuthor: true,
    hasCompetingInterest: true,
    competingInterestStatement: 'Works at eLife'
  }),
  new Person({
    id: 'c3b008e6-4ae9-4ef9-b7cb-854749a1e897',
    firstName: 'Jeanine',
    lastName: 'Smith'
  })
];

describe('Authors info details', () => {
  const mockStore = configureMockStore([]);

  it('renders authors list', () => {
    const mockState = givenState({
      title: new EditorState(),
      abstract: new EditorState(),
      affiliations: [],
      keywordGroups: {},
      authors: AUTHORS,
      references: []
    });
    const store = mockStore({ manuscript: mockState });
    const wrapper = create(
      <Provider store={store}>
        <AuthorsInfoDetails />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches edit action', () => {
    const mockState = givenState({
      title: new EditorState(),
      affiliations: [],
      abstract: new EditorState(),
      keywordGroups: {},
      authors: AUTHORS,
      references: []
    });

    const store = mockStore({ manuscript: mockState });

    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AuthorsInfoDetails />
      </Provider>
    );

    wrapper.find(IconButton).at(0).prop('onClick')(null);

    expect(store.dispatch).toBeCalledWith(
      manuscriptEditorActions.showModalDialog({
        component: AuthorFormDialog,
        props: { author: AUTHORS[0] },
        title: 'Edit Author'
      })
    );
  });

  it('dispatches add action', () => {
    const mockState = givenState({
      title: new EditorState(),
      abstract: new EditorState(),
      affiliations: [],
      keywordGroups: {},
      authors: [],
      references: []
    });

    const store = mockStore({ manuscript: mockState });

    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AuthorsInfoDetails />
      </Provider>
    );

    wrapper.find(ActionButton).prop('onClick')();

    expect(store.dispatch).toBeCalledWith(
      manuscriptEditorActions.showModalDialog({
        component: AuthorFormDialog,
        title: 'Add Author'
      })
    );
  });
});
