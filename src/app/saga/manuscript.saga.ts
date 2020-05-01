import { all, takeLatest, call, put } from 'redux-saga/effects';
import * as manuscriptActions from '../actions/manuscript.actions';
import * as initActions from '../actions/init.actions';
import { Action } from '../utils/action.utils';
import { getManuscriptContent } from '../api/manuscript.api';

export function* loadManuscriptSaga(action: Action<string>) {
  const params = new URLSearchParams(document.location.search.substring(1));
  const id = action.payload || params.get('articleId') || '00104';
  try {
    const manuscript = yield call(getManuscriptContent, id);
    yield put(manuscriptActions.loadManuscriptAction.success(manuscript));
  } catch (e) {
    yield put(manuscriptActions.loadManuscriptAction.error(e));
  }
}

export default function* () {
  yield all([
    takeLatest(manuscriptActions.loadManuscriptAction.request.type, loadManuscriptSaga),
    takeLatest(initActions.initApplication.type, loadManuscriptSaga)
  ]);
}
