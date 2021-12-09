import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditorState, Transaction } from 'prosemirror-state';

import {
  getAbstract,
  getAcknowledgements,
  getBody,
  getImpactStatement,
  getKeywordGroups,
  getTitle
} from '../../selectors/manuscript.selectors';
import * as manuscriptActions from '../../actions/manuscript.actions';
import { RichTextEditor } from '../../components/rich-text-editor';
import * as manuscriptEditorActions from '../../actions/manuscript-editor.actions';
import { KeywordsEditor } from '../../components/keywords';
import { useManuscriptStyles } from './styles';
import { SortableAuthorsList } from './sortable-authors-list';
import { AuthorsInfoDetails } from './authors-info-details';
import { AffiliationsList } from './affiliations-list';
import { ReferenceList } from './references-list';
import { ArticleInformation } from './article-information';
import { getFocusedEditorStatePath } from '../../selectors/manuscript-editor.selectors';
import { RelatedArticles } from './related-articles';
import { ClearFocus } from './clear-focus';
import { Keyword, KeywordGroups } from '../../models/keyword';

const isInputFocused = (inputName: string, focusedPath?: string): boolean => {
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

  const handleKeywordsChange = (keywordGroup: string, id: string, diff: Transaction): void => {
    dispatch(manuscriptActions.updateKeywordAction({ keywordGroup, id, change: diff }));
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

  const handleKeywordDelete = useCallback(
    (keywordGroup: string, keyword: Keyword): void => {
      dispatch(manuscriptActions.deleteKeywordAction({ keywordGroup, keyword }));
    },
    [dispatch]
  );

  const handleKeywordAdd = useCallback(
    (keywordGroup: string, keyword: Keyword): void => {
      dispatch(manuscriptActions.addNewKeywordAction({ keywordGroup, keyword }));
    },
    [dispatch]
  );

  const handleFocusSwitch = useCallback(
    (state: EditorState, path: string) => {
      dispatch(manuscriptEditorActions.setFocusAction(path));
    },
    [dispatch]
  );

  const handleBlur = useCallback(() => {
    dispatch(manuscriptEditorActions.removeFocusAction());
  }, [dispatch]);

  const renderKeywords = (keywordGroups: KeywordGroups): JSX.Element[] => {
    return Object.entries(keywordGroups).map(([groupType, group]) => {
      return (
        <React.Fragment key={groupType}>
          <KeywordsEditor
            keywords={group.keywords}
            newKeyword={group.newKeyword}
            activeKeywordPath={focusedPath}
            name={groupType}
            label={group.title || 'Keywords'}
            onNewKeywordChange={handleNewKeywordChange}
            onAdd={handleKeywordAdd}
            onChange={handleKeywordsChange}
            onDelete={handleKeywordDelete}
            onFocus={handleFocusSwitch}
            onBlur={handleBlur}
          />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        </React.Fragment>
      );
    });
  };

  return (
    <div onClick={clearFocus} className={classes.contentWrapper} data-test-id="container-wrapper">
      <div aria-hidden="true" className={classes.toolbarPlaceholder} />
      <div className={classes.content}>
        <RichTextEditor
          editorState={title}
          label="Title"
          id="title"
          isActive={isInputFocused('title', focusedPath)}
          name="title"
          onChange={handleTitleChange}
          onFocus={handleFocusSwitch}
        />
        <ClearFocus>
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <SortableAuthorsList id="authors" />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <AffiliationsList id="affiliations" />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        </ClearFocus>
        <RichTextEditor
          editorState={abstract}
          label="Abstract"
          id="abstract"
          name="abstract"
          isActive={isInputFocused('abstract', focusedPath)}
          onChange={handleAbstractChange}
          onFocus={handleFocusSwitch}
        />
        <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        <RichTextEditor
          editorState={impactStatement}
          label="Impact statement"
          id="impactStatement"
          name="impactStatement"
          isActive={isInputFocused('impactStatement', focusedPath)}
          onChange={handleImpactStatementChange}
          onFocus={handleFocusSwitch}
        />
        <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        <RichTextEditor
          editorState={body}
          label="Main text"
          id="mainText"
          name="body"
          isActive={isInputFocused('body', focusedPath)}
          onChange={handleBodyChange}
          onFocus={handleFocusSwitch}
        />
        <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        <RichTextEditor
          editorState={acknowledgements}
          label="Acknowledgements"
          id="acknowledgements"
          name="acknowledgements"
          isActive={isInputFocused('acknowledgements', focusedPath)}
          onChange={handleAcknowledgementsChange}
          onFocus={handleFocusSwitch}
        />
        <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
        <ClearFocus>
          <ReferenceList id="references" />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <AuthorsInfoDetails id="author-details" />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          <ArticleInformation id="article-info" />
          <div aria-hidden="true" className={classes.spacer} onClick={clearFocus} />
          {renderKeywords(allKeywords)}
          <RelatedArticles id="related-articles" />
        </ClearFocus>
      </div>
    </div>
  );
};
