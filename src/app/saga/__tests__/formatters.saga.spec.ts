import { runSaga } from 'redux-saga';

import { toggleMarkSaga } from 'app/saga/formatters.saga';
import { applyChangeAction, toggleMarkAction } from 'app/actions/manuscript.actions';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { createNewKeywordState } from 'app/models/manuscript-state.factory';

describe('formatters saga', () => {
  it('should load data', async () => {
    const dispatched = [];
    const manuscriptState = givenState({
      keywordGroups: {
        kwdGroup: {
          title: 'Test',
          keywords: [],
          newKeyword: createNewKeywordState()
        }
      }
    });
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
