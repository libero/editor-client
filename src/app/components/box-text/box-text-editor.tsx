import React, { useCallback, useRef, useImperativeHandle, useState } from 'react';
import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

import { RichTextEditor } from 'app/components/rich-text-editor';
import { useBoxTextEditorStyles } from 'app/components/box-text/styles';

export interface BoxTextEditorHandle {
  updateContent(editorState: EditorState): void;
  focus(): void;
  hasFocus(): boolean;
}

interface BoxTextEditorProps {
  editorState: EditorState;
  onDelete(): void;
  onNodeChange(change: Transaction): void;
  onSelectionChange(from: number, anchor: number): void;
}

export const BoxTextEditor = React.forwardRef((props: BoxTextEditorProps, ref) => {
  const { editorState, onNodeChange, onSelectionChange, onDelete } = props;
  const [isEditorActive, setEditorActive] = useState<boolean>(false);
  const classes = useBoxTextEditorStyles();
  const boxTextRef = useRef(null);

  useImperativeHandle(ref, () => ({
    updateContent: (editorState: EditorState) => {
      const { $head, $anchor } = boxTextRef.current.editorView.state.selection;
      const selection = TextSelection.create(editorState.doc, $anchor.pos, $head.pos);
      boxTextRef.current.updateEditorState(editorState.apply(editorState.tr.setSelection(selection)));
    },
    focus: () => {
      boxTextRef.current.focus();
    },
    hasFocus: () => boxTextRef.current.editorView.hasFocus()
  }));

  const handleContentChange = useCallback(
    (change: Transaction) => {
      if (change.docChanged) {
        onNodeChange(change);
      } else {
        onSelectionChange(change.selection.$from.pos, change.selection.$to.pos);
      }
    },
    [onNodeChange, onSelectionChange]
  );

  const handleFocus = useCallback(() => {
    setEditorActive(true);
  }, [setEditorActive]);

  const handleBlur = useCallback(() => {
    setEditorActive(false);
  }, [setEditorActive]);

  return (
    <div className={classes.boxContainer}>
      <div className={classes.boxText}>
        <RichTextEditor
          ref={boxTextRef}
          isActive={isEditorActive}
          variant="outlined"
          label="Box text"
          editorState={editorState}
          onChange={handleContentChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        ></RichTextEditor>
      </div>
      <IconButton classes={{ root: classes.editButton }} onClick={onDelete}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
});
