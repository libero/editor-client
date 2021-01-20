import { get, set } from 'lodash';

import { Manuscript } from 'app/types/manuscript';
import { Change } from 'app/utils/history/change';
import { cloneManuscript } from 'app/utils/state.utils';
import { JSONObject } from 'app/types/utility.types';
import { manuscriptEntityToJson } from 'app/utils/changes.utils';

export class DeleteObjectChange<T> extends Change {
  public static fromJSON<T>(data: JSONObject): DeleteObjectChange<T> {
    const change = new DeleteObjectChange<T>(
      data.path as string,
      (data.object as unknown) as T,
      data.idField as string
    );
    change._timestamp = data.timestamp as number;
    return change;
  }

  private removedIndex: number;
  constructor(private path: string, private object: T, private idField: string) {
    super();
  }

  get isEmpty(): boolean {
    return false;
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
      object: manuscriptEntityToJson<T>(this.object)
    };
  }
}
