import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import { ActionButton, VariantType } from 'app/components/action-button';
import { usePromptDialogStyles } from 'app/components/prompt-dialog/styles';

interface PromptDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onAccept: () => void;
  onReject: () => void;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptVariant?: VariantType;
  rejectVariant?: VariantType;
}

const defaultProps = {
  acceptLabel: 'OK',
  rejectLabel: 'Cancel',
  acceptVariant: 'primaryContained' as VariantType,
  rejectVariant: 'secondaryOutlined' as VariantType
};

export const PromptDialog: React.FC<PromptDialogProps> = (props) => {
  const classes = usePromptDialogStyles();
  return (
    <Dialog
      open={props.isOpen}
      aria-labelledby="alert-dialog-title"
      maxWidth="xs"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" disableTypography={true} classes={{ root: classes.dialogTitle }}>
        <Typography variant="h3">{props.title}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions classes={{ root: classes.actionPanel }}>
        <ActionButton
          onClick={props.onReject}
          variant={props.rejectVariant || defaultProps.rejectVariant}
          title={props.rejectLabel || defaultProps.rejectLabel}
        />
        <ActionButton
          onClick={props.onAccept}
          variant={props.acceptVariant || defaultProps.acceptVariant}
          title={props.acceptLabel || defaultProps.acceptLabel}
        />
      </DialogActions>
    </Dialog>
  );
};

export const renderConfirmDialog = (title: string, msg: string, onAccept: () => void, onReject: () => void) => {
  return (
    <PromptDialog
      title={title}
      message={msg}
      isOpen={true}
      onAccept={onAccept}
      onReject={onReject}
      acceptLabel="Delete"
      rejectLabel="Cancel"
      acceptVariant="containedWarning"
      rejectVariant="secondaryOutlined"
    />
  );
};
