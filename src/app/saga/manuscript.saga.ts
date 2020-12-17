import { all, takeLatest, call, put } from 'redux-saga/effects';
import { groupBy } from 'lodash';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { Action } from 'app/utils/action.utils';
import { getManuscriptChanges, getManuscriptContent } from 'app/api/manuscript.api';
import { Manuscript } from 'app/types/manuscript';
import { ManuscriptChangeJSON } from 'app/types/changes.types';
import { applyEditorStateChanges } from 'app/utils/changes.utils';

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

function applyChangesFromServer(manuscript: Manuscript, changes: Array<ManuscriptChangeJSON>): Manuscript {
  const groupedChanges = groupBy(changes, (change) => change.path.split('.')[0]);
  Object.entries(groupedChanges).forEach(([manuscriptSection, changes]) => {
    switch (manuscriptSection) {
      case 'title':
        manuscript.title = applyEditorStateChanges(manuscript.title, changes);
        break;
      case 'abstract':
        manuscript.abstract = applyEditorStateChanges(manuscript.abstract, changes);
        break;
      case 'impactStatement':
        manuscript.impactStatement = applyEditorStateChanges(manuscript.impactStatement, changes);
        break;
      case 'body':
        manuscript.body = applyEditorStateChanges(manuscript.body, changes);
        break;
      case 'acknowledgements':
        manuscript.acknowledgements = applyEditorStateChanges(manuscript.acknowledgements, changes);
        break;

      // cases remaining
      // keywordGroups authors affiliations references relatedArticles articleInfo journalMeta
    }
  });
  return manuscript;
}
