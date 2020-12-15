import { set, get } from 'lodash';
import { EditorState, Transaction } from 'prosemirror-state';

import { cloneManuscript, ManuscriptHistory } from './state.utils';
import { Manuscript, ManuscriptDiff, ManuscriptDiffValues } from 'app/models/manuscript';

export function updateManuscriptState(
  state: ManuscriptHistory,
  propName: string,
  transaction: Transaction
): ManuscriptHistory {
  const updatedManuscript = applyDiffToManuscript(state.present, createDiff({ [propName]: transaction }));

  // only update history when document changes
  if (transaction.docChanged) {
    return {
      past: [...state.past, createDiff({ [propName]: transaction })],
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

  const redoDiff = makeRollbackDiff(state.present, diff);

  return {
    past,
    present: updatedManuscript,
    future: [redoDiff, ...state.future]
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
  const diff = future.shift();

  const updatedManuscript = applyDiffToManuscript(state.present, diff);

  const undoDiff = makeRollbackDiff(state.present, diff);

  return {
    past: [...state.past, undoDiff],
    present: updatedManuscript,
    future: future
  };
}

function invertDiff(manuscript: Manuscript, diff: ManuscriptDiff): ManuscriptDiff {
  const invertedDiff = Object.keys(diff).reduce((acc, key) => {
    if (!diff[key]) {
      return acc;
    }

    if (diff[key] instanceof Transaction) {
      const invertedSteps = (diff[key] as Transaction).steps.map((step, index) => {
        return step.invert((diff[key] as Transaction).docs[index]);
      });
      const invertedTransaction = get(manuscript, key).tr;
      invertedSteps.reverse().forEach((step) => invertedTransaction.maybeStep(step));
      acc[key] = invertedTransaction;
    } else {
      acc[key] = diff[key];
    }
    return acc;
  }, {} as ManuscriptDiff);
  invertedDiff._timestamp = Date.now();
  return invertedDiff;
}

function applyDiffToManuscript(manuscript: Manuscript, diff: ManuscriptDiff): Manuscript {
  const newManuscript = cloneManuscript(manuscript);

  Object.keys(diff).forEach((changePath) => {
    if (changePath === '_timestamp') {
      return;
    }

    if (diff[changePath] instanceof Transaction) {
      const updatedState = (get(newManuscript, changePath) as EditorState).apply(diff[changePath] as Transaction);
      set(newManuscript, changePath, updatedState);
    } else {
      set(newManuscript, changePath, diff[changePath]);
    }
  });

  return newManuscript;
}

function makeRollbackDiff(manuscript: Manuscript, undoDiff: ManuscriptDiff): ManuscriptDiff {
  const diff = Object.keys(undoDiff).reduce((acc, changePath) => {
    acc[changePath] = undoDiff[changePath] instanceof Transaction ? undoDiff[changePath] : get(manuscript, changePath);
    return acc;
  }, {} as ManuscriptDiff);
  diff._timestamp = Date.now();
  return diff;
}
