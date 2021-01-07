import { get, set, cloneDeep } from 'lodash';
import * as deepDiff from 'deep-diff';

import { Manuscript } from 'app/types/manuscript';

export interface Change {
  applyChange(manuscript: Manuscript): Manuscript;
  rollbackChange(manuscript: Manuscript): Manuscript;
  readonly isEmpty: boolean;
}

export class BatchChange implements Change {
  private changes: Change[];
  constructor(changes: Change[] = []) {
    this.changes = changes.filter((change) => !change.isEmpty);
  }

  get isEmpty(): boolean {
    return !Array.isArray(this.changes) || this.changes.length === 0;
  }

  applyChange(manuscript: Manuscript): Manuscript {
    return this.changes.reduce(
      (acc: Manuscript, change: Change) => {
        return change.applyChange(acc);
      },
      { ...manuscript }
    );
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    return this.changes.reduceRight(
      (acc: Manuscript, change: Change) => {
        return change.rollbackChange(acc);
      },
      { ...manuscript }
    );
  }
}
