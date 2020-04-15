import {loadManuscriptSaga} from "../manuscript.saga";
import {loadManuscriptAction} from "../../actions/manuscript.actions";
import {put} from 'redux-saga/effects';
import {EditorState} from "prosemirror-state";
import {Manuscript} from "../../models/manuscript";

describe('manuscript saga', () => {
  it('should load data', () => {
    const response = {title: new EditorState()} as Manuscript;
    const saga = loadManuscriptSaga(loadManuscriptAction.request('SOME_ID'));

    saga.next();
    const sagaResult = saga.next(response).value;

    expect(sagaResult).toEqual(put(loadManuscriptAction.success(response)));
  });
})