import * as manuscriptActions from "../actions/manuscript.actions";
import {ManuscriptHistory} from "../utils/state.utils";
import {Transaction} from "prosemirror-state";
import {redoPreviousChange, undoPreviousChange, updateManuscriptState} from "../utils/history.utils";

export function manuscriptEditorReducer(state: ManuscriptHistory | undefined, action: manuscriptActions.ActionType): ManuscriptHistory {
  if (!state) {
    return state;
  }

  switch(action.type) {
    case manuscriptActions.updateTitleAction.type:
      return updateManuscriptState(state, 'title', action.payload as Transaction)
    case manuscriptActions.undoAction.type:
      return undoPreviousChange(state);
    case manuscriptActions.redoAction.type:
      return redoPreviousChange(state);
    default:
      return state;
  }
}
