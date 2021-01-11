import { Manuscript } from 'app/types/manuscript';
import { get, set } from 'lodash';
import { Change } from 'app/utils/history/change';
import { cloneManuscript } from 'app/utils/state.utils';

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

    return set({ ...manuscript }, this.path, [...originalSection, this.object]);
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    const originalSection = get(manuscript, this.path);

    if (!Array.isArray(originalSection)) {
      throw new TypeError('Trying to rollback AddObject change on a non-array section');
    }
    const updatedSection = originalSection.filter((item) => item[this.idField] === this.object[this.idField]);
    return set(cloneManuscript(manuscript), this.path, updatedSection);
  }
}
