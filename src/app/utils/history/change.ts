import { Manuscript } from '../../types/manuscript';
import { JSONObject } from '../../types/utility.types';

export abstract class Change {
  abstract applyChange(manuscript: Manuscript): Manuscript;
  abstract rollbackChange(manuscript: Manuscript): Manuscript;
  abstract isPathAffected(pathPattern: RegExp): boolean;
  abstract get isEmpty(): boolean;
  abstract toJSON(): JSONObject;

  protected _timestamp: number;
  constructor() {
    this._timestamp = Date.now();
  }

  get timestamp(): number {
    return this._timestamp;
  }
}
