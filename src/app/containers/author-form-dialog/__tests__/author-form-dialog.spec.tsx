import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import { AuthorFormDialog } from '../';
import { addAuthorAction, deleteAuthorAction, updateAuthorAction } from '../../../actions/manuscript.actions';
import { PromptDialog } from '../../../components/prompt-dialog';
import { givenState } from '../../../test-utils/reducer-test-helpers';
import { ManuscriptHistoryState } from '../../../store';
import { Person } from '../../../models/person';

jest.mock('app/components/rich-text-input', () => ({
  RichTextInput: () => <div data-cmp="rich-text-input"></div>
}));

jest.mock('@material-ui/core', () => ({
  Select: ({ children }) => <div data-cmp="Index">{children}</div>,
  Dialog: () => <div data-cmp="Dialog"></div>,
  Menu: ({ children }) => <div data-cmp="Menu">{children}</div>,
  MenuItem: ({ children }) => <div data-cmp="MenuItem">{children}</div>,
  Checkbox: ({ children }) => <div data-cmp="Checkbox" />,
  FormControlLabel: ({ children }) => <div data-cmp="FormControlLabel" />,
  FormControl: ({ children }) => <div data-cmp="FormControl">{children}</div>,
  InputLabel: ({ children }) => <div data-cmp="InputLabel">{children}</div>,
  TextField: () => <div data-cmp="TextField"></div>,
  IconButton: () => <div data-cmp="iconButton"></div>,
  Button: () => <div data-cmp="Button"></div>
}));

describe('Author Form Dialog', () => {
  const mockStore = configureMockStore([]);
  let mockState: ManuscriptHistoryState;

  beforeEach(() => {
    mockState = givenState({
      authors: [
        new Person({
          id: '4d53e405-5225-4858-a87a-aec902ae50b6',
          firstName: 'Fred',
          lastName: 'Atherden',
          email: 'f.atherden@elifesciences.org',
          orcid: 'https://orcid.org/0000-0002-6048-1470'
        })
      ]
    });
  });

  it('renders new author dialog form', () => {
    const store = mockStore({
      manuscript: mockState
    });

    const wrapper = create(
      <Provider store={store}>
        <AuthorFormDialog />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a form with competing interest statement', () => {
    mockState.data.present.authors[0].hasCompetingInterest = true;
    mockState.data.present.authors[0].competingInterestStatement = 'statement';

    const store = mockStore({
      manuscript: mockState
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
      manuscript: mockState
    });

    const wrapper = create(
      <Provider store={store}>
        <AuthorFormDialog author={mockState.data.present.authors[0]} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches an event to create new author', () => {
    const store = mockStore({
      manuscript: mockState
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AuthorFormDialog />
      </Provider>
    );
    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(store.dispatch).toBeCalledWith(addAuthorAction(expect.any(Person)));
  });

  it('dispatches an event to save edited author', () => {
    const store = mockStore({
      manuscript: mockState
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AuthorFormDialog author={mockState.data.present.authors[0]} />
      </Provider>
    );

    wrapper.find({ name: 'lastName' }).prop('onChange')({ target: { name: 'lastName', value: 'new value' } });
    wrapper.update();
    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(store.dispatch).toBeCalledWith(updateAuthorAction(expect.any(Person)));
  });

  it('does not dispatch an event when no changes made', () => {
    const store = mockStore({
      manuscript: mockState
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AuthorFormDialog author={mockState.data.present.authors[0]} />
      </Provider>
    );
    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(store.dispatch).not.toBeCalledWith(updateAuthorAction(mockState.data.present.authors[0]));
  });

  it('dispatches an event to delete author', () => {
    const store = mockStore({
      manuscript: mockState
    });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <AuthorFormDialog author={mockState.data.present.authors[0]} />
      </Provider>
    );

    wrapper.find({ title: 'Delete' }).prop('onClick')();
    wrapper.update();

    wrapper.find(PromptDialog).prop('onAccept')();
    expect(store.dispatch).toBeCalledWith(deleteAuthorAction(mockState.data.present.authors[0]));
  });
});
