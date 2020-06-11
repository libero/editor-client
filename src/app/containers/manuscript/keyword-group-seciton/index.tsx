import React, { useCallback } from 'react';
import { KeywordGroups } from 'app/models/manuscript';
import { KeywordsEditor } from 'app/containers/manuscript/keyword-group-seciton/keywords-editor';
import { memoizeBind } from 'app/utils/memoize-bind';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { useDispatch } from 'react-redux';
import { Transaction, EditorState } from 'prosemirror-state';
import { isEqual } from 'lodash';

interface KeywordGroupsSectionsProps {
  keywordGroups: KeywordGroups;
}

export const KeywordGroupSections: React.FC<KeywordGroupsSectionsProps> = React.memo(({ keywordGroups }) => {
  const dispatch = useDispatch();

  const handleBlur = useCallback(() => {
    dispatch(manuscriptEditorActions.removeFocusAction());
  }, [dispatch]);

  const handleKeywordFocus = useCallback(
    (group: string, index: number | undefined, isNewKeywordFocused: boolean) => {
      const kwdIndexPath = isNewKeywordFocused ? 'newKeyword' : `keywords.${index}`;
      dispatch(manuscriptEditorActions.setFocusAction(['keywordGroups', group, kwdIndexPath].join('.')));
    },
    [dispatch]
  );

  const handleNewKeywordChange = useCallback(
    (keywordGroup: string, diff: Transaction): void => {
      dispatch(manuscriptActions.updateNewKeywordAction({ keywordGroup, change: diff }));
    },
    [dispatch]
  );

  const handleKeywordsChange = useCallback(
    (keywordGroup: string, index: number, diff: Transaction): void => {
      dispatch(manuscriptActions.updateKeywordAction({ keywordGroup, index, change: diff }));
    },
    [dispatch]
  );

  const handleKeywordDelete = useCallback(
    (keywordGroup: string, index: number): void => {
      dispatch(manuscriptActions.deleteKeywordAction({ keywordGroup, index }));
    },
    [dispatch]
  );

  const handleKeywordAdd = useCallback(
    (keywordGroup: string, keyword: EditorState): void => {
      dispatch(manuscriptActions.addNewKeywordAction({ keywordGroup, keyword }));
    },
    [dispatch]
  );

  return (
    <>
      {Object.entries(keywordGroups).map(([groupType, group]) => {
        return (
          <KeywordsEditor
            key={groupType}
            keywords={group.keywords}
            newKeyword={group.newKeyword}
            label={group.title || 'Keywords'}
            onNewKeywordChange={memoizeBind(handleNewKeywordChange, groupType)}
            onAdd={memoizeBind(handleKeywordAdd, groupType)}
            onChange={memoizeBind(handleKeywordsChange, groupType)}
            onDelete={memoizeBind(handleKeywordDelete, groupType)}
            onFocus={memoizeBind(handleKeywordFocus, groupType)}
            onBlur={handleBlur}
          />
        );
      })}
    </>
  );
}, isEqual);
