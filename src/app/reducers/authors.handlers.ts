import { cloneManuscript } from 'app/utils/state.utils';
import { Person } from 'app/models/person';
import { ManuscriptHistoryState } from 'app/store';
import { MoveAuthorPayload } from 'app/actions/manuscript.actions';
import { getReorderedAffiliations } from 'app/reducers/affiliations.handlers';
import { getCopyrightStatement, LICENSE_CC_BY_4 } from 'app/models/article-information';
import { Manuscript } from 'app/models/manuscript';

export function updateAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  const authorIndex = state.data.present.authors.findIndex(({ id }) => id === payload.id);

  const newDiff = {
    [`authors.${authorIndex}`]: state.data.present.authors[authorIndex],
    affiliations: state.data.present.affiliations
  };

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.authors[authorIndex] = payload;
  newManuscript.affiliations = getReorderedAffiliations(newManuscript.authors, newManuscript.affiliations);

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}

export function addAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  const newDiff = {
    authors: state.data.present.authors,
    affiliations: state.data.present.affiliations
  };

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.authors.push(payload);
  newManuscript.affiliations = getReorderedAffiliations(newManuscript.authors, newManuscript.affiliations);

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}

export function moveAuthor(state: ManuscriptHistoryState, payload: MoveAuthorPayload): ManuscriptHistoryState {
  const { index, author } = payload;
  const currentIndex = state.data.present.authors.findIndex(({ id }) => id === author.id);

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.authors.splice(currentIndex, 1);
  newManuscript.authors.splice(index, 0, author);
  newManuscript.affiliations = getReorderedAffiliations(newManuscript.authors, newManuscript.affiliations);

  const newDiff: Partial<Manuscript> = {
    authors: state.data.present.authors,
    affiliations: state.data.present.affiliations
  };

  if (state.data.present.articleInfo.licenseType === LICENSE_CC_BY_4) {
    newManuscript.articleInfo.copyrightStatement = getCopyrightStatement(
      newManuscript.authors,
      state.data.present.articleInfo.publicationDate
    );
    newDiff.articleInfo = state.data.present.articleInfo;
  }

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}

export function deleteAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  const currentIndex = state.data.present.authors.findIndex(({ id }) => id === payload.id);

  const newDiff = {
    authors: state.data.present.authors,
    affiliations: state.data.present.affiliations
  };

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.authors.splice(currentIndex, 1);
  newManuscript.affiliations = getReorderedAffiliations(newManuscript.authors, newManuscript.affiliations);

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}
