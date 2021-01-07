import { cloneManuscript } from 'app/utils/state.utils';
import { Affiliation } from 'app/models/affiliation';
import { Person } from 'app/models/person';
import { ManuscriptHistoryState } from 'app/store';
import { LinkAffiliationsPayload } from 'app/actions/manuscript.actions';
import { ManuscriptDiff } from 'app/types/manuscript';
import { createDiff } from 'app/utils/history.utils';
import { ObjectChange } from 'app/utils/history/object-change';
import { BatchChange } from 'app/utils/history/change';
import { RearrangingChange } from 'app/utils/history/rearranging-change';

export function getReorderedAffiliations(authors: Person[], affiliations: Affiliation[]): BatchChange {
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

  const affiliationsUpdates = new ObjectChange('affiliations', affiliations, newAffiliations);

  const sortedAffiliations = [...newAffiliations].sort((a, b) => Number(a.label) - Number(b.label));
  const affiliationsSort = RearrangingChange.createFromListRearrange(
    'affiliations',
    newAffiliations,
    sortedAffiliations
  );
  return new BatchChange([affiliationsUpdates, affiliationsSort]);
}

export function updateAffiliation(state: ManuscriptHistoryState, payload: Affiliation): ManuscriptHistoryState {
  const affiliationIndex = state.data.present.affiliations.findIndex(({ id }) => id === payload.id);
  const change = new ObjectChange(
    `affiliations.${affiliationIndex}`,
    state.data.present.affiliations[affiliationIndex],
    payload
  );

  if (change.isEmpty) {
    return state;
  }

  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
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
  // newManuscript.affiliations = getReorderedAffiliations(newManuscript.authors, newManuscript.affiliations);

  return {
    ...state
    // data: {
    //   past: [...state.data.past, newDiff],
    //   present: newManuscript,
    //   future: []
    // }
  };
}

export function deleteAffiliation(state: ManuscriptHistoryState, payload: Affiliation): ManuscriptHistoryState {
  const currentIndex = state.data.present.affiliations.findIndex(({ id }) => id === payload.id);

  const newDiff: ManuscriptDiff = createDiff({ affiliations: state.data.present.affiliations });

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.affiliations.splice(currentIndex, 1);
  // newManuscript.affiliations = getReorderedAffiliations(newManuscript.authors, newManuscript.affiliations);

  return {
    ...state
    // data: {
    //   past: [...state.data.past, newDiff],
    //   present: newManuscript,
    //   future: []
    // }
  };
}

export function linkAffiliations(
  state: ManuscriptHistoryState,
  payload: LinkAffiliationsPayload
): ManuscriptHistoryState {
  const authorsIds = new Set(payload.authors.map(({ id }) => id));
  const affiliatonChanges = state.data.present.authors
    .map((author, index) => {
      const affId = payload.affiliation.id;
      if (!authorsIds.has(author.id) && author.affiliations.includes(affId)) {
        return new ObjectChange(`authors.${index}`, author, {
          ...author,
          affiliations: author.affiliations.filter((id) => id !== affId)
        });
      } else if (authorsIds.has(author.id) && !author.affiliations.includes(affId)) {
        author.affiliations.push(affId);
        return new ObjectChange(`authors.${index}`, author, {
          ...author,
          affiliations: [...author.affiliations, affId]
        });
      }
    })
    .filter((change) => change && !change.isEmpty);

  const authorsBatchChange = new BatchChange(affiliatonChanges);
  const updatedAuthorsManuscript = authorsBatchChange.applyChange(state.data.present);
  const affiliationsBatchChange = getReorderedAffiliations(
    updatedAuthorsManuscript.authors,
    updatedAuthorsManuscript.affiliations
  );

  return {
    ...state,
    data: {
      past: [...state.data.past, new BatchChange([authorsBatchChange, affiliationsBatchChange])],
      present: affiliationsBatchChange.applyChange(updatedAuthorsManuscript),
      future: []
    }
  };
}
