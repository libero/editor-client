import React from 'react';
import {useSelector} from 'react-redux';
import {Backdrop, CircularProgress} from "@material-ui/core";

import {isManuscriptLoaded} from '../../selectors/manuscript.selectors';
import './styles.scss';
import {ManuscriptEditor} from "./manuscript-editor";

const renderBackdrop = () => (<Backdrop open={true}> <CircularProgress color="inherit" /> </Backdrop>);

export const Manuscript: React.FC = () => {
  const isLoaded = useSelector(isManuscriptLoaded);

  const renderContent = () => <div>
    <div className='manuscript-container'>
      <ManuscriptEditor />
    </div>
  </div>

  return isLoaded ? renderContent() : renderBackdrop();
}