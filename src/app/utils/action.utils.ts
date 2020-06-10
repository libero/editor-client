import { createAction, SimpleActionCreator } from 'redux-act';

export interface Action<T> {
  type: string;
  payload: T;
}

export interface AsyncAction<R, T> {
  request: SimpleActionCreator<R>;
  success: SimpleActionCreator<T>;
  error: SimpleActionCreator<Error>;
}

export function createAsyncAction<R, T>(type: string): AsyncAction<R, T> {
  return {
    request: createAction<R>(type + '_REQUEST'),
    success: createAction<T>(type + '_SUCCESS'),
    error: createAction<Error>(type + '_ERROR')
  } as AsyncAction<R, T>;
}
