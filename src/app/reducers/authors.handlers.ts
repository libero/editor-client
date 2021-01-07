import { Person } from 'app/models/person';
import { ManuscriptHistoryState } from 'app/store';
import { MoveAuthorPayload } from 'app/actions/manuscript.actions';
import { RearrangingChange } from 'app/utils/history/rearranging-change';
import { BatchChange } from 'app/utils/history/change';
import { getReorderedAffiliations } from 'app/reducers/affiliations.handlers';

export function updateAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  // const authorIndex = state.data.present.authors.findIndex(({ id }) => id === payload.id);
  //
  // const newDiff: ManuscriptDiff = createDiff({
  //   [`authors.${authorIndex}`]: state.data.present.authors[authorIndex],
  //   affiliations: state.data.present.affiliations
  // });
  //
  // const newManuscript = cloneManuscript(state.data.present);
  // newManuscript.authors[authorIndex] = payload;
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

export function addAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  // const newDiff: ManuscriptDiff = createDiff({
  //   authors: state.data.present.authors,
  //   affiliations: state.data.present.affiliations
  // });
  //
  // const newManuscript = cloneManuscript(state.data.present);
  // newManuscript.authors.push(payload);
  // newManuscript.affiliations = getReorderedAffiliations(newManuscript.authors, newManuscript.affiliations);
  //

  return {
    ...state
    //   data: {
    //     past: [...state.data.past, newDiff],
    //     present: newManuscript,
    //     future: []
    //   }
  };
}

export function moveAuthor(state: ManuscriptHistoryState, payload: MoveAuthorPayload): ManuscriptHistoryState {
  const { index, author } = payload;
  const currentIndex = state.data.present.authors.findIndex(({ id }) => id === author.id);
  const changeAuthors = RearrangingChange.createFromItemMoved(
    'authors',
    currentIndex,
    index,
    state.data.present.authors
  );

  // const newManuscript = changeAuthors.applyChange(state.data.present);
  // const newAffiliations = getReorderedAffiliations(newManuscript.authors, newManuscript.affiliations);
  //
  // const changeAffiliations = RearrangingChange.createFromListRearrange(
  //   'affiliations',
  //   state.data.present.affiliations,
  //   newAffiliations
  // );

  const change = new BatchChange([changeAuthors /*, changeAffiliations*/]);
  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
      future: []
    }
  };
}

export function deleteAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  // const currentIndex = state.data.present.authors.findIndex(({ id }) => id === payload.id);
  //
  // const newDiff: ManuscriptDiff = createDiff({
  //   authors: state.data.present.authors,
  //   affiliations: state.data.present.affiliations
  // });
  //
  // const newManuscript = cloneManuscript(state.data.present);
  // newManuscript.authors.splice(currentIndex, 1);
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
