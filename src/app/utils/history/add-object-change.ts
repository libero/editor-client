import { get, set } from 'lodash';

import { Manuscript } from 'app/types/manuscript';
import { Change } from 'app/utils/history/change';
import { cloneManuscript } from 'app/utils/state.utils';
import { JSONObject } from 'app/types/utility.types';
import { manuscriptEntityToJson } from 'app/utils/changes.utils';

export class AddObjectChange<T> extends Change {
  constructor(private path: string, private object: T, private idField: string) {
    super();
  }

  get isEmpty(): boolean {
    return false;
  }

  applyChange(manuscript: Manuscript): Manuscript {
    const originalSection = get(manuscript, this.path);

    if (!Array.isArray(originalSection)) {
      throw new TypeError('Trying to make AddObject change on a non-array section');
    }

    return set(cloneManuscript(manuscript), this.path, [...originalSection, this.object]);
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    const originalSection = get(manuscript, this.path);

    if (!Array.isArray(originalSection)) {
      throw new TypeError('Trying to rollback AddObject change on a non-array section');
    }
    const updatedSection = originalSection.filter((item) => item[this.idField] !== this.object[this.idField]);
    return set(cloneManuscript(manuscript), this.path, updatedSection);
  }

  toJSON(): JSONObject {
    return {
      type: 'add-object',
      timestamp: this.timestamp,
      path: this.path,
      idField: this.idField,
      object: manuscriptEntityToJson<T>(this.object)
    };
  }
}
