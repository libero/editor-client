import { EditorState, Transaction } from 'prosemirror-state';
import { toggleMark, setBlockType } from 'prosemirror-commands';
import { all, takeLatest, call, put, select } from 'redux-saga/effects';
import { MarkType, Fragment } from 'prosemirror-model';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import { Action } from 'app/utils/action.utils';
import { getFocusedEditorState, getFocusedEditorStatePath } from 'app/selectors/manuscript-editor.selectors';
import { insertBox } from 'app/utils/prosemirror/box.helpers';
import { insertFigure, insertFigureCitation } from 'app/utils/prosemirror/figure.helpers';
import { wrapInListOrChangeListType } from 'app/utils/prosemirror/list.helpers';

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

export function* insertReferenceCitationSaga() {
  const editorState: EditorState = yield select(getFocusedEditorState);
  if (editorState && editorState.schema.nodes['refCitation']) {
    const path = yield select(getFocusedEditorStatePath);
    const { empty, $from, $to } = editorState.selection;
    let content = Fragment.empty;
    if (!empty && $from.sameParent($to) && $from.parent.inlineContent) {
      content = $from.parent.content.cut($from.parentOffset, $to.parentOffset);
    }
    const change = editorState.tr.replaceSelectionWith(editorState.schema.nodes['refCitation'].create(null, content));
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export function* insertBoxSaga() {
  const editorState: EditorState = yield select(getFocusedEditorState);
  if (editorState && editorState.schema.nodes['boxText']) {
    const path = yield select(getFocusedEditorStatePath);
    const change = yield insertBox(editorState);
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export function* insertFigureCitationSaga() {
  const editorState: EditorState = yield select(getFocusedEditorState);
  if (editorState && editorState.schema.nodes['figureCitation']) {
    const path = yield select(getFocusedEditorStatePath);
    const change = insertFigureCitation(editorState);
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export function* insertFigureSaga(action: Action<string>) {
  const editorState: EditorState = yield select(getFocusedEditorState);
  if (editorState && editorState.schema.nodes['figure']) {
    const path = yield select(getFocusedEditorStatePath);
    const change = yield insertFigure(editorState, action.payload);
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export function* insertHeadingSaga(action: Action<number>) {
  const editorState: EditorState = yield select(getFocusedEditorState);
  if (editorState && editorState.schema.nodes['heading']) {
    const path = yield select(getFocusedEditorStatePath);
    const commandAction = new Promise((resolve) => {
      const command = setBlockType(editorState.schema.nodes['heading'], { level: action.payload });
      command(editorState, (change: Transaction) => {
        resolve(change);
      });
    });
    const change = yield commandAction;
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export function* insertListOrChangeTypeSaga(action: Action<string>) {
  const editorState: EditorState = yield select(getFocusedEditorState);
  const knowsLists = editorState && (editorState.schema.nodes['orderedList'] || editorState.schema.nodes['bulletList']);
  if (knowsLists) {
    const path = yield select(getFocusedEditorStatePath);
    const listNodeType =
      action.payload === 'order' ? editorState.schema.nodes['orderedList'] : editorState.schema.nodes['bulletList'];

    const change = yield wrapInListOrChangeListType(editorState, listNodeType);
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export function* insertParagraphSaga() {
  const editorState: EditorState = yield select(getFocusedEditorState);
  if (editorState && editorState.schema.nodes['heading']) {
    const path = yield select(getFocusedEditorStatePath);
    const commandAction = new Promise((resolve) => {
      const command = setBlockType(editorState.schema.nodes['paragraph']);
      command(editorState, (change: Transaction) => {
        resolve(change);
      });
    });
    const change = yield commandAction;
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export default function* () {
  yield all([
    takeLatest(manuscriptActions.toggleMarkAction.getType(), toggleMarkSaga),
    takeLatest(manuscriptActions.insertReferenceCitationAction.getType(), insertReferenceCitationSaga),
    takeLatest(manuscriptActions.insertBoxAction.getType(), insertBoxSaga),
    takeLatest(manuscriptActions.insertFigureAction.getType(), insertFigureSaga),
    takeLatest(manuscriptActions.insertListAction.getType(), insertListOrChangeTypeSaga),
    takeLatest(manuscriptActions.insertHeadingAction.getType(), insertHeadingSaga),
    takeLatest(manuscriptActions.insertFigureCitationAction.getType(), insertFigureCitationSaga),
    takeLatest(manuscriptActions.insertParagraphAction.getType(), insertParagraphSaga)
  ]);
}
