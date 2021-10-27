import React from 'react';
import ReactDOM from 'react-dom';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { ThemeProvider } from '@material-ui/core/styles';

import { theme } from '../../styles/theme';
import { FigureCitationEditorPopup, FiguresListEntry, UNLABELLED_FIGURE_TEXT } from './figure-citation-editor-popup';
import { TextSelection } from 'prosemirror-state';
import { store } from '../../store';
import { Provider } from 'react-redux';

export class FigureCitationNodeView implements NodeView {
  dom?: HTMLAnchorElement;
  contentDOM?: HTMLSpanElement;
  figureEditorContainer: HTMLDivElement;

  constructor(private node: ProsemirrorNode, private view: EditorView, private getPos: () => number) {
    this.dom = document.createElement('a');
    this.dom.style.cursor = 'pointer';
    this.dom.addEventListener('click', this.selectNode);
    this.contentDOM = document.createElement('span');
    this.dom.appendChild(this.contentDOM);
    if (this.node.attrs.figIds === null) {
      this.open();
    }
  }

  selectNode = (): void => {
    this.dom.classList.add('ProseMirror-selectednode');
    this.open();
  };

  deselectNode(): void {
    this.dom.classList.remove('ProseMirror-selectednode');
    this.close();
  }

  update(node: ProsemirrorNode): boolean {
    this.node = node;
    return true;
  }

  open(): void {
    this.figureEditorContainer = this.view.dom.parentNode.appendChild(document.createElement('div'));

    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <FigureCitationEditorPopup
            selectedIds={this.node.attrs.figIds || []}
            anchorEl={this.dom}
            onClose={this.close}
            onChange={this.handleChange}
          />
        </ThemeProvider>
      </Provider>,
      this.figureEditorContainer
    );
  }

  stopEvent(): boolean {
    return true;
  }

  ignoreMutation(): boolean {
    return true;
  }

  close = (): void => {
    this.dom.classList.remove('ProseMirror-selectednode');
    if (this.figureEditorContainer) {
      ReactDOM.unmountComponentAtNode(this.figureEditorContainer);
      this.figureEditorContainer.parentNode.removeChild(this.figureEditorContainer);
      this.figureEditorContainer = null;
    }
  };

  handleChange = (figures: FiguresListEntry[]): void => {
    const ids = figures.map(({ id }) => id);
    const change = this.view.state.tr.setNodeMarkup(this.getPos(), null, { figIds: ids });

    if (this.node.textContent === '???' && figures.length > 0) {
      const nodeContent = (figures[0].name || UNLABELLED_FIGURE_TEXT).replace(/\.$/, '');
      change
        .setSelection(TextSelection.create(change.doc, this.getPos() + 1, this.getPos() + this.node.nodeSize - 1))
        .replaceSelectionWith(this.view.state.schema.text(nodeContent));
    } else if (figures.length === 0) {
      change
        .setSelection(TextSelection.create(change.doc, this.getPos() + 1, this.getPos() + this.node.nodeSize - 1))
        .replaceSelectionWith(this.view.state.schema.text('???'));
    }

    this.view.dispatch(change);
  };
}
