import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@material-ui/core';

import { isManuscriptLoaded } from 'app/selectors/manuscript.selectors';
import { ManuscriptToolbar } from './manuscript-toolbar';
import { ManuscriptEditor } from './manuscript-editor';
import { ManuscriptTOC } from './manuscript-toc';
import { HotKeyBindings } from './hot-keys';
import { hasUnsavedChanges } from 'app/selectors/manuscript-editor.selectors';

const renderBackdrop = (): JSX.Element => (
  <Backdrop open={true}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

export const ManuscriptContainer: React.FC = () => {
  const [tocOpen, setTocOpen] = React.useState<boolean>(false);
  const checkForUnsavedChanges = useSelector(hasUnsavedChanges);

  const handleTocToggle = useCallback(() => {
    setTocOpen(!tocOpen);
  }, [tocOpen, setTocOpen]);

  useEffect(() => {
    const eventHandler = (e): boolean => {
      if (checkForUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = true;
        return true;
      }
    };

    window.addEventListener('beforeunload', eventHandler);
    return () => window.removeEventListener('beforeunload', eventHandler);
  }, [checkForUnsavedChanges]);

  const isLoaded = useSelector(isManuscriptLoaded);

  const renderContent = (): JSX.Element => (
    <React.Fragment>
      <HotKeyBindings />
      <ManuscriptTOC tocOpen={tocOpen} handleTocToggle={handleTocToggle.bind(null, this)} />
      <ManuscriptToolbar tocOpen={tocOpen} handleTocToggle={handleTocToggle.bind(null, this)} />
      <ManuscriptEditor />
    </React.Fragment>
  );

  return isLoaded ? renderContent() : renderBackdrop();
};
