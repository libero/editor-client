import React, { useCallback, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditorState, Transaction } from 'prosemirror-state';

import { getAbstract, getImpactStatement, getKeywordGroups, getTitle } from 'app/selectors/manuscript.selectors';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { RichTextEditor } from 'app/components/rich-text-editor';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { KeywordsEditor } from 'app/components/keywords';
import { KeywordGroups } from 'app/models/manuscript';
import { useManuscriptStyles } from './styles';
import { SortableAuthorsList } from './sortable-authors-list';
import { AuthorsInfoDetails } from 'app/containers/manuscript/authors-info-details';
import { AffiliationsList } from 'app/containers/manuscript/affiliations-list';
import { ReferenceList } from 'app/containers/manuscript/references-list';
import { ArticleInformation } from 'app/containers/manuscript/article-information';
import { getFocusedEditorStatePath } from 'app/selectors/manuscript-editor.selectors';
import { RelatedArticles } from 'app/containers/manuscript/related-articles';
import { ClearFocus } from 'app/containers/manuscript/clear-focus';

const isInputFocused = (inputName: string, focusedPath?: string) => {
  return Boolean(focusedPath) && focusedPath.startsWith(inputName);
};

export const ManuscriptEditor: React.FC = () => {
  const classes = useManuscriptStyles();
  const dispatch = useDispatch();

  const title: EditorState = useSelector(getTitle);
  const abstract: EditorState = useSelector(getAbstract);
  const impactStatement: EditorState = useSelector(getImpactStatement);
  const focusedPath = useSelector(getFocusedEditorStatePath);
  const allKeywords: KeywordGroups = useSelector(getKeywordGroups);

  const handleTitleChange = useCallback(
    (diff: Transaction) => {
      dispatch(manuscriptActions.updateTitleAction(diff));
    },
    [dispatch]
  );

  const clearFocus = useCallback(() => {
    console.log('clear focus');
    dispatch(manuscriptEditorActions.removeFocusAction());
  }, [dispatch]);

  const preventClick = useCallback((event: SyntheticEvent) => {
    console.log('prevent click');
    event.stopPropagation();
    event.preventDefault();
  }, []);

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

  const handleImpactStatementChange = useCallback(
    (diff: Transaction): void => {
      dispatch(manuscriptActions.updateImpactStatementAction(diff));
    },
    [dispatch]
  );

  const handleKeywordDelete = (keywordGroup: string, index: number): void => {
    dispatch(manuscriptActions.deleteKeywordAction({ keywordGroup, index }));
  };

  const handleKeywordAdd = (keywordGroup: string, keyword: EditorState): void => {
    dispatch(manuscriptActions.addNewKeywordAction({ keywordGroup, keyword }));
  };

  const handleFocusSwitch = useCallback(
    (state: EditorState, path: string) => {
      dispatch(manuscriptEditorActions.setFocusAction(path));
    },
    [dispatch]
  );

  const handleBlur = useCallback(() => {
    dispatch(manuscriptEditorActions.removeFocusAction());
  }, [dispatch]);

  const handleKeywordFocus = (group: string, index: number | undefined, isNewKeywordFocused: boolean): void => {
    const kwdIndexPath = isNewKeywordFocused ? 'newKeyword' : `keywords.${index}`;
    handleFocusSwitch(null, ['keywordGroups', group, kwdIndexPath].join('.'));
  };

  const renderKeywords = (keywordGroups: KeywordGroups): JSX.Element[] => {
    return Object.entries(keywordGroups).map(([groupType, group]) => {
      return (
        <KeywordsEditor
          key={groupType}
          keywords={group.keywords}
          newKeyword={group.newKeyword}
          activeKeywordPath={focusedPath}
          name={groupType}
          label={group.title || 'Keywords'}
          onNewKeywordChange={handleNewKeywordChange}
          onAdd={handleKeywordAdd}
          onChange={handleKeywordsChange}
          onDelete={handleKeywordDelete}
          onFocusSwitch={handleKeywordFocus}
          onBlur={handleBlur}
        />
      );
    });
  };

  return (
    <div onClick={clearFocus} className={classes.contentWrapper}>
      <div aria-hidden="true" className={classes.toolbarPlaceholder} />
      <div className={classes.content} onClick={preventClick}>
        <RichTextEditor
          editorState={title}
          label="Title"
          isActive={isInputFocused('title', focusedPath)}
          name="title"
          onChange={handleTitleChange}
          onFocusSwitch={handleFocusSwitch}
        />
        <ClearFocus>
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <SortableAuthorsList />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <AffiliationsList />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        </ClearFocus>
        <RichTextEditor
          editorState={abstract}
          label="Abstract"
          name="abstract"
          isActive={isInputFocused('abstract', focusedPath)}
          onChange={handleAbstractChange}
          onFocusSwitch={handleFocusSwitch}
        />
        <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        <RichTextEditor
          editorState={impactStatement}
          label="Impact statement"
          name="impactStatement"
          isActive={isInputFocused('impactStatement', focusedPath)}
          onChange={handleImpactStatementChange}
          onFocusSwitch={handleFocusSwitch}
        />
        <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        {renderKeywords(allKeywords)}
        <ClearFocus>
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <ArticleInformation />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <RelatedArticles />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <AuthorsInfoDetails />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <ReferenceList />
        </ClearFocus>
      </div>
    </div>
  );
};
