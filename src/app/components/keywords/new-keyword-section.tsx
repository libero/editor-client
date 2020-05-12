import { EditorState, Transaction } from 'prosemirror-state';
import React, { useCallback, useEffect, useState } from 'react';
import { EditorView } from 'prosemirror-view';
import { ProseMirrorEditorView } from '../rich-text-editor/prosemirror-editor-view';

const ENTER_KEY_CODE = 'Enter';

interface NewKeywordSection {
  className?: string;
  editorState: EditorState;
  onEnter: (editorState: EditorState) => void;
}

export const NewKeywordSection: React.FC<NewKeywordSection> = ({ editorState, onEnter, className }) => {
  const [internalState, setInternalState] = useState(editorState);

  useEffect(() => {
    setInternalState(editorState);
  }, [editorState, setInternalState]);

  const updateNewKeywordState = useCallback(
    (tr: Transaction) => {
      setInternalState(internalState.apply(tr));
    },
    [internalState]
  );

  const options = {
    handleKeyDown: (view: EditorView, event: KeyboardEvent): boolean => {
      if (event.key === ENTER_KEY_CODE) {
        onEnter(view.state);
        return true;
      }
      return false;
    }
  };

  return (
    <ProseMirrorEditorView
      className={className}
      options={options}
      editorState={internalState}
      onChange={updateNewKeywordState}
    />
  );
};
