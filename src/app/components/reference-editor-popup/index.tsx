import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';

export class ReferenceCitationNodeView implements NodeView {
  dom?: HTMLAnchorElement;

  constructor(private node: ProsemirrorNode, private view: EditorView) {
    this.dom = document.createElement('a');
    this.dom.style.cursor = 'pointer';
    this.dom.textContent = node.attrs.refText;
    this.dom.setAttribute('href', this.node.attrs.href);
  }
}
