import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Button } from '@material-ui/core';
import { useAddEntityBtnStyles } from './styles';

interface AddEntityButtonProps {
  label: string;
  onClick?: () => void;
}

export const AddEntityButton: React.FC<AddEntityButtonProps> = ({label, onClick}) => {
  const classes = useAddEntityBtnStyles();
  return (
    <Button
      size="small"
      onClick={onClick}
      classes={{ root: classes.root, startIcon: classes.icon }}
      variant="text"
      startIcon={<AddIcon />}
    >
      {label}
    </Button>
  );
};
