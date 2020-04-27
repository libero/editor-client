export interface Action<T> {
  type: string;
  payload: T;
}

export type ActionFactory<T> = ((payload: T) => Action<T>) & { type: string };

export interface AsyncAction<R, T> {
  request: ActionFactory<R>;
  success: ActionFactory<T>;
  error: ActionFactory<Error>;
}

export type ofActionType<A> = A extends AsyncAction<infer R, infer T>
  ? Action<R> | Action<T> | Action<Error>
  : A extends (...args: unknown[]) => unknown
  ? ReturnType<A>
  : never;

export function createAction<T>(type: string): ActionFactory<T> {
  const actionFn = (payload: T): Action<T> => ({ type, payload });
  actionFn.type = type;
  return actionFn as ActionFactory<T>;
}

export function createAsyncAction<R, T>(type: string): AsyncAction<R, T> {
  return {
    request: createAction<R>(type + '_REQUEST'),
    success: createAction<T>(type + '_SUCCESS'),
    error: createAction<Error>(type + '_ERROR')
  } as AsyncAction<R, T>;
}
