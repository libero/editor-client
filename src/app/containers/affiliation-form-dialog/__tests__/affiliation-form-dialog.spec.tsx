import React from 'react';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { PromptDialog } from 'app/components/prompt-dialog';
import { AffiliationFormDialog } from 'app/containers/affiliation-form-dialog/affiliation-form-dialog';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { Affiliation } from 'app/models/affiliation';

jest.mock('@material-ui/core', () => ({
  Dialog: () => <div data-cmp="Dialog"></div>,
  Select: ({ children }) => <div data-cmp="Index">{children}</div>,
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
    mockState = givenState({
      affiliations: [
        new Affiliation({
          id: 'some_id',
          label: '1',
          institution: {
            name: 'Cambridge University, Boring science'
          },
          address: {
            city: 'Cambridge'
          },
          country: 'UK'
        })
      ]
    });
  });

  it('renders new affiliation dialog form', () => {
    const store = mockStore({
      manuscript: mockState
    });

    const wrapper = create(
      <Provider store={store}>
        <AffiliationFormDialog onDelete={jest.fn()} allowLinkAuthors={true} onAccept={jest.fn()} onCancel={jest.fn()} />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders edit affiliation dialog form', () => {
    const store = mockStore({
      manuscript: mockState
    });

    const wrapper = create(
      <Provider store={store}>
        <AffiliationFormDialog
          affiliation={mockState.data.present.affiliations[0]}
          allowLinkAuthors={true}
          onDelete={jest.fn()}
          onAccept={jest.fn()}
          onCancel={jest.fn()}
        />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders affiliation dialog without linking authors', () => {
    const store = mockStore({
      manuscript: mockState
    });

    const wrapper = create(
      <Provider store={store}>
        <AffiliationFormDialog
          onDelete={jest.fn()}
          allowLinkAuthors={false}
          onAccept={jest.fn()}
          onCancel={jest.fn()}
        />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('dispatches an event to create new affiliation', () => {
    const store = mockStore({
      manuscript: mockState
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
        _id: expect.any(String),
        label: '',
        institution: {
          name: ''
        },
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
      manuscript: mockState
    });
    const onAccept = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <AffiliationFormDialog
          affiliation={mockState.data.present.affiliations[0]}
          allowLinkAuthors={true}
          onDelete={jest.fn()}
          onAccept={onAccept}
          onCancel={jest.fn()}
        />
      </Provider>
    );
    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(onAccept).toBeCalledWith(mockState.data.present.affiliations[0], []);
  });

  it('dispatches an event to delete affiliation', () => {
    const store = mockStore({
      manuscript: mockState
    });
    const onDelete = jest.fn();
    const wrapper = mount(
      <Provider store={store}>
        <AffiliationFormDialog
          affiliation={mockState.data.present.affiliations[0]}
          allowLinkAuthors={true}
          onDelete={onDelete}
          onAccept={jest.fn()}
          onCancel={jest.fn()}
        />
      </Provider>
    );

    wrapper.find({ title: 'Delete' }).prop('onClick')();
    wrapper.update();
    wrapper.find(PromptDialog).prop('onAccept')();
    expect(onDelete).toBeCalledWith(mockState.data.present.affiliations[0]);
  });
});
