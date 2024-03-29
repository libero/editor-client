import { Transaction, TextSelection } from 'prosemirror-state';
import { all, takeLatest, put, select, call, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import * as manuscriptEditorActions from '../actions/manuscript-editor.actions';
import * as manuscriptActions from '../actions/manuscript.actions';
import { Action } from '../utils/action.utils';
import {
  getExportTask,
  getFocusedEditorState,
  getFocusedEditorStatePath,
  getManuscriptId
} from '../selectors/manuscript-editor.selectors';
import { cancelManuscriptExport, getManuscriptExportStatus, startManuscriptExport } from '../api/manuscript.api';
import { PDF_TASK_STATUSES } from '../store';
import { LocalStorageApi } from '../api/local-storage.api';

const POLL_INTERVAL = 5000;

function createPollingEventChannel(delay: number) {
  return eventChannel((emitter) => {
    const interval = setInterval(() => {
      emitter(0);
    }, delay);

    return () => clearInterval(interval);
  });
}

export function* setFocusSaga(action: Action<string>) {
  const focusedEditorState = yield select(getFocusedEditorState);
  const path = yield select(getFocusedEditorStatePath);
  yield put(manuscriptEditorActions.updateFocusPathAction(action.payload));

  if (focusedEditorState && !focusedEditorState.selection.empty) {
    const change: Transaction = focusedEditorState.tr;
    change.setSelection(new TextSelection(focusedEditorState.doc.resolve(0)));
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export function* exportPdfSaga() {
  const articleId = yield select(getManuscriptId);
  const taskId = yield call(startManuscriptExport, articleId);
  yield put(manuscriptEditorActions.setActiveExportPdfTask(taskId));
}

export function* pollExportPdfStatusSaga() {
  const channel = yield call(createPollingEventChannel, POLL_INTERVAL);
  yield takeEvery(channel, function* () {
    const { taskId } = yield select(getExportTask);
    if (taskId) {
      const status = yield call(getManuscriptExportStatus, taskId);
      if (status === PDF_TASK_STATUSES.PDF_EXPORT_ERROR || status === PDF_TASK_STATUSES.PDF_EXPORT_SUCCESS) {
        yield put(manuscriptEditorActions.updateExportPdfStatus(status));
        channel.close();
        LocalStorageApi.remove(LocalStorageApi.EXPORT_TASK_KEY);
      } else {
        LocalStorageApi.set(LocalStorageApi.EXPORT_TASK_KEY, taskId);
      }
    }
  });
}

export function* cancelPdfExportSaga() {
  const articleId = yield select(getManuscriptId);
  yield call(cancelManuscriptExport, articleId);
}

export default function* () {
  yield all([takeLatest(manuscriptEditorActions.setFocusAction.getType(), setFocusSaga)]);
  yield all([takeLatest(manuscriptEditorActions.exportPdfAction.getType(), exportPdfSaga)]);
  yield all([takeLatest(manuscriptEditorActions.setActiveExportPdfTask.getType(), pollExportPdfStatusSaga)]);
  yield all([takeLatest(manuscriptEditorActions.cancelExportPdfTask.getType(), cancelPdfExportSaga)]);
}
