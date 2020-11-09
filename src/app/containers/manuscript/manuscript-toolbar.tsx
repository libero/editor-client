import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import LinkIcon from '@material-ui/icons/Link';
import MenuIcon from '@material-ui/icons/Menu';

import { DropDownMenu } from 'app/components/drop-down-menu';
import * as manuscriptActions from 'app/actions/manuscript.actions';

import {
  canApplyMarkToSelection,
  canInsertNodeAtSelection,
  canRedoChanges,
  canUndoChanges,
  canToggleHeadingAtSelection,
  isMarkAppliedToSelection,
  canToggleParagraphAtSelection,
  isActiveContainer,
  canToggleListAtSelection, canInsertFigureCitationAtSelection
} from 'app/selectors/manuscript-editor.selectors';

import { useToolbarStyles } from './styles';
import { uploadImage } from 'app/utils/view.utils';

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
  const canInsert = useSelector(canInsertNodeAtSelection);
  const isApplied = useSelector(isMarkAppliedToSelection);
  const canToggleHeading = useSelector(canToggleHeadingAtSelection);
  const canToggleParagraph = useSelector(canToggleParagraphAtSelection);
  const canToggleList = useSelector(canToggleListAtSelection);
  const canInsertFigureCitation = useSelector(canInsertFigureCitationAtSelection);
  const checkActiveContainer = useSelector(isActiveContainer);

  const invokeUndo = useCallback(() => dispatch(manuscriptActions.undoAction()), [dispatch]);
  const invokeRedo = useCallback(() => dispatch(manuscriptActions.redoAction()), [dispatch]);

  const insertReferenceCitation = useCallback(() => {
    dispatch(manuscriptActions.insertReferenceCitationAction());
  }, [dispatch]);

  const insertBox = useCallback(() => {
    dispatch(manuscriptActions.insertBoxAction());
  }, [dispatch]);

  const insertFigureCitation = useCallback(() => {
    dispatch(manuscriptActions.insertFigureCitationAction());
  }, [dispatch]);

  const toggleOrderList = useCallback(() => {
    dispatch(manuscriptActions.insertListAction('order'));
  }, [dispatch]);

  const toggleBulletList = useCallback(() => {
    dispatch(manuscriptActions.insertListAction('bullet'));
  }, [dispatch]);

  const insertFigure = useCallback(() => {
    uploadImage((imageSource: string) => {
      dispatch(manuscriptActions.insertFigureAction(imageSource));
    });
  }, [dispatch]);

  const toggleHeading = useCallback(
    (headingLevel: number) => () => {
      dispatch(manuscriptActions.insertHeadingAction(headingLevel));
    },
    [dispatch]
  );

  const getSectionMenuTitle = useCallback(() => {
    const activeContainer = Object.entries({
      paragraph: ['paragraph'],
      'heading 1': ['heading', { level: 1 }],
      'heading 2': ['heading', { level: 2 }],
      'heading 3': ['heading', { level: 3 }],
      'heading 4': ['heading', { level: 4 }]
    }).find(([, entry]) => {
      const nodeName: string = entry[0] as string;
      const attrs = entry[1] as Record<string, string | number>;
      return checkActiveContainer(nodeName, attrs);
    });
    return activeContainer ? activeContainer[0].toUpperCase() : 'PARAGRAPH';
  }, [checkActiveContainer]);

  const toggleParagraph = useCallback(() => {
    dispatch(manuscriptActions.insertParagraphAction());
  }, [dispatch]);

  const invokeToggleMark = useCallback(
    (mark: string) => () => {
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
          <ToggleButton disabled={!canUndo} onClick={invokeUndo} selected={false}>
            <UndoIcon />
          </ToggleButton>
          <ToggleButton disabled={!canRedo} onClick={invokeRedo} selected={false}>
            <RedoIcon />
          </ToggleButton>
          <ToggleButton disabled={!canApply('bold')} selected={isApplied('bold')} onClick={invokeToggleMark('bold')}>
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton
            disabled={!canApply('italic')}
            selected={isApplied('italic')}
            onClick={invokeToggleMark('italic')}
          >
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton disabled={!canApply('link')} selected={isApplied('link')} onClick={invokeToggleMark('link')}>
            <LinkIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <DropDownMenu
          title={getSectionMenuTitle()}
          entries={[
            { title: 'Heading 1', enabled: canToggleHeading(1), action: toggleHeading(1) },
            { title: 'Heading 2', enabled: canToggleHeading(2), action: toggleHeading(2) },
            { title: 'Heading 3', enabled: canToggleHeading(3), action: toggleHeading(3) },
            { title: 'Heading 4', enabled: canToggleHeading(4), action: toggleHeading(4) },
            { title: 'Paragraph', enabled: canToggleParagraph, action: toggleParagraph },
            { title: 'Bulleted List', enabled: canToggleList('bullet'), action: toggleBulletList },
            { title: 'Numbered List', enabled: canToggleList('order'), action: toggleOrderList },
            { title: 'Preformat', enabled: false, action: undefined }
          ]}
        />
        <DropDownMenu
          title="FORMAT"
          entries={[
            { title: 'Bold', enabled: canApply('bold'), action: invokeToggleMark('bold'), selected: isApplied('bold') },
            {
              title: 'Italics',
              enabled: canApply('italic'),
              action: invokeToggleMark('italic'),
              selected: isApplied('italic')
            },
            {
              title: 'Subscript',
              enabled: canApply('subscript'),
              action: invokeToggleMark('subscript'),
              selected: isApplied('subscript')
            },
            {
              title: 'Superscript',
              enabled: canApply('superscript'),
              action: invokeToggleMark('superscript'),
              selected: isApplied('superscript')
            },
            { title: 'Monospace', enabled: false, action: undefined },
            { title: 'Small Caps', enabled: false, action: undefined },
            {
              title: 'Underline',
              enabled: canApply('underline'),
              action: invokeToggleMark('underline'),
              selected: isApplied('underline')
            },
            { title: 'Overline', enabled: false, action: undefined },
            {
              title: 'Strike Through',
              enabled: canApply('strikethrough'),
              action: invokeToggleMark('strikethrough'),
              selected: isApplied('strikethrough')
            }
          ]}
        />
        <DropDownMenu
          title="INSERT"
          entries={[
            { title: 'Figure', enabled: canInsert('figure'), action: insertFigure },
            { title: 'Inline Graphic', enabled: false, action: undefined },
            { title: 'Table', enabled: false, action: undefined },
            { title: 'Block Quote', enabled: false, action: undefined },
            { title: 'Box', enabled: canInsert('boxText'), action: insertBox },
            { title: 'Equation', enabled: false, action: undefined },
            { title: 'File', enabled: false, action: undefined },
            { title: 'Inline Math', enabled: false, action: undefined },
            null,
            { title: 'Reference Citation', enabled: canInsert('refCitation'), action: insertReferenceCitation },
            { title: 'Figure Citation', enabled: canInsertFigureCitation(), action: insertFigureCitation },
            { title: 'Table citation', enabled: false, action: undefined },
            { title: 'Footnote citation', enabled: false, action: undefined },
            { title: 'Equation citation', enabled: false, action: undefined },
            { title: 'File Citation', enabled: false, action: undefined }
          ]}
        />
      </Toolbar>
    </AppBar>
  );

  return renderContent();
};
