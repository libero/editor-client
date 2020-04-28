import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import LinkIcon from '@material-ui/icons/Link';
import { DropDownMenu } from '../../components/drop-down-menu';

import * as manuscriptActions from '../../actions/manuscript.actions';
import {
  canRedoChanges,
  canUndoChanges,
  canBoldSelection,
  canItalicizeSelection,
  canLinkSelection
} from '../../selectors/manuscript.selectors';
import './styles.scss';

export const ManuscriptToolbar: React.FC = () => {
  const canUndo = useSelector(canUndoChanges);
  const canRedo = useSelector(canRedoChanges);
  const canBold = useSelector(canBoldSelection);
  const canItalicize = useSelector(canItalicizeSelection);
  const canLink = useSelector(canLinkSelection);

  const dispatch = useDispatch();

  const invokeUndo = useCallback(() => dispatch(manuscriptActions.undoAction()), [dispatch]);
  const invokeRedo = useCallback(() => dispatch(manuscriptActions.redoAction()), [dispatch]);

  const renderContent = () => (
    <AppBar position='sticky'>
      <Toolbar className='manuscript-toolbar'>
        <IconButton edge='start' disabled={true}>
          {' '}
          <SaveAltIcon />{' '}
        </IconButton>
        <IconButton edge='start' disabled={!canUndo} onClick={invokeUndo}>
          {' '}
          <UndoIcon />{' '}
        </IconButton>
        <IconButton edge='start' disabled={!canRedo} onClick={invokeRedo}>
          {' '}
          <RedoIcon />{' '}
        </IconButton>
        <IconButton edge='start' disabled={!canBold} onClick={invokeRedo}>
          {' '}
          <FormatBoldIcon />{' '}
        </IconButton>
        <IconButton edge='start' disabled={!canItalicize} onClick={invokeRedo}>
          {' '}
          <FormatItalicIcon />{' '}
        </IconButton>
        <IconButton edge='start' disabled={!canLink} onClick={invokeRedo}>
          {' '}
          <LinkIcon />{' '}
        </IconButton>
        <DropDownMenu
          title='PARAGRAPH'
          entries={[
            {
              title: 'opt1',
              enabled: () => false,
              onClick: () => {}
            },
            { title: 'opt2', enabled: () => false, onClick: () => {} }
          ]}
        />
        <DropDownMenu
          title='FORMAT'
          entries={[
            {
              title: 'opt1',
              enabled: () => false,
              onClick: () => {}
            },
            { title: 'opt2', enabled: () => false, onClick: () => {} }
          ]}
        />
        <DropDownMenu
          title='INSERT'
          entries={[
            {
              title: 'opt1',
              enabled: () => false,
              onClick: () => {}
            },
            { title: 'opt2', enabled: () => false, onClick: () => {} }
          ]}
        />
      </Toolbar>
    </AppBar>
  );

  return renderContent();
};
