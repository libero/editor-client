import { Transaction } from 'prosemirror-state';
import { ManuscriptHistoryState } from '../store';
import { updateManuscriptState } from '../utils/history.utils';

export function updateTitle(state: ManuscriptHistoryState, payload: Transaction): ManuscriptHistoryState {
  return {
    ...state,
    data: updateManuscriptState(state.data, 'title', payload)
  };
}
