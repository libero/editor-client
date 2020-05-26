import { getInitialHistory, ManuscriptHistory } from 'app/utils/state.utils';
import { redoChange, undoChange, updateManuscriptState } from 'app/utils/history.utils';
import { Manuscript } from 'app/models/manuscript';
import { EditorState, Transaction } from 'prosemirror-state';

describe('history utils', () => {
  it('updates manuscript state', () => {
    const editorState = mockEditorState();
    const initialHistory = getInitialHistory({ title: editorState } as Manuscript) as ManuscriptHistory;
    const tx = { ...editorState.tr, docChanged: true } as Transaction;

    const newState = updateManuscriptState(initialHistory, 'title', tx);
    expect(newState.past).toContainEqual({ title: tx });
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
    state.past = [{ title: tx }];

    const revertedState = undoChange(state);

    expect(revertedState.past).toEqual([]);
    expect(revertedState.present).not.toBe(state.present);
    expect(revertedState.present.title).not.toBe(editorState);
    expect(revertedState.future).toEqual([{ title: tx }]);
  });

  it('roll on changes', () => {
    const editorState = mockEditorState();
    const state = getInitialHistory({ title: editorState } as Manuscript) as ManuscriptHistory;
    const tx = editorState.tr;
    state.future = [{ title: tx }];

    const rolledOnState = redoChange(state);

    expect(rolledOnState.past).toEqual([{ title: tx }]);
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
