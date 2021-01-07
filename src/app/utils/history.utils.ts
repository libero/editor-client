import { Transaction } from 'prosemirror-state';

import { ManuscriptHistory } from './state.utils';
import { ManuscriptDiff, ManuscriptDiffValues } from 'app/types/manuscript';
import { ProsemirrorChange } from 'app/utils/history/prosemirror-change';

export function updateManuscriptState(
  state: ManuscriptHistory,
  propName: string,
  transaction: Transaction
): ManuscriptHistory {
  const change = new ProsemirrorChange(propName, transaction);

  if (transaction.docChanged) {
    return {
      past: [...state.past, change],
      present: change.applyChange(state.present),
      future: []
    } as ManuscriptHistory;
  } else {
    return {
      ...state,
      present: change.applyChange(state.present)
    };
  }
}

export function undoChange(state: ManuscriptHistory): ManuscriptHistory {
  const past = [...state.past];
  const change = past.pop();

  return {
    past,
    present: change.rollbackChange(state.present),
    future: [change, ...state.future]
  };
}

export function createDiff(changes: Record<string, ManuscriptDiffValues>): ManuscriptDiff {
  return {
    ...changes,
    _timestamp: Date.now()
  } as ManuscriptDiff;
}

export function redoChange(state: ManuscriptHistory): ManuscriptHistory {
  const future = [...state.future];
  const change = future.shift();

  return {
    past: [...state.past, change],
    present: change.applyChange(state.present),
    future: future
  };
}
