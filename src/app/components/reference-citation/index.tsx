import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';

import { TextSelection } from 'prosemirror-state';

import { theme } from 'app/styles/theme';
import { getRefNodeText, Reference } from 'app/models/reference';
import { store } from 'app/store';
import { ReferenceCitationEditorPopup } from 'app/components/reference-citation/reference-citation-editor-popup';

export class ReferenceCitationNodeView implements NodeView {
  dom?: HTMLAnchorElement;
  refEditorContainer: HTMLDivElement;

  constructor(private node: ProsemirrorNode, private view: EditorView, private getPos) {
    this.dom = document.createElement('a');
    this.dom.style.cursor = 'pointer';
    this.dom.textContent = this.node.attrs.refText || '???';
    this.dom.addEventListener('click', this.selectNode);
    if (this.node.attrs.refId === null) {
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

  open(): void {
    this.refEditorContainer = this.view.dom.parentNode.appendChild(document.createElement('div'));
    this.refEditorContainer.style.position = 'absolute';
    this.refEditorContainer.style.zIndex = '10';

    ReactDOM.render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ReferenceCitationEditorPopup
            anchorEl={this.dom}
            editorView={this.view}
            node={this.node}
            onClose={this.close}
            onChange={this.handleChange}
          />
        </ThemeProvider>
      </Provider>,
      this.refEditorContainer
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
    if (this.refEditorContainer) {
      ReactDOM.unmountComponentAtNode(this.refEditorContainer);
      this.refEditorContainer.parentNode.removeChild(this.refEditorContainer);
      this.refEditorContainer = null;
    }
  };

  handleChange = (ref: Reference): void => {
    const attrs = ref
      ? { refId: ref.id || uuidv4(), refText: getRefNodeText(ref) }
      : { refId: undefined, refText: undefined };

    const schema = this.view.state.schema;
    const change = this.view.state.tr.replaceWith(
      this.getPos(),
      this.getPos() + this.node.nodeSize,
      schema.nodes['refCitation'].create(attrs)
    );
    // due to browser managing cursor position on focus and blur the cursor is sometimes reset to 0
    // to rectify this behaviour we move cursor back to before the citation
    change.setSelection(new TextSelection(change.doc.resolve(this.getPos())));
    this.view.dispatch(change);
    this.close();
  };
}
