import React from 'react';
import { withStyles, WithStyles } from '@material-ui/core/styles';

import { NodeEditor } from 'app/components/node-editor/node-editor';
import { RichTextEditor } from 'app/components/rich-text-editor';
import { useFigureContentEditorStyles } from 'app/components/figure/styles';

interface FigureContentEditorProps extends WithStyles<typeof useFigureContentEditorStyles> {
  label: string;
}

export class FigureContentEditorComponent extends NodeEditor<FigureContentEditorProps> {
  render() {
    return (
      <div>
        <RichTextEditor
          ref={this.editorRef}
          classes={{ root: this.props.classes.richTextEditorField }}
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

const stylesDecorator = withStyles(useFigureContentEditorStyles, { withTheme: true });
export const FigureContentEditor = stylesDecorator(FigureContentEditorComponent);
