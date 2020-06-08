import React from 'react';
import { create } from 'react-test-renderer';
import { AuthorFormDialog } from 'app/containers/author-form-dialog/index';
import configureMockStore from 'redux-mock-store';
import { getInitialHistory, getLoadableStateSuccess } from 'app/utils/state.utils';
import { EditorState } from 'prosemirror-state';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { addAuthorAction, deleteAuthorAction, updateAuthorAction } from 'app/actions/manuscript.actions';
import { PromptDialog } from 'app/components/prompt-dialog';

jest.mock('app/components/prompt-dialog', () => ({
  PromptDialog: () => <div data-cmp="confirm-dialog"></div>
}));

jest.mock('@material-ui/core', () => ({
  Select: ({ children }) => <div data-cmp="Select">{children}</div>,
  Menu: ({ children }) => <div data-cmp="Menu">{children}</div>,
  MenuItem: ({ children }) => <div data-cmp="MenuItem">{children}</div>,
  FormControl: ({ children }) => <div data-cmp="FormControl">{children}</div>,
  InputLabel: ({ children }) => <div data-cmp="InputLabel">{children}</div>,
  TextField: () => <div data-cmp="TextField"></div>,
  IconButton: () => <div data-cmo="iconButton"></div>,
  Button: () => <div data-cmo="Button"></div>
}));

describe('Author Form Dialog', () => {
  const mockStore = configureMockStore([]);
  let mockState;

  beforeEach(() => {
    mockState = getInitialHistory({
      title: new EditorState(),
      abstract: new EditorState(),
      affiliations: [],
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
    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(store.dispatch).toBeCalledWith(
      addAuthorAction({ firstName: '', id: expect.any(String), lastName: '', affiliations: [] })
    );
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
    wrapper.find({ title: 'Done' }).prop('onClick')();
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

    wrapper.find({ title: 'Delete' }).prop('onClick')();
    wrapper.update();

    wrapper.find(PromptDialog).prop('onAccept')();
    expect(store.dispatch).toBeCalledWith(deleteAuthorAction(mockState.present.authors[0]));
  });
});
