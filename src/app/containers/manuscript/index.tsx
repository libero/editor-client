import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress, useTheme, makeStyles } from '@material-ui/core';

import { isManuscriptLoaded } from '../../selectors/manuscript.selectors';
import './styles.scss';
import { ManuscriptToolbar } from './manuscript-toolbar';
import { ManuscriptEditor } from './manuscript-editor';
import { ManuscriptTOC } from './manuscript-toc';

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

const renderBackdrop = (): JSX.Element => (
  <Backdrop open={true}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

export const ManuscriptContainer: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isLoaded = useSelector(isManuscriptLoaded);
  const renderContent = (): JSX.Element => (
    <div>
      <div className={classes.root}>
        <ManuscriptToolbar />
        <ManuscriptTOC />
        <ManuscriptEditor />
      </div>
    </div>
  );

  return isLoaded ? renderContent() : renderBackdrop();
};
