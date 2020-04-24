import {Manuscript} from '../models/manuscript';
import {createAction, createAsyncAction, ofActionType} from '../utils/action.utils';
import {Transaction} from "prosemirror-state";

export interface KeywordUpdatePayload {
  keywordGroup: string;
  index: number;
  change: Transaction;
}

export interface KeywordDeletePayload {
  keywordGroup: string;
  index: number;
}


export const loadManuscriptAction = createAsyncAction<string, Manuscript>('LOAD_MANUSCRIPT');
export const updateTitleAction = createAction<Transaction>('UPDATE_TITLE');
export const updateKeywordsAction = createAction<KeywordUpdatePayload>('UPDATE_KEYWORDS');
export const deleteKeywordAction = createAction<KeywordDeletePayload>('DELETE_KEYWORDS');

export const undoAction = createAction<void>('UNDO');
export const redoAction = createAction<void>('REDO');

export type ActionType = ofActionType<typeof loadManuscriptAction>
  | ofActionType<typeof undoAction>
  | ofActionType<typeof redoAction>
  | ofActionType<typeof deleteKeywordAction>
  | ofActionType<typeof updateKeywordsAction>
  | ofActionType<typeof updateTitleAction>;
