import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';

import { isManuscriptLoaded } from '../../selectors/manuscript.selectors';
import './styles.scss';
import { ManuscriptToolbar } from './manuscript-toolbar';
import { ManuscriptEditor } from './manuscript-editor';
import { ManuscriptTOC } from './manuscript-toc';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  }
}));

const renderBackdrop = (): JSX.Element => (
  <Backdrop open={true}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

export const ManuscriptContainer: React.FC = () => {
  const classes = useStyles();
  const [tocOpen, setTocOpen] = React.useState(false);

  const handleTocToggle = () => {
    setTocOpen(!tocOpen);
  };

  const isLoaded = useSelector(isManuscriptLoaded);
  const renderContent = (): JSX.Element => (
    <div>
      <div className={classes.root}>
        <ManuscriptToolbar tocOpen={tocOpen} handleTocToggle={handleTocToggle.bind(null, this)} />
        <ManuscriptTOC tocOpen={tocOpen} handleTocToggle={handleTocToggle.bind(null, this)} />
        <ManuscriptEditor />
      </div>
    </div>
  );

  return isLoaded ? renderContent() : renderBackdrop();
};
