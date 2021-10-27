import { getInitialHistory, ManuscriptHistory } from '../state.utils';
import { redoChange, undoChange, updateManuscriptState } from '../history.utils';
import { Manuscript } from '../../types/manuscript';
import { EditorState, Transaction } from 'prosemirror-state';
import { ProsemirrorChange } from '../history/prosemirror-change';

describe('history utils', () => {
  it('updates manuscript state', () => {
    const editorState = mockEditorState();
    const initialHistory = getInitialHistory({ title: editorState } as Manuscript) as ManuscriptHistory;
    const tx = { ...editorState.tr, docChanged: true } as Transaction;

    const newState = updateManuscriptState(initialHistory, 'title', tx);
    expect(newState.past[0]).toEqual(expect.any(ProsemirrorChange));
    expect(newState.present).not.toBe(initialHistory.present);
    expect(newState.present.title).not.toBe(editorState);
    expect(newState.future).toEqual([]);
  });

  it('updates present editor state but not affect history when docChanged is false', () => {
    const editorState = mockEditorState();
    const initialHistory = getInitialHistory({ title: editorState } as Manuscript) as ManuscriptHistory;
    const tx = editorState.tr;

    const newState = updateManuscriptState(initialHistory, 'title', tx);

    expect(newState.past).toEqual(initialHistory.past);
    expect(newState.present).not.toBe(initialHistory.present);
    expect(newState.present.title).not.toBe(editorState);
    expect(newState.future).toEqual(initialHistory.future);
  });

  it('reverts changes', () => {
    const editorState = mockEditorState();
    const state = getInitialHistory({ title: editorState } as Manuscript) as ManuscriptHistory;
    const tx = editorState.tr;
    Object.defineProperty(tx, 'docChanged', { value: true });
    state.past = [new ProsemirrorChange('title', tx)];

    const revertedState = undoChange(state);

    expect(revertedState.past).toEqual([]);
    expect(revertedState.present).not.toBe(state.present);
    expect(revertedState.present.title).not.toBe(editorState);
    expect(revertedState.future).toEqual([state.past[0]]);
  });

  it('roll on changes', () => {
    const editorState = mockEditorState();
    const state = getInitialHistory({ title: editorState } as Manuscript) as ManuscriptHistory;
    const tx = editorState.tr;
    state.future = [new ProsemirrorChange('title', tx)];

    const rolledOnState = redoChange(state);

    expect(rolledOnState.past).toEqual([state.future[0]]);
    expect(rolledOnState.present).not.toBe(state.present);
    expect(rolledOnState.present.title).not.toBe(editorState);
    expect(rolledOnState.future).toEqual([]);
  });
});

function mockEditorState(): EditorState {
  const state = new EditorState();
  jest.spyOn(state, 'apply').mockImplementation(() => mockEditorState());
  return state;
}
