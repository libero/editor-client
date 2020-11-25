import React, { useImperativeHandle, useState } from 'react';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';

import { RichTextEditor } from 'app/components/rich-text-editor';
import { useBoxTextEditorStyles } from 'app/components/box-text/styles';
import { NodeEditor } from 'app/components/node-editor/node-editor';

const BOX_CONTENT_OFFSET_CORRECTION = 1;

export interface BoxTextEditorHandle {
  updateContent(node: ProsemirrorNode): void;
}

interface BoxTextEditorProps {
  node: ProsemirrorNode;
  onDelete(): void;
}

export const BoxTextEditor = React.forwardRef((props: BoxTextEditorProps, ref) => {
  const { onDelete } = props;
  const [boxNode, setBoxNode] = useState<ProsemirrorNode>(props.node);
  const classes = useBoxTextEditorStyles();

  useImperativeHandle(ref, () => ({
    updateContent: (node: ProsemirrorNode) => {
      setBoxNode(node);
    }
  }));

  return (
    <div className={classes.boxContainer}>
      <div className={classes.boxText}>
        <BoxTextNodeEditor node={boxNode} offset={BOX_CONTENT_OFFSET_CORRECTION}></BoxTextNodeEditor>
      </div>
      <IconButton classes={{ root: classes.editButton }} onClick={onDelete}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
});

class BoxTextNodeEditor extends NodeEditor<{}> {
  render() {
    return (
      <RichTextEditor
        ref={this.editorRef}
        isActive={this.getEditorActiveState()}
        variant="outlined"
        label="Box text"
        editorState={this.state.editorState}
        onChange={this.handleInternalEditorStateChange}
        onFocus={this.handleEditorFocus}
        onBlur={this.handleEditorBlur}
      ></RichTextEditor>
    );
  }
}
