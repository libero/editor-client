import { EditorState, Transaction } from 'prosemirror-state';
import React, { useCallback, useEffect, useState } from 'react';
import { EditorView } from 'prosemirror-view';
import { ProseMirrorEditorView } from '../rich-text-editor/prosemirror-editor-view';

const ENTER_KEY_CODE = 'Enter';

interface NewKeywordSection {
  editorState: EditorState;
  onEnter: (editorState: EditorState) => void;
}

export const NewKeywordSection: React.FC<NewKeywordSection> = ({ editorState, onEnter }) => {
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
    handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
      if (event.key === ENTER_KEY_CODE) {
        onEnter(view.state);
      }
    }
  };

  return <ProseMirrorEditorView options={options} editorState={internalState} onChange={updateNewKeywordState} />;
};
