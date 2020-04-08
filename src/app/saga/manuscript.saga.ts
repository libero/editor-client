import {all, takeLatest, call, put} from 'redux-saga/effects';
import * as manuscriptActions from '../actions/manuscript.actions';
import * as initActions from '../actions/init.actions';
import {Action} from "../utils/action.utils";
import {getManuscriptContent} from "../api/manuscript.api";

function* loadManuscript(action: Action<string>) {
  const id = action.payload || '00104';
  try {
    const manuscript = yield call(getManuscriptContent, id);
    yield put(manuscriptActions.loadManuscript.success(manuscript));
  } catch (e) {
    yield put(manuscriptActions.loadManuscript.error(e));
  }
}

export default function*() {
  yield all([
    takeLatest(initActions.initApplication.type, loadManuscript),
  ]);
}