import React, { useCallback } from 'react';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useDropDownStyles } from './styles';

export interface DropDownMenuItemProps {
  title: string;
  enabled: boolean;
  action(): void;
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

  const handleMenuItemClick = useCallback(
    (action) => {
      if (action) {
        action();
      }
      setAnchorEl(null);
    },
    [setAnchorEl]
  );

  const classes = useDropDownStyles();

  const menuItems = entries.map((entry, index) => {
    return (
      <MenuItem disabled={!entry.enabled} key={index} onClick={handleMenuItemClick.bind(null, entry.action)}>
        {entry.title}
      </MenuItem>
    );
  });

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuClick} className={classes.button}>
        {title}
        <ArrowDropDownIcon />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {menuItems}
      </Menu>
    </div>
  );
};
