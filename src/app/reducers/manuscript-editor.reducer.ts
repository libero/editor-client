import * as manuscriptActions from '../actions/manuscript.actions';
import { cloneManuscript, ManuscriptHistory } from '../utils/state.utils';
import { Transaction } from 'prosemirror-state';
import { redoChange, undoChange, updateManuscriptState } from '../utils/history.utils';
import { KeywordAddPayload, KeywordDeletePayload, KeywordUpdatePayload } from '../actions/manuscript.actions';
import { Action } from '../utils/action.utils';

export function manuscriptEditorReducer(
  state: ManuscriptHistory | undefined,
  action: manuscriptActions.ActionType
): ManuscriptHistory {
  if (!state) {
    return state;
  }

  switch (action.type) {
    case manuscriptActions.updateTitleAction.type:
      return updateManuscriptState(state, 'title', action.payload as Transaction);
    case manuscriptActions.updateAbstractAction.type:
      return updateManuscriptState(state, 'abstract', action.payload as Transaction);

    case manuscriptActions.updateKeywordsAction.type:
      const updatePayload = action.payload as KeywordUpdatePayload;
      const keywordPath = ['keywords', updatePayload.keywordGroup, updatePayload.index].join('.');
      return updateManuscriptState(state, keywordPath, updatePayload.change);

    case manuscriptActions.deleteKeywordAction.type:
      return handleDeleteKeywordAction(state, action as Action<KeywordDeletePayload>);

    case manuscriptActions.addNewKeywordAction.type:
      return handleAddNewKeywordAction(state, action as Action<KeywordAddPayload>);

    case manuscriptActions.undoAction.type:
      return undoChange(state);
    case manuscriptActions.redoAction.type:
      return redoChange(state);
    default:
      return state;
  }
}

function handleDeleteKeywordAction(state: ManuscriptHistory, action: Action<KeywordDeletePayload>): ManuscriptHistory {
  const { keywordGroup, index } = action.payload as KeywordDeletePayload;
  const newManuscript = cloneManuscript(state.present);
  newManuscript.keywords[keywordGroup].splice(index, 1);
  const newDiff = {
    [`keywords.${keywordGroup}`]: state.present.keywords[keywordGroup]
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
  newManuscript.keywords[keywordGroup].push(keyword);
  const newDiff = {
    [`keywords.${keywordGroup}`]: state.present.keywords[keywordGroup]
  };

  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}
