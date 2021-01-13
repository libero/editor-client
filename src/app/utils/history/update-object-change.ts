import * as deepDiff from 'deep-diff';
import { cloneDeep, cloneDeepWith, get, set } from 'lodash';
import { EditorState } from 'prosemirror-state';

import { Manuscript } from 'app/types/manuscript';
import { Change } from 'app/utils/history/change';
import { cloneManuscript } from 'app/utils/state.utils';

export class UpdateObjectChange<T> extends Change {
  private differences: deepDiff.Diff<T, T>[];

  constructor(private path: string, oldObject: T, newObject: T) {
    super();
    this.differences = deepDiff.diff(oldObject, newObject);
  }

  get isEmpty(): boolean {
    return !Array.isArray(this.differences) || this.differences.length === 0;
  }

  applyChange(manuscript: Manuscript): Manuscript {
    const originalSection = get(manuscript, this.path);

    const updatedSection = this.differences.reduce((acc: T, diff) => {
      const newAcc = this.cloneWithoutEditorState(acc);
      deepDiff.applyChange(newAcc, acc, diff);

      return newAcc;
    }, originalSection);

    return set(cloneManuscript(manuscript), this.path, updatedSection);
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    const originalSection = get(manuscript, this.path);

    const updatedSection = this.differences.reduce((acc: T, diff) => {
      const newAcc = cloneDeep(acc);
      deepDiff.revertChange(newAcc, acc, diff);
      return newAcc;
    }, originalSection);

    return set(cloneManuscript(manuscript), this.path, updatedSection);
  }

  private cloneWithoutEditorState(object: T): T {
    const cloneCustomizer = (value): EditorState | undefined => (value instanceof EditorState ? value : undefined);
    return cloneDeepWith(object, cloneCustomizer);
  }
}
