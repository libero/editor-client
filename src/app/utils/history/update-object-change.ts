import * as deepDiff from 'deep-diff';
import { Manuscript } from 'app/types/manuscript';
import { cloneDeep, cloneDeepWith, get, set } from 'lodash';
import { Change } from 'app/utils/history/change';
import { cloneManuscript } from 'app/utils/state.utils';
import { EditorState } from 'prosemirror-state';

export class UpdateObjectChange<T> implements Change {
  private differences: deepDiff.Diff<T, T>[];

  constructor(private path: string, oldObject: T, newObject: T) {
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
