import React, { useCallback, useRef, useImperativeHandle, useState } from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton, TextField } from '@material-ui/core';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { get } from 'lodash';

import { RichTextEditor } from 'app/components/rich-text-editor';
import { useFigureEditorStyles } from 'app/components/figure/styles';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { SelectPlugin } from 'app/models/plugins/selection.plugin';
import { PlaceholderPlugin } from 'app/models/plugins/placeholder.plugin';
import { findChildrenByType } from 'app/utils/view.utils';

export interface FigureEditorHandle {
  updateContent(node: ProsemirrorNode): void;
  focus(): void;
  hasFocus(): boolean;
}

interface FigureEditorProps {
  figureNode: ProsemirrorNode;
  onDelete(): void;
  onNodeChange(change: Transaction): void;
  onSelectionChange(from: number, anchor: number): void;
}

export const FigureEditor = React.forwardRef((props: FigureEditorProps, ref) => {
  const { figureNode, onNodeChange, onSelectionChange, onDelete } = props;
  const [isTitleEditorActive, setTitleEditorActive] = useState<boolean>(false);
  const [isLegendEditorActive, setLegendEditorActive] = useState<boolean>(false);
  const [internalTitleState, setInternalTitleState] = useState<EditorState>(createFigureTitleState(figureNode));
  const [internalLegendState, setInternalLegendState] = useState<EditorState>(createFigureLegendState(figureNode));
  const classes = useFigureEditorStyles();
  const titleEditorRef = useRef(null);
  const legendEditorRef = useRef(null);

  useImperativeHandle(ref, () => ({
    updateContent: (updatedFigureNode: ProsemirrorNode) => {
      const state = titleEditorRef.current.editorView.state;
      const updatedTitleNode = findChildrenByType(
        updatedFigureNode,
        updatedFigureNode.type.schema.nodes.figureTitle
      )[0];

      titleEditorRef.current.updateEditorState(getUpdatedStateForNode(updatedTitleNode, state));
    },
    focus: () => {
      titleEditorRef.current.focus();
    },
    hasFocus: () => titleEditorRef.current.editorView.hasFocus()
  }));

  const handleTitleChange = useCallback(
    (change: Transaction) => {
      setInternalTitleState(titleEditorRef.current.editorView.state);
      if (change.docChanged && !change.getMeta('parentChange')) {
        onNodeChange(change);
      } else {
        onSelectionChange(change.selection.$from.pos, change.selection.$to.pos);
      }
    },
    [onNodeChange, onSelectionChange]
  );

  const handleLegendChange = useCallback(
    (change: Transaction) => {
      setInternalLegendState(legendEditorRef.current.editorView.state);
      if (change.docChanged && !change.getMeta('parentChange')) {
        onNodeChange(change);
      } else {
        onSelectionChange(change.selection.$from.pos, change.selection.$to.pos);
      }
    },
    [onNodeChange, onSelectionChange]
  );

  const handleTitleFocus = useCallback(() => {
    setTitleEditorActive(true);
  }, [setTitleEditorActive]);

  const handleTitleBlur = useCallback(() => {
    setTitleEditorActive(false);
  }, [setTitleEditorActive]);

  const handleLegendFocus = useCallback(() => {
    setLegendEditorActive(true);
  }, [setTitleEditorActive]);

  const handleLegendBlur = useCallback(() => {
    setLegendEditorActive(false);
  }, [setTitleEditorActive]);

  return (
    <div className={classes.figureContainer}>
      <div className={classes.figureContent}>
        <TextField
          fullWidth
          name="href"
          label="Article DOI"
          classes={{ root: classes.inputField }}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          multiline
          value={figureNode.attrs.label}
        />
        <RichTextEditor
          ref={titleEditorRef}
          isActive={isTitleEditorActive}
          variant="outlined"
          label="Title"
          editorState={internalTitleState}
          onChange={handleTitleChange}
          onFocus={handleTitleFocus}
          onBlur={handleTitleBlur}
        ></RichTextEditor>
        <RichTextEditor
          ref={legendEditorRef}
          isActive={isLegendEditorActive}
          variant="outlined"
          label="Legend"
          editorState={internalLegendState}
          onChange={handleLegendChange}
          onFocus={handleLegendFocus}
          onBlur={handleLegendBlur}
        ></RichTextEditor>
      </div>
      <IconButton classes={{ root: classes.deleteButton }} onClick={onDelete}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
});

function createFigureTitleState(node: ProsemirrorNode): EditorState {
  const titleNode = findChildrenByType(node, node.type.schema.nodes.figureTitle)[0];
  return EditorState.create({
    doc: titleNode,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap), SelectPlugin, PlaceholderPlugin('')]
  });
}

function createFigureLegendState(node: ProsemirrorNode): EditorState {
  const legendNode = findChildrenByType(node, node.type.schema.nodes.figureLegend)[0];
  return EditorState.create({
    doc: legendNode,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap), SelectPlugin, PlaceholderPlugin('')]
  });
}

function getUpdatedStateForNode(updatedNode: ProsemirrorNode, state: EditorState): EditorState {
  const start = updatedNode.content.findDiffStart(state.doc.content);
  if (start !== null) {
    let { a: endA, b: endB } = updatedNode.content.findDiffEnd(get(state, 'doc.content'));
    const overlap = start - Math.min(endA, endB);
    if (overlap > 0) {
      endA += overlap;
      endB += overlap;
    }

    const change = state.tr.replace(start, endB, updatedNode.slice(start, endA)).setMeta('parentChange', true);
    return state.apply(change);
  }

  return state;
}
