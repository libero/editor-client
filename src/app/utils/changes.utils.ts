import { cloneDeepWith } from 'lodash';
import { EditorState } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { ManuscriptChangeJSON } from 'app/types/changes.types';
import { JSONObject } from 'app/types/utility.types';

export function manuscriptEntityToJson<T>(object: T): JSONObject {
  return cloneDeepWith(object, (value) => {
    if (value instanceof EditorState) {
      return value.doc.toJSON();
    }
  });
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
