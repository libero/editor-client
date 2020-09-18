import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import { isEqual, debounce } from 'lodash';

import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import { ProseMirrorEditorView } from './prosemirror-editor-view';
import { SectionContainer } from 'app/components/section-container';
import { ReferenceCitationNodeView } from 'app/components/reference-citation-editor-popup';

export interface RichTextEditorProps {
  editorState: EditorState;
  label?: string;
  id?: string;
  name?: string;
  isActive: boolean;
  onChange?: (change: Transaction, name: string) => void;
  onFocusSwitch?: (state: EditorState, name: string) => void;
}

const restoreSelection = debounce((editorView, from, to) => {
  if (editorView.state.selection) {
    const $from = editorView.state.doc.resolve(from);
    const $to = editorView.state.doc.resolve(to);
    const change = editorView.state.tr.setSelection(new TextSelection($from, $to));
    editorView.dispatch(change);
  }
}, 50);

export const RichTextEditor: React.FC<RichTextEditorProps> = React.memo((props) => {
  const { editorState, label, onChange, onFocusSwitch, name, isActive, id } = props;
  const prosemirrorRef = useRef<ProseMirrorEditorView>();

  useEffect(() => {
    if (isActive && prosemirrorRef.current && !prosemirrorRef.current.editorView.hasFocus()) {
      const { from, to } = editorState.selection;
      restoreSelection(prosemirrorRef.current.editorView, from, to);
      prosemirrorRef.current.focus();
      // position needs to be reset after focus when selection is not empty
    }
  }, [isActive, prosemirrorRef, editorState]);

  const options = useMemo(
    () => ({
      nodeViews: {
        refCitation(node, view, getPos) {
          return new ReferenceCitationNodeView(node, view, getPos);
        }
      },
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
    <SectionContainer label={label} focused={isActive} id={id}>
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
