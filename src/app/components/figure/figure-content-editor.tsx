import React from 'react';
import { NodeEditor } from 'app/components/node-editor/node-editor';
import { RichTextEditor } from 'app/components/rich-text-editor';

interface FigureContentEditorProps {
  label: string;
}

export class FigureContentEditor extends NodeEditor<FigureContentEditorProps> {
  render() {
    return (
      <div>
        <RichTextEditor
          isActive={this.getEditorActiveState()}
          variant="outlined"
          label={this.props.label}
          editorState={this.state.editorState}
          onChange={this.handleInternalEditorStateChange}
          onFocus={this.handleEditorFocus}
          onBlur={this.handleEditorBlur}
        ></RichTextEditor>
      </div>
    );
  }
}
