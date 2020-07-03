import React, { ChangeEvent } from 'react';
import { create } from 'react-test-renderer';
import { EditorView } from 'prosemirror-view';
import { mount } from 'enzyme';
import { TextField, Popover } from '@material-ui/core';

import { createBioEditorState } from 'app/models/person';
import { LinkEditorPopup } from 'app/components/link-editor-popup/index';
import { ActionButton } from 'app/components/action-button';

jest.mock('@material-ui/core', () => ({
  Popover: ({ children }) => <div data-cmp="Popover">{children}</div>,
  IconButton: ({ children }) => <div data-cmp="IconButton">{children}</div>,
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
    const el = document.createElement('bio');
    el.innerHTML = `<p><bold>Fred Atherden</bold> is in the Production Department, eLife Sciences, Cambridge, United Kingdoms
                    <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution License</ext-link>
                </p>`;
    const editorState = createBioEditorState(el);

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const wrapper = create(<LinkEditorPopup editorView={editorView} onClose={jest.fn()} x={100} y={200} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should pass href value on apply', () => {
    const handleClose = jest.fn();
    const el = document.createElement('bio');
    el.innerHTML = `<p><bold>Fred Atherden</bold> is in the Production Department, eLife Sciences, Cambridge, United Kingdoms
                    <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution License</ext-link>
                </p>`;
    const editorState = createBioEditorState(el);

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const wrapper = mount(<LinkEditorPopup editorView={editorView} onClose={handleClose} x={100} y={200} />);
    const event = document.createEvent('Event');

    (wrapper.find(TextField).getDOMNode() as HTMLInputElement).value = 'sampleLink';
    wrapper.find(TextField).simulate('change', event);
    wrapper.find(ActionButton).prop('onClick')();

    expect(handleClose).toHaveBeenCalledWith('sampleLink');
  });

  it('should not pass href value on close', () => {
    const handleClose = jest.fn();
    const el = document.createElement('bio');
    el.innerHTML = `<p><bold>Fred Atherden</bold> is in the Production Department, eLife Sciences, Cambridge, United Kingdoms
                    <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution License</ext-link>
                </p>`;
    const editorState = createBioEditorState(el);

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const wrapper = mount(<LinkEditorPopup editorView={editorView} onClose={handleClose} x={100} y={200} />);
    wrapper.find(Popover).prop('onClose')(new Event('input'), 'backdropClick');

    expect(handleClose).toHaveBeenCalledWith();
  });
});
