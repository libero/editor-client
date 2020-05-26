import { loadManuscriptSaga } from 'app/saga/manuscript.saga';
import { loadManuscriptAction } from 'app/actions/manuscript.actions';
import { put } from 'redux-saga/effects';
import { EditorState } from 'prosemirror-state';
import { Manuscript } from 'app/models/manuscript';

describe('manuscript saga', () => {
  it('should load data', () => {
    const response = { title: new EditorState() } as Manuscript;
    const saga = loadManuscriptSaga(loadManuscriptAction.request('SOME_ID'));

    saga.next();
    const sagaResult = saga.next(response).value;

    expect(sagaResult).toEqual(put(loadManuscriptAction.success(response)));
  });
});
