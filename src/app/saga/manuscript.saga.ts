import { EditorState } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { all, takeLatest, call, put } from 'redux-saga/effects';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { Action } from 'app/utils/action.utils';
import { getManuscriptChanges, getManuscriptContent, ManuscriptChangesResponse } from 'app/api/manuscript.api';
import { Manuscript } from 'app/models/manuscript';

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
      const changes = yield call(getManuscriptChanges, id);
      manuscript = applyChangesFromServer(manuscript, changes);
    } catch (e) {}

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

function applyChangesFromServer(manuscript: Manuscript, changes: ManuscriptChangesResponse['changes']): Manuscript {
  changes.forEach((change) => {
    if (manuscript[change.path] instanceof EditorState) {
      const transaction = manuscript[change.path].tr;
      change.steps.forEach((stepJson) => {
        transaction.maybeStep(Step.fromJSON(manuscript[change.path].schema, stepJson));
      });
      manuscript[change.path] = manuscript[change.path].apply(transaction);
    }
  });
  return manuscript;
}
