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
  onFocus: () => void;
  onBlur: () => void;
}

export const NewKeywordSection: React.FC<NewKeywordSection> = ({
  editorState,
  onEnter,
  onChange,
  className,
  onFocus,
  onBlur
}) => {
  const options = {
    handleDOMEvents: {
      focus: () => {
        onFocus();
        return false;
      },
      blur: () => {
        onBlur();
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
