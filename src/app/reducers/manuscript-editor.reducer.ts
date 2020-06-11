import { createReducer } from 'redux-act';
import * as manuscriptEditorAction from 'app/actions/manuscript-editor.actions';
import { ManuscriptEditorState } from 'app/store';

const initialState: ManuscriptEditorState = {
  focusedManuscriptPath: undefined,
  modal: {
    isVisible: false
  }
};

export const manuscriptEditorReducer = createReducer<ManuscriptEditorState>({}, initialState);

manuscriptEditorReducer.on(manuscriptEditorAction.setFocusAction, (state, payload) => ({
  ...state,
  focusedManuscriptPath: payload
}));

manuscriptEditorReducer.on(manuscriptEditorAction.removeFocusAction, (state) => ({
  ...state,
  focusedManuscriptPath: undefined
}));

manuscriptEditorReducer.on(manuscriptEditorAction.showModalDialog, (state, payload) => ({
  ...state,
  modal: {
    params: payload,
    isVisible: true
  }
}));

manuscriptEditorReducer.on(manuscriptEditorAction.hideModalDialog, (state) => ({
  ...state,
  modal: {
    isVisible: false
  }
}));
