import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { SortableAuthorsList } from 'app/containers/manuscript/sortable-authors-list/index';
import { create } from 'react-test-renderer';
import { mount } from 'enzyme';
import { moveAuthorAction } from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { AuthorFormDialog } from 'app/containers/author-form-dialog';
import { givenState } from 'app/test-utils/reducer-test-helpers';

jest.mock('app/components/rich-text-input', () => ({
  RichTextInput: () => <div data-cmp="rich-text-input"></div>
}));

jest.mock('@material-ui/core', () => ({
  Chip: ({ label }) => <div data-cmp="chip">{label}</div>,
  Button: () => <div data-cmp="Button"></div>
}));

jest.mock('react-sortable-hoc', () => ({
  SortableContainer: (_) => _,
  SortableElement: (_) => _,
  SortableHandle: (_) => _
}));

const AUTHORS = [
  {
    id: '4d53e405-5225-4858-a87a-aec902ae50b6',
    firstName: 'Fred',
    lastName: 'Atherden',
    email: 'f.atherden@elifesciences.org',
    orcid: 'https://orcid.org/0000-0002-6048-1470',
    affiliations: []
  },
  {
    id: 'c3b008e6-4ae9-4ef9-b7cb-854749a1e897',
    firstName: 'Jeanine',
    lastName: 'Smith',
    suffix: 'III',
    affiliations: []
  }
];

describe('Sortable authors list', () => {
  const mockStore = configureMockStore([]);

  it('renders authors list', () => {
    const mockState = givenState({ authors: AUTHORS });
    const store = mockStore({
      manuscript: mockState
    });
    const wrapper = create(
      <Provider store={store}>
        <SortableAuthorsList />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches move actions when authors rearranged', () => {
    const mockState = givenState({ authors: AUTHORS });
    const store = mockStore({
      manuscript: mockState
    });

    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <SortableAuthorsList />
      </Provider>
    );

    const onSortEnd = wrapper.findWhere((n) => n.prop('onSortEnd')).prop('onSortEnd');
    onSortEnd({ oldIndex: 0, newIndex: 1 });

    expect(store.dispatch).toBeCalledWith(moveAuthorAction({ index: 1, author: AUTHORS[0] }));
  });

  it('dispatches edit action', () => {
    const mockState = givenState({ authors: AUTHORS });

    const store = mockStore({
      manuscript: mockState
    });

    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <SortableAuthorsList />
      </Provider>
    );

    const onEdit = wrapper.findWhere((n) => n.prop('index') === 0).prop('onEdit');
    onEdit(AUTHORS[0]);

    expect(store.dispatch).toBeCalledWith(
      manuscriptEditorActions.showModalDialog({
        component: AuthorFormDialog,
        props: { author: AUTHORS[0] },
        title: 'Edit Author'
      })
    );
  });

  it('dispatches add action', () => {
    const mockState = givenState({ authors: AUTHORS });

    const store = mockStore({
      manuscript: mockState
    });

    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <SortableAuthorsList />
      </Provider>
    );

    wrapper.find({ variant: 'addEntity' }).prop('onClick')();

    expect(store.dispatch).toBeCalledWith(
      manuscriptEditorActions.showModalDialog({
        component: AuthorFormDialog,
        title: 'Add Author'
      })
    );
  });
});
