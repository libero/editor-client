import { all, takeLatest, call, put } from 'redux-saga/effects';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { Action } from 'app/utils/action.utils';
import { getManuscriptContent } from 'app/api/manuscript.api';

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
    yield put(manuscriptActions.loadManuscriptAction.error(e));
  }
}

export default function* () {
  yield all([takeLatest(manuscriptActions.loadManuscriptAction.request, loadManuscriptSaga)]);
}
