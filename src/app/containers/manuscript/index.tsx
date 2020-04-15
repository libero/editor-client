import React, {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Backdrop, CircularProgress, IconButton} from "@material-ui/core";
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

import * as manuscriptActions from "../../actions/manuscript.actions";
import {canRedoChanges, canUndoChanges, isManuscriptLoaded} from '../../selectors/manuscript.selectors';
import './styles.scss';
import {ManuscriptEditor} from "./manuscript-editor";

const renderBackdrop = () => (<Backdrop open={true}> <CircularProgress color="inherit" /> </Backdrop>);

export const Manuscript: React.FC = () => {
  const isLoaded = useSelector(isManuscriptLoaded);
  const canUndo = useSelector(canUndoChanges);
  const canRedo = useSelector(canRedoChanges);

  const dispatch = useDispatch();

  const invokeUndo = useCallback(() => dispatch(manuscriptActions.undoAction()), [dispatch]);
  const invokeRedo = useCallback(() => dispatch(manuscriptActions.redoAction()), [dispatch]);

  const renderContent = () => <div>
    <IconButton edge="start" disabled={!canUndo} onClick={invokeUndo}> <UndoIcon /> </IconButton>
    <IconButton edge="start" disabled={!canRedo}  onClick={invokeRedo}> <RedoIcon /> </IconButton>
    <div className='manuscript-container'>
      <ManuscriptEditor />
    </div>
  </div>;

  return isLoaded ? renderContent() : renderBackdrop();
}