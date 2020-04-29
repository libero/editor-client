import React, { useCallback } from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

export interface DropDownMenuItemProps {
  title: string;
  enabled: boolean;
  onClick(): void;
}

export interface DropDownMenuProps {
  title: string;
  entries: DropDownMenuItemProps[];
}

export const DropDownMenu: React.FC<DropDownMenuProps> = ({ title, entries }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleItemClick = useCallback(
    (action) => {
      if (action) {
        action();
      }
      setAnchorEl(null);
    },
    [setAnchorEl]
  );

  const items = entries.map((entry) => {
    return (
      <MenuItem disabled={!entry.enabled} onClick={handleItemClick.bind(null, entry.onClick)}>
        {entry.title}
      </MenuItem>
    );
  });

  return (
    <div>
      <Button aria-controls='simple-menu' aria-haspopup='true' onClick={handleMenuClick}>
        {title}
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {items}
      </Menu>
    </div>
  );
};
