import { get, has, set } from 'lodash';
import { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import {
  ManuscriptChangeJSON,
  SerializableChanges,
  SerializableChangeType,
  SerializableObjectValue
} from 'app/types/changes.types';
import { ManuscriptDiff } from 'app/types/manuscript';

export function compressChanges(changes: Record<string, SerializableChanges>): Record<string, SerializableChanges> {
  const mergeOptions = Object.keys(changes).reduce((mergeAcc: Record<string, string>, path: string) => {
    const crumbs = path.split('.');

    for (let i = 1; i < crumbs.length; i++) {
      const changesPath = crumbs.slice(0, i);

      if (has(changes, changesPath.join('.'))) {
        mergeAcc[path] = changesPath.join('.');
        break;
      }
    }
    return mergeAcc;
  }, {});

  for (const [mergeSourcePath, mergeDestPath] of Object.entries(mergeOptions)) {
    changes[mergeDestPath] = mergeChanges(changes, mergeSourcePath, mergeDestPath);
    delete changes[mergeSourcePath];
  }

  return changes;
}

export function mergeChanges(
  changes: Record<string, SerializableChanges>,
  sourcePath: string,
  destPath: string
): SerializableChanges {
  const source = changes[sourcePath];
  const dest = changes[destPath];

  if (dest.timestamp > source.timestamp) {
    return dest;
  }

  if (dest.type === 'object' && source.type === 'object') {
    const pathToSourceInDest = sourcePath.replace(`${destPath}.`, '');
    set<SerializableObjectValue>(dest.object, pathToSourceInDest, source);
  } else if (source.type === 'steps' && dest.type === 'object') {
    const pathToSourceInDest = sourcePath.replace(`${destPath}.`, '');
    if (get(dest.object, pathToSourceInDest) instanceof EditorState) {
      const state = get(dest.object, pathToSourceInDest, source).tr;
      const transaction = state.tr;
      source.steps.forEach((stepJson) => {
        transaction.maybeStep(Step.fromJSON(state.schema, stepJson));
      });
      set(dest.object, pathToSourceInDest, state.apply(transaction));
    }
  }
  return dest;
}

export function reduceHistory(changes: ManuscriptDiff[]): Record<string, SerializableChanges> {
  return changes.reduce((acc: Record<string, SerializableChanges>, diff: ManuscriptDiff) => {
    Object.keys(diff).forEach((path) => {
      if (path === '_timestamp') {
        return;
      }

      const type: SerializableChangeType = diff[path] instanceof Transaction ? 'steps' : 'object';
      if (!acc[path]) {
        acc[path] = {
          path,
          type,
          timestamp: diff._timestamp
        };
      }

      if (diff[path] instanceof Transaction) {
        acc[path].steps = (acc[path].steps || []).concat((diff[path] as Transaction).steps);
      } else {
        acc[path].object = diff[path] as SerializableObjectValue;
      }
    });
    return acc;
  }, {});
}

export function applyServerChangesToEditorState(editorState: EditorState, change: ManuscriptChangeJSON): EditorState {
  if (change.type !== 'steps') {
    throw new TypeError('Invalid manuscript change type provided. Cannot make a transaction from an "object" change');
  }

  const transaction = editorState.tr;
  change.steps.forEach((stepJson) => {
    transaction.maybeStep(Step.fromJSON(editorState.schema, stepJson));
  });
  return editorState.apply(transaction);
}

export function applyEditorStateChanges(titleState: EditorState, changes: Array<ManuscriptChangeJSON>): EditorState {
  return changes.reduce((accState: EditorState, changeJson: ManuscriptChangeJSON) => {
    return applyServerChangesToEditorState(accState, changeJson);
  }, titleState);
}
