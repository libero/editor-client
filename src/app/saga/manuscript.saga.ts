import { all, takeLatest, call, put } from 'redux-saga/effects';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { Action } from 'app/utils/action.utils';
import { getManuscriptChanges, getManuscriptContent } from 'app/api/manuscript.api';
import { applyChangesFromServer } from 'app/utils/changes.utils';

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
