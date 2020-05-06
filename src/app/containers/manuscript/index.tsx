import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@material-ui/core';

import { isManuscriptLoaded } from '../../selectors/manuscript.selectors';
import './styles.scss';
import { ManuscriptToolbar } from './manuscript-toolbar';
import { ManuscriptEditor } from './manuscript-editor';

const renderBackdrop = (): JSX.Element => (
  <Backdrop open={true}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

export const ManuscriptContainer: React.FC = () => {
  const isLoaded = useSelector(isManuscriptLoaded);
  const renderContent = (): JSX.Element => (
    <React.Fragment>
      <ManuscriptToolbar />
      <ManuscriptEditor />
    </React.Fragment>
  );

  return isLoaded ? renderContent() : renderBackdrop();
};
