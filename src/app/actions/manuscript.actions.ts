import { Manuscript } from '../models/manuscript';
import { createAction, createAsyncAction, ofActionType } from '../utils/action.utils';
import { Transaction } from 'prosemirror-state';

export const loadManuscriptAction = createAsyncAction<string, Manuscript>('LOAD_MANUSCRIPT');
export const updateTitleAction = createAction<Transaction>('SET_TITLE');

export const undoAction = createAction<void>('UNDO');
export const redoAction = createAction<void>('REDO');

export type ActionType =
  | ofActionType<typeof loadManuscriptAction>
  | ofActionType<typeof undoAction>
  | ofActionType<typeof redoAction>
  | ofActionType<typeof updateTitleAction>;
