import React from 'react';
import { EditorState } from 'prosemirror-state';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';

import { Person } from '../../../models/person';
import { RichTextInput } from '../';
import { ProseMirrorEditorView } from '../../rich-text-editor/prosemirror-editor-view';

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

describe('RichTextInput', () => {
  it('should render component', () => {
    const wrapper = create(
      <RichTextInput
        editorState={givenEditorState()}
        name="test-editor-input"
        label="Test Editor Input"
        onChange={jest.fn()}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should toggle an event', () => {
    const onChangeHandler = jest.fn();
    const editorState = givenEditorState();
    const wrapper = mount(
      <RichTextInput
        editorState={editorState}
        name="test-editor-input"
        label="Test Editor Input"
        onChange={onChangeHandler}
      />
    );
    const change = editorState.tr;
    const prosemirrorComponent = wrapper.find(ProseMirrorEditorView).at(0);
    (prosemirrorComponent.instance() as ProseMirrorEditorView).editorView.dispatch(change);

    expect(onChangeHandler).toHaveBeenCalledWith(change);
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
