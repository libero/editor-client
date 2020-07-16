import React from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorProps, EditorView } from 'prosemirror-view';
import classnames from 'classnames';
import 'prosemirror-view/style/prosemirror.css';

import './prosemirror-styles.scss';

interface ProseMirrorEditorViewState {
  editorState: EditorState;
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

  focus() {
    // debugger;
    this.editorView.focus();
  }

  blur() {
    (this.editorView.dom as HTMLDivElement).blur();
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.editorState !== this.editorView.state) {
      this.editorView.updateState(nextProps.editorState);
    }
    return false;
  }

  componentWillUnmount() {
    if (this.editorView) {
      this.editorView.destroy();
    }
  }

  render() {
    // Render just an empty div which is then used as a container for an
    // EditorView instance.
    return <div ref={this.createEditorView} className={classnames('prosemirrorContainer', this.props.className)} />;
  }

  private createEditorView = (element: HTMLElement) => {
    if (element) {
      const additionalOptions = this.props.options || {};
      this.editorView = new EditorView(element, {
        ...additionalOptions,
        state: this.props.editorState,
        dispatchTransaction: (tx: Transaction) => this.props.onChange(tx)
      });
    }
  };
}
