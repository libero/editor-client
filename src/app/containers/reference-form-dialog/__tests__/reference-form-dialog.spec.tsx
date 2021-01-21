import React from 'react';
import configureMockStore from 'redux-mock-store';
import { create } from 'react-test-renderer';
import { Provider } from 'react-redux';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { mount } from 'enzyme';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { PromptDialog } from 'app/components/prompt-dialog';
import { ConnectedReferenceFormDialog } from 'app/containers/reference-form-dialog/connected-reference-form-dialog';
import { createReferenceAnnotatedValue, ReferenceType } from 'app/models/reference-type';
import { Reference } from 'app/models/reference';
import { JSONObject } from 'app/types/utility.types';

jest.mock('@material-ui/core', () => ({
  Dialog: () => <div data-cmp="Dialog"></div>,
  Menu: ({ children }) => <div data-cmp="Menu">{children}</div>,
  Select: ({ children }) => <div data-cmp="Index">{children}</div>,
  MenuItem: ({ children }) => <div data-cmp="MenuItem">{children}</div>,
  FormControl: ({ children }) => <div data-cmp="FormControl">{children}</div>,
  FormControlLabel: ({ children }) => <div data-cmp="FormControlLabel">{children}</div>,
  InputLabel: ({ children }) => <div data-cmp="InputLabel">{children}</div>,
  TextField: ({ children }) => <div data-cmp="TextField">{children}</div>,
  Checkbox: ({ children }) => <div data-cmp="CheckboxInput">{children}</div>,
  IconButton: ({ children }) => <div data-cmp="iconButton">{children}</div>,
  Button: ({ children }) => <div data-cmp="Button">{children}</div>
}));

jest.mock('app/components/rich-text-input', () => ({
  RichTextInput: ({ children }) => <div data-cmp="RichTextInput">{children}</div>
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
        new Reference({
          _id: 'some_id',
          _type: 'journal' as ReferenceType,
          authors: [{ firstName: 'First Name', lastName: 'Last Name' }, { groupName: 'Group Name' }],
          referenceInfo: {
            year: '2012',
            source: stringToEditorState('Science'),
            articleTitle: stringToEditorState(
              'Molecular architecture and assembly principles of <italic>Vibrio cholerae</italic> biofilms'
            ),
            doi: '',
            pmid: '',
            elocationId: '',
            firstPage: '236',
            lastPage: '239',
            inPress: false,
            volume: '337'
          }
        })
      ]
    });
  });

  it('renders form', () => {
    const store = mockStore({ manuscript: mockState });
    const wrapper = create(
      <Provider store={store}>
        <ConnectedReferenceFormDialog reference={mockState.data.present.references[0]} />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should not dispatch update action when no changes', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedReferenceFormDialog reference={mockState.data.present.references[0]} />
      </Provider>
    );

    wrapper.find({ title: 'Done' }).prop('onClick')();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      manuscriptActions.updateReferenceAction(mockState.data.present.references[0])
    );
  });

  it('should dispatch update action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedReferenceFormDialog reference={mockState.data.present.references[0]} />
      </Provider>
    );
    wrapper.find({ name: 'firstName' }).at(0).prop('onChange')({ target: { name: 'firstName', value: 'new value' } });
    const updatedReference = mockState.data.present.references[0].clone();
    updatedReference.authors[0].firstName = 'new value';

    wrapper.update();
    wrapper.find({ title: 'Done' }).prop('onClick')();
    wrapper.update();
    expect(store.dispatch).toHaveBeenCalledWith(manuscriptActions.updateReferenceAction(updatedReference));
  });

  it('should dispatch add action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedReferenceFormDialog />
      </Provider>
    );

    wrapper.find({ 'test-id': 'ref-authors' }).prop('onChange')([{ firstName: 'First Name', lastName: 'last name' }]);
    wrapper.update();
    wrapper.find({ 'test-id': 'ref-type' }).prop('onChange')({ target: { value: 'journal' } });
    wrapper.update();
    wrapper.find({ title: 'Done' }).prop('onClick')();

    expect(store.dispatch).toHaveBeenCalledWith(manuscriptActions.addReferenceAction(expect.any(Reference)));
  });

  it('should dispatch delete action', () => {
    const store = mockStore({ manuscript: mockState });
    jest.spyOn(store, 'dispatch');

    const wrapper = mount(
      <Provider store={store}>
        <ConnectedReferenceFormDialog reference={mockState.data.present.references[0]} />
      </Provider>
    );

    wrapper.find({ title: 'Delete' }).prop('onClick')();
    wrapper.update();
    wrapper.find(PromptDialog).prop('onAccept')();

    expect(store.dispatch).toHaveBeenCalledWith(
      manuscriptActions.deleteReferenceAction(mockState.data.present.references[0])
    );
  });

  function stringToEditorState(xmlContent: string): JSONObject {
    const el = document.createElement('div');
    el.innerHTML = xmlContent;
    return createReferenceAnnotatedValue(el).toJSON();
  }
});
