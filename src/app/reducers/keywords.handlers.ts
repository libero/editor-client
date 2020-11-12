import { cloneManuscript } from 'app/utils/state.utils';
import {
  KeywordAddPayload,
  KeywordDeletePayload,
  KeywordUpdatePayload,
  NewKeywordUpdatePayload
} from 'app/actions/manuscript.actions';
import { createNewKeywordState } from 'app/models/manuscript-state.factory';
import { ManuscriptHistoryState } from 'app/store';
import { createDiff, updateManuscriptState } from 'app/utils/history.utils';
import { ManuscriptDiff } from 'app/models/manuscript';

export function deleteKeyword(state: ManuscriptHistoryState, payload: KeywordDeletePayload): ManuscriptHistoryState {
  const { keywordGroup, index } = payload;
  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.keywordGroups[keywordGroup].keywords.splice(index, 1);
  const newDiff: ManuscriptDiff = createDiff({
    [`keywordGroups.${keywordGroup}`]: state.data.present.keywordGroups[keywordGroup]
  });

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}

export function addKeyword(state: ManuscriptHistoryState, payload: KeywordAddPayload): ManuscriptHistoryState {
  const { keywordGroup, keyword } = payload;
  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.keywordGroups[keywordGroup].keywords.push(keyword);
  newManuscript.keywordGroups[keywordGroup].newKeyword = createNewKeywordState();
  const newDiff: ManuscriptDiff = createDiff({
    [`keywordGroups.${keywordGroup}`]: state.data.present.keywordGroups[keywordGroup]
  });

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}

export function updateKeyword(state: ManuscriptHistoryState, payload: KeywordUpdatePayload): ManuscriptHistoryState {
  const keywordPath = ['keywordGroups', payload.keywordGroup, 'keywords', payload.index].join('.');
  return {
    ...state,
    data: updateManuscriptState(state.data, keywordPath, payload.change)
  };
}

export function updateNewKeyword(
  state: ManuscriptHistoryState,
  payload: NewKeywordUpdatePayload
): ManuscriptHistoryState {
  const newKeywordPath = ['keywordGroups', payload.keywordGroup, 'newKeyword'].join('.');
  return {
    ...state,
    data: updateManuscriptState(state.data, newKeywordPath, payload.change)
  };
}
