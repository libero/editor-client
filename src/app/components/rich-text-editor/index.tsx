import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import { isEqual, debounce } from 'lodash';

import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import { ProseMirrorEditorView } from './prosemirror-editor-view';
import { SectionContainer } from 'app/components/section-container';

export interface RichTextEditorProps {
  editorState: EditorState;
  label?: string;
  name?: string;
  isActive: boolean;
  onChange?: (change: Transaction, name: string) => void;
  onFocusSwitch?: (state: EditorState, name: string) => void;
}

const restoreSelection = debounce((editorView, from, to) => {
  const $from = editorView.state.editorView.state.selection.resolve(from);
  const $to = editorView.state.editorView.state.selection.resolve(to);
  const change = editorView.state.editorView.setSelection(new TextSelection($from, $to));
  editorView.dispatch(change);
}, 50);

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo((props) => {
  const { editorState, label, onChange, onFocusSwitch, name, isActive } = props;
  const prosemirrorRef = useRef<ProseMirrorEditorView>();

  useEffect(() => {
    if (isActive && prosemirrorRef.current && !prosemirrorRef.current.editorView.hasFocus()) {
      const { from, to } = editorState.selection;
      restoreSelection(prosemirrorRef.current.editorView, from, to);
      prosemirrorRef.current.focus();
      // position needs to be reset after focus when selection is not empty
    }
  }, [isActive, prosemirrorRef]);

  const options = useMemo(
    () => ({
      handleDOMEvents: {
        focus: ({ state }: EditorView) => {
          if (onFocusSwitch && !isActive) {
            onFocusSwitch(state, name);
          }
          return true;
        }
      }
    }),
    [onFocusSwitch, name, isActive]
  );

  const handleChange = useCallback((tr) => onChange(tr, name), [name, onChange]);

  return (
    <SectionContainer label={label} focused={isActive}>
      {editorState ? (
        <ProseMirrorEditorView
          ref={prosemirrorRef}
          options={options}
          editorState={editorState}
          onChange={handleChange}
        />
      ) : null}
    </SectionContainer>
  );
}, isEqual);
