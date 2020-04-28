import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export interface DropDownMenuItemProps {
  title: string;
  enabled(): boolean;
  onClick(): void;
}

export interface DropDownMenuProps {
  title: string;
  entries: DropDownMenuItemProps[];
}

export const DropDownMenu: React.FC<DropDownMenuProps> = ({ title, entries }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (action) => {
    if (action) {
      action();
    }
    setAnchorEl(null);
  };

  const items = entries.map((entry) => {
    return (
      <MenuItem disabled={!entry.enabled()} onClick={() => handleItemClick(entry.onClick)}>
        {entry.title}
      </MenuItem>
    );
  });

  return (
    <div>
      <Button aria-controls='simple-menu' aria-haspopup='true' onClick={handleMenuClick}>
        {title}
      </Button>
      <Menu id='simple-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {items}
      </Menu>
    </div>
  );
};
