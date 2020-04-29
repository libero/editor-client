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
  const invokeBold = useCallback(() => dispatch(manuscriptActions.boldAction()), [dispatch]);
  const invokeItalicize = useCallback(() => dispatch(manuscriptActions.italicizeAction()), [dispatch]);
  const invokeLink = useCallback(() => dispatch(manuscriptActions.linkAction()), [dispatch]);

  const renderContent = () => (
    <AppBar position='sticky'>
      <Toolbar className='manuscript-toolbar'>
        <IconButton disabled={true}>
          {' '}
          <SaveAltIcon />{' '}
        </IconButton>
        <IconButton disabled={!canUndo} onClick={invokeUndo}>
          {' '}
          <UndoIcon />{' '}
        </IconButton>
        <IconButton disabled={!canRedo} onClick={invokeRedo}>
          {' '}
          <RedoIcon />{' '}
        </IconButton>
        <IconButton disabled={!canBold} onClick={invokeBold}>
          {' '}
          <FormatBoldIcon />{' '}
        </IconButton>
        <IconButton disabled={!canItalicize} onClick={invokeItalicize}>
          {' '}
          <FormatItalicIcon />{' '}
        </IconButton>
        <IconButton disabled={!canLink} onClick={invokeLink}>
          {' '}
          <LinkIcon />{' '}
        </IconButton>
        <DropDownMenu
          title='PARAGRAPH'
          entries={[
            { title: 'opt1', enabled: false, action: undefined },
            { title: 'opt2', enabled: false, action: undefined }
          ]}
        />
        <DropDownMenu
          title='FORMAT'
          entries={[
            { title: 'Bold', enabled: canBold, action: invokeBold },
            { title: 'Italics', enabled: canItalicize, action: invokeItalicize },
            { title: 'Link', enabled: canItalicize, action: invokeLink }
          ]}
        />
        <DropDownMenu
          title='INSERT'
          entries={[
            { title: 'opt1', enabled: false, action: undefined },
            { title: 'opt2', enabled: false, action: undefined }
          ]}
        />
      </Toolbar>
    </AppBar>
  );

  return renderContent();
};
