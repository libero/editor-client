import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Paper, PaperProps } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Draggable from 'react-draggable';

import { isModalVisible, getModalParams } from 'app/selectors/manuscript-editor.selectors';
import { useModalContainerStyles } from './styles';
import { ReactFCProps } from 'app/utils/types';

const PaperComponent: React.FC<PaperProps> = (props: PaperProps) => (
  <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
    <Paper {...props} />
  </Draggable>
);

export const ModalContainer: React.FC<{}> = (props) => {
  const isVisible = useSelector(isModalVisible);
  const params = useSelector(getModalParams);
  const classes = useModalContainerStyles();

  const renderDialog = (Component: React.FC, title?: string, props?: ReactFCProps<typeof Component>) => {
    return (
      <Dialog aria-labelledby="draggable-dialog-title" open={true} PaperComponent={PaperComponent}>
        <DialogTitle
          style={{ cursor: 'move' }}
          disableTypography={true}
          classes={{ root: classes.dialogTitle }}
          id="draggable-dialog-title"
        >
          <Typography variant="h3">{title}</Typography>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Component {...(props || {})} />
        </DialogContent>
      </Dialog>
    );
  };

  return isVisible ? renderDialog(params.component, params.title, params.props) : <></>;
};
