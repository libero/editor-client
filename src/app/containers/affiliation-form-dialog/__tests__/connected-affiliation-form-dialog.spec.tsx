import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import { ConnectedAffiliationFormDialog } from 'app/containers/affiliation-form-dialog/connected-affiliation-form-dialog';
import { AffiliationFormDialog } from 'app/containers/affiliation-form-dialog/affiliation-form-dialog';
import { givenState } from 'app/test-utils/reducer-test-helpers';

jest.mock('app/containers/affiliation-form-dialog/affiliation-form-dialog', () => ({
  AffiliationFormDialog: () => <div data-cmp="AffiliationsFormDialog"></div>
}));

describe('Author Form Dialog', () => {
  const mockStore = configureMockStore([]);
  let mockState;

  beforeEach(() => {
    mockState = givenState({
      affiliations: [
        {
          id: 'some_id',
          label: '1',
          institution: {
            name: 'Cambridge University, Boring science'
          },
          address: {
            city: 'Cambridge'
          },
          country: 'UK'
        }
      ]
    });
  });

  it('renders edit affiliation dialog', () => {
    const store = mockStore({ manuscript: mockState });

    const wrapper = create(
      <Provider store={store}>
        <ConnectedAffiliationFormDialog affiliation={mockState.data.present.affiliations[0]} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches update affiliation action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedAffiliationFormDialog affiliation={mockState.data.present.affiliations[0]} />
      </Provider>
    );

    wrapper.find(AffiliationFormDialog).prop('onAccept')(mockState.data.present.affiliations[0], []);
    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.updateAffiliationAction(mockState.data.present.affiliations[0])
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.linkAffiliationsAction({ affiliation: mockState.data.present.affiliations[0], authors: [] })
    );
  });

  it('dispatches add affiliation action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedAffiliationFormDialog />
      </Provider>
    );

    wrapper.find(AffiliationFormDialog).prop('onAccept')(mockState.data.present.affiliations[0], []);
    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.addAffiliationAction(mockState.data.present.affiliations[0])
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.linkAffiliationsAction({ affiliation: mockState.data.present.affiliations[0], authors: [] })
    );
  });

  it('dispatches delete affiliation action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedAffiliationFormDialog affiliation={mockState.data.present.affiliations[0]} />
      </Provider>
    );

    wrapper.find(AffiliationFormDialog).prop('onDelete')(mockState.data.present.affiliations[0]);
    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.deleteAffiliationAction(mockState.data.present.affiliations[0])
    );
  });
});
