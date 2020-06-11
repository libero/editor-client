import React, { useMemo } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import { isEqual } from 'lodash';

import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import { ProseMirrorEditorView } from './prosemirror-editor-view';
import { SectionContainer } from 'app/components/section-container';

export interface RichTextEditorProps {
  editorState: EditorState;
  label?: string;
  name?: string;
  onChange?: (change: Transaction, name: string) => void;
  onFocus?: (state: EditorState, name: string) => void;
  onBlur?: (state: EditorState, name: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo((props) => {
  const { editorState, label, onChange, onFocus, onBlur, name } = props;

  const options = useMemo(
    () => ({
      handleDOMEvents: {
        focus: ({ state }: EditorView) => {
          onFocus && onFocus(state, name);
          return true;
        },
        blur: ({ state }: EditorView) => {
          onBlur && onBlur(state, name);
          return true;
        }
      }
    }),
    [onFocus, onBlur, name]
  );

  return (
    <SectionContainer label={label}>
      {editorState ? <ProseMirrorEditorView options={options} editorState={editorState} onChange={onChange} /> : null}
    </SectionContainer>
  );
}, isEqual);
