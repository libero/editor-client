import { createReducer } from 'redux-act';
import * as manuscriptEditorAction from '../actions/manuscript-editor.actions';
import { ManuscriptEditorState, PDF_TASK_STATUSES } from '../store';

const initialState: ManuscriptEditorState = {
  focusedManuscriptPath: undefined,
  manuscriptBodyTOC: [],
  manuscriptId: '',
  exportTask: undefined,
  lastSyncTimestamp: 0,
  lastSyncSuccessful: true,
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

manuscriptEditorReducer.on(manuscriptEditorAction.setActiveExportPdfTask, (state: ManuscriptEditorState, payload) => ({
  ...state,
  exportTask: {
    taskId: payload,
    status: PDF_TASK_STATUSES.PDF_EXPORT_RUNNING
  }
}));

manuscriptEditorReducer.on(manuscriptEditorAction.updateExportPdfStatus, (state: ManuscriptEditorState, payload) => ({
  ...state,
  exportTask: {
    ...state.exportTask,
    status: payload
  }
}));

manuscriptEditorReducer.on(manuscriptEditorAction.cancelExportPdfTask, (state: ManuscriptEditorState, payload) => ({
  ...state,
  exportTask: null
}));

manuscriptEditorReducer.on(manuscriptEditorAction.setLastSyncTimestamp, (state, payload) => ({
  ...state,
  lastSyncTimestamp: payload,
  lastSyncSuccessful: true
}));

manuscriptEditorReducer.on(manuscriptEditorAction.setLastSyncFailed, (state, payload) => ({
  ...state,
  lastSyncSuccessful: false
}));

manuscriptEditorReducer.on(manuscriptEditorAction.setManuscriptId, (state, payload) => ({
  ...state,
  manuscriptId: payload
}));
