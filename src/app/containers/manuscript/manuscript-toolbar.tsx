import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, IconButton, ButtonGroup } from '@material-ui/core';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import PdfIcon from '@material-ui/icons/PictureAsPdf';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';

import { DropDownMenu } from '../../components/drop-down-menu';
import * as manuscriptActions from '../../actions/manuscript.actions';
import * as manuscriptEditorActions from '../../actions/manuscript-editor.actions';

import defaultMenuConfig from './default-menu-config.json';

import {
  canApplyMarkToSelection,
  canInsertNodeAtSelection,
  canRedoChanges,
  canUndoChanges,
  canToggleHeadingAtSelection,
  isMarkAppliedToSelection,
  canToggleParagraphAtSelection,
  isActiveContainer,
  canToggleListAtSelection,
  canInsertFigureCitationAtSelection,
  isLastSyncSuccesful,
  getLastSyncTimestamp,
  isExportTaskRunning
} from '../../selectors/manuscript-editor.selectors';
import { useToolbarStyles } from './styles';
import { getImageFileUpload } from '../../utils/view.utils';
import moment from 'moment';

export interface ManuscriptToolbarProps {
  tocOpen: boolean;
  handleTocToggle(): void;
}

interface MenuConfig {
  'button-group': string[];
  menus: string[];
  'custom-buttons': {
    id: string;
    url: string;
    icon: string;
  }[];
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
  const lastSyncSuccessful = useSelector(isLastSyncSuccesful);
  const lastSyncTs = useSelector(getLastSyncTimestamp);
  const isExportRunning = useSelector(isExportTaskRunning);

  const invokeUndo = useCallback(() => dispatch(manuscriptActions.undoAction()), [dispatch]);
  const invokeRedo = useCallback(() => dispatch(manuscriptActions.redoAction()), [dispatch]);

  const [menuConfig, setMenuConfig] = useState<MenuConfig>(defaultMenuConfig);

  useEffect(() => {
    fetch('./menu-config.json', {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    })
      .then((data) => data.json())
      .then((json) => setMenuConfig(json));
  }, []);

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
    getImageFileUpload((imageFile: File) => {
      dispatch(manuscriptActions.insertFigureAction(imageFile));
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

  const exportPdf = useCallback(() => {
    dispatch(manuscriptEditorActions.exportPdfAction());
  }, [dispatch]);

  const invokeToggleMark = useCallback(
    (mark: string) => () => {
      dispatch(manuscriptActions.toggleMarkAction(mark));
    },
    [dispatch]
  );

  const buttons = {
    save: (
      <IconButton disabled={true}>
        <SaveAltIcon />
      </IconButton>
    ),
    undo: (
      <IconButton disabled={!canUndo} onClick={invokeUndo} id="undo">
        <UndoIcon />
      </IconButton>
    ),
    redo: (
      <IconButton disabled={!canRedo} onClick={invokeRedo} id="redo">
        <RedoIcon />
      </IconButton>
    ),
    pdf: (
      <IconButton disabled={isExportRunning} onClick={exportPdf}>
        <PdfIcon />
      </IconButton>
    )
  };

  const dropdowns = {
    typography: (
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
    ),
    headings: (
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
    ),
    insert: (
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
    )
  };
  console.log('rendered', menuConfig);
  const renderContent = (): JSX.Element => (
    <AppBar color="inherit" position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton aria-label="open drawer" edge="start" onClick={handleTocToggle} className={classes.menuButton}>
          <MenuIcon />
        </IconButton>
        <ButtonGroup classes={{ grouped: classes.toolButtonsGroup }}>
          {menuConfig['button-group'].map((button) => buttons[button])}
        </ButtonGroup>
        {menuConfig.menus.map((menu) => dropdowns[menu])}
        {menuConfig['custom-buttons']?.length ? (
          <ButtonGroup classes={{ grouped: classes.toolButtonsGroup }}>
            {menuConfig['custom-buttons'].map(({ id, icon, url }) => (
              <IconButton onClick={() => (window.location.href = url)} id={id}>
                <img src={`${process.env.PUBLIC_URL}/icons/${icon}`} alt="icon" />
              </IconButton>
            ))}
          </ButtonGroup>
        ) : undefined}
        <div className={classes.spacer}></div>
        {lastSyncTs || !lastSyncSuccessful ? (
          <div className={classNames(classes.toolbarMessage, { error: !lastSyncSuccessful })}>
            {lastSyncSuccessful ? getFormattedMessage(lastSyncTs) : 'System offline'}
          </div>
        ) : undefined}
      </Toolbar>
    </AppBar>
  );

  return renderContent();
};

function getFormattedMessage(time: number): string {
  return `Last saved: ${moment(time).format('HH:mm')}`;
}
