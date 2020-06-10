import { cloneDeep } from 'lodash';

import { getInitialHistory, getInitialLoadableState, ManuscriptHistory } from 'app/utils/state.utils';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { manuscriptReducer } from 'app/reducers/manuscript.reducer';
import { EditorState } from 'prosemirror-state';
import { redoChange, undoChange } from 'app/utils/history.utils';
import { Manuscript } from 'app/models/manuscript';
import { givenState } from 'app/test-utils/reducer-test-helpers';

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

  it('should undo last changes', () => {
    const state = givenState({});
    state.data.past.push({ title: undefined });

    const undoneState = cloneDeep(state);
    undoneState.data.past = [];
    (undoChange as jest.Mock).mockReturnValue(undoneState.data);
    expect(manuscriptReducer(state, manuscriptActions.undoAction())).toEqual(undoneState);
  });

  it('should redo undone last changes', () => {
    const state = givenState({});
    state.data.future.push({ title: undefined });

    const redoneState = cloneDeep(state);
    redoneState.data.future = [];
    (redoChange as jest.Mock).mockReturnValueOnce(redoneState.data);

    expect(manuscriptReducer(state, manuscriptActions.redoAction())).toEqual(redoneState);
  });
});
