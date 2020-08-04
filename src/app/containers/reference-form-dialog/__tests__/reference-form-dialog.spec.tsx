import React from 'react';
import configureMockStore from 'redux-mock-store';
import { create } from 'react-test-renderer';
import { Provider } from 'react-redux';

import { ReferenceFormDialog } from 'app/containers/reference-form-dialog/index';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { createEmptyRefInfoByType, ReferenceType } from 'app/models/reference';
import { mount } from 'enzyme';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { PromptDialog } from 'app/components/prompt-dialog';

jest.mock('@material-ui/core', () => ({
  Dialog: () => <div data-cmp="Dialog"></div>,
  Menu: ({ children }) => <div data-cmp="Menu">{children}</div>,
  Select: ({ children }) => <div data-cmp="Index">{children}</div>,
  MenuItem: ({ children }) => <div data-cmp="MenuItem">{children}</div>,
  FormControl: ({ children }) => <div data-cmp="FormControl">{children}</div>,
  FormControlLabel: ({ children }) => <div data-cmp="FormControlLabel">{children}</div>,
  InputLabel: ({ children }) => <div data-cmp="InputLabel">{children}</div>,
  TextField: () => <div data-cmp="TextField"></div>,
  Checkbox: () => <div data-cmp="CheckboxInput"></div>,
  IconButton: () => <div data-cmp="iconButton"></div>,
  Button: () => <div data-cmp="Button"></div>
}));

jest.mock('@material-ui/lab', () => ({
  ToggleButtonGroup: ({ children }) => <div data-cmp="ToggleButtonGroup">{children}</div>,
  ToggleButton: ({ children }) => <div data-cmp="ToggleButton">{children}</div>
}));

jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles
  };
});

describe('Reference form dialog', () => {
  const mockStore = configureMockStore([]);
  let mockState;

  beforeEach(() => {
    mockState = givenState({
      references: [
        {
          id: 'some_id',
          type: 'journal' as ReferenceType,
          authors: [{ firstName: 'First Name', lastName: 'Last Name' }, { groupName: 'Group Name' }],
          referenceInfo: null
        }
      ]
    });
  });

  it('renders form', () => {
    const store = mockStore({ manuscript: mockState });
    const wrapper = create(
      <Provider store={store}>
        <ReferenceFormDialog reference={mockState.data.present.references[0]} />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should dispatch update action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ReferenceFormDialog reference={mockState.data.present.references[0]} />
      </Provider>
    );

    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.updateReferenceAction(mockState.data.present.references[0])
    );
  });

  it('should dispatch add action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ReferenceFormDialog />
      </Provider>
    );

    wrapper.find({ 'test-id': 'ref-authors' }).prop('onChange')([{ firstName: 'First Name', lastName: 'last name' }]);
    wrapper.update();
    wrapper.find({ 'test-id': 'ref-type' }).prop('onChange')({ target: { value: 'journal' } });
    wrapper.update();
    wrapper.find({ title: 'Done' }).prop('onClick')();

    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.addReferenceAction({
        id: expect.any(String),
        type: 'journal',
        authors: [{ firstName: 'First Name', lastName: 'last name' }],
        referenceInfo: expect.any(Object)
      })
    );
  });

  it('should dispatch delete action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ReferenceFormDialog reference={mockState.data.present.references[0]} />
      </Provider>
    );

    wrapper.find({ title: 'Delete' }).prop('onClick')();
    wrapper.update();
    wrapper.find(PromptDialog).prop('onAccept')();

    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.deleteReferenceAction(mockState.data.present.references[0])
    );
  });
});
