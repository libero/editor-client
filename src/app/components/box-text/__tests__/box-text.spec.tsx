import React from 'react';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { ReplaceStep } from 'prosemirror-transform';

import { createBodyState } from '../../../models/body';
import { EditorView } from 'prosemirror-view';
import { BoxTextNodeView } from '../';
import { BoxTextEditor } from '../box-text-editor';

jest.mock('prosemirror-view');
jest.mock('app/components/box-text/box-text-editor', () => ({
  BoxTextEditor: class BoxTextEditorClass extends jest.requireActual('react').Component {
    static updateContentSpy = jest.fn();
    updateContent(...args): void {
      BoxTextEditorClass.updateContentSpy(...args);
    }
    render(): React.ReactNode {
      return <div data-cmp="BoxTextEditor" />;
    }
  }
}));

jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn()
  };
});

describe('BoxText node view', () => {
  it('should render figure node view', () => {
    const figureNode = givenBoxTextNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new BoxTextNodeView(figureNode, view, jest.fn().mockReturnValue(0));

    expect(nodeView.dom.innerHTML).toMatchSnapshot();
  });

  it('should delete node', () => {
    const figureNode = givenBoxTextNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new BoxTextNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    jest.spyOn(view, 'dispatch');
    nodeView.handleDelete();
    expect(view.dispatch['mock'].calls[0][0].steps[0]).toBeInstanceOf(ReplaceStep);
  });

  it('should update node', () => {
    const figureNode = givenBoxTextNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new BoxTextNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    const newNode = givenBoxTextNode();
    nodeView.update(newNode);
    expect(BoxTextEditor['updateContentSpy']).toBeCalledWith(newNode);
  });

  it('should stop event if target is part of node view', () => {
    const figureNode = givenBoxTextNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new BoxTextNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    expect(nodeView.stopEvent(new Event('click'))).toBeFalsy();
    const evt = new Event('click');
    nodeView.dom.firstChild.dispatchEvent(evt);
    expect(nodeView.stopEvent(evt)).toBeTruthy();
  });

  it('should ignore mutations', () => {
    const figureNode = givenBoxTextNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new BoxTextNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    expect(nodeView.ignoreMutation()).toBeTruthy();
  });

  it('should stop and prevent drop event', () => {
    const figureNode = givenBoxTextNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new BoxTextNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    const evt = new Event('drop');
    jest.spyOn(evt, 'stopPropagation');
    jest.spyOn(evt, 'preventDefault');
    nodeView.dom.dispatchEvent(evt);
    expect(evt.stopPropagation).toBeCalled();
    expect(evt.preventDefault).toBeCalled();
  });

  it('should detach drop event listener when destroyed', () => {
    const figureNode = givenBoxTextNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new BoxTextNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    const evt = new Event('drop');
    jest.spyOn(evt, 'stopPropagation');
    jest.spyOn(evt, 'preventDefault');
    nodeView.destroy();
    nodeView.dom.dispatchEvent(evt);
    expect(evt.stopPropagation).not.toBeCalled();
    expect(evt.preventDefault).not.toBeCalled();
  });
});

function givenBoxTextNode(): ProsemirrorNode {
  const bodyEditorState = createBodyState(document.createElement('div'), '');
  return bodyEditorState.schema.nodes.boxText.createAndFill();
}
