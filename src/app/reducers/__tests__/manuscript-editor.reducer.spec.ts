import * as manuscriptActions from '../../actions/manuscript.actions';
import {EditorState} from "prosemirror-state";
import {manuscriptEditorReducer} from "../manuscript-editor.reducer";
import {Manuscript} from "../../models/manuscript";

describe('manuscript editor reducer', () => {
  it('should update title', () => {
    const state = {title: undefined} as Manuscript;
    const newTitle = new EditorState();

    const newState = manuscriptEditorReducer(state, manuscriptActions.updateTitle(newTitle));
    expect(newState.title).toBe(newTitle);
  });
})