import { createReducer } from 'redux-act';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import {
  getInitialHistory,
  getInitialLoadableState,
  getLoadableStateError,
  getLoadableStateProgress,
  getLoadableStateSuccess
} from 'app/utils/state.utils';
import { ManuscriptHistoryState } from 'app/store';
import { updateTitle } from 'app/reducers/title.handlers';
import { updateAbstract, updateImpactStatement } from 'app/reducers/abstract.handlers';
import { addAuthor, moveAuthor, updateAuthor, deleteAuthor } from 'app/reducers/authors.handlers';
import {
  addAffiliation,
  deleteAffiliation,
  linkAffiliations,
  updateAffiliation
} from 'app/reducers/affiliations.handlers';
import { addKeyword, deleteKeyword, updateKeyword, updateNewKeyword } from 'app/reducers/keywords.handlers';
import { redoChange, undoChange, updateManuscriptState } from 'app/utils/history.utils';
import { addReference, deleteReference, updateReference } from 'app/reducers/references.handlers';
import { updateArticleInformation } from 'app/reducers/article-information.handlers';
import { addRelatedArticle, deleteRelatedArticle, updateRelatedArticle } from 'app/reducers/related-articles.handlers';

const initialState = getInitialLoadableState() as ManuscriptHistoryState;

export const manuscriptReducer = createReducer<ManuscriptHistoryState>({}, initialState);

manuscriptReducer.on(manuscriptActions.loadManuscriptAction.request, (state) => ({
  ...state,
  ...getLoadableStateProgress()
}));

manuscriptReducer.on(manuscriptActions.loadManuscriptAction.success, (state, payload) => ({
  ...state,
  ...getLoadableStateSuccess(getInitialHistory(payload))
}));

manuscriptReducer.on(manuscriptActions.loadManuscriptAction.error, (state, payload) => ({
  ...state,
  ...getLoadableStateError(payload)
}));

manuscriptReducer.on(manuscriptActions.undoAction, (state) => ({
  ...state,
  data: undoChange(state.data)
}));

manuscriptReducer.on(manuscriptActions.redoAction, (state) => ({
  ...state,
  data: redoChange(state.data)
}));

manuscriptReducer.on(manuscriptActions.applyChangeAction, (state, payload) => ({
  ...state,
  data: updateManuscriptState(state.data, payload.path, payload.change)
}));

manuscriptReducer.on(manuscriptActions.updateTitleAction, updateTitle);
manuscriptReducer.on(manuscriptActions.updateAbstractAction, updateAbstract);
manuscriptReducer.on(manuscriptActions.updateImpactStatementAction, updateImpactStatement);
manuscriptReducer.on(manuscriptActions.updateAuthorAction, updateAuthor);
manuscriptReducer.on(manuscriptActions.addAuthorAction, addAuthor);
manuscriptReducer.on(manuscriptActions.updateArticleInformationAction, updateArticleInformation);
manuscriptReducer.on(manuscriptActions.moveAuthorAction, moveAuthor);
manuscriptReducer.on(manuscriptActions.deleteAuthorAction, deleteAuthor);
manuscriptReducer.on(manuscriptActions.updateAffiliationAction, updateAffiliation);
manuscriptReducer.on(manuscriptActions.addAffiliationAction, addAffiliation);
manuscriptReducer.on(manuscriptActions.deleteAffiliationAction, deleteAffiliation);
manuscriptReducer.on(manuscriptActions.updateRelatedArticleAction, updateRelatedArticle);
manuscriptReducer.on(manuscriptActions.addRelatedArticleAction, addRelatedArticle);
manuscriptReducer.on(manuscriptActions.deleteRelatedArticleAction, deleteRelatedArticle);
manuscriptReducer.on(manuscriptActions.linkAffiliationsAction, linkAffiliations);
manuscriptReducer.on(manuscriptActions.updateReferenceAction, updateReference);
manuscriptReducer.on(manuscriptActions.addReferenceAction, addReference);
manuscriptReducer.on(manuscriptActions.deleteReferenceAction, deleteReference);
manuscriptReducer.on(manuscriptActions.addNewKeywordAction, addKeyword);
manuscriptReducer.on(manuscriptActions.deleteKeywordAction, deleteKeyword);
manuscriptReducer.on(manuscriptActions.updateKeywordAction, updateKeyword);
manuscriptReducer.on(manuscriptActions.updateNewKeywordAction, updateNewKeyword);
