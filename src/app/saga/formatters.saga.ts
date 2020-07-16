import { EditorState, Transaction } from 'prosemirror-state';
import { toggleMark } from 'prosemirror-commands';
import { all, takeLatest, call, put, select } from 'redux-saga/effects';
import { MarkType } from 'prosemirror-model';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import { Action } from 'app/utils/action.utils';
import { getFocusedEditorState, getFocusedEditorStatePath } from 'app/selectors/manuscript-editor.selectors';

async function makeTransactionForMark(editorState: EditorState, mark: MarkType): Promise<Transaction> {
  return new Promise((resolve) => {
    toggleMark(mark, {})(editorState, (change: Transaction) => {
      resolve(change);
    });
  });
}

export function* toggleMarkSaga(action: Action<string>) {
  const mark = action.payload;
  const editorState: EditorState = yield select(getFocusedEditorState);
  if (editorState && editorState.schema.marks[mark]) {
    const path = yield select(getFocusedEditorStatePath);
    const change = yield call(makeTransactionForMark, editorState, editorState.schema.marks[mark]);
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export default function* () {
  yield all([takeLatest(manuscriptActions.toggleMarkAction.getType(), toggleMarkSaga)]);
}
