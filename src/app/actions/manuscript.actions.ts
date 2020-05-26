import { Manuscript } from 'app/models/manuscript';
import { createAction, createAsyncAction, ofActionType } from 'app/utils/action.utils';
import { EditorState, Transaction } from 'prosemirror-state';
import { Person } from 'app/models/person';

export interface KeywordUpdatePayload {
  keywordGroup: string;
  index: number;
  change: Transaction;
}

export interface NewKeywordUpdatePayload {
  keywordGroup: string;
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

export interface MoveAuthorPayload {
  index: number;
  author: Person;
}

export const loadManuscriptAction = createAsyncAction<string, Manuscript>('LOAD_MANUSCRIPT');
export const updateTitleAction = createAction<Transaction>('UPDATE_TITLE');
export const updateAbstractAction = createAction<Transaction>('UPDATE_ABSTRACT');
export const updateKeywordAction = createAction<KeywordUpdatePayload>('UPDATE_KEYWORD');
export const updateNewKeywordAction = createAction<NewKeywordUpdatePayload>('UPDATE_NEW_KEYWORD');
export const deleteKeywordAction = createAction<KeywordDeletePayload>('DELETE_KEYWORD');
export const addNewKeywordAction = createAction<KeywordAddPayload>('ADD_KEYWORD');
export const updateAuthorAction = createAction<Person>('UPDATE_AUTHOR');
export const addAuthorAction = createAction<Person>('ADD_AUTHOR');
export const moveAuthorAction = createAction<MoveAuthorPayload>('MOVE_AUTHOR');
export const deleteAuthorAction = createAction<Person>('DELETE_AUTHOR');

export const undoAction = createAction<void>('UNDO');
export const redoAction = createAction<void>('REDO');
export const boldAction = createAction<void>('BOLD');
export const italicizeAction = createAction<void>('ITALICIZE');
export const linkAction = createAction<void>('LINK');

export type ActionType =
  | ofActionType<typeof loadManuscriptAction>
  | ofActionType<typeof updateAuthorAction>
  | ofActionType<typeof addAuthorAction>
  | ofActionType<typeof moveAuthorAction>
  | ofActionType<typeof deleteAuthorAction>
  | ofActionType<typeof undoAction>
  | ofActionType<typeof redoAction>
  | ofActionType<typeof boldAction>
  | ofActionType<typeof italicizeAction>
  | ofActionType<typeof linkAction>
  | ofActionType<typeof addNewKeywordAction>
  | ofActionType<typeof deleteKeywordAction>
  | ofActionType<typeof updateKeywordAction>
  | ofActionType<typeof updateNewKeywordAction>
  | ofActionType<typeof updateTitleAction>;
