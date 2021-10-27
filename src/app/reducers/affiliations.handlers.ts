import { Affiliation } from '../models/affiliation';
import { Person } from '../models/person';
import { ManuscriptHistoryState } from '../store';
import { LinkAffiliationsPayload } from '../actions/manuscript.actions';
import { UpdateObjectChange } from '../utils/history/update-object-change';
import { BatchChange } from '../utils/history/batch-change';
import { RearrangingChange } from '../utils/history/rearranging-change';
import { DeleteObjectChange } from '../utils/history/delete-object-change';
import { AddObjectChange } from '../utils/history/add-object-change';

export function getReorderedAffiliations(authors: Person[], affiliations: Affiliation[]): BatchChange {
  const newAffiliations = affiliations.map((affiliation) => {
    const aff = affiliation.clone();
    aff.label = '';
    return aff;
  });

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

  const affiliationsUpdates = UpdateObjectChange.createFromTwoObjects('affiliations', affiliations, newAffiliations);

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
  const change = UpdateObjectChange.createFromTwoObjects(
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
  const affiliationsChange = new AddObjectChange('affiliations', payload, 'id');
  const updatedAffiliationsManuscript = affiliationsChange.applyChange(state.data.present);
  const rearrangeAffiliationsChange = getReorderedAffiliations(
    updatedAffiliationsManuscript.authors,
    updatedAffiliationsManuscript.affiliations
  );

  return {
    ...state,
    data: {
      past: [...state.data.past, new BatchChange([affiliationsChange, rearrangeAffiliationsChange])],
      present: rearrangeAffiliationsChange.applyChange(updatedAffiliationsManuscript),
      future: []
    }
  };
}

export function deleteAffiliation(state: ManuscriptHistoryState, payload: Affiliation): ManuscriptHistoryState {
  const affiliationsChange = new DeleteObjectChange('affiliations', payload, 'id');

  const updatedAffiliationsManuscript = affiliationsChange.applyChange(state.data.present);
  const rearrangeAffiliationsChange = getReorderedAffiliations(
    updatedAffiliationsManuscript.authors,
    updatedAffiliationsManuscript.affiliations
  );

  return {
    ...state,
    data: {
      past: [...state.data.past, new BatchChange([affiliationsChange, rearrangeAffiliationsChange])],
      present: rearrangeAffiliationsChange.applyChange(updatedAffiliationsManuscript),
      future: []
    }
  };
}

export function linkAffiliations(
  state: ManuscriptHistoryState,
  payload: LinkAffiliationsPayload
): ManuscriptHistoryState {
  const linkedAuthorsIds = new Set(payload.authors.map(({ id }) => id));
  const affiliatonChanges = state.data.present.authors
    .map((author, index) => {
      const affId = payload.affiliation.id;
      if (!linkedAuthorsIds.has(author.id) && author.affiliations.includes(affId)) {
        const updatedAuthor = author.clone();
        updatedAuthor.affiliations = author.affiliations.filter((id) => id !== affId);
        return UpdateObjectChange.createFromTwoObjects(`authors.${index}`, author, updatedAuthor);
      } else if (linkedAuthorsIds.has(author.id) && !author.affiliations.includes(affId)) {
        const updatedAuthor = author.clone();
        updatedAuthor.affiliations = [...author.affiliations, affId];
        return UpdateObjectChange.createFromTwoObjects(`authors.${index}`, author, updatedAuthor);
      }
      return null;
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
