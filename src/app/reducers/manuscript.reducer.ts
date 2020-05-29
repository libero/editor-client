import { Manuscript } from 'app/models/manuscript';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import {
  cloneManuscript,
  getInitialHistory,
  getInitialLoadableState,
  getLoadableStateError,
  getLoadableStateProgress,
  getLoadableStateSuccess,
  ManuscriptHistory
} from 'app/utils/state.utils';
import { ManuscriptHistoryState } from 'app/store';
import { redoChange, undoChange, updateManuscriptState } from 'app/utils/history.utils';
import { Transaction } from 'prosemirror-state';
import {
  KeywordAddPayload,
  KeywordDeletePayload,
  KeywordUpdatePayload,
  MoveAuthorPayload,
  NewKeywordUpdatePayload
} from 'app/actions/manuscript.actions';
import { Action } from 'app/utils/action.utils';
import { createNewKeywordState } from 'app/models/manuscript-state.factory';
import { Person } from 'app/models/person';
import { Affiliation } from 'app/models/affiliation';

const initialState = getInitialLoadableState() as ManuscriptHistoryState;

export function manuscriptReducer(
  state: ManuscriptHistoryState = initialState,
  action: manuscriptActions.ActionType
): ManuscriptHistoryState {
  switch (action.type) {
    case manuscriptActions.loadManuscriptAction.request.type:
      return {
        ...state,
        ...getLoadableStateProgress()
      };
    case manuscriptActions.loadManuscriptAction.success.type:
      return {
        ...state,
        ...getLoadableStateSuccess(getInitialHistory(action.payload as Manuscript))
      };

    case manuscriptActions.loadManuscriptAction.error.type:
      return {
        ...state,
        ...getLoadableStateError(action.payload as Error)
      };

    case manuscriptActions.updateTitleAction.type:
      return {
        ...state,
        data: updateManuscriptState(state.data, 'title', action.payload as Transaction)
      };

    case manuscriptActions.updateAuthorAction.type:
      return {
        ...state,
        data: handleAuthorUpdate(state.data, action as Action<Person>)
      };

    case manuscriptActions.addAuthorAction.type:
      return {
        ...state,
        data: handleAuthorAdd(state.data, action as Action<Person>)
      };

    case manuscriptActions.moveAuthorAction.type:
      return {
        ...state,
        data: handleAuthorMove(state.data, action as Action<MoveAuthorPayload>)
      };

    case manuscriptActions.deleteAuthorAction.type:
      return {
        ...state,
        data: handleAuthorDelete(state.data, action as Action<Person>)
      };

    case manuscriptActions.deleteAffiliationAction.type:
      return {
        ...state,
        data: handleAffiliationDelete(state.data, action as Action<Affiliation>)
      };

    case manuscriptActions.addAffiliationAction.type:
      return {
        ...state,
        data: handleAffiliationAdd(state.data, action as Action<Affiliation>)
      };

    case manuscriptActions.updateAffiliationAction.type:
      return {
        ...state,
        data: handleAffiliationUpdate(state.data, action as Action<Affiliation>)
      };

    case manuscriptActions.updateAbstractAction.type:
      return {
        ...state,
        data: updateManuscriptState(state.data, 'abstract', action.payload as Transaction)
      };

    case manuscriptActions.updateKeywordAction.type:
      const updatePayload = action.payload as KeywordUpdatePayload;
      const keywordPath = ['keywordGroups', updatePayload.keywordGroup, 'keywords', updatePayload.index].join('.');
      return {
        ...state,
        data: updateManuscriptState(state.data, keywordPath, updatePayload.change)
      };

    case manuscriptActions.updateNewKeywordAction.type:
      const newKeywordUpdatePayload = action.payload as NewKeywordUpdatePayload;
      const newKeywordPath = ['keywordGroups', newKeywordUpdatePayload.keywordGroup, 'newKeyword'].join('.');
      return {
        ...state,
        data: updateManuscriptState(state.data, newKeywordPath, newKeywordUpdatePayload.change)
      };

    case manuscriptActions.deleteKeywordAction.type:
      return {
        ...state,
        data: handleDeleteKeywordAction(state.data, action as Action<KeywordDeletePayload>)
      };

    case manuscriptActions.addNewKeywordAction.type:
      return {
        ...state,
        data: handleAddNewKeywordAction(state.data, action as Action<KeywordAddPayload>)
      };

    case manuscriptActions.undoAction.type:
      return {
        ...state,
        data: undoChange(state.data)
      };
    case manuscriptActions.redoAction.type:
      return {
        ...state,
        data: redoChange(state.data)
      };

    default:
      return state;
  }
}

function handleAuthorUpdate(state: ManuscriptHistory, action: Action<Person>): ManuscriptHistory {
  const authorIndex = state.present.authors.findIndex(({ id }) => id === action.payload.id);

  const newDiff = {
    [`authors.${authorIndex}`]: state.present.authors[authorIndex]
  };

  const newManuscript = cloneManuscript(state.present);
  newManuscript.authors[authorIndex] = action.payload;

  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}

function handleAuthorAdd(state: ManuscriptHistory, action: Action<Person>): ManuscriptHistory {
  const newDiff = {
    authors: state.present.authors
  };

  const newManuscript = cloneManuscript(state.present);
  newManuscript.authors.push(action.payload);
  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}

function handleAuthorMove(state: ManuscriptHistory, action: Action<MoveAuthorPayload>): ManuscriptHistory {
  const { index, author } = action.payload;
  const currentIndex = state.present.authors.findIndex(({ id }) => id === author.id);

  const newDiff = {
    authors: state.present.authors
  };

  const newManuscript = cloneManuscript(state.present);
  newManuscript.authors.splice(currentIndex, 1);
  newManuscript.authors.splice(index, 0, author);

  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}

function handleAffiliationUpdate(state: ManuscriptHistory, action: Action<Affiliation>): ManuscriptHistory {
  const affiliationIndex = state.present.affiliations.findIndex(({ id }) => id === action.payload.id);

  const newDiff = {
    [`authors.${affiliationIndex}`]: state.present.affiliations[affiliationIndex]
  };

  const newManuscript = cloneManuscript(state.present);
  newManuscript.affiliations[affiliationIndex] = action.payload;

  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}

function handleAuthorDelete(state: ManuscriptHistory, action: Action<Person>): ManuscriptHistory {
  const currentIndex = state.present.authors.findIndex(({ id }) => id === action.payload.id);

  const newDiff = {
    authors: state.present.authors
  };

  const newManuscript = cloneManuscript(state.present);
  newManuscript.authors.splice(currentIndex, 1);

  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}

function handleAffiliationAdd(state: ManuscriptHistory, action: Action<Affiliation>): ManuscriptHistory {
  const newDiff = {
    affiliations: state.present.affiliations
  };

  const newManuscript = cloneManuscript(state.present);
  newManuscript.affiliations.push(action.payload);
  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}

function handleAffiliationDelete(state: ManuscriptHistory, action: Action<Affiliation>): ManuscriptHistory {
  const currentIndex = state.present.affiliations.findIndex(({ id }) => id === action.payload.id);

  const newDiff = {
    affiliations: state.present.affiliations
  };

  const newManuscript = cloneManuscript(state.present);
  newManuscript.authors.splice(currentIndex, 1);

  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}

function handleDeleteKeywordAction(state: ManuscriptHistory, action: Action<KeywordDeletePayload>): ManuscriptHistory {
  const { keywordGroup, index } = action.payload as KeywordDeletePayload;
  const newManuscript = cloneManuscript(state.present);
  newManuscript.keywordGroups[keywordGroup].keywords.splice(index, 1);
  const newDiff = {
    [`keywordGroups.${keywordGroup}`]: state.present.keywordGroups[keywordGroup]
  };

  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}

function handleAddNewKeywordAction(state: ManuscriptHistory, action: Action<KeywordAddPayload>): ManuscriptHistory {
  const { keywordGroup, keyword } = action.payload as KeywordAddPayload;
  const newManuscript = cloneManuscript(state.present);
  newManuscript.keywordGroups[keywordGroup].keywords.push(keyword);
  newManuscript.keywordGroups[keywordGroup].newKeyword = createNewKeywordState();
  const newDiff = {
    [`keywordGroups.${keywordGroup}`]: state.present.keywordGroups[keywordGroup]
  };

  return {
    past: [...state.past, newDiff],
    present: newManuscript,
    future: []
  };
}
