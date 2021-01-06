import { cloneManuscript } from 'app/utils/state.utils';
import { Affiliation } from 'app/models/affiliation';
import { Person } from 'app/models/person';
import { ManuscriptHistoryState } from 'app/store';
import { LinkAffiliationsPayload } from 'app/actions/manuscript.actions';
import { ManuscriptDiff } from 'app/types/manuscript';
import { createDiff } from 'app/utils/history.utils';

export function getReorderedAffiliations(authors: Person[], affiliations: Affiliation[]): Affiliation[] {
  const newAffiliations = affiliations.map((affiliation) => ({ ...affiliation, label: '' }));
  let labelIndex = 1;
  authors.forEach((author) => {
    author.affiliations.forEach((affId) => {
      const authorAffiliation = newAffiliations.find(({ id }) => id === affId);
      if (authorAffiliation && !authorAffiliation.label) {
        authorAffiliation.label = String(labelIndex++);
      }
    });
  });
  newAffiliations.forEach((affiliation) => {
    if (!affiliation.label) {
      affiliation.label = String(labelIndex++);
    }
  });
  newAffiliations.sort((a, b) => Number(a.label) - Number(b.label));
  return newAffiliations;
}

export function updateAffiliation(state: ManuscriptHistoryState, payload: Affiliation): ManuscriptHistoryState {
  const affiliationIndex = state.data.present.affiliations.findIndex(({ id }) => id === payload.id);

  const newDiff: ManuscriptDiff = createDiff({ affiliations: state.data.present.affiliations });

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.affiliations[affiliationIndex] = payload;
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

export function addAffiliation(state: ManuscriptHistoryState, payload: Affiliation): ManuscriptHistoryState {
  const newDiff: ManuscriptDiff = createDiff({ affiliations: state.data.present.affiliations });

  const newManuscript = cloneManuscript(state.data.present);
  const newAffiliation = payload;
  newAffiliation.label = newAffiliation.label || String(newManuscript.affiliations.length + 1);
  newManuscript.affiliations.push(newAffiliation);
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

export function deleteAffiliation(state: ManuscriptHistoryState, payload: Affiliation): ManuscriptHistoryState {
  const currentIndex = state.data.present.affiliations.findIndex(({ id }) => id === payload.id);

  const newDiff: ManuscriptDiff = createDiff({ affiliations: state.data.present.affiliations });

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.affiliations.splice(currentIndex, 1);
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

export function linkAffiliations(
  state: ManuscriptHistoryState,
  payload: LinkAffiliationsPayload
): ManuscriptHistoryState {
  const newDiff: ManuscriptDiff = createDiff({
    authors: state.data.present.authors,
    affiliations: state.data.present.affiliations
  });

  const authorsIds = new Set(payload.authors.map(({ id }) => id));
  const newManuscript = cloneManuscript(state.data.present);

  newManuscript.authors.forEach((author) => {
    const affId = payload.affiliation.id;
    if (!authorsIds.has(author.id) && author.affiliations.includes(affId)) {
      author.affiliations = author.affiliations.filter((id) => id !== affId);
    } else if (authorsIds.has(author.id) && !author.affiliations.includes(affId)) {
      author.affiliations.push(affId);
    }
  });

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
