import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import { isModalVisible, getModalParams } from '../../selectors/manuscript-editor.selectors';
import { useModalContainerStyles } from './styles';
import { ReactFCProps } from '../../utils/types';

export const ModalContainer: React.FC<{}> = (props) => {
  const isVisible = useSelector(isModalVisible);
  const params = useSelector(getModalParams);
  const classes = useModalContainerStyles();

  const renderDialog = (Component: React.FC, title?: string, props?: ReactFCProps<typeof Component>) => {
    return (
      <Dialog aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle disableTypography={true} classes={{ root: classes.dialogTitle }}>
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
