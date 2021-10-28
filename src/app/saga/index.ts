import { fork, all, AllEffect, ForkEffect, put } from 'redux-saga/effects';
import manuscriptSaga from './manuscript.saga';
import formattersSaga from './formatters.saga';
import manuscriptEditorSaga from './manuscript-editor.saga';
import syncChangesSaga from './sync.saga';
import tocSaga from './toc.saga';
import { routerSaga } from './router.saga';
import { LocalStorageApi } from '../api/local-storage.api';
import * as manuscriptEditorAction from '../actions/manuscript-editor.actions';

// eslint-disable-next-line
function* initialSaga<T>() {
  const taskId = LocalStorageApi.get(LocalStorageApi.EXPORT_TASK_KEY);
  if (typeof taskId === 'string') {
    yield put(manuscriptEditorAction.setActiveExportPdfTask(taskId));
  }
}

export function* rootSaga(): IterableIterator<AllEffect<ForkEffect>> {
  yield all([
    fork(initialSaga),
    fork(routerSaga),
    fork(syncChangesSaga),
    fork(formattersSaga),
    fork(manuscriptSaga),
    fork(manuscriptEditorSaga),
    fork(tocSaga)
  ]);
}
