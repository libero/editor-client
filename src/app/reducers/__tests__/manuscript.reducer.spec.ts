import {
  cloneManuscript,
  getInitialHistory,
  getInitialLoadableState,
  getLoadableStateSuccess,
  ManuscriptHistory
} from '../../utils/state.utils';
import * as manuscriptActions from '../../actions/manuscript.actions';
import { manuscriptReducer } from '../manuscript.reducer';
import { EditorState } from 'prosemirror-state';
import { cloneDeep } from 'lodash';
import { redoChange, undoChange, updateManuscriptState } from '../../utils/history.utils';
import { Manuscript } from '../../models/manuscript';

jest.mock('../../utils/history.utils');

describe('manuscript reducer', () => {
  it('should set state to loading', () => {
    const state = getInitialLoadableState<ManuscriptHistory>();

    expect(state.isLoading).toBeFalsy();
    const newState = manuscriptReducer(state, manuscriptActions.loadManuscriptAction.request('SOME_ID'));
    expect(newState.isLoading).toBeTruthy();
  });

  it('should set data on state', () => {
    const state = getInitialLoadableState<ManuscriptHistory>();
    const data = { title: new EditorState() } as Manuscript;

    expect(state.data).toBeFalsy();
    const newState = manuscriptReducer(state, manuscriptActions.loadManuscriptAction.success(data));
    expect(newState.data).toEqual(getInitialHistory(data));
  });

  it('should set error on state', () => {
    const state = getInitialLoadableState<ManuscriptHistory>();
    const error = new Error('test error');

    expect(state.error).toBeFalsy();
    const newState = manuscriptReducer(state, manuscriptActions.loadManuscriptAction.error(error));
    expect(newState.error).toBe(error);
  });

  it('should update title', () => {
    const state = getInitialHistory({
      title: undefined,
      abstract: undefined,
      keywords: {}
    });
    const updatedState = cloneDeep(state);
    updatedState.present.title = new EditorState();
    (updateManuscriptState as jest.Mock).mockReturnValueOnce(updatedState);

    const newState = manuscriptReducer(
      getLoadableStateSuccess(state),
      manuscriptActions.updateTitleAction(updatedState.present.title.tr)
    );
    expect(newState.data.present.title).toBe(updatedState.present.title);
  });

  it('should update abstract', () => {
    const state = getInitialHistory({
      title: undefined,
      abstract: undefined,
      keywords: {}
    });

    const updatedState = cloneDeep(state);
    updatedState.present.abstract = new EditorState();
    (updateManuscriptState as jest.Mock).mockReturnValueOnce(updatedState);

    const action = manuscriptActions.updateAbstractAction(updatedState.present.abstract.tr);
    const newState = manuscriptReducer(getLoadableStateSuccess(state), action);
    expect(newState.data.present.title).toBe(updatedState.present.title);
  });

  it('should undo last changes', () => {
    const initialHistory = getInitialHistory({
      title: new EditorState(),
      abstract: undefined,
      keywords: {}
    });
    const state = getLoadableStateSuccess(initialHistory);

    state.data.past.push({ title: undefined });

    const undoneState = cloneDeep(state);
    undoneState.data.past = [];
    (undoChange as jest.Mock).mockReturnValueOnce(undoneState.data);

    expect(manuscriptReducer(state, manuscriptActions.undoAction())).toEqual(undoneState);
  });

  it('should redo undone last changes', () => {
    const initialHistory = getInitialHistory({
      title: new EditorState(),
      abstract: undefined,
      keywords: {}
    });
    const state = getLoadableStateSuccess(initialHistory);
    state.data.future.push({ title: undefined });

    const redoneState = cloneDeep(state);
    redoneState.data.future = [];
    (redoChange as jest.Mock).mockReturnValueOnce(redoneState.data);

    expect(manuscriptReducer(state, manuscriptActions.redoAction())).toEqual(redoneState);
  });

  it('should delete keyword', () => {
    const state = getInitialHistory({
      title: new EditorState(),
      abstract: undefined,
      keywords: {
        'kwd-group': [new EditorState(), new EditorState()]
      }
    });

    const expectedState = getInitialHistory(cloneManuscript(state.present));
    expectedState.present.keywords['kwd-group'].splice(1, 1);

    const payload = { keywordGroup: 'kwd-group', index: 1 };
    const actualSate = manuscriptReducer(
      getLoadableStateSuccess(state),
      manuscriptActions.deleteKeywordAction(payload)
    );
    expect(actualSate.data.present).toEqual(expectedState.present);
  });

  it('should add keyword', () => {
    const state = getInitialHistory({
      title: new EditorState(),
      abstract: undefined,
      keywords: {
        'kwd-group': [new EditorState()]
      }
    });

    const expectedState = getInitialHistory(cloneManuscript(state.present));
    expectedState.present.keywords['kwd-group'].splice(1, 1);

    const payload = { keywordGroup: 'kwd-group', keyword: new EditorState() };
    const actualState = manuscriptReducer(
      getLoadableStateSuccess(state),
      manuscriptActions.addNewKeywordAction(payload)
    );
    expect(actualState.data.present.keywords['kwd-group'][0]).toEqual(payload.keyword);
  });

  it('should update keyword', () => {
    const state = getInitialHistory({
      title: new EditorState(),
      abstract: undefined,
      keywords: {
        'kwd-group': [new EditorState()]
      }
    });

    const payload = {
      keywordGroup: 'kwd-group',
      index: 0,
      change: state.present.keywords['kwd-group'][0].tr
    };

    manuscriptReducer(getLoadableStateSuccess(state), manuscriptActions.updateKeywordAction(payload));
    expect(updateManuscriptState).toBeCalledWith(state, 'keywords.kwd-group.0', payload.change);
  });
});
