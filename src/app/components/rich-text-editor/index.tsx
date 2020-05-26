import React from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';

import { ProseMirrorEditorView } from './prosemirror-editor-view';
import { EditorView } from 'prosemirror-view';
import { SectionContainer } from '../section-container';

export interface RichTextEditorProps {
  editorState: EditorState;
  label?: string;
  onChange?: (change: Transaction) => void;
  onFocus?: (state: EditorState) => void;
  onBlur?: (state: EditorState) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  const { editorState, label, onChange, onFocus, onBlur } = props;

  const onEditorChange = (tx: Transaction) => {
    onChange(tx);
  };

  const handleFocusEvent = (view: EditorView): boolean => {
    if (onFocus) {
      onFocus(view.state);
    }
    return true;
  };

  const handleBlurEvent = (view: EditorView): boolean => {
    if (onBlur) {
      onBlur(view.state);
    }
    return true;
  };

  const options = {
    handleDOMEvents: {
      focus: handleFocusEvent,
      blur: handleBlurEvent
    }
  };

  return (
    <SectionContainer label={label}>
      {editorState ? (
        <ProseMirrorEditorView options={options} editorState={editorState} onChange={onEditorChange} />
      ) : null}
    </SectionContainer>
  );
};
