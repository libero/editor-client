import { fork, all } from 'redux-saga/effects';
import manuscriptSaga from './manuscript.saga';

function* initialSaga() {
  console.log('Initialising');
}

export function* rootSaga() {
  yield all([fork(initialSaga), fork(manuscriptSaga)]);
}
