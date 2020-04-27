import { set, get } from 'lodash';
import { EditorState, Transaction } from 'prosemirror-state';

import { cloneManuscript, ManuscriptHistory } from './state.utils';
import { Manuscript, ManuscriptDiff } from '../models/manuscript';

export function updateManuscriptState(
  state: ManuscriptHistory,
  propName: string,
  transaction: Transaction
): ManuscriptHistory {
  const updatedManuscript = applyDiffToManuscript(state.present, { [propName]: transaction });

  // only update history when document changes
  if (transaction.docChanged) {
    return {
      past: [...state.past, { [propName]: transaction }],
      present: updatedManuscript,
      future: []
    } as ManuscriptHistory;
  } else {
    return {
      ...state,
      present: updatedManuscript
    };
  }
}

export function undoChange(state: ManuscriptHistory): ManuscriptHistory {
  const past = [...state.past];
  const diff = past.pop();
  const undoDiff = invertDiff(state.present, diff);

  const updatedManuscript = applyDiffToManuscript(state.present, undoDiff);

  return {
    past,
    present: updatedManuscript,
    future: [diff, ...state.future]
  };
}

export function redoChange(state: ManuscriptHistory): ManuscriptHistory {
  const future = [...state.future];
  const diff = future.shift();

  const updatedManuscript = applyDiffToManuscript(state.present, diff);

  return {
    past: [...state.past, diff],
    present: updatedManuscript,
    future: future
  };
}

function invertDiff(manuscript: Manuscript, diff: ManuscriptDiff): ManuscriptDiff {
  return Object.keys(diff).reduce((acc, key) => {
    if (!diff[key]) {
      return acc;
    }

    if (diff[key] instanceof Transaction) {
      const invertedSteps = diff[key].steps.map((step) => step.invert(diff[key].doc));
      const invertedTransaction = get(manuscript, key).tr;
      invertedSteps.reverse().forEach((step) => invertedTransaction.maybeStep(step));
      acc[key] = invertedTransaction;
    } else {
      acc[key] = diff[key];
    }
    return acc;
  }, {} as ManuscriptDiff);
}

function applyDiffToManuscript(manuscript: Manuscript, diff: ManuscriptDiff): Manuscript {
  const newManuscript = cloneManuscript(manuscript);

  Object.keys(diff).forEach((changePath) => {
    if (diff[changePath] instanceof Transaction) {
      const updatedState = (get(newManuscript, changePath) as EditorState).apply(diff[changePath]);
      set(newManuscript, changePath, updatedState);
    } else {
      set(newManuscript, changePath, diff[changePath]);
    }
  });

  return newManuscript;
}
