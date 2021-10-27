import { all, takeLatest, call, put } from 'redux-saga/effects';

import * as manuscriptActions from '../actions/manuscript.actions';
import * as manuscriptEditorActions from '../actions/manuscript-editor.actions';
import { Action } from '../utils/action.utils';
import { getManuscriptChanges, getManuscriptContent } from '../api/manuscript.api';
import { applyChangesFromServer } from '../utils/changes.utils';

/**
 * Side effect handler to load the specified article from the backend.
 *
 * @export
 * @param {Action<string>} action
 */
export function* loadManuscriptSaga(action: Action<string>) {
  const id = action.payload;
  try {
    let manuscript = yield call(getManuscriptContent, id);
    try {
      const changesJson = yield call(getManuscriptChanges, id);
      manuscript = applyChangesFromServer(manuscript, changesJson);
    } catch (e) {
      console.error('Loading changes failed', e);
    }

    yield put(manuscriptActions.loadManuscriptAction.success(manuscript));
    yield put(manuscriptEditorActions.setManuscriptId(id));
  } catch (e) {
    console.error(e);
    yield put(manuscriptActions.loadManuscriptAction.error(e));
  }
}

export default function* () {
  yield all([takeLatest(manuscriptActions.loadManuscriptAction.request, loadManuscriptSaga)]);
}
