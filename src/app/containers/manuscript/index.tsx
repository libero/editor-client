import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@material-ui/core';

import { isManuscriptLoaded } from '../../selectors/manuscript.selectors';
import './styles.scss';
import { ManuscriptToolbar } from './manuscript-toolbar';
import { ManuscriptEditor } from './manuscript-editor';

const renderBackdrop = () => (
  <Backdrop open={true}>
    <CircularProgress color='inherit' />
  </Backdrop>
);

export const ManuscriptContainer: React.FC = () => {
  const isLoaded = useSelector(isManuscriptLoaded);
  const renderContent = () => (
    <div>
      <div className='manuscript-container'>
        <ManuscriptToolbar />
        <ManuscriptEditor />
      </div>
    </div>
  );

  return isLoaded ? renderContent() : renderBackdrop();
};
