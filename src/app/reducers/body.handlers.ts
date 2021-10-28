import { Transaction } from 'prosemirror-state';

import { ManuscriptHistoryState } from '../store';
import { updateManuscriptState } from '../utils/history.utils';

export function updateBody(state: ManuscriptHistoryState, payload: Transaction): ManuscriptHistoryState {
  return {
    ...state,
    data: updateManuscriptState(state.data, 'body', payload)
  };
}
