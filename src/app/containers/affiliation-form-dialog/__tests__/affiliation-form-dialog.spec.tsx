import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { getInitialHistory, getLoadableStateSuccess } from 'app/utils/state.utils';
import { EditorState } from 'prosemirror-state';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { PromptDialog } from 'app/components/prompt-dialog';
import { AffiliationFormDialog } from 'app/containers/affiliation-form-dialog/affiliation-form-dialog';

jest.mock('../../../components/prompt-dialog', () => ({
  PromptDialog: () => <div data-cmp="confirm-dialog"></div>
}));

jest.mock('@material-ui/core', () => ({
  Select: ({ children }) => <div data-cmp="Select">{children}</div>,
  MenuItem: ({ children }) => <div data-cmp="MenuItem">{children}</div>,
  FormControl: ({ children }) => <div data-cmp="FormControl">{children}</div>,
  InputLabel: ({ children }) => <div data-cmp="InputLabel">{children}</div>,
  TextField: () => <div data-cmp="TextField"></div>,
  IconButton: () => <div data-cmp="iconButton"></div>,
  Button: () => <div data-cmp="Button"></div>
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
          institution: 'Cambridge University, Boring science',
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
        <AffiliationFormDialog onDelete={jest.fn()} onAccept={jest.fn()} onCancel={jest.fn()} />
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
        <AffiliationFormDialog
          affiliation={mockState.present.affiliations[0]}
          onDelete={jest.fn()}
          onAccept={jest.fn()}
          onCancel={jest.fn()}
        />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches an event to create new affiliation', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    const onAccept = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <AffiliationFormDialog onDelete={jest.fn()} onAccept={onAccept} onCancel={jest.fn()} />
      </Provider>
    );
    wrapper.find({ title: 'Done' }).prop('onClick')();
    wrapper.update();

    expect(onAccept).toBeCalledWith(
      {
        id: expect.any(String),
        label: '',
        institution: '',
        address: {
          city: ''
        },
        country: ''
      },
      []
    );
  });

  it('dispatches an event to save edited affiliation', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    const onAccept = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <AffiliationFormDialog
          affiliation={mockState.present.affiliations[0]}
          onDelete={jest.fn()}
          onAccept={onAccept}
          onCancel={jest.fn()}
        />
      </Provider>
    );
    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(onAccept).toBeCalledWith(mockState.present.affiliations[0], []);
  });

  it('dispatches an event to delete affiliation', () => {
    const store = mockStore({
      manuscript: getLoadableStateSuccess(mockState)
    });
    const onDelete = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <AffiliationFormDialog
          affiliation={mockState.present.affiliations[0]}
          onDelete={onDelete}
          onAccept={jest.fn()}
          onCancel={jest.fn()}
        />
      </Provider>
    );

    wrapper.find({ title: 'Delete' }).prop('onClick')();
    wrapper.update();
    wrapper.find(PromptDialog).prop('onAccept')();
    expect(onDelete).toBeCalledWith(mockState.present.affiliations[0]);
  });
});
