import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAbstract, getKeywords, getTitle } from '../../selectors/manuscript.selectors';
import * as manuscriptActions from '../../actions/manuscript.actions';
import * as manuscriptEditorActions from '../../actions/manuscript-editor.actions';
import { RichTextEditor } from '../../components/rich-text-editor';

import { EditorState, Transaction } from 'prosemirror-state';
import { KeywordsEditor } from '../../components/keywords';
import { KeywordGroups } from '../../models/manuscript';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export const ManuscriptEditor: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const title: EditorState = useSelector(getTitle);
  const abstract: EditorState = useSelector(getAbstract);
  const allKeywords: KeywordGroups = useSelector(getKeywords);

  const handleTitleChange = (diff: Transaction) => {
    dispatch(manuscriptActions.updateTitleAction(diff));
  };

  const handleKeywordsChange = (keywordGroup: string, index: number, diff: Transaction) => {
    dispatch(manuscriptActions.updateKeywordsAction({ keywordGroup, index, change: diff }));
  };

  const handleAbstractChange = (diff: Transaction) => {
    dispatch(manuscriptActions.updateAbstractAction(diff));
  };

  const handleKeywordDelete = (keywordGroup: string, index: number) => {
    dispatch(manuscriptActions.deleteKeywordAction({ keywordGroup, index }));
  };

  const handleKeywordAdd = (keywordGroup: string, keyword: EditorState) => {
    dispatch(manuscriptActions.addNewKeywordAction({ keywordGroup, keyword }));
  };

  const handleFocus = (manuscriptFieldPath: string) => {
    dispatch(manuscriptEditorActions.setFocusAction(manuscriptFieldPath));
  };

  const handleBlur = () => {
    dispatch(manuscriptEditorActions.removeFocusAction());
  };

  const handleKeywordFocus = (group: string, index: number) => {
    handleFocus(['keywords', group, index].join('.'));
  };

  const renderKeywords = (keywordGroups: KeywordGroups) => {
    return Object.entries(keywordGroups).map(([groupType, keywords]) => {
      return (
        <div className="manuscript-field" key={groupType}>
          <KeywordsEditor
            keywords={keywords}
            label={groupType}
            onAdd={handleKeywordAdd.bind(null, groupType)}
            onChange={handleKeywordsChange.bind(null, groupType)}
            onDelete={handleKeywordDelete.bind(null, groupType)}
            onFocus={handleKeywordFocus.bind(null, groupType)}
            onBlur={handleBlur}
          />
        </div>
      );
    });
  };

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Container maxWidth="md">
        <div className="manuscript-field">
          <RichTextEditor
            editorState={title}
            label="Title"
            onChange={handleTitleChange}
            onFocus={handleFocus.bind(null, 'title')}
            onBlur={handleBlur}
          />
        </div>
        <div className="manuscript-field">
          <RichTextEditor
            editorState={abstract}
            label="Abstract"
            onChange={handleAbstractChange}
            onFocus={handleFocus.bind(null, 'abstract')}
            onBlur={handleBlur}
          />
        </div>
        {renderKeywords(allKeywords)}
      </Container>
    </main>
  );
};
