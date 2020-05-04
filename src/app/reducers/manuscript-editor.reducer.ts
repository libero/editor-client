import * as manuscriptEditorAction from '../actions/manuscript-editor.actions';
import { ManuscriptEditorState } from '../store';

const initialState: ManuscriptEditorState = {
  focusedManuscriptPath: undefined
};

export function manuscriptEditorReducer(
  state: ManuscriptEditorState = initialState,
  action: manuscriptEditorAction.ActionType
): ManuscriptEditorState {
  switch (action.type) {
    case manuscriptEditorAction.setFocusAction.type:
      return {
        ...state,
        focusedManuscriptPath: action.payload as string
      };

    case manuscriptEditorAction.removeFocusAction.type:
      return {
        ...state,
        focusedManuscriptPath: undefined
      };
  }

  return state;
}
