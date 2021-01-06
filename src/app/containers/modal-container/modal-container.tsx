import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Paper, PaperProps } from '@material-ui/core';
import Draggable from 'react-draggable';

import { useModalContainerStyles } from './styles';
import { ReactFCProps } from 'app/types/utility.types';

interface ModalContainerProps<T> {
  title: string;
  params: ReactFCProps<T>;
  component: T;
}

const PaperComponent: React.FC<PaperProps> = (props: PaperProps) => (
  <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
    <Paper {...props} />
  </Draggable>
);

export const ModalContainer: React.FC<ModalContainerProps<React.FC>> = (props) => {
  const classes = useModalContainerStyles();
  const Component = props.component;

  return (
    <Dialog aria-labelledby="draggable-dialog-title" open={true} PaperComponent={PaperComponent}>
      <DialogTitle
        style={{ cursor: 'move' }}
        disableTypography={true}
        classes={{ root: classes.dialogTitle }}
        id="draggable-dialog-title"
      >
        <Typography variant="h3">{props.title}</Typography>
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogContent }}>
        <Component {...(props.params || {})} />
      </DialogContent>
    </Dialog>
  );
};
