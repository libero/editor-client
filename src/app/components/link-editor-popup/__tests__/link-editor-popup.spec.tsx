import React from 'react';
import { create } from 'react-test-renderer';
import { EditorView } from 'prosemirror-view';
import { mount } from 'enzyme';
import { TextField, ClickAwayListener } from '@material-ui/core';
import { EditorState } from 'prosemirror-state';

import { Person } from '../../../models/person';
import { LinkEditorPopup } from '../link-editor-popup';
import { ActionButton } from '../../action-button';

jest.mock('@material-ui/core', () => ({
  Popper: ({ children }) => <div data-cmp="Popper">{children}</div>,
  Paper: ({ children }) => <div data-cmp="Paper">{children}</div>,
  ClickAwayListener: ({ children }) => <div data-cmp="ClickAwayListener">{children}</div>,
  IconButton: ({ children }) => <div data-cmp="IconButton">{children}</div>,
  useTheme: () => ({ zIndex: { tooltip: 100 } }),
  InputAdornment: ({ children }) => <div data-cmp="InputAdornment">{children}</div>,
  Button: ({ children }) => <div data-cmp="Button">{children}</div>,
  TextField: ({ value, onChange, children }) => (
    <input onChange={onChange} value={value} data-cmp="TextField">
      {children}
    </input>
  )
}));

jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles
  };
});

describe('LinkEditorPopup', () => {
  it('should render component', () => {
    const editorState = givenEditorState();
    const anchorEl = document.createElement('p');
    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const wrapper = create(
      <LinkEditorPopup editorView={editorView} onApply={jest.fn()} onClose={jest.fn()} anchorEl={anchorEl} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger apply event', () => {
    const handleClose = jest.fn();
    const handleApply = jest.fn();
    const editorState = givenEditorState();
    const anchorEl = document.createElement('p');

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const wrapper = mount(
      <LinkEditorPopup editorView={editorView} onApply={handleApply} onClose={handleClose} anchorEl={anchorEl} />
    );
    const event = document.createEvent('Event');

    (wrapper.find(TextField).getDOMNode() as HTMLInputElement).value = 'sampleLink';
    wrapper.find(TextField).simulate('change', event);
    wrapper.find(ActionButton).prop('onClick')();

    expect(handleApply).toHaveBeenCalledWith('sampleLink');
  });

  it('should trigger close event', () => {
    const handleClose = jest.fn();
    const handleApply = jest.fn();
    const editorState = givenEditorState();
    const anchorEl = document.createElement('p');

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const wrapper = mount(
      <LinkEditorPopup editorView={editorView} onApply={handleApply} onClose={handleClose} anchorEl={anchorEl} />
    );
    wrapper.find(ClickAwayListener).prop('onClickAway').call(null);

    expect(handleClose).toHaveBeenCalled();
  });

  function givenEditorState(): EditorState {
    const authorsContainer = document.createElement('div');
    authorsContainer.innerHTML = `
        <name><surname>Atherden</surname><given-names>Fred</given-names><suffix>Capt.</suffix></name>
        <contrib-id authenticated="true" contrib-id-type="orcid">https://orcid.org/0000-0002-6048-1470</contrib-id>
        <email>f.atherden@elifesciences.org</email>
        <bio>
            <p><bold>Fred Atherden</bold> is in the Production Department, eLife Sciences, Cambridge, United Kingdoms
                <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution License</ext-link>
            </p> 
        </bio>`;
    const person = new Person(authorsContainer);
    return person.bio;
  }
});
