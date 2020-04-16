import React from "react";
import {EditorState, Transaction} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';

import 'prosemirror-view/style/prosemirror.css';
import './prosemirror.scss';

export interface ProseMirrorEditorViewProps {
  editorState: EditorState;
  onChange: (tx: Transaction) => void;
}

export class ProseMirrorEditorView extends React.Component<ProseMirrorEditorViewProps, {}> {
  public props;

  private editorView: EditorView;

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
      this.editorView = new EditorView(element, {
        state: this.props.editorState,
        dispatchTransaction: this.dispatchTransaction,
      });
    }
  };

}

