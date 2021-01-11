import React from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorProps, EditorView } from 'prosemirror-view';
import classnames from 'classnames';
import 'prosemirror-view/style/prosemirror.css';
import { DOMSerializer, Slice } from 'prosemirror-model';
import { get } from 'lodash';

import './prosemirror-styles.scss';

interface ProseMirrorEditorViewState {
  editorState: EditorState;
}

function clipboardTextSerializer(slice: Slice): string {
  const content = slice.content;
  const text = [];
  let separated = true;
  const blockSeparator = ' ';
  content.nodesBetween(0, content.size, (node, pos) => {
    if (node.isText) {
      text.push(node.text);
      separated = !blockSeparator;
    } else if (node.isLeaf && node.type.spec.toClipboardText) {
      text.push(node.type.spec.toClipboardText(node));
      separated = !blockSeparator;
    } else if (!separated && node.isBlock) {
      text.push(blockSeparator);
      separated = true;
    }
    return true;
  });

  return text.join('');
}

export interface ProseMirrorEditorViewProps {
  className?: string;
  editorState: EditorState;
  options?: Partial<EditorProps>;
  onChange: (tx: Transaction) => void;
}

export class ProseMirrorEditorView extends React.Component<ProseMirrorEditorViewProps, ProseMirrorEditorViewState> {
  public props;
  public editorView: EditorView;

  focus(): void {
    this.editorView.focus();
  }

  blur(): void {
    (this.editorView.dom as HTMLDivElement).blur();
  }

  shouldComponentUpdate(nextProps): boolean {
    if (nextProps.editorState !== this.editorView.state) {
      this.editorView.updateState(nextProps.editorState);
    }
    return false;
  }

  componentWillUnmount(): void {
    if (this.editorView) {
      this.editorView.destroy();
    }
  }

  render(): React.ReactNode {
    // Render just an empty div which is then used as a container for an
    // EditorView instance.
    return <div ref={this.createEditorView} className={classnames('prosemirrorContainer', this.props.className)} />;
  }

  private createEditorView = (element: HTMLElement): void => {
    if (element) {
      const clipboardSerializer = DOMSerializer.fromSchema(this.props.editorState.schema);
      Object.entries(this.props.editorState.schema.nodes).forEach(([nodeName, nodeType]) => {
        clipboardSerializer.nodes[nodeName] = get(nodeType, 'spec.toClipboardDOM', clipboardSerializer.nodes[nodeName]);
      });

      const additionalOptions = this.props.options || {};
      this.editorView = new EditorView(element, {
        ...additionalOptions,
        clipboardSerializer,
        clipboardTextSerializer,
        state: this.props.editorState,
        dispatchTransaction: (tx: Transaction) => this.props.onChange(tx)
      });
    }
  };
}
