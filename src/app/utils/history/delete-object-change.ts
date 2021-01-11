import { Manuscript } from 'app/types/manuscript';
import { get, set } from 'lodash';
import { Change } from 'app/utils/history/change';
import { cloneManuscript } from 'app/utils/state.utils';

export class DeleteObjectChange<T> extends Change {
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
      throw new TypeError('Trying to make AddObject change on a non-array section');
    }
    this.removedIndex = originalSection.findIndex((item) => item[this.idField] === this.object[this.idField]);
    const updatedSection = [...originalSection];
    updatedSection.splice(this.removedIndex, 1);
    return set(cloneManuscript(manuscript), this.path, updatedSection);
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    const updatedSection = [...get(manuscript, this.path)];

    if (!Array.isArray(updatedSection)) {
      throw new TypeError('Trying to rollback AddObject change on a non-array section');
    }
    updatedSection.splice(this.removedIndex, 0, this.object);
    return set(cloneManuscript(manuscript), this.path, updatedSection);
  }
}
