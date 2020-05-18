import { all, takeLatest, call, put } from 'redux-saga/effects';
import * as manuscriptActions from '../actions/manuscript.actions';
import { Action } from '../utils/action.utils';
import { getManuscriptContent } from '../api/manuscript.api';

/**
 * Side effect handler to load the specified article from the backend.
 *
 * @export
 * @param {Action<string>} action
 */
export function* loadManuscriptSaga(action: Action<string>) {
  const id = action.payload;
  try {
    const manuscript = yield call(getManuscriptContent, id);
    yield put(manuscriptActions.loadManuscriptAction.success(manuscript));
  } catch (e) {
    console.log(e);
    yield put(manuscriptActions.loadManuscriptAction.error(e));
  }
}

export default function* () {
  yield all([takeLatest(manuscriptActions.loadManuscriptAction.request.type, loadManuscriptSaga)]);
}
