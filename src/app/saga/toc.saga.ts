import { all, takeLatest, select, put } from 'redux-saga/effects';
import { Transaction, EditorState } from 'prosemirror-state';
import { Node as ProsemirrorNode } from 'prosemirror-model';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { Action } from 'app/utils/action.utils';
import { TableOfContents, TOCEntry } from 'app/models/manuscript';
import { getBody } from 'app/selectors/manuscript.selectors';
import { setBodyTOCAction } from 'app/actions/manuscript-editor.actions';
import { ApplyChangePayload } from 'app/actions/manuscript.actions';

function getElementOffset(el: Element) {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function getTOCForBody(editorState: EditorState): TableOfContents {
  const toc = [] as TableOfContents;
  editorState.doc.forEach((node: ProsemirrorNode) => {
    if (node.type.name === 'heading') {
      toc.push({ title: node.textContent, level: node.attrs.level, id: node.attrs.domId });
    }
  });
  return toc;
}

export function* updateTOC() {
  const body = yield select(getBody);
  const newBodyTOC = getTOCForBody(body);
  yield put(setBodyTOCAction(newBodyTOC));
}

export function* updateTOCOnBodyEditSaga(action: Action<Transaction>) {
  if (action.payload.docChanged) {
    yield updateTOC();
  }
}

export function* updateTOCOnFormatOrInsertSaga(action: Action<ApplyChangePayload>) {
  // only update toc when body changes
  if (action.payload.path === 'body') {
    yield updateTOC();
  }
}

export function* scrollViewSaga(action: Action<TOCEntry>) {
  const entry = action.payload;
  const domElement = document.getElementById(entry.id);
  if (domElement) {
    const domElementTop = getElementOffset(domElement).top;
    document.documentElement.scrollTop = domElementTop - 80;
  }
  yield null;
}

export default function* () {
  yield all([takeLatest(manuscriptActions.applyChangeAction.getType(), updateTOCOnFormatOrInsertSaga)]);
  yield all([takeLatest(manuscriptActions.updateBodyAction.getType(), updateTOCOnBodyEditSaga)]);
  yield all([takeLatest(manuscriptActions.loadManuscriptAction.success.getType(), updateTOC)]);
  yield all([takeLatest(manuscriptEditorActions.scrollIntoViewAction.getType(), scrollViewSaga)]);
}
