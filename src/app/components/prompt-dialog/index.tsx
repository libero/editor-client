import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';
import { ActionButton, VariantType } from '../action-button';

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
  return (
    <Dialog open={props.isOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h2">{props.title}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{props.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
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
