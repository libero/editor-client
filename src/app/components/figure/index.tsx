import React from 'react';
import { NodeView, EditorView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { NodeSelection } from 'prosemirror-state';

import { theme } from 'app/styles/theme';
import { FigureEditor, FigureEditorHandle } from 'app/components/figure/figure-editor';
import { NodeViewContext } from 'app/utils/view.utils';
import { AutoScroller } from 'app/utils/autoscroller';

export class FigureNodeView implements NodeView {
  dom?: HTMLElement;
  figureEditor: React.RefObject<FigureEditorHandle>;
  scroller = AutoScroller.getInstance();

  constructor(private node: ProsemirrorNode, private view: EditorView, private getPos: () => number) {
    this.dom = document.createElement('section');
    this.dom.style.outline = 'none';
    this.figureEditor = React.createRef();

    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <NodeViewContext.Provider
          value={{
            view: this.view,
            getPos: this.getPos,
            getNode: () => this.node
          }}
        >
          <FigureEditor
            getParentNodePos={this.getPos}
            parentView={this.view}
            ref={this.figureEditor}
            node={this.node}
            onDelete={this.handleDelete}
            onAttributesChange={this.handleAttributesChange}
          />
        </NodeViewContext.Provider>
      </ThemeProvider>,
      this.dom
    );

    this.dom.addEventListener('drag', this.handleDrag);
    this.dom.addEventListener('dragend', this.handleDragEnd);
  }

  handleAttributesChange = (label: string, img: string) => {
    const change = this.view.state.tr.setNodeMarkup(this.getPos(), null, { id: this.node.attrs.id, label, img });
    this.view.dispatch(change);
  };

  destroy() {
    this.dom.removeEventListener('drag', this.handleDrag);
    this.dom.removeEventListener('dragend', this.handleDragEnd);
  }

  handleDelete = () => {
    const resolvedPosition = this.view.state.doc.resolve(this.getPos());
    const change = this.view.state.tr.setSelection(new NodeSelection(resolvedPosition)).deleteSelection();
    let documentReducedBy = 0;
    change.doc.descendants((node: ProsemirrorNode, pos: number) => {
      if (node.type.name === 'figureCitation' && node.attrs.figIds.includes(this.node.attrs.id)) {
        if (node.attrs.figIds.length > 1) {
          const updatedAttrs = { figIds: node.attrs['figIds'].filter((figId) => figId !== this.node.attrs.id) };
          change.setNodeMarkup(pos - documentReducedBy, null, updatedAttrs);
        } else {
          change.replace(pos - documentReducedBy, pos - documentReducedBy + node.nodeSize);
          documentReducedBy += node.nodeSize;
        }
      }
      return Boolean(node.childCount);
    });
    this.view.dispatch(change);
  };

  update(node: ProsemirrorNode) {
    this.node = node;
    this.figureEditor.current.updateContent(node);
    return true;
  }

  stopEvent(event) {
    return !event.target.classList.contains('drag-handle'); // !/drag/.test(event.type);
  }

  ignoreMutation() {
    return true;
  }

  private handleDrag = (event) => {
    this.scroller.updateScroll(event, this.view.dom);
  };

  private handleDragEnd = () => {
    this.scroller.clear();
  };
}
