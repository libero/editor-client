import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import LinkIcon from '@material-ui/icons/Link';
import MenuIcon from '@material-ui/icons/Menu';
import { DropDownMenu } from '../../components/drop-down-menu';
import { makeStyles } from '@material-ui/core/styles';

import * as manuscriptActions from '../../actions/manuscript.actions';

import {
  canItalicizeSelection,
  canRedoChanges,
  canUndoChanges,
  canBoldSelection,
  canLinkSelection
} from '../../selectors/manuscript-editor.selectors';

import { tocWidth } from './manuscript-toc';

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${tocWidth}px)`,
      marginLeft: tocWidth
    }
  },
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: {
    ...theme.mixins.toolbar
  }
}));

export interface ManuscriptToolbarProps {
  tocOpen: boolean;
  handleTocToggle(): void;
}

export const ManuscriptToolbar: React.FC<ManuscriptToolbarProps> = (props) => {
  const classes = useStyles();
  const { handleTocToggle } = props;

  const dispatch = useDispatch();

  const canUndo = useSelector(canUndoChanges);
  const canRedo = useSelector(canRedoChanges);
  const canBold = useSelector(canBoldSelection);
  const canItalicize = useSelector(canItalicizeSelection);
  const canLink = useSelector(canLinkSelection);

  const invokeUndo = useCallback(() => dispatch(manuscriptActions.undoAction()), [dispatch]);
  const invokeRedo = useCallback(() => dispatch(manuscriptActions.redoAction()), [dispatch]);
  const invokeBold = useCallback(() => dispatch(manuscriptActions.boldAction()), [dispatch]);
  const invokeItalicize = useCallback(() => dispatch(manuscriptActions.italicizeAction()), [dispatch]);
  const invokeLink = useCallback(() => dispatch(manuscriptActions.linkAction()), [dispatch]);

  const renderContent = (): JSX.Element => (
    <AppBar color="inherit" position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton aria-label="open drawer" edge="start" onClick={handleTocToggle} className={classes.menuButton}>
          <MenuIcon />
        </IconButton>
        <IconButton disabled={true}>
          <SaveAltIcon />
        </IconButton>
        <IconButton disabled={!canUndo} onClick={invokeUndo}>
          <UndoIcon />
        </IconButton>
        <IconButton disabled={!canRedo} onClick={invokeRedo}>
          <RedoIcon />
        </IconButton>
        <IconButton disabled={!canBold} onClick={invokeBold}>
          <FormatBoldIcon />
        </IconButton>
        <IconButton disabled={!canItalicize} onClick={invokeItalicize}>
          <FormatItalicIcon />
        </IconButton>
        <IconButton disabled={!canLink} onClick={invokeLink}>
          <LinkIcon />
        </IconButton>
        <DropDownMenu
          title="PARAGRAPH"
          entries={[
            { title: 'Heading 1', enabled: false, action: undefined },
            { title: 'Heading 2', enabled: false, action: undefined },
            { title: 'Heading 3', enabled: false, action: undefined },
            { title: 'Paragraph', enabled: false, action: undefined },
            { title: 'Bulleted List', enabled: false, action: undefined },
            { title: 'Numbered List', enabled: false, action: undefined },
            { title: 'Preformat', enabled: false, action: undefined }
          ]}
        />
        <DropDownMenu
          title="FORMAT"
          entries={[
            { title: 'Bold', enabled: canBold, action: invokeBold },
            { title: 'Italics', enabled: canItalicize, action: invokeItalicize },
            { title: 'Subscript', enabled: false, action: undefined },
            { title: 'Superscript', enabled: false, action: undefined },
            { title: 'Monospace', enabled: false, action: undefined },
            { title: 'Small Caps', enabled: false, action: undefined },
            { title: 'Underline', enabled: false, action: undefined },
            { title: 'Overline', enabled: false, action: undefined },
            { title: 'Strike Through', enabled: false, action: undefined }
          ]}
        />
        <DropDownMenu
          title="INSERT"
          entries={[
            { title: 'Figure', enabled: false, action: undefined },
            { title: 'Table', enabled: false, action: undefined },
            { title: 'Block Quote', enabled: false, action: undefined },
            { title: 'Equation', enabled: false, action: undefined },
            { title: 'File', enabled: false, action: undefined },
            { title: 'Footnote', enabled: false, action: undefined },
            { title: 'Math', enabled: false, action: undefined },
            { title: 'Inline Graphic', enabled: false, action: undefined },
            { title: 'Citation', enabled: false, action: undefined },
            { title: 'Figure Reference', enabled: false, action: undefined },
            { title: 'Table Reference', enabled: false, action: undefined },
            { title: 'Footnote Reference', enabled: false, action: undefined },
            { title: 'Equation Reference', enabled: false, action: undefined },
            { title: 'Figure Reference', enabled: false, action: undefined },
            { title: 'Table Reference', enabled: false, action: undefined },
            { title: 'File Reference', enabled: false, action: undefined },
            { title: 'Author', enabled: false, action: undefined },
            { title: 'Affiliation', enabled: false, action: undefined },
            { title: 'Reference', enabled: false, action: undefined }
          ]}
        />
      </Toolbar>
    </AppBar>
  );

  return renderContent();
};
