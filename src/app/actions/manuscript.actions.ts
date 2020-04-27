import {Manuscript} from '../models/manuscript';
import {createAction, createAsyncAction, ofActionType} from '../utils/action.utils';
import {EditorState, Transaction} from "prosemirror-state";

export interface KeywordUpdatePayload {
  keywordGroup: string;
  index: number;
  change: Transaction;
}

export interface KeywordAddPayload {
  keywordGroup: string;
  keyword: EditorState;
}

export interface KeywordDeletePayload {
  keywordGroup: string;
  index: number;
}

export const loadManuscriptAction = createAsyncAction<string, Manuscript>('LOAD_MANUSCRIPT');
export const updateTitleAction = createAction<Transaction>('UPDATE_TITLE');
export const updateKeywordsAction = createAction<KeywordUpdatePayload>('UPDATE_KEYWORD');
export const deleteKeywordAction = createAction<KeywordDeletePayload>('DELETE_KEYWORD');
export const addNewKeywordAction = createAction<KeywordAddPayload>('ADD_KEYWORD');

export const undoAction = createAction<void>('UNDO');
export const redoAction = createAction<void>('REDO');

export type ActionType = ofActionType<typeof loadManuscriptAction>
  | ofActionType<typeof undoAction>
  | ofActionType<typeof redoAction>
  | ofActionType<typeof addNewKeywordAction>
  | ofActionType<typeof deleteKeywordAction>
  | ofActionType<typeof updateKeywordsAction>
  | ofActionType<typeof updateTitleAction>;
