import React from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress, Container } from '@material-ui/core';

import { isManuscriptLoaded } from '../../selectors/manuscript.selectors';
import { ManuscriptToolbar } from './manuscript-toolbar';
import { ManuscriptEditor } from './manuscript-editor';
import { ManuscriptTOC } from './manuscript-toc';

const renderBackdrop = (): JSX.Element => (
  <Backdrop open={true}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

export const ManuscriptContainer: React.FC = () => {
  const [tocOpen, setTocOpen] = React.useState<boolean>(false);

  const handleTocToggle = (): void => {
    setTocOpen(!tocOpen);
  };

  const isLoaded = useSelector(isManuscriptLoaded);

  const renderContent = (): JSX.Element => (
    <React.Fragment>
      <ManuscriptTOC tocOpen={tocOpen} handleTocToggle={handleTocToggle.bind(null, this)} />
      <ManuscriptToolbar tocOpen={tocOpen} handleTocToggle={handleTocToggle.bind(null, this)} />
      <ManuscriptEditor />
    </React.Fragment>
  );

  return isLoaded ? renderContent() : renderBackdrop();
};
