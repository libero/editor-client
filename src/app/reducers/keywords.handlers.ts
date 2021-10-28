import {
  KeywordAddPayload,
  KeywordDeletePayload,
  KeywordUpdatePayload,
  NewKeywordUpdatePayload
} from '../actions/manuscript.actions';
import { ManuscriptHistoryState } from '../store';
import { updateManuscriptState } from '../utils/history.utils';
import { AddObjectChange } from '../utils/history/add-object-change';
import { UpdateObjectChange } from '../utils/history/update-object-change';
import { BatchChange } from '../utils/history/batch-change';
import { DeleteObjectChange } from '../utils/history/delete-object-change';
import { Keyword } from '../models/keyword';

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
  const updateIdChange = UpdateObjectChange.createFromTwoObjects(
    `keywordGroups.${keywordGroup}.newKeyword`,
    newKeywordSection,
    new Keyword()
  );

  const change = new BatchChange([insertKeywordChange, updateIdChange]);
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
