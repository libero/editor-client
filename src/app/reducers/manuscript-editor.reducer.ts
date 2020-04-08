import {Manuscript} from "../models/manuscript";
import * as manuscriptActions from "../actions/manuscript.actions";
import {EditorState} from "prosemirror-state";

export function manuscriptEditorReducer(state: Manuscript | undefined, action: manuscriptActions.ActionType): Manuscript {
  if (!state) {
    return state;
  }

  switch(action.type) {
    case manuscriptActions.updateTitle.type:
      return {
        ...state,
        title: action.payload as EditorState
      }

    default:
      return state;
  }
}