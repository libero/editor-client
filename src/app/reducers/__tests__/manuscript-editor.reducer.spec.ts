import { EditorState } from 'prosemirror-state';
import { cloneDeep } from 'lodash';
import * as manuscriptActions from '../../actions/manuscript.actions';
import { manuscriptEditorReducer } from '../manuscript-editor.reducer';
import { cloneManuscript, getInitialHistory } from '../../utils/state.utils';
import { redoChange, undoChange, updateManuscriptState } from '../../utils/history.utils';

jest.mock('../../utils/history.utils');

describe('manuscript editor reducer', () => {
  it('should update title', () => {
    const state = getInitialHistory({
      title: undefined,
      keywords: {}
    });
    const updatedState = cloneDeep(state);
    updatedState.present.title = new EditorState();
    (updateManuscriptState as jest.Mock).mockReturnValueOnce(updatedState);

    const newState = manuscriptEditorReducer(state, manuscriptActions.updateTitleAction(updatedState.present.title.tr));
    expect(newState.present.title).toBe(updatedState.present.title);
  });

  it('should undo last changes', () => {
    const state = getInitialHistory({
      title: new EditorState(),
      keywords: {}
    });
    state.past.push({ title: undefined });

    const undoneState = cloneDeep(state);
    undoneState.past = [];
    (undoChange as jest.Mock).mockReturnValueOnce(undoneState);

    expect(manuscriptEditorReducer(state, manuscriptActions.undoAction())).toBe(undoneState);
  });

  it('should redo undone last changes', () => {
    const state = getInitialHistory({
      title: new EditorState(),
      keywords: {}
    });
    state.future.push({ title: undefined });

    const redoneState = cloneDeep(state);
    redoneState.future = [];
    (redoChange as jest.Mock).mockReturnValueOnce(redoneState);

    expect(manuscriptEditorReducer(state, manuscriptActions.redoAction())).toBe(redoneState);
  });

  it('should delete keyword', () => {
    const state = getInitialHistory({
      title: new EditorState(),
      keywords: {
        'kwd-group': [new EditorState(), new EditorState()]
      }
    });

    const expectedState = getInitialHistory(cloneManuscript(state.present));
    expectedState.present.keywords['kwd-group'].splice(1, 1);

    const payload = { keywordGroup: 'kwd-group', index: 1 };
    const actualSate = manuscriptEditorReducer(state, manuscriptActions.deleteKeywordAction(payload));
    expect(actualSate.present).toEqual(expectedState.present);
  });

  it('should add keyword', () => {
    const state = getInitialHistory({
      title: new EditorState(),
      keywords: {
        'kwd-group': [new EditorState()]
      }
    });

    const expectedState = getInitialHistory(cloneManuscript(state.present));
    expectedState.present.keywords['kwd-group'].splice(1, 1);

    const payload = { keywordGroup: 'kwd-group', keyword: new EditorState() };
    const actualState = manuscriptEditorReducer(state, manuscriptActions.addNewKeywordAction(payload));
    expect(actualState.present.keywords['kwd-group'][0]).toEqual(payload.keyword);
  });

  it('should update keyword', () => {
    const state = getInitialHistory({
      title: new EditorState(),
      keywords: {
        'kwd-group': [new EditorState()]
      }
    });

    const payload = {
      keywordGroup: 'kwd-group',
      index: 0,
      change: state.present.keywords['kwd-group'][0].tr
    };

    manuscriptEditorReducer(state, manuscriptActions.updateKeywordsAction(payload));
    expect(updateManuscriptState).toBeCalledWith(state, 'keywords.kwd-group.0', payload.change);
  });
});
