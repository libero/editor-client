import React from 'react';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import { ThemeProvider } from '@material-ui/core/styles';
import { TextSelection } from 'prosemirror-state';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode, ResolvedPos } from 'prosemirror-model';

import { theme } from 'app/styles/theme';
import { LinkEditorPopup } from 'app/components/link-editor-popup/link-editor-popup';

export class LinkNodeView implements NodeView {
  dom?: HTMLAnchorElement;
  linkEditorContainer: HTMLDivElement;
  linkEditorView: HTMLElement;

  constructor(private node: ProsemirrorNode, private view: EditorView) {
    this.dom = document.createElement('a');
    this.dom.style.cursor = 'pointer';
    this.dom.setAttribute('href', this.node.attrs.href);
    this.dom.addEventListener('contextmenu', this.openLinkInNewWindow.bind(this));
    this.dom.addEventListener(
      'click',
      debounce((event: MouseEvent) => {
        if (event.ctrlKey) {
          this.openLinkInNewWindow(event);
        } else {
          this.open();
        }
      }, 100)
    );
    if (this.node.attrs.href === undefined) {
      this.dom.dispatchEvent(new Event('click'));
    }
  }

  openLinkInNewWindow(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const newWindow = window.open();
    newWindow.opener = null;
    newWindow.location = this.node.attrs.href;
  }

  open(): void {
    this.linkEditorContainer = this.view.dom.parentNode.appendChild(document.createElement('div'));

    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <LinkEditorPopup
          editorView={this.view}
          anchorEl={this.dom}
          node={this.node}
          onClose={this.close.bind(this)}
          onApply={this.handleApply.bind(this)}
        />
      </ThemeProvider>,
      this.linkEditorContainer
    );
    this.dom.classList.add('ProseMirror-selectednode');
  }

  removeMark(): void {
    const markType = this.view.state.schema.marks.link;
    const { from, $from, $to, to } = this.view.state.selection;
    const linkStart = from - $from.nodeBefore.nodeSize;
    const linkEnd = to + $to.nodeAfter.nodeSize;
    const transaction = this.view.state.tr;
    transaction.removeMark(linkStart, linkEnd, markType);
    this.view.dispatch(transaction);
  }

  updateMark(href: string): void {
    const markType = this.view.state.schema.marks.link;
    const { $from } = this.view.state.selection as TextSelection;
    const { from: linkStart, to: linkEnd } = this.getMarkExtent($from);

    const transaction = this.view.state.tr;
    transaction.removeMark(linkStart, linkEnd, markType);
    transaction.addMark(linkStart, linkEnd, markType.create({ href }));
    this.view.dispatch(transaction);
  }

  close(): void {
    this.dom.classList.remove('ProseMirror-selectednode');
    ReactDOM.unmountComponentAtNode(this.linkEditorContainer);
    this.linkEditorContainer.parentNode.removeChild(this.linkEditorContainer);
  }

  stopEvent(event): boolean {
    return this.dom.contains(event.target);
  }

  handleApply(href: string): void {
    this.close();
    if (href) {
      this.updateMark(href);
    } else {
      this.removeMark();
    }
  }

  destroy(): void {
    if (this.linkEditorView) {
      this.close();
    }
  }

  private getMarkExtent($start: ResolvedPos): { from: number; to: number } {
    const markType = this.view.state.schema.marks.link;
    let startIndex = $start.index();
    let endIndex = $start.indexAfter();
    while (startIndex > 0 && markType.isInSet($start.parent.child(startIndex - 1).marks)) {
      startIndex--;
    }
    while (endIndex < $start.parent.childCount && markType.isInSet($start.parent.child(endIndex).marks)) endIndex++;
    let startPos = $start.start();
    let endPos = startPos;
    for (let i = 0; i < endIndex; i++) {
      const size = $start.parent.child(i).nodeSize;
      if (i < startIndex) startPos += size;
      endPos += size;
    }
    return { from: startPos, to: endPos };
  }
}
