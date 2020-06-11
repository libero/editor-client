import { memoize } from 'lodash';
import objectHash from 'object-hash';

export const memoizeBind = memoize(
  (fn: Function, ...args: any[]) => {
    return fn.bind(null, ...args);
  },
  (fn: Function, firstArg: any) => {
    return objectHash({
      fn,
      firstArg
    });
  }
);
