import { all, takeLatest, call, put } from 'redux-saga/effects';
import { groupBy } from 'lodash';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { Action } from 'app/utils/action.utils';
import { getManuscriptChanges, getManuscriptContent } from 'app/api/manuscript.api';
import { Manuscript } from 'app/types/manuscript';
import { ManuscriptChangeJSON } from 'app/types/changes.types';
import { applyEditorStateChanges } from 'app/utils/changes.utils';
import { applyAuthorsChanges } from 'app/models/person';
import { applyAffiliationsChanges } from 'app/models/affiliation';
import { applyArticleInfoChanges } from 'app/models/article-information';

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

function applyChangesFromServer(manuscript: Manuscript, changes: Array<ManuscriptChangeJSON>): Manuscript {
  const groupedChanges = groupBy(changes, (change) => change.path.split('.')[0]);
  Object.entries(groupedChanges).forEach(([manuscriptSection, changes]) => {
    switch (manuscriptSection) {
      case 'title':
      case 'abstract':
      case 'impactStatement':
      case 'body':
      case 'acknowledgements':
        manuscript[manuscriptSection] = applyEditorStateChanges(manuscript[manuscriptSection], changes);
        break;
      case 'authors':
        manuscript.authors = applyAuthorsChanges(manuscript.authors, changes);
        break;
      case 'affiliations':
        manuscript.affiliations = applyAffiliationsChanges(manuscript.affiliations, changes);
        break;
      case 'articleInfo':
        manuscript.articleInfo = applyArticleInfoChanges(manuscript.articleInfo, changes);
        break;

      // cases remaining
      // keywordGroups references relatedArticles journalMeta
    }
  });
  return manuscript;
}
