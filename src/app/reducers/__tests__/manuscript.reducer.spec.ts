import {
  cloneManuscript,
  getInitialHistory,
  getInitialLoadableState,
  getLoadableStateSuccess,
  ManuscriptHistory
} from 'app/utils/state.utils';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { manuscriptReducer } from 'app/reducers/manuscript.reducer';
import { EditorState } from 'prosemirror-state';
import { cloneDeep } from 'lodash';
import { redoChange, undoChange, updateManuscriptState } from 'app/utils/history.utils';
import { Manuscript } from 'app/models/manuscript';

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
      authors: [],
      abstract: undefined,
      keywordGroups: {}
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
      keywordGroups: {},
      authors: []
    });

    const updatedState = cloneDeep(state);
    updatedState.present.abstract = new EditorState();
    (updateManuscriptState as jest.Mock).mockReturnValueOnce(updatedState);

    const action = manuscriptActions.updateAbstractAction(updatedState.present.abstract.tr);
    const newState = manuscriptReducer(getLoadableStateSuccess(state), action);
    expect(newState.data.present.title).toBe(updatedState.present.title);
  });

  it('should add new author', () => {
    const state = getInitialHistory({
      title: undefined,
      abstract: undefined,
      keywordGroups: {},
      authors: []
    });
    const newAuthor = { id: 'newId', firstName: 'Jules', lastName: 'Verne' };
    const updatedState = cloneDeep(state);
    updatedState.present.authors = [newAuthor];
    updatedState.past = [{ authors: [] }];

    const action = manuscriptActions.addAuthorAction(newAuthor);
    const newState = manuscriptReducer(getLoadableStateSuccess(state), action);
    expect(newState.data).toEqual(updatedState);
  });

  it('should update existing author', () => {
    const state = getInitialHistory({
      title: undefined,
      abstract: undefined,
      keywordGroups: {},
      authors: [{ id: 'newId', firstName: 'Jules', lastName: 'Verne' }]
    });
    const updatedAuthor = { id: 'newId', firstName: 'Jules Gabriel', lastName: 'Verne' };
    const updatedState = cloneDeep(state);
    updatedState.present.authors = [updatedAuthor];
    updatedState.past = [{ 'authors.0': state.present.authors[0] }];

    const action = manuscriptActions.updateAuthorAction(updatedAuthor);
    const newState = manuscriptReducer(getLoadableStateSuccess(state), action);
    expect(newState.data).toEqual(updatedState);
  });

  it('should move author', () => {
    const state = getInitialHistory({
      title: undefined,
      abstract: undefined,
      keywordGroups: {},
      authors: [
        { id: 'id1', firstName: 'Jules', lastName: 'Verne' },
        { id: 'id2', firstName: 'H G', lastName: 'Wells' }
      ]
    });

    const updatedState = cloneDeep(state);
    updatedState.present.authors.reverse();
    updatedState.past = [{ authors: state.present.authors }];
    const action = manuscriptActions.moveAuthorAction({ index: 1, author: state.present.authors[0] });
    const newState = manuscriptReducer(getLoadableStateSuccess(state), action);
    expect(newState.data).toEqual(updatedState);
  });

  it('should delete author', () => {
    const state = getInitialHistory({
      title: undefined,
      abstract: undefined,
      keywordGroups: {},
      authors: [
        { id: 'id1', firstName: 'Jules', lastName: 'Verne' },
        { id: 'id2', firstName: 'H G', lastName: 'Wells' }
      ]
    });

    const updatedState = cloneDeep(state);
    updatedState.present.authors = updatedState.present.authors.slice(1);
    updatedState.past = [{ authors: state.present.authors }];
    const action = manuscriptActions.deleteAuthorAction(state.present.authors[0]);
    const newState = manuscriptReducer(getLoadableStateSuccess(state), action);
    expect(newState.data).toEqual(updatedState);
  });

  it('should undo last changes', () => {
    const initialHistory = getInitialHistory({
      title: new EditorState(),
      abstract: undefined,
      keywordGroups: {},
      authors: []
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
      keywordGroups: {},
      authors: []
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
      authors: [],
      abstract: undefined,
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [new EditorState(), new EditorState()],
          newKeyword: new EditorState()
        }
      }
    });

    const expectedState = getInitialHistory(cloneManuscript(state.present));
    expectedState.present.keywordGroups['kwd-group'].keywords.splice(1, 1);

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
      authors: [],
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [new EditorState()],
          newKeyword: new EditorState()
        }
      }
    });

    const expectedState = getInitialHistory(cloneManuscript(state.present));
    expectedState.present.keywordGroups['kwd-group'].keywords.splice(1, 1);

    const payload = { keywordGroup: 'kwd-group', keyword: new EditorState() };
    const actualState = manuscriptReducer(
      getLoadableStateSuccess(state),
      manuscriptActions.addNewKeywordAction(payload)
    );
    expect(actualState.data.present.keywordGroups['kwd-group'].keywords[0]).toEqual(payload.keyword);
  });

  it('should update keyword', () => {
    const state = getInitialHistory({
      title: new EditorState(),
      abstract: undefined,
      authors: [],
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [new EditorState()],
          newKeyword: new EditorState()
        }
      }
    });

    const payload = {
      keywordGroup: 'kwd-group',
      index: 0,
      change: state.present.keywordGroups['kwd-group'].keywords[0].tr
    };

    manuscriptReducer(getLoadableStateSuccess(state), manuscriptActions.updateKeywordAction(payload));
    expect(updateManuscriptState).toBeCalledWith(state, 'keywordGroups.kwd-group.keywords.0', payload.change);
  });

  it('should update new keyword', () => {
    const state = getInitialHistory({
      title: new EditorState(),
      abstract: undefined,
      authors: [],
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [new EditorState()],
          newKeyword: new EditorState()
        }
      }
    });

    const payload = {
      keywordGroup: 'kwd-group',
      change: state.present.keywordGroups['kwd-group'].newKeyword.tr
    };

    manuscriptReducer(getLoadableStateSuccess(state), manuscriptActions.updateNewKeywordAction(payload));
    expect(updateManuscriptState).toBeCalledWith(state, 'keywordGroups.kwd-group.newKeyword', payload.change);
  });
});
