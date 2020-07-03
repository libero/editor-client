import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlineIcon from '@material-ui/icons/FormatUnderlined';
import FormatStrikethroughIcon from '@material-ui/icons/FormatStrikethrough';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import LinkIcon from '@material-ui/icons/Link';
import MenuIcon from '@material-ui/icons/Menu';

import { SubscriptIcon, SuperscriptIcon } from 'app/assets/icons';
import { DropDownMenu } from 'app/components/drop-down-menu';
import * as manuscriptActions from 'app/actions/manuscript.actions';

import {
  canApplyMarkToSelection,
  canRedoChanges,
  canUndoChanges,
  isMarkAppliedToSelection
} from 'app/selectors/manuscript-editor.selectors';

import { useToolbarStyles } from './styles';

export interface ManuscriptToolbarProps {
  tocOpen: boolean;
  handleTocToggle(): void;
}

export const ManuscriptToolbar: React.FC<ManuscriptToolbarProps> = (props) => {
  const classes = useToolbarStyles();
  const { handleTocToggle } = props;

  const dispatch = useDispatch();

  const canUndo = useSelector(canUndoChanges);
  const canRedo = useSelector(canRedoChanges);
  const canApply = useSelector(canApplyMarkToSelection);
  const isApplied = useSelector(isMarkAppliedToSelection);

  const invokeUndo = useCallback(() => dispatch(manuscriptActions.undoAction()), [dispatch]);
  const invokeRedo = useCallback(() => dispatch(manuscriptActions.redoAction()), [dispatch]);
  const invokeToggleMark = useCallback(
    (mark: string) => (event?) => {
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      dispatch(manuscriptActions.toggleMarkAction(mark));
    },
    [dispatch]
  );

  const renderContent = (): JSX.Element => (
    <AppBar color="inherit" position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton aria-label="open drawer" edge="start" onClick={handleTocToggle} className={classes.menuButton}>
          <MenuIcon />
        </IconButton>
        <ToggleButtonGroup classes={{ grouped: classes.toolButtonsGroup }}>
          <ToggleButton disabled={true}>
            <SaveAltIcon />
          </ToggleButton>
          <ToggleButton disabled={!canUndo} onMouseDown={invokeUndo} selected={false}>
            <UndoIcon />
          </ToggleButton>
          <ToggleButton disabled={!canRedo} onMouseDown={invokeRedo} selected={false}>
            <RedoIcon />
          </ToggleButton>
          <ToggleButton
            disabled={!canApply('bold')}
            selected={isApplied('bold')}
            onMouseDown={invokeToggleMark('bold')}
          >
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton
            disabled={!canApply('underline')}
            selected={isApplied('underline')}
            onMouseDown={invokeToggleMark('underline')}
          >
            <FormatUnderlineIcon />
          </ToggleButton>
          <ToggleButton
            disabled={!canApply('strikethrough')}
            selected={isApplied('strikethrough')}
            onMouseDown={invokeToggleMark('strikethrough')}
          >
            <FormatStrikethroughIcon />
          </ToggleButton>
          <ToggleButton
            disabled={!canApply('italic')}
            selected={isApplied('italic')}
            onMouseDown={invokeToggleMark('italic')}
          >
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton
            disabled={!canApply('subscript')}
            selected={isApplied('subscript')}
            onMouseDown={invokeToggleMark('subscript')}
          >
            <SubscriptIcon />
          </ToggleButton>
          <ToggleButton
            disabled={!canApply('superscript')}
            selected={isApplied('superscript')}
            onMouseDown={invokeToggleMark('superscript')}
          >
            <SuperscriptIcon />
          </ToggleButton>
          <ToggleButton
            disabled={!canApply('link')}
            selected={isApplied('link')}
            onMouseDown={invokeToggleMark('link')}
          >
            <LinkIcon />
          </ToggleButton>
        </ToggleButtonGroup>
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
            { title: 'Bold', enabled: canApply('bold'), action: invokeToggleMark('bold') },
            { title: 'Italics', enabled: canApply('italic'), action: invokeToggleMark('italic') },
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
