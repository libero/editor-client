import { Person } from 'app/models/person';
import { ManuscriptHistoryState } from 'app/store';
import { MoveAuthorPayload } from 'app/actions/manuscript.actions';
import { RearrangingChange } from 'app/utils/history/rearranging-change';
import { BatchChange } from 'app/utils/history/batch-change';
import { getReorderedAffiliations } from 'app/reducers/affiliations.handlers';
import { UpdateObjectChange } from 'app/utils/history/update-object-change';
import { AddObjectChange } from 'app/utils/history/add-object-change';
import { DeleteObjectChange } from 'app/utils/history/delete-object-change';

export function updateAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  const authorIndex = state.data.present.authors.findIndex(({ id }) => id === payload.id);

  const authorUpdateChange = UpdateObjectChange.createFromTwoObjects(
    `authors.${authorIndex}`,
    state.data.present.authors[authorIndex],
    payload
  );

  const updatedManuscript = authorUpdateChange.applyChange(state.data.present);
  const affiliationsReorderChange = getReorderedAffiliations(updatedManuscript.authors, updatedManuscript.affiliations);

  return {
    ...state,
    data: {
      past: [...state.data.past, new BatchChange([authorUpdateChange, affiliationsReorderChange])],
      present: affiliationsReorderChange.applyChange(updatedManuscript),
      future: []
    }
  };
}

export function addAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  const addAuthorChange = new AddObjectChange('authors', payload, 'id');

  const updatedManuscript = addAuthorChange.applyChange(state.data.present);
  const affiliationsReorderChange = getReorderedAffiliations(updatedManuscript.authors, updatedManuscript.affiliations);

  return {
    ...state,
    data: {
      past: [...state.data.past, new BatchChange([addAuthorChange, affiliationsReorderChange])],
      present: affiliationsReorderChange.applyChange(updatedManuscript),
      future: []
    }
  };
}

export function moveAuthor(state: ManuscriptHistoryState, payload: MoveAuthorPayload): ManuscriptHistoryState {
  const { index, author } = payload;
  const currentIndex = state.data.present.authors.findIndex(({ id }) => id === author.id);
  const rearrangeAuthors = RearrangingChange.createFromItemMoved(
    'authors',
    currentIndex,
    index,
    state.data.present.authors
  );

  const updatedManuscript = rearrangeAuthors.applyChange(state.data.present);
  const affiliationsReorderChange = getReorderedAffiliations(updatedManuscript.authors, updatedManuscript.affiliations);

  const change = new BatchChange([rearrangeAuthors, affiliationsReorderChange]);
  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: affiliationsReorderChange.applyChange(updatedManuscript),
      future: []
    }
  };
}

export function deleteAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  const deleteAuthorChange = new DeleteObjectChange('authors', payload, 'id');

  const updatedManuscript = deleteAuthorChange.applyChange(state.data.present);
  const affiliationsReorderChange = getReorderedAffiliations(updatedManuscript.authors, updatedManuscript.affiliations);

  return {
    ...state,
    data: {
      past: [...state.data.past, new BatchChange([deleteAuthorChange, affiliationsReorderChange])],
      present: affiliationsReorderChange.applyChange(updatedManuscript),
      future: []
    }
  };
}
