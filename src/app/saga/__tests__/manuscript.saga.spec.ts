import { loadManuscriptSaga } from 'app/saga/manuscript.saga';
import { loadManuscriptAction } from 'app/actions/manuscript.actions';
import { put } from 'redux-saga/effects';
import { EditorState } from 'prosemirror-state';
import { Manuscript } from 'app/types/manuscript';
import { setManuscriptId } from 'app/actions/manuscript-editor.actions';

describe('manuscript saga', () => {
  it('should load data', () => {
    const response = { title: new EditorState() } as Manuscript;
    const saga = loadManuscriptSaga(loadManuscriptAction.request('SOME_ID'));

    saga.next();
    saga.next(response);

    expect(saga.next([]).value).toEqual(put(loadManuscriptAction.success(response)));
    expect(saga.next().value).toEqual(put(setManuscriptId('SOME_ID')));
  });
});
