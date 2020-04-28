import React from "react";
import {EditorState, Transaction} from "prosemirror-state";
import {ProseMirrorEditorView} from "./prosemirror-editor-view";

import './styles.scss';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';

export interface RichTextEditorProps {
  editorState: EditorState;
  label?: string;
  onChange: (state: Transaction) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({editorState, onChange, label}) => {
  const onEditorChange = (tx: Transaction) => {
    onChange(tx);
  };

  return <div className='editorview-wrapper'>
    {label ? <div className="editor-label">{label}</div> : undefined}
    {editorState ? (<ProseMirrorEditorView
      editorState={editorState}
      onChange={onEditorChange}
    />) : null}
    </div>;
}
