import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { getInitialHistory, getLoadableStateSuccess } from 'app/utils/state.utils';
import { EditorState } from 'prosemirror-state';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import {
  addAffiliationAction,
  addAuthorAction, deleteAffiliationAction,
  deleteAuthorAction, updateAffiliationAction,
  updateAuthorAction
} from 'app/actions/manuscript.actions';
import { PromptDialog } from 'app/components/prompt-dialog';
import { AffiliationFormDialog } from 'app/containers/affiliation-form-dialog/index';

jest.mock('../../../components/prompt-dialog', () => ({
  PromptDialog: () => <div data-cmp="confirm-dialog"></div>
}));

describe('Affiliation Form Dialog', () => {
  const mockStore = configureMockStore([]);
  let mockState;

  beforeEach(() => {
    mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      authors: [],
      keywordGroups: {},
      affiliations: [
        {
          id: 'some_id',
          label: '1',
          institution: {
            name: 'Cambridge University',
            department: 'Boring science'
          },
          address: {
            city: 'Cambridge'
          },
          country: 'UK'
        }
      ]
    });
  });

  it('renders new affiliation dialog form', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });

    const wrapper = create(
      <Provider store={store}>
        <AffiliationFormDialog />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders edit affiliation dialog form', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });

    const wrapper = create(
      <Provider store={store}>
        <AffiliationFormDialog affiliation={mockState.present.affiliations[0]} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches an event to create new affiliation', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AffiliationFormDialog />
      </Provider>
    );
    wrapper.find({ title: 'Done' }).simulate('click');
    expect(store.dispatch).toBeCalledWith(
      addAffiliationAction({
        id: expect.any(String),
        label: '',
        institution: {
          name: '',
          department: ''
        },
        address: {
          city: ''
        },
        country: ''
      })
    );
  });

  it('dispatches an event to save edited author', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AffiliationFormDialog affiliation={mockState.present.affiliations[0]} />
      </Provider>
    );
    wrapper.find({ title: 'Done' }).simulate('click');
    expect(store.dispatch).toBeCalledWith(updateAffiliationAction(mockState.present.affiliations[0]));
  });

  it('dispatches an event to delete author', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AffiliationFormDialog affiliation={mockState.present.affiliations[0]} />
      </Provider>
    );

    wrapper.find({ title: 'Delete' }).simulate('click');
    wrapper.update();

    wrapper.find(PromptDialog).prop('onAccept')();
    expect(store.dispatch).toBeCalledWith(deleteAffiliationAction(mockState.present.affiliations[0]));
  });
});
