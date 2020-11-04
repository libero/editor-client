import React from 'react';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { ReplaceAroundStep, ReplaceStep } from 'prosemirror-transform';

import { createBodyState } from 'app/models/manuscript-state.factory';
import { FigureNodeView } from 'app/components/figure/index';
import { EditorView } from 'prosemirror-view';

jest.mock('prosemirror-view');
jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn()
  };
});

jest.mock('app/components/figure/figure-editor', () => {
  return {
    FigureEditor: () => <div data-cmp="FigureEditor"></div>
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
    const nodeView = new FigureNodeView(
      figureNode,
      view,
      jest.fn().mockReturnValue(0),
      jest.fn().mockReturnValue(true)
    );

    expect(nodeView.dom.innerHTML).toMatchSnapshot();
  });

  it('should update node attributes', () => {
    const figureNode = givenFigureNode();
    const view = new EditorView(null, {
      state: null,
      dispatchTransaction: jest.fn()
    });

    view.state = createBodyState(document.createElement('body'), '');
    const nodeView = new FigureNodeView(
      figureNode,
      view,
      jest.fn().mockReturnValue(0),
      jest.fn().mockReturnValue(true)
    );
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
    const nodeView = new FigureNodeView(
      figureNode,
      view,
      jest.fn().mockReturnValue(0),
      jest.fn().mockReturnValue(true)
    );
    jest.spyOn(view, 'dispatch');
    nodeView.handleDelete();
    expect(view.dispatch['mock'].calls[0][0].steps[0]).toBeInstanceOf(ReplaceStep);
  });
});

function givenFigureNode(): ProsemirrorNode {
  const bodyEditorState = createBodyState(document.createElement('div'), '');
  return bodyEditorState.schema.nodes.figure.createAndFill();
}
