import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { SortableAuthorsList } from 'app/containers/manuscript/sortable-authors-list/index';
import { getInitialHistory, getLoadableStateSuccess } from 'app/utils/state.utils';
import { EditorState } from 'prosemirror-state';
import { create } from 'react-test-renderer';
import { mount } from 'enzyme';
import { moveAuthorAction } from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { AuthorFormDialog } from 'app/containers/author-form-dialog';

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
    orcId: 'https://orcid.org/0000-0002-6048-1470',
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
    const mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      keywordGroups: {},
      authors: AUTHORS,
      affiliations: []
    });
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    const wrapper = create(
      <Provider store={store}>
        <SortableAuthorsList />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches move actions when authors rearranged', () => {
    const mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      keywordGroups: {},
      authors: AUTHORS,
      affiliations: []
    });

    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
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
    const mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      keywordGroups: {},
      authors: AUTHORS,
      affiliations: []
    });

    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
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
    const mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      keywordGroups: {},
      authors: [],
      affiliations: []
    });

    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
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
