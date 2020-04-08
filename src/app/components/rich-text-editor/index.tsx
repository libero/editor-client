import React from "react";
import {EditorState, Transaction} from "prosemirror-state";
import {ProseMirrorEditorView} from "./prosemirror-editor-view";

import './styles.scss';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';

export interface RichTextEditorProps {
  editorState: EditorState;
  onChange: (state: Transaction) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({editorState, onChange}) => {
  const onEditorChange = (tx: Transaction) => {
    onChange(tx);
  };

  return <div className='editorview-wrapper'>
    {editorState ? (<ProseMirrorEditorView
      editorState={editorState}
      onChange={onEditorChange}
    />) : null}
    </div>;
}
