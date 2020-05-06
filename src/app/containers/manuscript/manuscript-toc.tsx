import React from 'react';
import { Drawer, Divider, Hidden, List, ListItem, ListItemText } from '@material-ui/core';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import './styles.scss';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export interface ManuscriptTOCProps {
  mobileOpen: boolean;
  handleDrawerToggle(): void;
}

export const ManuscriptTOC: React.FC<ManuscriptTOCProps> = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { mobileOpen, handleDrawerToggle } = props;

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {['Title', 'Abstract'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderContent = () => (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {}
      <Hidden smUp implementation="css">
        <Drawer
          /*container={container}*/
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );

  return renderContent();
};
