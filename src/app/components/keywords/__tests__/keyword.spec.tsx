import React from 'react';
import { EditorState } from 'prosemirror-state';
import { create } from 'react-test-renderer';
import { mount } from 'enzyme';

import { Keyword } from 'app/components/keywords/keyword';
import { ProseMirrorEditorView } from 'app/components/rich-text-editor/prosemirror-editor-view';
import { createNewKeywordState } from 'app/models/manuscript-state.factory';

describe('KeywordsEditorComponent', () => {
  it('renders keyword', () => {
    const props = {
      editorState: new EditorState(),
      onChange: jest.fn(),
      onDelete: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn()
    };

    const component = create(<Keyword {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('sets focus on dbl click', () => {
    const props = {
      editorState: createNewKeywordState(),
      onChange: jest.fn(),
      onDelete: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn()
    };

    const component = mount(<Keyword {...props} />);
    const prosemirror = component.find(ProseMirrorEditorView).get(0);
    jest.spyOn(prosemirror['ref'].current, 'focus');

    component.find('[data-test-id="keyword-container"]').getDOMNode().dispatchEvent(new Event('dblclick'));

    expect(prosemirror['ref'].current.focus).toHaveBeenCalled();
  });

  it('stops single clicks', () => {
    const props = {
      editorState: createNewKeywordState(),
      onChange: jest.fn(),
      onDelete: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn()
    };

    const component = mount(<Keyword {...props} />);
    const prosemirror = component.find(ProseMirrorEditorView).get(0);

    jest.spyOn(prosemirror['ref'].current, 'focus');
    const mouseDownEvent = new Event('mousedown');
    jest.spyOn(mouseDownEvent, 'preventDefault');
    jest.spyOn(mouseDownEvent, 'stopPropagation');
    component.find('[data-test-id="keyword-container"]').getDOMNode().dispatchEvent(mouseDownEvent);

    expect(mouseDownEvent.preventDefault).toHaveBeenCalled();
    expect(mouseDownEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should unsubscribe on unmount', () => {
    const props = {
      editorState: createNewKeywordState(),
      onChange: jest.fn(),
      onDelete: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn()
    };

    const component = mount(<Keyword {...props} />);
    const containerDiv = component.find('[data-test-id="keyword-container"]').getDOMNode();
    jest.spyOn(containerDiv, 'removeEventListener');
    component.unmount();
    expect(containerDiv.removeEventListener).toHaveBeenCalledWith('dblclick', expect.any(Function), true);
    expect(containerDiv.removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function), true);
  });
});
