import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { getInitialHistory, getLoadableStateSuccess } from 'app/utils/state.utils';
import { EditorState } from 'prosemirror-state';
import { create } from 'react-test-renderer';
import { AffiliationsList } from 'app/containers/manuscript/affiliations-list/index';

jest.mock('@material-ui/core', () => ({
  Button: ({ label }) => <div data-cmp="Button">{label}</div>,
  IconButton: () => <div data-cmp="IconButton"></div>
}));

const AFFILIATIONS = [
  {
    label: '1',
    institution: {
      name: 'eLife Sciences',
      department: 'Production Department'
    },
    address: {
      city: 'Cambridge'
    },
    country: 'United Kingdom',
    id: 'aff1'
  },
  {
    label: '2',
    institution: {
      name: 'University',
      department: 'Department'
    },
    address: {
      city: 'City'
    },
    country: 'Country',
    id: 'aff2'
  }
];

describe('Authors details info', () => {
  const mockStore = configureMockStore([]);

  it('renders affiliations list', () => {
    const mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      authors: [],
      keywordGroups: {},
      affiliations: AFFILIATIONS
    });
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    const wrapper = create(
      <Provider store={store}>
        <AffiliationsList />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
