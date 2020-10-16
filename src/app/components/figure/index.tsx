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
  figureEditor: React.RefObject<FigureEditorHandle>;

  constructor(
    private node: ProsemirrorNode,
    private view: EditorView,
    private getPos: () => number,
    private isContainerActive: () => boolean
  ) {
    this.dom = document.createElement('section');
    this.figureEditor = React.createRef();
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <FigureEditor
          ref={this.figureEditor}
          figureNode={this.node}
          onDelete={this.handleDelete}
          onLabelChange={this.handleLabelChange}
          onImageChange={this.handleImageChange}
          onNodeChange={this.handleContentChange}
          onSelectionChange={this.handleSelectionChange}
        />
      </ThemeProvider>,
      this.dom
    );
  }

  handleLabelChange = (label: string) => {
    const newAttributes = { label, img: this.node.attrs.img };
    const change = this.view.state.tr.setNodeMarkup(this.getPos(), null, newAttributes);
    this.view.dispatch(change);
  };

  handleImageChange = (img: string) => {
    const newAttributes = { img, label: this.node.attrs.label };
    const change = this.view.state.tr.setNodeMarkup(this.getPos(), null, newAttributes);
    this.view.dispatch(change);
  };

  handleContentChange = (nodeViewChange: Transaction, offset: number) => {
    this.view.dispatch(this.transformNodeViewChanges(nodeViewChange, offset));
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
      this.node = node;
    }
    this.figureEditor.current.updateContent(node);
    if (this.isContainerActive() && !this.figureEditor.current.hasFocus()) {
      this.figureEditor.current.focusFromSelection(this.view.state.selection, this.getPos());
    }
    return true;
  }

  stopEvent(evt) {
    return this.dom.contains(evt.target);
  }

  ignoreMutation() {
    return true;
  }

  private transformNodeViewChanges(change: Transaction, additionalOffset: number): Transaction {
    const parentChange = this.view.state.tr;
    const offsetMap = StepMap.offset(this.getPos() + 2 + additionalOffset);
    const steps = change.steps;
    for (let i = 0; i < steps.length; i++) {
      parentChange.step(steps[i].map(offsetMap));
    }
    return parentChange;
  }
}
