import {Manuscript} from '../models/manuscript';
import {createAction, createAsyncAction, ofActionType} from '../utils/action.utils';
import {EditorState} from "prosemirror-state";

export const loadManuscript = createAsyncAction<string, Manuscript>('LOAD_MANUSCRIPT');
export const updateTitle = createAction<EditorState>('SET_TITLE');

export type ActionType = ofActionType<typeof loadManuscript>
  | ofActionType<typeof updateTitle>;
