import { get, set } from 'lodash';

import { Manuscript } from 'app/types/manuscript';
import { Change } from 'app/utils/history/change';
import { cloneManuscript } from 'app/utils/state.utils';
import { JSONObject } from 'app/types/utility.types';
import { deserializeBackmatter, manuscriptEntityToJson } from 'app/utils/changes.utils';
import { BackmatterEntity } from 'app/models/backmatter-entity';

export class AddObjectChange extends Change {
  static fromJSON(data: JSONObject): AddObjectChange {
    const change = new AddObjectChange(
      data.path as string,
      deserializeBackmatter(data.path as string, data.object as JSONObject),
      data.idField as string
    );
    change._timestamp = data.timestamp as number;
    return change;
  }

  constructor(private path: string, private object: BackmatterEntity, private idField: string) {
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
      object: manuscriptEntityToJson(this.object)
    };
  }
}
