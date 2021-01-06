import { ManuscriptDiffValues } from 'app/types/manuscript';
import { Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';

export type SerializableChangeType = 'steps' | 'object';
export type SerializableObjectValue = Exclude<ManuscriptDiffValues, Transaction>;

export interface SerializableChanges {
  path: string;
  steps?: Step[];
  object?: SerializableObjectValue;
  timestamp: number;
  type: SerializableChangeType;
}

export type ManuscriptChangeJSON = {
  _id: string;
  articleId: string;
  applied: boolean;
  user: string;
} & SerializableChanges;

export interface ManuscriptChangesResponse {
  changes: Array<ManuscriptChangeJSON>;
}
