import { fork, all, AllEffect, ForkEffect } from 'redux-saga/effects';
import manuscriptSaga from './manuscript.saga';
import formattersSaga from './formatters.saga';
import manuscriptEditorSaga from './manuscript-editor.saga';
import syncChangesSaga from './sync.saga';
import tocSaga from './toc.saga';
import { routerSaga } from 'app/saga/router.saga';

// eslint-disable-next-line require-yield
function* initialSaga(): IterableIterator<void> {
  console.log('Initialising');
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
