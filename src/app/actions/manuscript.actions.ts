import { createAction } from 'redux-act';

import { Manuscript } from 'app/models/manuscript';
import { createAsyncAction } from 'app/utils/action.utils';
import { EditorState, Transaction } from 'prosemirror-state';
import { Person } from 'app/models/person';
import { Affiliation } from 'app/models/affiliation';

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

export interface LinkAffiliationsPayload {
  affiliation: Affiliation;
  authors: Person[];
}

export interface ApplyChangePayload {
  path: string;
  change: Transaction;
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
export const updateAffiliationAction = createAction<Affiliation>('UPDATE_AFFILIATION');
export const addAffiliationAction = createAction<Affiliation>('ADD_AFFILIATION');
export const deleteAffiliationAction = createAction<Affiliation>('DELETE_AFFILIATION');
export const linkAffiliationsAction = createAction<LinkAffiliationsPayload>('LINK_AFFILIATIONS');
export const applyChangeAction = createAction<ApplyChangePayload>('APPLY_CHANGE');

export const undoAction = createAction<void>('UNDO');
export const redoAction = createAction<void>('REDO');
export const toggleMarkAction = createAction<string>('TOGGLE_MARK');
export const linkAction = createAction<void>('LINK');
