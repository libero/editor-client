import React, { useCallback, useState, useMemo } from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { SectionContainer } from 'app/components/section-container';
import { ProseMirrorEditorView } from 'app/components/rich-text-editor/prosemirror-editor-view';

interface RichTextInputProps {
  editorState: EditorState;
  label: string;
  onChange(editorState: EditorState): void;
}

export const RichTextInput: React.FC<RichTextInputProps> = ({ label, onChange, editorState }) => {
  const [isFocused, setFocused] = useState(false);
  const handleOnChange = useCallback(
    (tr: Transaction) => {
      onChange(editorState.apply(tr));
    },
    [editorState, onChange]
  );

  const onFocus = useCallback(() => setFocused(true), [setFocused]);
  const onBlur = useCallback(() => setFocused(false), [setFocused]);

  const options = useMemo(
    () => ({
      handleDOMEvents: {
        focus: onFocus,
        blur: onBlur
      }
    }),
    [onFocus, onBlur]
  );
  return (
    <SectionContainer label={label}>
      {editorState ? (
        <ProseMirrorEditorView options={options} editorState={editorState} onChange={handleOnChange} />
      ) : null}
    </SectionContainer>
  );
};
