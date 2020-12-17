import React from 'react';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { ReplaceAroundStep } from 'prosemirror-transform';

import { FigureCitationNodeView } from 'app/components/figure-citation/index';
import { createBodyState } from 'app/models/body';

jest.mock('prosemirror-view');
jest.mock('app/components/figure-citation/figure-citation-editor-popup', () => ({
  FigureCitationEditorPopup: () => <div data-cmp="FigureCitationEditorPopup" />
}));
jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles
  };
});

global['document']['createRange'] = () => ({
  setStart: jest.fn(),
  setEnd: jest.fn(),
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document
  }
});

describe('Figure citation node view', () => {
  it('should render node', () => {
    const [state, node] = givenState();
    const view = givenEditorView(state);
    const nodeView = new FigureCitationNodeView(node, view, jest.fn());
    expect(nodeView.dom.innerHTML).toMatchSnapshot();
  });

  it('should open editor on click', () => {
    const parentContainer = document.createElement('div');
    parentContainer.id = 'view-parent-container';
    const [state, node] = givenState();
    const view = givenEditorView(state);
    const nodeView = new FigureCitationNodeView(node, view, jest.fn());
    parentContainer.appendChild(view.dom);
    nodeView.dom.dispatchEvent(new Event('click'));
    expect(parentContainer.innerHTML).toMatchSnapshot();
  });

  it('should update node markup', () => {
    const [state, node] = givenState();
    const view = givenEditorView(state);
    const nodeView = new FigureCitationNodeView(node, view, () => 1);
    nodeView.handleChange([
      { id: 'id1', name: 'figure 1' },
      { id: 'id2', name: 'figure 2' }
    ]);
    expect(view.dispatch['mock'].calls[0][0].steps[0]).toBeInstanceOf(ReplaceAroundStep);
  });

  it('should remove popup on close', () => {
    const parentContainer = document.createElement('div');
    parentContainer.id = 'view-parent-container';
    const [state, node] = givenState();
    const view = givenEditorView(state);
    const nodeView = new FigureCitationNodeView(node, view, jest.fn());
    parentContainer.appendChild(view.dom);
    nodeView.dom.dispatchEvent(new Event('click'));
    nodeView.close();
    expect(parentContainer.innerHTML).toBe(view.dom.outerHTML);
  });
});

function givenState(): [EditorState, ProsemirrorNode] {
  let state = createBodyState(document.createElement('div'), '');
  const node = state.schema.nodes.figureCitation.createAndFill({ figIds: ['id1'] }, state.schema.text('test content'));
  state = state.apply(state.tr.insert(0, node));
  return [state, node];
}

function givenEditorView(state: EditorState): EditorView {
  const dom = document.createElement('div');
  dom.id = 'view-container';
  const view = new EditorView(dom, {
    state: null,
    dispatchTransaction: jest.fn()
  });
  view.dom = dom;
  view.state = state;
  view.dispatch = jest.fn();
  return view;
}
