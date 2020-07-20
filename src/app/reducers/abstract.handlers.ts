import { Transaction } from 'prosemirror-state';
import { ManuscriptHistoryState } from 'app/store';
import { updateManuscriptState } from 'app/utils/history.utils';

export function updateAbstract(state: ManuscriptHistoryState, payload: Transaction): ManuscriptHistoryState {
  return {
    ...state,
    data: updateManuscriptState(state.data, 'abstract', payload)
  };
}

export function updateImpactStatement(state: ManuscriptHistoryState, payload: Transaction): ManuscriptHistoryState {
  return {
    ...state,
    data: updateManuscriptState(state.data, 'impactStatement', payload)
  };
}
