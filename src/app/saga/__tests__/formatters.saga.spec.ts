import { EditorState } from 'prosemirror-state';
import { runSaga } from 'redux-saga';

import { toggleMarkSaga } from 'app/saga/formatters.saga';
import { applyChangeAction, toggleMarkAction } from 'app/actions/manuscript.actions';
import { createNewKeywordState } from 'app/models/manuscript-state.factory';
import { getInitialHistory, getLoadableStateSuccess } from 'app/utils/state.utils';

describe('manuscript saga', () => {
  it('should load data', async () => {
    const dispatched = [];
    const manuscriptState = getLoadableStateSuccess(
      getInitialHistory({
        title: new EditorState(),
        abstract: new EditorState(),
        keywordGroups: {
          kwdGroup: {
            title: 'Test',
            keywords: [],
            newKeyword: createNewKeywordState()
          }
        },
        authors: [],
        affiliations: []
      })
    );
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          manuscript: manuscriptState,
          manuscriptEditor: { focusedManuscriptPath: 'keywordGroups.kwdGroup.newKeyword' }
        })
      },
      toggleMarkSaga,
      toggleMarkAction('italic')
    ).toPromise();

    expect(dispatched).toEqual([
      applyChangeAction({ path: 'keywordGroups.kwdGroup.newKeyword', change: expect.any(Object) })
    ]);
  });
});
