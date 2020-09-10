import { runSaga } from 'redux-saga';

import { insertHeadingSaga, insertReferenceCitationSaga, toggleMarkSaga } from 'app/saga/formatters.saga';
import {
  applyChangeAction,
  insertHeading,
  insertReferenceCitationAction,
  toggleMarkAction
} from 'app/actions/manuscript.actions';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { createBodyState, createNewKeywordState } from 'app/models/manuscript-state.factory';

describe('formatters saga', () => {
  it('should format text', async () => {
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

  it('should set text to heading', async () => {
    const dispatched = [];
    const manuscriptState = givenState({
      body: createBodyState(document.createElement('div'))
    });
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          manuscript: manuscriptState,
          manuscriptEditor: { focusedManuscriptPath: 'body' }
        })
      },
      insertHeadingSaga,
      insertHeading(1)
    ).toPromise();

    expect(dispatched).toEqual([applyChangeAction({ path: 'body', change: expect.any(Object) })]);
  });

  it('should insert ref citation', async () => {
    const dispatched = [];
    const manuscriptState = givenState({
      body: createBodyState(document.createElement('div'))
    });

    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          manuscript: manuscriptState,
          manuscriptEditor: { focusedManuscriptPath: 'body' }
        })
      },
      insertReferenceCitationSaga,
      insertReferenceCitationAction()
    ).toPromise();

    expect(dispatched).toEqual([applyChangeAction({ path: 'body', change: expect.any(Object) })]);
  });
});
