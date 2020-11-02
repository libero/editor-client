import React from 'react';
import { TextField, IconButton } from '@material-ui/core';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import DeleteIcon from '@material-ui/icons/Delete';

import { FIGURE_LICENSE_CC0, FIGURE_LICENSE_SELECT_OPTIONS, FigureLicense } from 'app/models/figure-license';
import { RichTextEditor } from 'app/components/rich-text-editor';
import { NodeEditor } from 'app/components/node-editor/node-editor';
import { useFigureLicenseEditorStyles } from 'app/components/figure/styles';
import { Select } from 'app/components/select';
import { NodeSelection } from 'prosemirror-state';

interface FigureLicenseEditorProps extends WithStyles<typeof useFigureLicenseEditorStyles> {
  node: ProsemirrorNode;
  offset: number;
  index: number;
  classes: Record<string, string>;
}

class FigureContentEditorComponent extends NodeEditor<FigureLicenseEditorProps> {
  render() {
    const license: FigureLicense = this.props.node.attrs.licenseInfo as FigureLicense;
    const classes = this.props.classes;
    return (
      <section className={classes.editorContainer}>
        <div className={classes.editorForm}>
          <div className={classes.fieldsRow}>
            <Select
              className={classes.smallField}
              name="licenseType"
              placeholder="Please select"
              canUnselect={false}
              blankValue={undefined}
              label="Licence type"
              options={FIGURE_LICENSE_SELECT_OPTIONS}
              value={license.licenseType}
              onChange={this.handleFormChange}
            />
            {license.licenseType !== FIGURE_LICENSE_CC0 ? (
              <TextField
                classes={{ root: classes.smallField }}
                name="copyrightYear"
                label="Year"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={license.copyrightYear}
                onChange={this.handleFormChange}
              />
            ) : undefined}
          </div>
          <div className={classes.inputField}>
            <RichTextEditor
              isActive={this.state.isEditorActive}
              label={`License ${this.props.index + 1}`}
              variant="outlined"
              editorState={this.state.editorState}
              onChange={this.handleInternalEditorStateChange}
            />
          </div>
          {license.licenseType !== FIGURE_LICENSE_CC0 ? (
            <>
              <TextField
                fullWidth
                name="copyrightStatement"
                label={`License ${this.props.index + 1} statement`}
                classes={{ root: classes.inputField }}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={license.copyrightStatement}
                onChange={this.handleFormChange}
              />
              <TextField
                fullWidth
                name="copyrightHolder"
                label={`License ${this.props.index + 1} holder`}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={license.copyrightHolder}
                onChange={this.handleFormChange}
              />
            </>
          ) : undefined}
        </div>
        <IconButton classes={{ root: classes.deleteButton }} onClick={this.handleDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </section>
    );
  }

  private handleFormChange = (event) => {
    const newAttributes = {
      ...this.props.node.attrs.licenseInfo,
      [event.target['name']]: event.target['value']
    } as FigureLicense;
    const change = this.context.view.state.tr;
    change.setNodeMarkup(this.context.getPos() + this.props.offset - 1, null, { licenseInfo: newAttributes });
    this.context.view.dispatch(change);
  };

  private handleDelete = () => {
    const licenseNodePosition = this.context.view.state.doc.resolve(this.context.getPos() + this.props.offset - 1);
    const change = this.context.view.state.tr.setSelection(new NodeSelection(licenseNodePosition)).deleteSelection();
    this.context.view.dispatch(change);
  };
}

const stylesDecorator = withStyles(useFigureLicenseEditorStyles, { withTheme: true });
export const FigureLicenseEditor = stylesDecorator(FigureContentEditorComponent);
