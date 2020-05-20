import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Button } from '@material-ui/core';
import { useAddEntityBtnStyles } from './styles';

export const AddEntityButton: React.FC = () => {
  const classes = useAddEntityBtnStyles();
  return (
    <Button
      size="small"
      classes={{ root: classes.root, startIcon: classes.icon }}
      variant="text"
      startIcon={<AddIcon />}
    >
      Add Author
    </Button>
  );
};
