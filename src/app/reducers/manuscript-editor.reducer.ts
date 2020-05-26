import * as manuscriptEditorAction from 'app/actions/manuscript-editor.actions';
import { ManuscriptEditorState } from 'app/store';
import { ModalPayload } from 'app/actions/manuscript-editor.actions';

const initialState: ManuscriptEditorState = {
  focusedManuscriptPath: undefined,
  modal: {
    isVisible: false
  }
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

    case manuscriptEditorAction.showModalDialog.type:
      return {
        ...state,
        modal: {
          params: action.payload as ModalPayload,
          isVisible: true
        }
      };

    case manuscriptEditorAction.hideModalDialog.type:
      return {
        ...state,
        modal: { isVisible: false }
      };
  }

  return state;
}
