import { Manuscript, ManuscriptDiff } from '../models/manuscript';
import { ManuscriptHistory } from './state.utils';
import { Transaction } from 'prosemirror-state';

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

    const invertedSteps = diff[key].steps.map((step) => step.invert(diff[key].doc));
    const invertedTransaction = manuscript[key].tr;

    invertedSteps.reverse().forEach((step) => invertedTransaction.maybeStep(step));
    acc[key] = invertedTransaction;
    return acc;
  }, {} as ManuscriptDiff);
}

function applyDiffToManuscript(manuscript: Manuscript, diff: ManuscriptDiff): Manuscript {
  return Object.keys(manuscript).reduce((acc, propName) => {
    acc[propName] = diff[propName] ? manuscript[propName].apply(diff[propName]) : manuscript[propName];
    return acc;
  }, {} as Manuscript);
}
