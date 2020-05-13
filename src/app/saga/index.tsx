import { fork, all, put, call } from 'redux-saga/effects';
import manuscriptSaga from './manuscript.saga';
import { initApplication } from '../actions/init.actions';
import { getArticleId } from '../api/manuscript.api';

function* initialSaga() {
  const id = yield call(getArticleId);
  yield put(initApplication(id));
}

export function* rootSaga() {
  yield all([fork(initialSaga), fork(manuscriptSaga)]);
}
