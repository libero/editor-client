import { Transaction, TextSelection } from 'prosemirror-state';
import { all, takeLatest, put, select, call, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { Action } from 'app/utils/action.utils';
import {
  getExportTask,
  getFocusedEditorState,
  getFocusedEditorStatePath,
  getManuscriptId
} from 'app/selectors/manuscript-editor.selectors';
import { cancelManuscriptExport, getManuscriptExportStatus, startManuscriptExport } from 'app/api/manuscript.api';
import { PDF_EXPORT_ERROR, PDF_EXPORT_SUCCESS } from 'app/store';

const POLL_INTERVAL = 1000;

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

  const channel = yield call(createPollingEventChannel, POLL_INTERVAL);
  yield takeEvery(channel, function* () {
    const { taskId } = yield select(getExportTask);
    if (taskId) {
      const status = yield call(getManuscriptExportStatus, taskId);
      if (status === PDF_EXPORT_ERROR || status === PDF_EXPORT_SUCCESS) {
        yield put(manuscriptEditorActions.updateExportPdfStatus(status));
        channel.close();
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
  yield all([takeLatest(manuscriptEditorActions.cancelExportPdfTask.getType(), cancelPdfExportSaga)]);
}
