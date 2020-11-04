import React from 'react';
import { NodeView, EditorView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { NodeSelection } from 'prosemirror-state';

import { theme } from 'app/styles/theme';
import { FigureEditor, FigureEditorHandle } from 'app/components/figure/figure-editor';
import { NodeViewContext } from 'app/utils/view.utils';

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
  }

  handleAttributesChange = (label: string, img: string) => {
    const change = this.view.state.tr.setNodeMarkup(this.getPos(), null, { id: this.node.attrs.id, label, img });
    this.view.dispatch(change);
  };

  handleDelete = () => {
    const resolvedPosition = this.view.state.doc.resolve(this.getPos());
    const change = this.view.state.tr.setSelection(new NodeSelection(resolvedPosition)).deleteSelection();
    this.view.dispatch(change);
  };

  update(node: ProsemirrorNode) {
    this.node = node;
    this.figureEditor.current.updateContent(node);
    return true;
  }

  stopEvent(evt) {
    return this.dom.contains(evt.target);
  }

  ignoreMutation() {
    return true;
  }
}
