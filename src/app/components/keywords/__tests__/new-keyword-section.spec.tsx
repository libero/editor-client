import React from 'react';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';

import { NewKeywordSection } from 'app/components/keywords/new-keyword-section';
import { ProseMirrorEditorView } from 'app/components/rich-text-editor/prosemirror-editor-view';
import { createNewKeywordState } from 'app/models/manuscript-state.factory';

describe('KeywordsEditorComponent', () => {
  it('renders keyword', () => {
    const props = {
      editorState: createNewKeywordState(),
      onEnter: jest.fn()
    };

    const component = create(<NewKeywordSection {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('triggers onEnter when enter key is pressed', () => {
    const props = {
      editorState: createNewKeywordState(),
      onEnter: jest.fn()
    };

    const component = mount(<NewKeywordSection {...props} />);
    const prosemirrorOptions = component.find(ProseMirrorEditorView).props().options;
    const keyboardEvent = new KeyboardEvent('keypress', { key: 'Enter' });

    prosemirrorOptions['handleKeyDown']({ state: props.editorState }, keyboardEvent);
    expect(props.onEnter).toBeCalledWith(props.editorState);
  });
});
