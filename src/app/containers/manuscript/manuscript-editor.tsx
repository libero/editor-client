import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAbstract, getKeywordGroups, getTitle } from '../../selectors/manuscript.selectors';
import * as manuscriptActions from '../../actions/manuscript.actions';
import * as manuscriptEditorActions from '../../actions/manuscript-editor.actions';
import { RichTextEditor } from '../../components/rich-text-editor';

import { EditorState, Transaction } from 'prosemirror-state';
import { KeywordsEditor } from '../../components/keywords';
import { KeywordGroups } from '../../models/manuscript';
import { useManuscriptStyles } from './styles';

export const ManuscriptEditor: React.FC = () => {
  const classes = useManuscriptStyles();
  const dispatch = useDispatch();

  const title: EditorState = useSelector(getTitle);
  const abstract: EditorState = useSelector(getAbstract);
  const allKeywords: KeywordGroups = useSelector(getKeywordGroups);

  const handleTitleChange = (diff: Transaction): void => {
    dispatch(manuscriptActions.updateTitleAction(diff));
  };

  const handleKeywordsChange = (keywordGroup: string, index: number, diff: Transaction): void => {
    dispatch(manuscriptActions.updateKeywordAction({ keywordGroup, index, change: diff }));
  };

  const handleNewKeywordChange = (keywordGroup: string, diff: Transaction): void => {
    dispatch(manuscriptActions.updateNewKeywordAction({ keywordGroup, change: diff }));
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

  const handleKeywordFocus = (group: string, index: string): void => {
    handleFocus(['keywordGroups', group, index].join('.'));
  };

  const renderKeywords = (keywordGroups: KeywordGroups): JSX.Element[] => {
    return Object.entries(keywordGroups).map(([groupType, group]) => {
      return (
        <KeywordsEditor
          key={groupType}
          keywords={group.keywords}
          newKeyword={group.newKeyword}
          className={classes.editorSection}
          label={groupType}
          onNewKeywordChange={handleNewKeywordChange.bind(null, groupType)}
          onAdd={handleKeywordAdd.bind(null, groupType)}
          onChange={handleKeywordsChange.bind(null, groupType)}
          onDelete={handleKeywordDelete.bind(null, groupType)}
          onFocus={handleKeywordFocus.bind(null, groupType)}
          onBlur={handleBlur}
        />
      );
    });
  };

  return (
    <div className={classes.content}>
      <div aria-hidden="true" className={classes.toolbarPlaceholder} />
      <RichTextEditor
        className={classes.editorSection}
        editorState={title}
        label="Title"
        onChange={handleTitleChange}
        onFocus={handleFocus.bind(null, 'title')}
        onBlur={handleBlur}
      />
      <RichTextEditor
        editorState={abstract}
        className={classes.editorSection}
        label="Abstract"
        onChange={handleAbstractChange}
        onFocus={handleFocus.bind(null, 'abstract')}
        onBlur={handleBlur}
      />
      {renderKeywords(allKeywords)}
    </div>
  );
};
