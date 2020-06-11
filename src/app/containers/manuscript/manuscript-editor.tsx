import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAbstract, getKeywordGroups, getTitle } from 'app/selectors/manuscript.selectors';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { RichTextEditor } from 'app/components/rich-text-editor';

import { EditorState, Transaction } from 'prosemirror-state';
import { KeywordGroups } from 'app/models/manuscript';
import { useManuscriptStyles } from './styles';
import { SortableAuthorsList } from './sortable-authors-list';
import { AuthorsInfoDetails } from 'app/containers/manuscript/authors-info-details';
import { AffiliationsList } from 'app/containers/manuscript/affiliations-list';
import { KeywordGroupSections } from './keyword-group-seciton';

export const ManuscriptEditor: React.FC = () => {
  const classes = useManuscriptStyles();
  const dispatch = useDispatch();

  const title: EditorState = useSelector(getTitle);
  const abstract: EditorState = useSelector(getAbstract);
  const keywordGroups: KeywordGroups = useSelector(getKeywordGroups);

  const handleTitleChange = useCallback(
    (diff: Transaction) => {
      dispatch(manuscriptActions.updateTitleAction(diff));
    },
    [dispatch]
  );

  const handleAbstractChange = useCallback(
    (diff: Transaction): void => {
      dispatch(manuscriptActions.updateAbstractAction(diff));
    },
    [dispatch]
  );

  const handleFocus = useCallback(
    (state: EditorState, name: string) => {
      dispatch(manuscriptEditorActions.setFocusAction(name));
    },
    [dispatch]
  );

  const handleBlur = useCallback(() => {
    dispatch(manuscriptEditorActions.removeFocusAction());
  }, [dispatch]);

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
        onChange={handleAbstractChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <KeywordGroupSections keywordGroups={keywordGroups} />
      <AuthorsInfoDetails />
    </div>
  );
};
