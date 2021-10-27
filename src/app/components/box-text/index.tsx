import React from 'react';
import { NodeView, EditorView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { NodeSelection } from 'prosemirror-state';

import { BoxTextEditor, BoxTextEditorHandle } from './box-text-editor';
import { theme } from '../../styles/theme';
import { NodeViewContext } from '../../utils/view.utils';

export class BoxTextNodeView implements NodeView {
  dom?: HTMLElement;
  boxTextEditor: React.RefObject<BoxTextEditorHandle>;

  constructor(private node: ProsemirrorNode, private view: EditorView, private getPos: () => number) {
    this.dom = document.createElement('section');
    this.boxTextEditor = React.createRef();
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <NodeViewContext.Provider
          value={{
            view: this.view,
            getPos: this.getPos,
            getNode: () => this.node
          }}
        >
          <BoxTextEditor ref={this.boxTextEditor} node={this.node} onDelete={this.handleDelete} />
        </NodeViewContext.Provider>
      </ThemeProvider>,
      this.dom
    );

    this.dom.addEventListener('drop', this.handleDrop, true);
  }

  handleDrop = (event: Event): void => {
    event.stopPropagation();
    event.preventDefault();
  };

  handleDelete = (): void => {
    const change = this.view.state.tr
      .setSelection(new NodeSelection(this.view.state.doc.resolve(this.getPos())))
      .deleteSelection();
    this.view.dispatch(change);
  };

  update(node: ProsemirrorNode): boolean {
    this.node = node;
    this.boxTextEditor.current.updateContent(node);
    return true;
  }

  stopEvent(evt): boolean {
    return this.dom.contains(evt.target) || /drag/.test(evt.type);
  }

  destroy(): void {
    this.dom.removeEventListener('drop', this.handleDrop, true);
  }

  ignoreMutation(): boolean {
    return true;
  }
}
