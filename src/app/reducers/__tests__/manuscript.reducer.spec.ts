
import {getInitialLoadableState} from "../../utils/state.utils";
import * as manuscriptActions from '../../actions/manuscript.actions';
import {manuscriptReducer, ManuscriptState} from "../manuscript.reducer";
import {EditorState} from "prosemirror-state";


describe('manuscript reducer', () => {

  it('should set state to loading', () => {
    const state = getInitialLoadableState();

    expect(state.isLoading).toBeFalsy();
    const newState = manuscriptReducer(state, manuscriptActions.loadManuscriptAction.request('SOME_ID'));
    expect(newState.isLoading).toBeTruthy();
  });

  it('should set data on state', () => {
    const state = getInitialLoadableState();
    const data = {title: new EditorState()};

    expect(state.data).toBeFalsy();
    const newState = manuscriptReducer(state, manuscriptActions.loadManuscriptAction.success(data));
    expect(newState.data).toBe(data)
  });

  it('should set error on state', () => {
    const state = getInitialLoadableState();
    const error = new Error('test error');

    expect(state.error).toBeFalsy();
    const newState = manuscriptReducer(state, manuscriptActions.loadManuscriptAction.error(error));
    expect(newState.error).toBe(error);
  });
})