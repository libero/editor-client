import * as deepDiff from 'deep-diff';
import { cloneDeepWith, get, set } from 'lodash';
import { EditorState, Transaction } from 'prosemirror-state';

import { Manuscript } from '../../types/manuscript';
import { Change } from './change';
import { cloneManuscript } from '../state.utils';
import { JSONObject } from '../../types/utility.types';
import { ProsemirrorChange } from './prosemirror-change';
import { BatchChange } from './batch-change';

export class UpdateObjectChange<T> extends Change {
  public static createFromTwoObjects<T>(path: string, oldObject: T, newObject: T): Change {
    const editorStateProps = [];

    const pojoDifferences = deepDiff.diff(
      oldObject,
      newObject,
      // if prefilter function returns true diff stops drilling down
      (path: Array<string | number>, key: string | number) => {
        const propPath = [...path, key].join('.');
        if (get(oldObject, propPath) instanceof EditorState) {
          editorStateProps.push(propPath);
          return true;
        }
        return false;
      }
    );

    const objectChange = new UpdateObjectChange(path, pojoDifferences);
    const prosemirrorChanges = editorStateProps
      .map((propPath: string) => {
        const transaction = UpdateObjectChange.getEditorStatesDiff(get(oldObject, propPath), get(newObject, propPath));
        if (transaction.docChanged) {
          return new ProsemirrorChange(`${path}.${propPath}`, transaction);
        }
        return undefined;
      })
      .filter(Boolean);

    return new BatchChange([objectChange, ...prosemirrorChanges]);
  }

  public static fromJSON<T>(data: JSONObject): UpdateObjectChange<T> {
    const change = new UpdateObjectChange(data.path as string, (data.differences as unknown) as deepDiff.Diff<T, T>[]);
    change._timestamp = data.timestamp as number;
    return change;
  }

  private constructor(private path: string, private differences: deepDiff.Diff<T, T>[] | undefined) {
    super();
  }

  get isEmpty(): boolean {
    return !Array.isArray(this.differences) || this.differences.length === 0;
  }

  isPathAffected(pathPattern: RegExp): boolean {
    return pathPattern.test(this.path);
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
      const newAcc = this.cloneWithoutEditorState(acc);
      deepDiff.revertChange(newAcc, acc, diff);
      return newAcc;
    }, originalSection);

    return set(cloneManuscript(manuscript), this.path, updatedSection);
  }

  toJSON(): JSONObject {
    return {
      type: 'update-object',
      timestamp: this.timestamp,
      path: this.path,
      differences: (this.differences as unknown) as JSONObject
    };
  }

  private cloneWithoutEditorState(object: T): T {
    const cloneCustomizer = (value): EditorState | undefined => (value instanceof EditorState ? value : undefined);
    return cloneDeepWith(object, cloneCustomizer);
  }

  private static getEditorStatesDiff(prevState: EditorState, nextState: EditorState): Transaction {
    const transaction = prevState.tr;
    const start = nextState.doc.content.findDiffStart(prevState.doc.content);
    if (start !== null) {
      let { a: endNext, b: endPrev } = nextState.doc.content.findDiffEnd(get(prevState, 'doc.content'));
      // FIXME: Workaround to resolve an issue where using transaction.replace when the new state completely overwrites the old results in an empty transaction. The workaround is to detect when the start and end indices encompose the entire size of the previous state, hence we can just return a new transaction derived from the next state.
      if (endPrev - start >= prevState.doc.content.size) {
        return nextState.tr;
      } else {
        const overlap = start - Math.min(endNext, endPrev);
        if (overlap > 0) {
          endNext += overlap;
          endPrev += overlap;
        }
        transaction.replace(start, endPrev, nextState.doc.slice(start, endNext));
      }
    }
    return transaction;
  }
}
