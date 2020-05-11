import React from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { ProseMirrorEditorView } from './prosemirror-editor-view';
import classNames from 'classnames';

import './styles.scss';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import { EditorView } from 'prosemirror-view';

export interface RichTextEditorProps {
  className?: string;
  editorState: EditorState;
  label?: string;
  onChange?: (change: Transaction) => void;
  onFocus?: (state: EditorState) => void;
  onBlur?: (state: EditorState) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const { editorState, label, onChange, onFocus, onBlur, className } = props;

  const onEditorChange = (tx: Transaction) => {
    onChange(tx);
  };

  const handleFocusEvent = (view: EditorView): void => {
    if (onFocus) {
      onFocus(view.state);
    }
  };

  const handleBlurEvent = (view: EditorView): void => {
    if (onBlur) {
      onBlur(view.state);
    }
  };

  const options = {
    handleDOMEvents: {
      focus: handleFocusEvent,
      blur: handleBlurEvent
    }
  };

  return (
    <fieldset className={classNames('editorview-wrapper', className)}>
      {label ? <legend className="editor-label">{label}</legend> : undefined}
      {editorState ? (
        <ProseMirrorEditorView options={options} editorState={editorState} onChange={onEditorChange} />
      ) : null}
    </fieldset>
  );
};
