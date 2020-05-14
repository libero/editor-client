import { Manuscript } from '../models/manuscript';
import * as manuscriptActions from '../actions/manuscript.actions';
import {
  cloneManuscript,
  getInitialHistory,
  getInitialLoadableState,
  getLoadableStateError,
  getLoadableStateProgress,
  getLoadableStateSuccess,
  ManuscriptHistory
} from '../utils/state.utils';
import { ManuscriptHistoryState } from '../store';
import { redoChange, undoChange, updateManuscriptState } from '../utils/history.utils';
import { Transaction } from 'prosemirror-state';
import {
  KeywordAddPayload,
  KeywordDeletePayload,
  KeywordUpdatePayload,
  NewKeywordUpdatePayload
} from '../actions/manuscript.actions';
import { Action } from '../utils/action.utils';
import { createNewKeywordState } from '../models/manuscript-state.factory';

const initialState = getInitialLoadableState() as ManuscriptHistoryState;

export function manuscriptReducer(
  state: ManuscriptHistoryState = initialState,
  action: manuscriptActions.ActionType
): ManuscriptHistoryState {
  switch (action.type) {
    case manuscriptActions.loadManuscriptAction.request.type:
      return {
        ...state,
        ...getLoadableStateProgress()
      };
    case manuscriptActions.loadManuscriptAction.success.type:
      return {
        ...state,
        ...getLoadableStateSuccess(getInitialHistory(action.payload as Manuscript))
      };

    case manuscriptActions.loadManuscriptAction.error.type:
      return {
        ...state,
        ...getLoadableStateError(action.payload as Error)
      };

    case manuscriptActions.updateTitleAction.type:
      return {
        ...state,
        data: updateManuscriptState(state.data, 'title', action.payload as Transaction)
      };

    case manuscriptActions.updateAbstractAction.type:
      return {
        ...state,
        data: updateManuscriptState(state.data, 'abstract', action.payload as Transaction)
      };

    case manuscriptActions.updateKeywordAction.type:
      const updatePayload = action.payload as KeywordUpdatePayload;
      const keywordPath = ['keywordGroups', updatePayload.keywordGroup, 'keywords', updatePayload.index].join('.');
      return {
        ...state,
        data: updateManuscriptState(state.data, keywordPath, updatePayload.change)
      };

    case manuscriptActions.updateNewKeywordAction.type:
      const newKeywordUpdatePayload = action.payload as NewKeywordUpdatePayload;
      const newKeywordPath = ['keywordGroups', newKeywordUpdatePayload.keywordGroup, 'newKeyword'].join('.');
      return {
        ...state,
        data: updateManuscriptState(state.data, newKeywordPath, newKeywordUpdatePayload.change)
      };

    case manuscriptActions.deleteKeywordAction.type:
      return {
        ...state,
        data: handleDeleteKeywordAction(state.data, action as Action<KeywordDeletePayload>)
      };

    case manuscriptActions.addNewKeywordAction.type:
      return {
        ...state,
        data: handleAddNewKeywordAction(state.data, action as Action<KeywordAddPayload>)
      };

    case manuscriptActions.undoAction.type:
      return {
        ...state,
        data: undoChange(state.data)
      };
    case manuscriptActions.redoAction.type:
      return {
        ...state,
        data: redoChange(state.data)
      };

    default:
      return state;
  }
}

function handleDeleteKeywordAction(state: ManuscriptHistory, action: Action<KeywordDeletePayload>): ManuscriptHistory {
  const { keywordGroup, index } = action.payload as KeywordDeletePayload;
  const newManuscript = cloneManuscript(state.present);
  newManuscript.keywordGroups[keywordGroup].keywords.splice(index, 1);
  const newDiff = {
    [`keywordGroups.${keywordGroup}`]: state.present.keywordGroups[keywordGroup]
  };

  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}

function handleAddNewKeywordAction(state: ManuscriptHistory, action: Action<KeywordAddPayload>): ManuscriptHistory {
  const { keywordGroup, keyword } = action.payload as KeywordAddPayload;
  const newManuscript = cloneManuscript(state.present);
  newManuscript.keywordGroups[keywordGroup].keywords.push(keyword);
  newManuscript.keywordGroups[keywordGroup].newKeyword = createNewKeywordState();
  const newDiff = {
    [`keywordGroups.${keywordGroup}`]: state.present.keywordGroups[keywordGroup]
  };

  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}
