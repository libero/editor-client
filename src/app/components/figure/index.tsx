import React from 'react';
import { NodeView, EditorView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { Transaction, TextSelection, NodeSelection } from 'prosemirror-state';

import { StepMap } from 'prosemirror-transform';

import { theme } from 'app/styles/theme';
import { FigureEditor, FigureEditorHandle } from 'app/components/figure/figure-editor';

export class FigureNodeView implements NodeView {
  dom?: HTMLElement;
  boxTextEditor: React.RefObject<FigureEditorHandle>;

  constructor(
    private node: ProsemirrorNode,
    private view: EditorView,
    private getPos: () => number,
    private isContainerActive: () => boolean
  ) {
    this.dom = document.createElement('section');
    this.boxTextEditor = React.createRef();
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <FigureEditor
          ref={this.boxTextEditor}
          figureNode={this.node}
          onDelete={this.handleDelete}
          onNodeChange={this.handleNodeChange}
          onSelectionChange={this.handleSelectionChange}
        />
      </ThemeProvider>,
      this.dom
    );
  }

  handleNodeChange = (nodeViewChange: Transaction) => {
    this.view.dispatch(this.transformNodeViewChanges(nodeViewChange));
  };

  handleDelete = () => {
    const change = this.view.state.tr
      .setSelection(new NodeSelection(this.view.state.doc.resolve(this.getPos())))
      .deleteSelection();
    this.view.dispatch(change);
  };

  handleSelectionChange = (anchor: number, head: number) => {
    const offset = this.getPos() + 1;
    const start = Math.min(anchor, head);
    const end = Math.max(anchor, head);
    const selection = TextSelection.create(this.view.state.doc, start + offset, end + offset);
    if (!selection.eq(this.view.state.selection)) {
      const selectionChange = this.view.state.tr.setSelection(selection);
      this.view.dispatch(selectionChange);
      this.view.dom.dispatchEvent(new FocusEvent('focus'));
    }
  };

  update(node: ProsemirrorNode) {
    if (!node.sameMarkup(this.node)) {
      return false;
    }
    this.boxTextEditor.current.updateContent(node);

    const hasCursor =
      this.view.state.selection.$from.pos >= this.getPos() &&
      this.view.state.selection.$from.pos <= this.getPos() + this.node.nodeSize;

    if (hasCursor && this.isContainerActive() && !this.boxTextEditor.current.hasFocus()) {
      this.boxTextEditor.current.focus();
    }
    return true;
  }

  stopEvent(evt) {
    return this.dom.contains(evt.target);
  }

  ignoreMutation() {
    return true;
  }

  private transformNodeViewChanges(change: Transaction): Transaction {
    const parentChange = this.view.state.tr;
    const offsetMap = StepMap.offset(this.getPos() + 2);
    const steps = change.steps;
    for (let i = 0; i < steps.length; i++) {
      parentChange.step(steps[i].map(offsetMap));
    }
    return parentChange;
  }
}
