import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAbstract, getKeywordGroups, getTitle } from 'app/selectors/manuscript.selectors';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { RichTextEditor } from 'app/components/rich-text-editor';

import { EditorState, Transaction } from 'prosemirror-state';
import { KeywordsEditor } from 'app/components/keywords';
import { KeywordGroups } from 'app/models/manuscript';
import { useManuscriptStyles } from './styles';
import { SortableAuthorsList } from './sortable-authors-list';
import { AuthorsInfoDetails } from 'app/containers/manuscript/authors-info-details';
import { AffiliationsList } from 'app/containers/manuscript/affiliations-list';

export const ManuscriptEditor: React.FC = () => {
  const classes = useManuscriptStyles();
  const dispatch = useDispatch();

  const title: EditorState = useSelector(getTitle);
  const abstract: EditorState = useSelector(getAbstract);
  const allKeywords: KeywordGroups = useSelector(getKeywordGroups);

  const handleTitleChange = useCallback(
    (diff: Transaction) => {
      dispatch(manuscriptActions.updateTitleAction(diff));
    },
    [dispatch]
  );

  const handleKeywordsChange = (keywordGroup: string, index: number, diff: Transaction): void => {
    dispatch(manuscriptActions.updateKeywordAction({ keywordGroup, index, change: diff }));
  };

  const handleNewKeywordChange = (keywordGroup: string, diff: Transaction): void => {
    dispatch(manuscriptActions.updateNewKeywordAction({ keywordGroup, change: diff }));
  };

  const handleAbstractChange = useCallback(
    (diff: Transaction): void => {
      dispatch(manuscriptActions.updateAbstractAction(diff));
    },
    [dispatch]
  );

  const handleKeywordDelete = (keywordGroup: string, index: number): void => {
    dispatch(manuscriptActions.deleteKeywordAction({ keywordGroup, index }));
  };

  const handleKeywordAdd = (keywordGroup: string, keyword: EditorState): void => {
    dispatch(manuscriptActions.addNewKeywordAction({ keywordGroup, keyword }));
  };

  const handleFocus = useCallback(
    (state: EditorState, name: string) => {
      dispatch(manuscriptEditorActions.setFocusAction(name));
    },
    [dispatch]
  );

  const handleBlur = useCallback(() => {
    dispatch(manuscriptEditorActions.removeFocusAction());
  }, [dispatch]);

  const handleKeywordFocus = (group: string, index: number | undefined, isNewKeywordFocused: boolean): void => {
    const kwdIndexPath = isNewKeywordFocused ? 'newKeyword' : `keywords.${index}`;
    handleFocus(null, ['keywordGroups', group, kwdIndexPath].join('.'));
  };

  const renderKeywords = (keywordGroups: KeywordGroups): JSX.Element[] => {
    return Object.entries(keywordGroups).map(([groupType, group]) => {
      return (
        <KeywordsEditor
          key={groupType}
          keywords={group.keywords}
          newKeyword={group.newKeyword}
          label={group.title || 'Keywords'}
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
        editorState={title}
        label="Title"
        name="title"
        onChange={handleTitleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <SortableAuthorsList />
      <AffiliationsList />
      <RichTextEditor
        editorState={abstract}
        label="Abstract"
        name="abstract"
        onChange={handleAbstractChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {renderKeywords(allKeywords)}
      <AuthorsInfoDetails />
    </div>
  );
};
