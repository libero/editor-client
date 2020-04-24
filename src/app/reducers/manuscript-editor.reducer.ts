import * as manuscriptActions from "../actions/manuscript.actions";
import {cloneManuscript, ManuscriptHistory} from "../utils/state.utils";
import {Transaction} from "prosemirror-state";
import {redoChange, undoChange, updateManuscriptState} from "../utils/history.utils";
import {KeywordDeletePayload, KeywordUpdatePayload} from "../actions/manuscript.actions";

export function manuscriptEditorReducer(state: ManuscriptHistory | undefined, action: manuscriptActions.ActionType): ManuscriptHistory {
  if (!state) {
    return state;
  }

  switch(action.type) {
    case manuscriptActions.updateTitleAction.type:
      return updateManuscriptState(state, 'title', action.payload as Transaction);

    case manuscriptActions.updateKeywordsAction.type:
      const updatePayload = action.payload as KeywordUpdatePayload;
      const keywordPath = ['keywords', updatePayload.keywordGroup, updatePayload.index].join('.');
      return updateManuscriptState(state, keywordPath, updatePayload.change);

    case manuscriptActions.deleteKeywordAction.type:
      const deletePayload = action.payload as KeywordDeletePayload;
      const newManuscript = cloneManuscript(state.present);
      newManuscript.keywords[deletePayload.keywordGroup].splice(deletePayload.index, 1);
      const newDiff = {
        [`keywords.${deletePayload.keywordGroup}`]: state.present.keywords[deletePayload.keywordGroup]
      }
      return {
        past: [...state.past, newDiff],
        present: newManuscript,
        future: []
      };

    case manuscriptActions.undoAction.type:
      return undoChange(state);
    case manuscriptActions.redoAction.type:
      return redoChange(state);
    default:
      return state;
  }
}
