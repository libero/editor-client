import { fork, all } from 'redux-saga/effects';
import manuscriptSaga from './manuscript.saga';
import formattersSaga from './formatters.saga';
import { routerSaga } from 'app/saga/router.saga';

// eslint-disable-next-line require-yield
function* initialSaga() {
  console.log('Initialising');
}

export function* rootSaga() {
  yield all([fork(initialSaga), fork(routerSaga), fork(formattersSaga), fork(manuscriptSaga)]);
}
