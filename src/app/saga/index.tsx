import {fork, all, put} from 'redux-saga/effects';
import manuscriptSaga from './manuscript.saga'
import {initApplication} from "../actions/init.actions";

function* initialSaga() {
  yield put(initApplication());
}

export function *rootSaga() {
  yield all([
    fork(initialSaga),
    fork(manuscriptSaga),
  ]);
}