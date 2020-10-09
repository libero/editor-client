import React, { useCallback, useRef, useImperativeHandle, useState } from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

import { RichTextEditor } from 'app/components/rich-text-editor';
import { useBoxTextEditorStyles } from 'app/components/box-text/styles';

export interface BoxTextEditorHandle {
  updateContent(node: ProsemirrorNode): void;
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
  const [internalState, setInternalState] = useState<EditorState>(editorState);
  const classes = useBoxTextEditorStyles();
  const boxTextRef = useRef(null);

  useImperativeHandle(ref, () => ({
    updateContent: (node: ProsemirrorNode) => {
      // const { $head, $anchor } = boxTextRef.current.editorView.state.selection;
      // const selection = TextSelection.create(editorState.doc, $anchor.pos, $head.pos);
      // boxTextRef.current.updateEditorState(editorState.apply(editorState.tr.setSelection(selection)));
      const view = boxTextRef.current.editorView;
      const start = node.content.findDiffStart(view.state.doc.content);
      if (start !== null) {
        let { a: endA, b: endB } = node.content.findDiffEnd(view.state.doc.content);
        const overlap = start - Math.min(endA, endB);
        if (overlap > 0) {
          endA += overlap;
          endB += overlap;
        }
        boxTextRef.current.editorView.dispatch(
          view.state.tr.replace(start, endB, node.slice(start, endA)).setMeta('parentChange', true)
        );
      }
    },
    focus: () => {
      boxTextRef.current.focus();
    },
    hasFocus: () => boxTextRef.current.editorView.hasFocus()
  }));

  const handleContentChange = useCallback(
    (change: Transaction) => {
      setInternalState(boxTextRef.current.editorView.state);
      if (change.docChanged && !change.getMeta('parentChange')) {
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
          editorState={internalState}
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
