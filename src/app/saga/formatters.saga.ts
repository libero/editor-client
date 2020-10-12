import { EditorState, Transaction, NodeSelection } from 'prosemirror-state';
import { toggleMark, setBlockType, splitBlockKeepMarks } from 'prosemirror-commands';
import { all, takeLatest, call, put, select } from 'redux-saga/effects';
import { MarkType, Fragment } from 'prosemirror-model';

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

async function insertBox(editorState: EditorState): Promise<Transaction> {
  const change = await new Promise<Transaction>((resolve) => {
    splitBlockKeepMarks(editorState, (tr: Transaction) => resolve(tr));
  });
  const { empty, $from, $to } = editorState.selection;
  const content =
    !empty && $from.sameParent($to) && $from.parent.inlineContent
      ? $from.parent.content.cut($from.parentOffset, $to.parentOffset)
      : editorState.schema.nodes.paragraph.createAndFill(null, editorState.schema.text(' '));

  const box = editorState.schema.nodes['boxText'].createAndFill(null, content);
  if (!change.doc.nodeAt($from.after()).textContent) {
    change.setSelection(NodeSelection.create(change.doc, $from.after())).replaceSelectionWith(box);
  } else {
    change.insert($from.pos, box);
  }
  return change;
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

export function* insertParagraphSaga(action: Action<number>) {
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
    takeLatest(manuscriptActions.insertHeadingAction.getType(), insertHeadingSaga),
    takeLatest(manuscriptActions.insertParagraphAction.getType(), insertParagraphSaga)
  ]);
}
