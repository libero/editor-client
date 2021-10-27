import React, { SyntheticEvent, useCallback, useState } from 'react';
import { ClickAwayListener, IconButton, InputAdornment, Paper, Popper, TextField, useTheme } from '@material-ui/core';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import CloseIcon from '@material-ui/icons/Close';
import LaunchIcon from '@material-ui/icons/Launch';

import { useLinkEditorStyles } from './styles';
import { ActionButton } from '../action-button';

interface LinkEditorPopupProps {
  editorView: EditorView | undefined;
  onClose: () => void;
  anchorEl: HTMLElement;
  onApply: (href: string) => void;
  node?: ProsemirrorNode;
}

export const LinkEditorPopup: React.FC<LinkEditorPopupProps> = ({ editorView, node, onApply, onClose, anchorEl }) => {
  const classes = useLinkEditorStyles();
  const [link, setLink] = useState<string>(node ? node.attrs.href : '');
  const theme = useTheme();
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
    <Popper open={true} anchorEl={anchorEl} style={{ zIndex: theme.zIndex.tooltip }}>
      <Paper>
        <ClickAwayListener onClickAway={onClose} mouseEvent="onMouseUp">
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
        </ClickAwayListener>
      </Paper>
    </Popper>
  );
};
