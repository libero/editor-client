import React from 'react';
import { create } from 'react-test-renderer';
import { AuthorFormDialog } from '../index';
import configureMockStore from 'redux-mock-store';
import { getInitialHistory, getLoadableStateSuccess } from '../../../utils/state.utils';
import { EditorState } from 'prosemirror-state';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { addAuthorAction, deleteAuthorAction, updateAuthorAction } from '../../../actions/manuscript.actions';
import { PromptDialog } from '../../../components/prompt-dialog';

jest.mock('../../../components/prompt-dialog', () => ({
  PromptDialog: () => <div data-cmp="confirm-dialog"></div>
}));

describe('Prompt Dialog', () => {
  const mockStore = configureMockStore([]);
  let mockState;

  beforeEach(() => {
    mockState = getInitialHistory({
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
        }
      ]
    });
  });

  it('renders new author dialog form', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });

    const wrapper = create(
      <Provider store={store}>
        <AuthorFormDialog />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders edit author dialog form', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });

    const wrapper = create(
      <Provider store={store}>
        <AuthorFormDialog author={mockState.present.authors[0]} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches an event to create new author', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AuthorFormDialog />
      </Provider>
    );
    wrapper.find({ title: 'Done' }).simulate('click');
    expect(store.dispatch).toBeCalledWith(addAuthorAction({ firstName: '', id: expect.any(String), lastName: '' }));
  });

  it('dispatches an event to save edited author', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AuthorFormDialog author={mockState.present.authors[0]} />
      </Provider>
    );
    wrapper.find({ title: 'Done' }).simulate('click');
    expect(store.dispatch).toBeCalledWith(updateAuthorAction(mockState.present.authors[0]));
  });

  it('dispatches an event to delete author', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AuthorFormDialog author={mockState.present.authors[0]} />
      </Provider>
    );

    wrapper.find({ title: 'Delete' }).simulate('click');
    wrapper.update();

    wrapper.find(PromptDialog).prop('onAccept')();
    expect(store.dispatch).toBeCalledWith(deleteAuthorAction(mockState.present.authors[0]));
  });
});
