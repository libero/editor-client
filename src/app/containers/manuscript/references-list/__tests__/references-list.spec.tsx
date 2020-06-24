import React from 'react';
import configureMockStore from 'redux-mock-store';
import { create } from 'react-test-renderer';
import { Provider } from 'react-redux';

import { ReferenceList } from 'app/containers/manuscript/references-list/index';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import ReferenceData from './reference-data.mock';

jest.mock('@material-ui/core', () => ({
  Button: ({ label }) => <div data-cmp="Button">{label}</div>,
  IconButton: () => <div data-cmp="IconButton"></div>
}));

describe('References List', () => {
  const mockStore = configureMockStore([]);

  it('renders the component', () => {
    const store = mockStore({ manuscript: givenState({ references: ReferenceData }) });

    const wrapper = create(
      <Provider store={store}>
        <ReferenceList />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
