import React, { SyntheticEvent, useCallback, useState } from 'react';
import { IconButton, InputAdornment, Popover, TextField } from '@material-ui/core';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import CloseIcon from '@material-ui/icons/Close';
import LaunchIcon from '@material-ui/icons/Launch';

import { useLinkEditorStyles } from 'app/components/link-editor-popup/styles';
import { ActionButton } from 'app/components/action-button';

interface LinkEditorPopupProps {
  editorView: EditorView | undefined;
  onClose: () => void;
  onApply: (href: string) => void;
  node?: ProsemirrorNode;
  y: number;
  x: number;
}

export const LinkEditorPopup: React.FC<LinkEditorPopupProps> = ({ editorView, node, onApply, onClose, x, y }) => {
  const classes = useLinkEditorStyles();
  const [link, setLink] = useState<string>(node ? node.attrs.href : '');

  const handleOnChange = useCallback(
    (event: SyntheticEvent) => {
      setLink(event.target['value']);
    },
    [setLink]
  );

  const handleLaunchClick = useCallback(() => {
    window.open(link, '_blank');
  }, [link]);

  const handleClearField = useCallback(() => setLink(''), [setLink]);

  const handleApplyClick = useCallback(() => {
    editorView.focus();
    onApply(link);
  }, [editorView, link, onApply]);

  if (!editorView) {
    return <></>;
  }

  return (
    <Popover
      open={true}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: y, left: x }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
    >
      <div className={classes.container}>
        <TextField
          fullWidth
          classes={{ root: classes.textField }}
          name="link"
          label="Link"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={link}
          onChange={handleOnChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <span className={classes.clearTextButton} onClick={handleClearField}>
                  <CloseIcon />
                </span>
              </InputAdornment>
            )
          }}
        />
        <IconButton size="small" onClick={handleLaunchClick} classes={{ root: classes.launchButton }}>
          <LaunchIcon fontSize="small" />
        </IconButton>
        <ActionButton variant="primaryContained" onClick={handleApplyClick} title="Apply" />
      </div>
    </Popover>
  );
};
