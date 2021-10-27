import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { create } from 'react-test-renderer';
import { AffiliationsList } from '../';
import { givenState } from '../../../../test-utils/reducer-test-helpers';

jest.mock('@material-ui/core', () => ({
  Button: ({ label }) => <div data-cmp="Button">{label}</div>,
  IconButton: () => <div data-cmp="IconButton"></div>
}));

describe('Affiliations info', () => {
  const mockStore = configureMockStore([]);

  it('renders affiliations list', () => {
    const mockState = givenState({});
    const store = mockStore({
      manuscript: mockState
    });
    const wrapper = create(
      <Provider store={store}>
        <AffiliationsList />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
