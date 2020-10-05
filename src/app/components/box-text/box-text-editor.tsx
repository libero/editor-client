import React, { useCallback, useRef, useImperativeHandle } from 'react';
import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

import { RichTextEditor } from 'app/components/rich-text-editor';
import { useBoxTextEditorStyles } from 'app/components/box-text/styles';

export interface BoxTextEditorHandle {
  updateContent(editorState: EditorState): void;
  focus(): void;
}

interface BoxTextEditorProps {
  editorState: EditorState;
  onDelete(): void;
  onNodeChange(change: Transaction): void;
  onSelectionChange(from: number, anchor: number): void;
}

export const BoxTextEditor = React.forwardRef((props: BoxTextEditorProps, ref) => {
  const { editorState, onNodeChange, onSelectionChange, onDelete } = props;
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
    }
  }));

  const handleContentChange = useCallback(
    (change: Transaction) => {
      if (change.docChanged) {
        onNodeChange(change);
      } else {
        onSelectionChange(change.selection.$anchor.pos, change.selection.$head.pos);
      }
    },
    [onNodeChange, onSelectionChange]
  );

  return (
    <div className={classes.boxContainer}>
      <div className="box-text">
        <RichTextEditor
          ref={boxTextRef}
          isActive={false}
          variant="outlined"
          label="Box text"
          editorState={editorState}
          onChange={handleContentChange}
        ></RichTextEditor>
      </div>
      <IconButton classes={{ root: classes.editButton }} onClick={onDelete}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
});
