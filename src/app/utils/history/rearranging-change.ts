import { get, set } from 'lodash';

import { Manuscript } from '../../types/manuscript';
import { Change } from './change';
import { cloneManuscript } from '../state.utils';
import { JSONObject } from '../../types/utility.types';

export class RearrangingChange extends Change {
  public static createFromListRearrange<T>(path: string, oldOrder: Array<T>, newOrder: Array<T>): RearrangingChange {
    const order = newOrder.map((item) => oldOrder.indexOf(item));
    return new RearrangingChange(path, order);
  }

  public static createFromItemMoved<T>(
    path: string,
    oldIndex: number,
    newIndex: number,
    collection: Array<T>
  ): RearrangingChange {
    const order = new Array(collection.length).fill(undefined).map((_, index) => index);
    order.splice(oldIndex, 1);
    order.splice(newIndex, 0, oldIndex);
    return new RearrangingChange(path, order);
  }

  public static fromJSON<T>(data: JSONObject): RearrangingChange {
    const change = new RearrangingChange(data.path as string, data.order as Array<number>);
    change._timestamp = data.timestamp as number;
    return change;
  }

  private constructor(private path: string, private order: number[]) {
    super();
  }

  get isEmpty(): boolean {
    return !this.order.some((el, index) => el !== index);
  }

  isPathAffected(pathPattern: RegExp): boolean {
    return pathPattern.test(this.path);
  }

  applyChange(manuscript: Manuscript): Manuscript {
    return set(cloneManuscript(manuscript), this.path, this.applyOrder(get(manuscript, this.path), this.order));
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    const rollbackOrder = this.reverseOrder(this.order);
    return set({ ...manuscript }, this.path, this.applyOrder(get(manuscript, this.path), rollbackOrder));
  }

  toJSON(): JSONObject {
    return {
      type: 'rearranging',
      timestamp: this.timestamp,
      path: this.path,
      order: this.order
    };
  }

  private applyOrder<T>(collection: Array<T>, order: number[]): Array<T> {
    return order.map((index) => collection[index]);
  }

  private reverseOrder(order: number[]): number[] {
    return order.reduce((acc, oldIndex, newIndex) => {
      acc[oldIndex] = newIndex;
      return acc;
    }, new Array<number>(order.length));
  }
}
