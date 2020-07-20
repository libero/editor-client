import { Transaction, TextSelection } from 'prosemirror-state';
import { all, takeLatest, put, select } from 'redux-saga/effects';

import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { Action } from 'app/utils/action.utils';
import { getFocusedEditorState, getFocusedEditorStatePath } from 'app/selectors/manuscript-editor.selectors';

export function* setFocusSaga(action: Action<string>) {
  const focusedEditorState = yield select(getFocusedEditorState);
  const path = yield select(getFocusedEditorStatePath);
  yield put(manuscriptEditorActions.updateFocusPathAction(action.payload));

  if (focusedEditorState && !focusedEditorState.selection.empty) {
    const change: Transaction = focusedEditorState.tr;
    change.setSelection(new TextSelection(focusedEditorState.doc.resolve(0)));
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export default function* () {
  yield all([takeLatest(manuscriptEditorActions.setFocusAction.getType(), setFocusSaga)]);
}
