import React from 'react';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';

import { NewKeywordSection } from '../new-keyword-section';
import { ProseMirrorEditorView } from '../../rich-text-editor/prosemirror-editor-view';
import { Keyword } from '../../../models/keyword';

describe('NewKeywordsEditorComponent', () => {
  const props = {
    editorState: new Keyword().content,
    onEnter: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onChange: jest.fn()
  };

  it('renders keyword', () => {
    const component = create(<NewKeywordSection {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('triggers onEnter when enter key is pressed', () => {
    const component = mount(<NewKeywordSection {...props} />);
    const prosemirrorOptions = component.find(ProseMirrorEditorView).props().options;
    const keyboardEvent = new KeyboardEvent('keypress', { key: 'Enter' });

    prosemirrorOptions['handleKeyDown']({ state: props.editorState }, keyboardEvent);
    expect(props.onEnter).toBeCalledWith(props.editorState);
  });
});
