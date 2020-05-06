import React from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorProps, EditorView } from 'prosemirror-view';

import 'prosemirror-view/style/prosemirror.css';
import './prosemirror.scss';

export interface ProseMirrorEditorViewProps {
  editorState: EditorState;
  options?: Partial<EditorProps>;
  onChange: (tx: Transaction) => void;
}

export class ProseMirrorEditorView extends React.Component<ProseMirrorEditorViewProps, {}> {
  public props;

  private editorView: EditorView;

  focus() {
    this.editorView.focus();
  }

  blur() {
    (this.editorView.dom as HTMLDivElement).blur();
  }

  dispatchTransaction = (tx: Transaction) => {
    // In case EditorView makes any modification to a state we funnel those
    // modifications up to the parent and apply to the EditorView itself.
    this.props.onChange(tx);
  };

  componentWillReceiveProps(nextProps: ProseMirrorEditorViewProps) {
    // In case we receive new EditorState through props — we apply it to the
    // EditorView instance.
    if (this.editorView) {
      if (nextProps.editorState !== this.editorView.state) {
        this.editorView.updateState(nextProps.editorState);
      }
    }
  }

  componentWillUnmount() {
    if (this.editorView) {
      this.editorView.destroy();
    }
  }

  shouldComponentUpdate() {
    // Note that EditorView manages its DOM itself so we'd rather don't mess
    // with it.
    return false;
  }

  render() {
    // Render just an empty div which is then used as a container for an
    // EditorView instance.
    return <div ref={this.createEditorView} />;
  }

  private createEditorView = (element: HTMLElement) => {
    if (element) {
      const additionalOptions = this.props.options || {};
      this.editorView = new EditorView(element, {
        ...additionalOptions,
        state: this.props.editorState,
        dispatchTransaction: this.dispatchTransaction
      });

      this.editorView.dom.setAttribute('tabIndex', '0');
    }
  };
}
