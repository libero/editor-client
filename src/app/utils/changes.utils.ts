import { cloneDeepWith } from 'lodash';
import { EditorState } from 'prosemirror-state';
import { JSONObject } from 'app/types/utility.types';
import { Manuscript } from 'app/types/manuscript';
import { Change } from 'app/utils/history/change';
import { BatchChange } from 'app/utils/history/batch-change';
import { ProsemirrorChange } from 'app/utils/history/prosemirror-change';
import { RearrangingChange } from 'app/utils/history/rearranging-change';

export function manuscriptEntityToJson<T>(object: T): JSONObject {
  return cloneDeepWith(object, (value) => {
    if (value instanceof EditorState) {
      return value.doc.toJSON();
    }
  });
}

export function deserializeChanges(manuscript: Manuscript, changesJson: JSONObject[]): Change[] {
  return changesJson.map((changeData) => {
    switch (changeData.type) {
      case 'prosemirror':
        return ProsemirrorChange.fromJSON(manuscript, changeData);

      case 'rearranging':
        return RearrangingChange.fromJSON(changeData);

      case 'batch':
        return BatchChange.fromJSON(manuscript, changeData);

      default:
        throw new TypeError(
          `Cannot deserialize ${changeData.type} change. Change type invalid, JSON object malformed or handling not supported.`
        );
    }
  });
}

export function applyChangesFromServer(manuscript: Manuscript, changesJson: JSONObject[]): Manuscript {
  const allChanges = new BatchChange(deserializeChanges(manuscript, changesJson));
  return allChanges.applyChange(manuscript);
}
