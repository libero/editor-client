import { runSaga } from 'redux-saga';

import { insertHeadingSaga, insertReferenceCitationSaga, toggleMarkSaga } from '../formatters.saga';
import {
  applyChangeAction,
  insertHeadingAction,
  insertReferenceCitationAction,
  toggleMarkAction
} from '../../actions/manuscript.actions';
import { givenState } from '../../test-utils/reducer-test-helpers';
import { createBodyState } from '../../models/body';
import { Keyword } from '../../models/keyword';

describe('formatters saga', () => {
  it('should format text', async () => {
    const dispatched = [];
    const manuscriptState = givenState({
      keywordGroups: {
        kwdGroup: {
          title: 'Test',
          keywords: [],
          newKeyword: new Keyword()
        }
      }
    });
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
        getState: () => ({
          manuscript: manuscriptState,
          manuscriptEditor: { focusedManuscriptPath: 'keywordGroups.kwdGroup.newKeyword.content' }
        })
      },
      toggleMarkSaga,
      toggleMarkAction('italic')
    ).toPromise();

    expect(dispatched).toEqual([
      applyChangeAction({ path: 'keywordGroups.kwdGroup.newKeyword.content', change: expect.any(Object) })
    ]);
  });

  it('should set text to heading', async () => {
    const dispatched = [];
    const manuscriptState = givenState({
      body: createBodyState(document.createElement('div'), '')
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
      insertHeadingAction(1)
    ).toPromise();

    expect(dispatched).toEqual([applyChangeAction({ path: 'body', change: expect.any(Object) })]);
  });

  it('should insert ref citation', async () => {
    const dispatched = [];
    const manuscriptState = givenState({
      body: createBodyState(document.createElement('div'), '')
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
