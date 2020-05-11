import React from 'react';
import { create } from 'react-test-renderer';
import { EditorState } from 'prosemirror-state';
import { ProseMirrorEditorView } from '../prosemirror-editor-view';
import { EditorView } from 'prosemirror-view';
import { mount } from 'enzyme';

jest.mock('prosemirror-view');

const createNodeMock = (element) => {
  return element;
};

describe('prosemirror view', () => {
  let mockEditorView;

  beforeEach(() => {
    mockEditorView = {
      updateState: jest.fn(),
      destroy: jest.fn()
    };
    (EditorView as jest.Mock).mockImplementation(() => mockEditorView);
  });

  it('should render', () => {
    const sampleState = new EditorState();
    const onChangeHandler = jest.fn();

    const component = create(<ProseMirrorEditorView editorState={sampleState} onChange={onChangeHandler} />, {
      createNodeMock
    });
    expect(component).toMatchSnapshot();
    expect(EditorView).toBeCalledWith(
      { props: {}, type: 'div' },
      { state: sampleState, dispatchTransaction: expect.any(Function) }
    );
  });

  it('should trigger onChange', () => {
    const sampleState = new EditorState();
    const onChangeHandler = jest.fn();

    create(<ProseMirrorEditorView editorState={sampleState} onChange={onChangeHandler} />, { createNodeMock });
    const { dispatchTransaction } = (EditorView as jest.Mock).mock.calls[0][1];

    const tx = {};
    dispatchTransaction(tx);
    expect(onChangeHandler).toHaveBeenCalledWith(tx);
  });

  it('should update EditorView when props change', () => {
    const sampleState = new EditorState();
    const onChangeHandler = jest.fn();

    const component = mount(<ProseMirrorEditorView editorState={sampleState} onChange={onChangeHandler} />);
    const newState = new EditorState();
    component.setProps({ onChange: onChangeHandler, editorState: newState });
    expect(mockEditorView.updateState).toBeCalledWith(newState);
  });

  it('should destroy EditorView when unmount', () => {
    const sampleState = new EditorState();
    const onChangeHandler = jest.fn();

    const component = mount(<ProseMirrorEditorView editorState={sampleState} onChange={onChangeHandler} />);
    component.unmount();
    expect(mockEditorView.destroy).toBeCalled();
  });

  afterEach(() => {
    (EditorView as jest.Mock).mockReset();
  });
});
