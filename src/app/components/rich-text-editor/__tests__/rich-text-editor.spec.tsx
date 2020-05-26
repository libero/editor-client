import React from 'react';
import { EditorState } from 'prosemirror-state';
import { RichTextEditor } from 'app/components/rich-text-editor/index';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';

describe('ReachTextEditorComponent', () => {
  it('renders the editor when editor state is provided', () => {
    const sampleState = new EditorState();

    const onChangeHandler = jest.fn();

    const component = create(<RichTextEditor editorState={sampleState} onChange={onChangeHandler} />);
    expect(component).toMatchSnapshot();
  });

  it('renders nothing when no EditorState is provided', () => {
    const sampleState = null;
    const onChangeHandler = jest.fn();

    const component = create(<RichTextEditor editorState={sampleState} onChange={onChangeHandler} />);
    expect(component).toMatchSnapshot();
  });

  it('fires onChange when prosemirror-view triggers onChange', () => {
    const sampleState = new EditorState();
    const onChangeHandler = jest.fn();

    const component = shallow(<RichTextEditor editorState={sampleState} onChange={onChangeHandler} />);
    const changeArg = Symbol();
    component.find('ProseMirrorEditorView').props().onChange.call(null, changeArg);

    expect(onChangeHandler).toHaveBeenCalledWith(changeArg);
  });
});
