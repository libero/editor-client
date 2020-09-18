import React, { useCallback, SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditorState, Transaction } from 'prosemirror-state';

import {
  getAbstract,
  getAcknowledgements,
  getBody,
  getImpactStatement,
  getKeywordGroups,
  getTitle
} from 'app/selectors/manuscript.selectors';
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
  const body: EditorState = useSelector(getBody);
  const acknowledgements: EditorState = useSelector(getAcknowledgements);
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
    dispatch(manuscriptEditorActions.removeFocusAction());
  }, [dispatch]);

  const preventClick = useCallback((event: SyntheticEvent) => {
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

  const handleAcknowledgementsChange = useCallback(
    (diff: Transaction): void => {
      dispatch(manuscriptActions.updateAcknowledgementsAction(diff));
    },
    [dispatch]
  );

  const handleBodyChange = useCallback(
    (diff: Transaction): void => {
      dispatch(manuscriptActions.updateBodyAction(diff));
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

  const handleKeywordFocus = useCallback(
    (group: string, index: number | undefined, isNewKeywordFocused: boolean): void => {
      const kwdIndexPath = isNewKeywordFocused ? 'newKeyword' : `keywords.${index}`;
      handleFocusSwitch(null, ['keywordGroups', group, kwdIndexPath].join('.'));
    },
    [handleFocusSwitch]
  );

  const renderKeywords = (keywordGroups: KeywordGroups): JSX.Element[] => {
    return Object.entries(keywordGroups).map(([groupType, group]) => {
      return (
        <>
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
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        </>
      );
    });
  };

  return (
    <div onClick={clearFocus} className={classes.contentWrapper} data-test-id="container-wrapper">
      <div aria-hidden="true" className={classes.toolbarPlaceholder} />
      <div className={classes.content} onClick={preventClick}>
        <RichTextEditor
          editorState={title}
          label="Title"
          id="title"
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
          id="abstract"
          name="abstract"
          isActive={isInputFocused('abstract', focusedPath)}
          onChange={handleAbstractChange}
          onFocusSwitch={handleFocusSwitch}
        />
        <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        <RichTextEditor
          editorState={impactStatement}
          label="Impact statement"
          id="impactStatement"
          name="impactStatement"
          isActive={isInputFocused('impactStatement', focusedPath)}
          onChange={handleImpactStatementChange}
          onFocusSwitch={handleFocusSwitch}
        />
        <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        <RichTextEditor
          editorState={body}
          label="Main text"
          id="mainBody"
          name="body"
          isActive={isInputFocused('body', focusedPath)}
          onChange={handleBodyChange}
          onFocusSwitch={handleFocusSwitch}
        />
        <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        <RichTextEditor
          editorState={acknowledgements}
          label="Acknowledgements"
          id="acknowledgements"
          name="acknowledgements"
          isActive={isInputFocused('acknowledgements', focusedPath)}
          onChange={handleAcknowledgementsChange}
          onFocusSwitch={handleFocusSwitch}
        />
        <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        <ClearFocus>
          <ReferenceList />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <AuthorsInfoDetails />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <ArticleInformation />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          {renderKeywords(allKeywords)}
          <RelatedArticles />
        </ClearFocus>
      </div>
    </div>
  );
};
