import { createAction } from 'redux-act';
import { EditorState, Transaction } from 'prosemirror-state';

import { Manuscript } from 'app/types/manuscript';
import { createAsyncAction } from 'app/utils/action.utils';
import { Person } from 'app/models/person';
import { Affiliation } from 'app/models/affiliation';
import { Reference } from 'app/models/reference';
import { RelatedArticle } from 'app/models/related-article';
import { ArticleInformation } from 'app/models/article-information';
import { ListType } from 'app/types/utility.types';

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
export const updateBodyAction = createAction<Transaction>('UPDATE_BODY');
export const updateAcknowledgementsAction = createAction<Transaction>('UPDATE_ACKNOWLEDGEMENTS');
export const updateImpactStatementAction = createAction<Transaction>('UPDATE_IMPACT_STATEMENT');
export const updateKeywordAction = createAction<KeywordUpdatePayload>('UPDATE_KEYWORD');
export const updateNewKeywordAction = createAction<NewKeywordUpdatePayload>('UPDATE_NEW_KEYWORD');
export const deleteKeywordAction = createAction<KeywordDeletePayload>('DELETE_KEYWORD');
export const addNewKeywordAction = createAction<KeywordAddPayload>('ADD_KEYWORD');
export const updateAuthorAction = createAction<Person>('UPDATE_AUTHOR');
export const updateArticleInformationAction = createAction<ArticleInformation>('UPDATE_ARTICLE_INFORMATION');
export const addAuthorAction = createAction<Person>('ADD_AUTHOR');
export const moveAuthorAction = createAction<MoveAuthorPayload>('MOVE_AUTHOR');
export const deleteAuthorAction = createAction<Person>('DELETE_AUTHOR');
export const updateAffiliationAction = createAction<Affiliation>('UPDATE_AFFILIATION');
export const addAffiliationAction = createAction<Affiliation>('ADD_AFFILIATION');
export const deleteAffiliationAction = createAction<Affiliation>('DELETE_AFFILIATION');
export const linkAffiliationsAction = createAction<LinkAffiliationsPayload>('LINK_AFFILIATIONS');
export const updateRelatedArticleAction = createAction<RelatedArticle>('UPDATE_RELATED_ARTICLE');
export const addRelatedArticleAction = createAction<RelatedArticle>('ADD_RELATED_ARTICLE');
export const deleteRelatedArticleAction = createAction<RelatedArticle>('DELETE_RELATED_ARTICLE');
export const updateReferenceAction = createAction<Reference>('UPDATE_REFERENCE');
export const addReferenceAction = createAction<Reference>('ADD_REFERENCE');
export const deleteReferenceAction = createAction<Reference>('DELETE_REFERENCE');
export const applyChangeAction = createAction<ApplyChangePayload>('APPLY_CHANGE');

export const undoAction = createAction<void>('UNDO');
export const redoAction = createAction<void>('REDO');
export const toggleMarkAction = createAction<string>('TOGGLE_MARK');
export const insertReferenceCitationAction = createAction<void>('INSERT_REFERENCE_CITATION');
export const insertBoxAction = createAction<void>('INSERT_BOX');
export const insertListAction = createAction<ListType>('INSERT_LIST');
export const insertFigureAction = createAction<string>('INSERT_FIGURE');
export const insertFigureCitationAction = createAction<void>('INSERT_FIGURE_CITATION');
export const insertHeadingAction = createAction<number>('INSERT_HEADING');
export const insertParagraphAction = createAction<void>('INSERT_PARAGRAPH');
