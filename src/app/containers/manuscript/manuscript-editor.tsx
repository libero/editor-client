import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAbstract, getKeywords, getTitle } from '../../selectors/manuscript.selectors';
import * as manuscriptActions from '../../actions/manuscript.actions';
import * as manuscriptEditorActions from '../../actions/manuscript-editor.actions';
import { RichTextEditor } from '../../components/rich-text-editor';

import { EditorState, Transaction } from 'prosemirror-state';
import { KeywordsEditor } from '../../components/keywords';
import { KeywordGroups } from '../../models/manuscript';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

import { tocWidth } from './manuscript-toc';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    ...theme.mixins.toolbar
  },
  drawerPaper: {
    width: tocWidth
  },
  content: {
    flexGrow: 1,
    padding: 0
  },
  field: {
    padding: '20px 0'
  }
}));

export const ManuscriptEditor: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const title: EditorState = useSelector(getTitle);
  const abstract: EditorState = useSelector(getAbstract);
  const allKeywords: KeywordGroups = useSelector(getKeywords);

  const handleTitleChange = (diff: Transaction): void => {
    dispatch(manuscriptActions.updateTitleAction(diff));
  };

  const handleKeywordsChange = (keywordGroup: string, index: number, diff: Transaction): void => {
    dispatch(manuscriptActions.updateKeywordsAction({ keywordGroup, index, change: diff }));
  };

  const handleAbstractChange = (diff: Transaction): void => {
    dispatch(manuscriptActions.updateAbstractAction(diff));
  };

  const handleKeywordDelete = (keywordGroup: string, index: number): void => {
    dispatch(manuscriptActions.deleteKeywordAction({ keywordGroup, index }));
  };

  const handleKeywordAdd = (keywordGroup: string, keyword: EditorState): void => {
    dispatch(manuscriptActions.addNewKeywordAction({ keywordGroup, keyword }));
  };

  const handleFocus = (manuscriptFieldPath: string): void => {
    dispatch(manuscriptEditorActions.setFocusAction(manuscriptFieldPath));
  };

  const handleBlur = (): void => {
    dispatch(manuscriptEditorActions.removeFocusAction());
  };

  const handleKeywordFocus = (group: string, index: number): void => {
    handleFocus(['keywords', group, index].join('.'));
  };

  const renderKeywords = (keywordGroups: KeywordGroups): JSX.Element[] => {
    return Object.entries(keywordGroups).map(([groupType, keywords]) => {
      return (
        <div className={classes.field} key={groupType}>
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
        <div className={classes.field}>
          <RichTextEditor
            editorState={title}
            label="Title"
            onChange={handleTitleChange}
            onFocus={handleFocus.bind(null, 'title')}
            onBlur={handleBlur}
          />
        </div>
        <div className={classes.field}>
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
