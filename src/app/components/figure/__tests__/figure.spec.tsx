import React from 'react';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { ReplaceAroundStep, ReplaceStep } from 'prosemirror-transform';

import { createBodyState } from 'app/models/body';
import { FigureNodeView } from 'app/components/figure/index';
import { EditorView } from 'prosemirror-view';
import { FigureEditor } from 'app/components/figure/figure-editor';

jest.mock('prosemirror-view');
jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn()
  };
});

jest.mock('app/components/figure/figure-editor', () => {
  return {
    FigureEditor: class FigureEditorClass extends jest.requireActual('react').Component {
      static updateContentSpy = jest.fn();
      updateContent(...args): void {
        FigureEditorClass.updateContentSpy(...args);
      }
      render(): React.ReactNode {
        return <div data-cmp="FigureEditor"></div>;
      }
    }
  };
});

describe('Figure node view', () => {
  it('should render figure node view', () => {
    const figureNode = givenFigureNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new FigureNodeView(figureNode, view, jest.fn().mockReturnValue(0));

    expect(nodeView.dom.innerHTML).toMatchSnapshot();
  });

  it('should update node attributes', () => {
    const figureNode = givenFigureNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new FigureNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    jest.spyOn(view, 'dispatch');
    nodeView.handleAttributesChange('new label', 'new image base64');
    expect(view.dispatch['mock'].calls[0][0].steps[0]).toBeInstanceOf(ReplaceAroundStep);
  });

  it('should delete node', () => {
    const figureNode = givenFigureNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new FigureNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    jest.spyOn(view, 'dispatch');
    jest.spyOn(nodeView, 'destroy');
    expect(nodeView.destroy).not.toBeCalled();
    nodeView.handleDelete();
    expect(view.dispatch['mock'].calls[0][0].steps[0]).toBeInstanceOf(ReplaceStep);
    expect(nodeView.destroy).toBeCalled();
  });

  it('should update node', () => {
    const figureNode = givenFigureNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new FigureNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    const newNode = givenFigureNode();
    nodeView.update(newNode);
    expect(FigureEditor['updateContentSpy']).toBeCalledWith(newNode);
  });

  it('should stop event if target does not have drag handle class', () => {
    const figureNode = givenFigureNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new FigureNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    expect(nodeView.stopEvent({ target: nodeView.dom.firstChild })).toBeTruthy();
  });

  it('should ignore mutations', () => {
    const figureNode = givenFigureNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new FigureNodeView(figureNode, view, jest.fn().mockReturnValue(0));
    expect(nodeView.ignoreMutation()).toBeTruthy();
  });
});

function givenFigureNode(): ProsemirrorNode {
  const bodyEditorState = createBodyState(document.createElement('div'), '');
  return bodyEditorState.schema.nodes.figure.createAndFill();
}
