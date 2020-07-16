import React, { useCallback, useRef } from 'react';
import { Popper, ClickAwayListener, Paper, MenuList, Button, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { useDropDownStyles } from './styles';

export interface DropDownMenuItemProps {
  title: string;
  enabled: boolean;
  selected?: boolean;
  action(): void;
}

export interface DropDownMenuProps {
  title: string;
  entries: DropDownMenuItemProps[];
}

export const DropDownMenu: React.FC<DropDownMenuProps> = ({ title, entries }) => {
  const [open, setOpen] = React.useState(false);
  const menuRef = useRef();
  const handleOpenMenuClick = useCallback(() => setOpen(true), [setOpen]);
  const handleMenuClose = useCallback(() => setOpen(false), [setOpen]);
  const classes = useDropDownStyles();

  const handleMenuItemClick = useCallback((action) => {
    if (action) {
      action();
    }
    setOpen(false);
  }, []);

  const menuItems = entries.map((entry, index) => {
    return (
      <MenuItem
        disabled={!entry.enabled}
        key={index}
        selected={entry.selected}
        onClick={handleMenuItemClick.bind(null, entry.action)}
      >
        {entry.title}
      </MenuItem>
    );
  });

  return (
    <div>
      <Button ref={menuRef} aria-haspopup="true" onClick={handleOpenMenuClick} className={classes.button}>
        {title}
        <ArrowDropDownIcon />
      </Button>
      <Popper anchorEl={menuRef.current} role={undefined} transition disablePortal open={open}>
        <Paper>
          <ClickAwayListener onClickAway={handleMenuClose}>
            <MenuList autoFocusItem={open}>{menuItems}</MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </div>
  );
};
