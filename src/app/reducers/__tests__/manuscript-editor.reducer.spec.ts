import {EditorState} from 'prosemirror-state';
import {cloneDeep} from 'lodash'
import * as manuscriptActions from '../../actions/manuscript.actions';
import {manuscriptEditorReducer} from '../manuscript-editor.reducer';
import {getInitialHistory} from '../../utils/state.utils';
import {redoChange, undoChange, updateManuscriptState} from '../../utils/history.utils';

jest.mock('../../utils/history.utils');

describe('manuscript editor reducer', () => {
  it('should update title', () => {
    const state = getInitialHistory({title: undefined});
    const updatedState = cloneDeep(state);
    updatedState.present.title = new EditorState();
    (updateManuscriptState as jest.Mock).mockReturnValueOnce(updatedState);

    const newState = manuscriptEditorReducer(state, manuscriptActions.updateTitleAction(updatedState.present.title.tr));
    expect(newState.present.title).toBe(updatedState.present.title);
  });

  it('should undo last changes', () => {

    const state = getInitialHistory({title: new EditorState()});
    state.past.push({title: undefined});

    const undoneState = cloneDeep(state);
    undoneState.past = [];
    (undoChange as jest.Mock).mockReturnValueOnce(undoneState);

    expect(manuscriptEditorReducer(state, manuscriptActions.undoAction())).toBe(undoneState);
  });

  it('should redo undone last changes', () => {

    const state = getInitialHistory({title: new EditorState()});
    state.future.push({title: undefined});

    const redoneState = cloneDeep(state);
    redoneState.future = [];
    (redoChange as jest.Mock).mockReturnValueOnce(redoneState);

    expect(manuscriptEditorReducer(state, manuscriptActions.redoAction())).toBe(redoneState);
  });
})