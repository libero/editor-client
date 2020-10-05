import React from 'react';
import { create } from 'react-test-renderer';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { mount } from 'enzyme';
import { DOMSerializer } from 'prosemirror-model';

import { ProseMirrorEditorView } from 'app/components/rich-text-editor/prosemirror-editor-view';
import { createDummyEditorState } from 'app/test-utils/reducer-test-helpers';

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
    const sampleState = createDummyEditorState();
    const onChangeHandler = jest.fn();

    const component = create(<ProseMirrorEditorView editorState={sampleState} onChange={onChangeHandler} />, {
      createNodeMock
    });
    expect(component).toMatchSnapshot();
    expect(EditorView).toBeCalledWith(
      { props: { className: 'prosemirrorContainer' }, type: 'div' },
      {
        state: sampleState,
        clipboardSerializer: expect.any(DOMSerializer),
        clipboardTextSerializer: expect.any(Function),
        dispatchTransaction: expect.any(Function)
      }
    );
  });

  it('should trigger onChange', () => {
    const sampleState = createDummyEditorState();
    const onChangeHandler = jest.fn();

    create(<ProseMirrorEditorView editorState={sampleState} onChange={onChangeHandler} />, { createNodeMock });
    const { dispatchTransaction } = (EditorView as jest.Mock).mock.calls[0][1];

    const tx = {};
    dispatchTransaction(tx);
    expect(onChangeHandler).toHaveBeenCalledWith(tx);
  });

  it('should update EditorView when props change', () => {
    const sampleState = createDummyEditorState();
    const onChangeHandler = jest.fn();

    const component = mount(<ProseMirrorEditorView editorState={sampleState} onChange={onChangeHandler} />);
    const newState = new EditorState();
    component.setProps({ onChange: onChangeHandler, editorState: newState });
    expect(mockEditorView.updateState).toBeCalledWith(newState);
  });

  it('should destroy EditorView when unmount', () => {
    const sampleState = createDummyEditorState();
    const onChangeHandler = jest.fn();

    const component = mount(<ProseMirrorEditorView editorState={sampleState} onChange={onChangeHandler} />);
    component.unmount();
    expect(mockEditorView.destroy).toBeCalled();
  });

  afterEach(() => {
    (EditorView as jest.Mock).mockReset();
  });
});
