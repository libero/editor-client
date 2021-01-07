import { Manuscript } from 'app/types/manuscript';
import { get, set } from 'lodash';
import { Change } from 'app/utils/history/change';

export class RearrangingChange<T> implements Change {
  public static createFromListRearrange<T>(path: string, oldOrder: Array<T>, newOrder: Array<T>): RearrangingChange<T> {
    const order = oldOrder.map((item) => newOrder.indexOf(item));
    return new RearrangingChange<T>(path, order);
  }

  public static createFromItemMoved<T>(
    path: string,
    oldIndex: number,
    newIndex: number,
    collection: Array<T>
  ): RearrangingChange<T> {
    const order = new Array(collection.length).fill(undefined).map((_, index) => index);
    order.splice(oldIndex, 1);
    order.splice(newIndex, 0, oldIndex);
    return new RearrangingChange<T>(path, order);
  }

  private constructor(private path: string, private order: number[]) {}

  get isEmpty(): boolean {
    return !this.order.some((el, index) => el !== index);
  }

  applyChange(manuscript: Manuscript): Manuscript {
    return set({ ...manuscript }, this.path, this.applyOrder(get(manuscript, this.path), this.order));
  }

  rollbackChange(manuscript: Manuscript): Manuscript {
    const rollbackOrder = this.reverseOrder(this.order);
    return set({ ...manuscript }, this.path, this.applyOrder(get(manuscript, this.path), rollbackOrder));
  }

  private applyOrder(collection: Array<T>, order: number[]): Array<T> {
    return order.map((index) => collection[index]);
  }

  private reverseOrder(order: number[]): number[] {
    return order.reduce((acc, oldIndex, newIndex) => {
      acc[oldIndex] = newIndex;
      return acc;
    }, new Array<number>(order.length));
  }
}
