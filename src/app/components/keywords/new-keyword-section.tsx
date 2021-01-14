import { EditorState, Transaction } from 'prosemirror-state';
import React from 'react';
import { EditorView } from 'prosemirror-view';
import { ProseMirrorEditorView } from 'app/components/rich-text-editor/prosemirror-editor-view';

const ENTER_KEY_CODE = 'Enter';

interface NewKeywordSection {
  className?: string;
  editorState: EditorState;
  onEnter: (editorState: EditorState) => void;
  onChange: (change: Transaction) => void;
  onFocus: (state: EditorState) => void;
}

export const NewKeywordSection: React.FC<NewKeywordSection> = ({
  editorState,
  onEnter,
  onChange,
  className,
  onFocus
}) => {
  const options = {
    handleDOMEvents: {
      focus: (view: EditorView): boolean => {
        onFocus(view.state);
        return false;
      }
    },
    handleKeyDown: (view: EditorView, event: KeyboardEvent): boolean => {
      if (event.key === ENTER_KEY_CODE) {
        onEnter(view.state);
        return true;
      }
      return false;
    }
  };

  return (
    <ProseMirrorEditorView className={className} options={options} editorState={editorState} onChange={onChange} />
  );
};
