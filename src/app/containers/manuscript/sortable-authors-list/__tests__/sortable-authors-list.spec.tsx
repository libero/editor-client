import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { SortableAuthorsList } from '../';
import { getInitialHistory, getLoadableStateSuccess } from '../../../../utils/state.utils';
import { EditorState } from 'prosemirror-state';
import { create } from 'react-test-renderer';
import { mount } from 'enzyme';
import { moveAuthorAction } from '../../../../actions/manuscript.actions';

jest.mock('@material-ui/core', () => ({
  Chip: ({ label }) => <div data-cmp="chip">{label}</div>,
  Button: () => <div data-cmp="Button"></div>
}));

jest.mock('react-sortable-hoc', () => ({
  SortableContainer: (_) => _,
  SortableElement: (_) => _
}));

describe('Sortable authors list', () => {
  const mockStore = configureMockStore([]);

  it('renders authors list', () => {
    const mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      keywordGroups: {},
      authors: [
        {
          id: '4d53e405-5225-4858-a87a-aec902ae50b6',
          firstName: 'Fred',
          lastName: 'Atherden',
          email: 'f.atherden@elifesciences.org',
          orcId: 'https://orcid.org/0000-0002-6048-1470'
        },
        {
          id: 'c3b008e6-4ae9-4ef9-b7cb-854749a1e897',
          firstName: 'Jeanine',
          lastName: 'Smith',
          suffix: 'III'
        }
      ]
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
    const authors = [
      {
        id: '4d53e405-5225-4858-a87a-aec902ae50b6',
        firstName: 'Fred',
        lastName: 'Atherden',
        email: 'f.atherden@elifesciences.org',
        orcId: 'https://orcid.org/0000-0002-6048-1470'
      },
      {
        id: 'c3b008e6-4ae9-4ef9-b7cb-854749a1e897',
        firstName: 'Jeanine',
        lastName: 'Smith',
        suffix: 'III'
      }
    ];

    const mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      keywordGroups: {},
      authors
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

    expect(store.dispatch).toBeCalledWith(moveAuthorAction({ index: 1, author: authors[0] }));
  });
});
