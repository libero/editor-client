import React from 'react';

import { createBioEditorState } from 'app/models/person';
import { create } from 'react-test-renderer';
import { RichTextInput } from 'app/components/rich-text-input/index';
import { mount } from 'enzyme';
import { ProseMirrorEditorView } from 'app/components/rich-text-editor/prosemirror-editor-view';

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
    const el = document.createElement('bio');
    el.innerHTML = `<p><bold>Fred Atherden</bold> is in the Production Department, eLife Sciences, Cambridge, United Kingdoms
                    <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution License</ext-link>
                </p>`;

    const editorState = createBioEditorState(el);
    const wrapper = create(
      <RichTextInput
        editorState={editorState}
        name="test-editor-input"
        label="Test Editor Input"
        onChange={jest.fn()}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should toggle an event', () => {
    const onChangeHandler = jest.fn();
    const el = document.createElement('bio');
    el.innerHTML = `<p><bold>Fred Atherden</bold> is in the Production Department, eLife Sciences, Cambridge, United Kingdoms
                    <ext-link ext-link-type="uri" xlink:href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution License</ext-link>
                </p>`;

    const editorState = createBioEditorState(el);
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
});
