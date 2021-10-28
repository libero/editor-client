import { Transaction } from 'prosemirror-state';
import { ManuscriptHistoryState } from '../store';
import { updateManuscriptState } from '../utils/history.utils';

export function updateAcknowledgements(state: ManuscriptHistoryState, payload: Transaction): ManuscriptHistoryState {
  return {
    ...state,
    data: updateManuscriptState(state.data, 'acknowledgements', payload)
  };
}
