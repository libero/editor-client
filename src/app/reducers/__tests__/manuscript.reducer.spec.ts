import { cloneDeep } from 'lodash';
import { EditorState } from 'prosemirror-state';

import { getInitialHistory, getInitialLoadableState, ManuscriptHistory } from '../../utils/state.utils';
import * as manuscriptActions from '../../actions/manuscript.actions';
import { manuscriptReducer } from '../manuscript.reducer';
import { redoChange, undoChange, updateManuscriptState } from '../../utils/history.utils';
import { Manuscript } from '../../types/manuscript';
import { givenState } from '../../test-utils/reducer-test-helpers';

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

  it('should apply prosemirror changes to state', () => {
    const state = givenState({});
    const change = state.data.present.title.tr;
    manuscriptReducer(state, manuscriptActions.applyChangeAction({ path: 'title', change }));
    expect(updateManuscriptState).toHaveBeenCalledWith(state.data, 'title', change);
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
