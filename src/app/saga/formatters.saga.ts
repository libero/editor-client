import { EditorState, Transaction, NodeSelection } from 'prosemirror-state';
import { toggleMark, setBlockType } from 'prosemirror-commands';
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
    const resolvedPos = change.doc.resolve(change.selection.anchor - change.selection.$anchor.nodeBefore.nodeSize);
    change.setSelection(new NodeSelection(resolvedPos));
    yield put(manuscriptActions.applyChangeAction({ path, change }));
  }
}

export function* insertBoxSaga() {
  const editorState: EditorState = yield select(getFocusedEditorState);
  if (editorState && editorState.schema.nodes['boxText']) {
    const path = yield select(getFocusedEditorStatePath);
    const { empty, $from, $to } = editorState.selection;

    let content = Fragment.empty;
    if (!empty && $from.sameParent($to) && $from.parent.inlineContent) {
      content = $from.parent.content.cut($from.parentOffset, $to.parentOffset);
    }

    const paragraph = editorState.schema.nodes['paragraph'].create(null, content);
    const change = editorState.tr
      .split($from.pos)
      .insert($from.pos, editorState.schema.nodes['boxText'].create(null, paragraph))
      .deleteSelection();

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
