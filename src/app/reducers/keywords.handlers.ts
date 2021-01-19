import { v4 as uuidv4 } from 'uuid';

import {
  KeywordAddPayload,
  KeywordDeletePayload,
  KeywordUpdatePayload,
  NewKeywordUpdatePayload
} from 'app/actions/manuscript.actions';
import { ManuscriptHistoryState } from 'app/store';
import { updateManuscriptState } from 'app/utils/history.utils';
import { AddObjectChange } from 'app/utils/history/add-object-change';
import { ProsemirrorChange } from 'app/utils/history/prosemirror-change';
import { UpdateObjectChange } from 'app/utils/history/update-object-change';
import { BatchChange } from 'app/utils/history/batch-change';
import { DeleteObjectChange } from 'app/utils/history/delete-object-change';

export function deleteKeyword(state: ManuscriptHistoryState, payload: KeywordDeletePayload): ManuscriptHistoryState {
  const { keywordGroup, keyword } = payload;
  const change = new DeleteObjectChange(`keywordGroups.${keywordGroup}.keywords`, keyword, 'id');

  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
      future: []
    }
  };
}

export function addKeyword(state: ManuscriptHistoryState, payload: KeywordAddPayload): ManuscriptHistoryState {
  const { keywordGroup, keyword } = payload;
  const insertKeywordChange = new AddObjectChange(`keywordGroups.${keywordGroup}.keywords`, keyword, 'id');

  const newKeywordSection = state.data.present.keywordGroups[keywordGroup].newKeyword;
  const updateIdChange = new UpdateObjectChange(`keywordGroups.${keywordGroup}.newKeyword`, newKeywordSection, {
    id: uuidv4(),
    content: newKeywordSection.content
  });

  const clearKeywordTransaction = newKeywordSection.content.tr;
  clearKeywordTransaction.insertText('', 0, newKeywordSection.content.doc.content.size);

  const clearNewKeywordChange = new ProsemirrorChange(
    `keywordGroups.${keywordGroup}.newKeyword.content`,
    clearKeywordTransaction
  );

  const change = new BatchChange([insertKeywordChange, updateIdChange, clearNewKeywordChange]);
  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
      future: []
    }
  };
}

export function updateKeyword(state: ManuscriptHistoryState, payload: KeywordUpdatePayload): ManuscriptHistoryState {
  const index = state.data.present.keywordGroups[payload.keywordGroup].keywords.findIndex(
    (kwd) => kwd.id === payload.id
  );
  const keywordPath = ['keywordGroups', payload.keywordGroup, 'keywords', index, 'content'].join('.');
  return {
    ...state,
    data: updateManuscriptState(state.data, keywordPath, payload.change)
  };
}

export function updateNewKeyword(
  state: ManuscriptHistoryState,
  payload: NewKeywordUpdatePayload
): ManuscriptHistoryState {
  const newKeywordPath = ['keywordGroups', payload.keywordGroup, 'newKeyword', 'content'].join('.');
  return {
    ...state,
    data: updateManuscriptState(state.data, newKeywordPath, payload.change)
  };
}
