import { Manuscript } from 'app/types/manuscript';

export abstract class Change {
  abstract applyChange(manuscript: Manuscript): Manuscript;
  abstract rollbackChange(manuscript: Manuscript): Manuscript;
  abstract get isEmpty(): boolean;

  private _timestamp: number;
  constructor() {
    this._timestamp = Date.now();
  }

  get timestamp(): number {
    return this._timestamp;
  }
}

export class BatchChange extends Change {
  private changes: Change[];
  constructor(changes: Change[] = []) {
    super();
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
