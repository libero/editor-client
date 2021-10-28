import { get, set } from 'lodash';

import { Manuscript } from '../../types/manuscript';
import { Change } from './change';
import { cloneManuscript } from '../state.utils';
import { JSONObject } from '../../types/utility.types';
import { deserializeBackmatter, manuscriptEntityToJson } from '../changes.utils';
import { BackmatterEntity } from '../../models/backmatter-entity';

export class DeleteObjectChange extends Change {
  public static fromJSON(data: JSONObject): DeleteObjectChange {
    const change = new DeleteObjectChange(
      data.path as string,
      deserializeBackmatter(data.path as string, data.object as JSONObject),
      data.idField as string
    );
    change._timestamp = data.timestamp as number;
    return change;
  }

  private removedIndex: number;
  constructor(private path: string, private object: BackmatterEntity, private idField: string) {
    super();
  }

  get isEmpty(): boolean {
    return false;
  }

  isPathAffected(pathPattern: RegExp): boolean {
    return pathPattern.test(this.path);
  }

  applyChange(manuscript: Manuscript): Manuscript {
    const originalSection = get(manuscript, this.path);

    if (!Array.isArray(originalSection)) {
      throw new TypeError('Trying to make DeleteObject change on a non-array section');
    }
    this.removedIndex = originalSection.findIndex((item) => item[this.idField] === this.object[this.idField]);
    const updatedSection = [...originalSection];
    updatedSection.splice(this.removedIndex, 1);
    return set(cloneManuscript(manuscript), this.path, updatedSection);
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    const updatedSection = [...get(manuscript, this.path)];

    if (!Array.isArray(updatedSection)) {
      throw new TypeError('Trying to rollback DeleteObject change on a non-array section');
    }
    updatedSection.splice(this.removedIndex, 0, this.object);
    return set(cloneManuscript(manuscript), this.path, updatedSection);
  }

  toJSON(): JSONObject {
    return {
      type: 'delete-object',
      timestamp: this.timestamp,
      path: this.path,
      removedIndex: this.removedIndex,
      idField: this.idField,
      object: manuscriptEntityToJson(this.object)
    };
  }
}
