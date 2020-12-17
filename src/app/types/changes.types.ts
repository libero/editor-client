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

export interface ManuscriptChangeJSON {
  _id: string;
  articleId: string;
  steps?: Array<ReturnType<Step['toJSON']>>;
  applied: boolean;
  user: string;
  path: string;
  type: SerializableChangeType;
  timestamp: number;
}

export interface ManuscriptChangesResponse {
  changes: Array<ManuscriptChangeJSON>;
}
