import { ManuscriptHistoryState } from 'app/store';
import { Reference } from 'app/models/reference';
import { cloneManuscript } from 'app/utils/state.utils';

export function updateReference(state: ManuscriptHistoryState, payload: Reference): ManuscriptHistoryState {
  const referenceIndex = state.data.present.references.findIndex(({ id }) => id === payload.id);

  const newDiff = {
    references: state.data.present.references
  };

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.references[referenceIndex] = payload;

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}

export function addReference(state: ManuscriptHistoryState, payload: Reference): ManuscriptHistoryState {
  const newDiff = {
    references: state.data.present.references
  };

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.references.push(payload);

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}

export function deleteReference(state: ManuscriptHistoryState, payload: Reference): ManuscriptHistoryState {
  const referenceIndex = state.data.present.references.findIndex(({ id }) => id === payload.id);

  const newDiff = {
    references: state.data.present.references
  };

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.references.splice(referenceIndex, 1);

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}
