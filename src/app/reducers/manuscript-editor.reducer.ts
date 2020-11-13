import { createReducer } from 'redux-act';
import * as manuscriptEditorAction from 'app/actions/manuscript-editor.actions';
import { ManuscriptEditorState } from 'app/store';

const initialState: ManuscriptEditorState = {
  focusedManuscriptPath: undefined,
  manuscriptBodyTOC: [],
  manuscriptId: '',
  lastSyncTimestamp: 0,
  modal: {
    isVisible: false
  }
};

export const manuscriptEditorReducer = createReducer<ManuscriptEditorState>({}, initialState);

manuscriptEditorReducer.on(manuscriptEditorAction.updateFocusPathAction, (state, payload) => ({
  ...state,
  focusedManuscriptPath: payload
}));

manuscriptEditorReducer.on(manuscriptEditorAction.setBodyTOCAction, (state, payload) => ({
  ...state,
  manuscriptBodyTOC: payload
}));

manuscriptEditorReducer.on(manuscriptEditorAction.removeFocusAction, (state) => ({
  ...state,
  focusedManuscriptPath: undefined
}));

manuscriptEditorReducer.on(manuscriptEditorAction.showModalDialog, (state, payload) => ({
  ...state,
  modal: {
    params: payload,
    isVisible: true,
    focusedManuscriptPath: undefined
  }
}));

manuscriptEditorReducer.on(manuscriptEditorAction.hideModalDialog, (state: ManuscriptEditorState) => ({
  ...state,
  modal: {
    isVisible: false
  }
}));

manuscriptEditorReducer.on(manuscriptEditorAction.setLastSyncTimestamp, (state, payload) => ({
  ...state,
  lastSyncTimestamp: payload
}));

manuscriptEditorReducer.on(manuscriptEditorAction.setManuscriptId, (state, payload) => ({
  ...state,
  manuscriptId: payload
}));
