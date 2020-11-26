import { put } from 'redux-saga/effects';
import { get } from 'lodash';
import { EditorState, TextSelection } from 'prosemirror-state';

import { setFocusSaga } from 'app/saga/manuscript-editor.saga';
import { setFocusAction, updateFocusPathAction } from 'app/actions/manuscript-editor.actions';
import { createBodyState } from 'app/models/manuscript-state.factory';
import { applyChangeAction } from 'app/actions/manuscript.actions';

describe('manuscript editor saga', () => {
  it('sets focus', () => {
    const editorState = givenEditorState();
    const saga = setFocusSaga(setFocusAction('body'));
    saga.next();
    saga.next(editorState);
    const iterator = saga.next('title');
    expect(iterator.value).toEqual(put(updateFocusPathAction('body')));
    expect(saga.next().done).toBe(true);
  });

  it('clears selection on previous active editor state', () => {
    let editorState = givenEditorState();
    editorState = editorState.apply(editorState.tr.setSelection(TextSelection.create(editorState.doc, 1, 5)));
    const saga = setFocusSaga(setFocusAction('title'));
    saga.next();
    saga.next(editorState);
    saga.next('body');
    const { action } = get(saga.next(), 'value.payload');
    expect(action.payload.change.curSelection.toJSON()).toEqual({ anchor: 0, head: 0, type: 'text' });
    expect(action.payload.path).toEqual('body');
    expect(action.type).toEqual(applyChangeAction.getType());
  });
});

function givenEditorState(): EditorState {
  const el = document.createElement('main-text');
  el.innerHTML = `<p>Example text</p>`;
  return createBodyState(el, '');
}
