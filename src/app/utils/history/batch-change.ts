import { Manuscript } from 'app/types/manuscript';
import { JSONObject } from 'app/types/utility.types';
import { deserializeChanges } from 'app/utils/changes.utils';
import { Change } from 'app/utils/history/change';

export class BatchChange extends Change {
  static fromJSON(data: JSONObject): BatchChange {
    const change = new BatchChange(deserializeChanges(data.changes as JSONObject[]));
    change._timestamp = data.timestamp as number;
    return change;
  }

  private changes: Change[];
  constructor(changes: Change[] = []) {
    super();
    this.changes = changes.filter((change) => !change.isEmpty);
  }

  get isEmpty(): boolean {
    return !Array.isArray(this.changes) || this.changes.length === 0;
  }

  isPathAffected(pathPattern: RegExp): boolean {
    return this.changes.some((change) => change.isPathAffected(pathPattern));
  }

  applyChange(manuscript: Manuscript): Manuscript {
    return this.changes.reduce((acc: Manuscript, change: Change) => {
      try {
        return change.applyChange(acc);
      } catch (e) {
        console.log(`Failed to apply change`);
        console.log(e);
      }
      return manuscript;
    }, manuscript);
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    return this.changes.reduceRight((acc: Manuscript, change: Change) => {
      return change.rollbackChange(acc);
    }, manuscript);
  }

  toJSON(): JSONObject {
    return {
      type: 'batch',
      changes: this.changes.map((change) => change.toJSON()),
      timestamp: this.timestamp
    };
  }
}
