import { Manuscript, ManuscriptDiff } from '../models/manuscript';

export interface LoadableState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

export function getInitialLoadableState<T>(): LoadableState<T> {
  return {
    data: undefined,
    isLoading: false,
    error: undefined
  };
}

export function getLoadableStateProgress<T>(): LoadableState<T> {
  return {
    data: undefined,
    isLoading: true,
    error: undefined
  };
}

export function getLoadableStateSuccess<T>(data: T): LoadableState<T> {
  return {
    data,
    isLoading: false,
    error: undefined
  };
}

export function getLoadableStateError<T>(error: Error): LoadableState<T> {
  console.log(error);
  return {
    data: undefined,
    isLoading: false,
    error
  };
}

export interface ManuscriptHistory {
  past: ManuscriptDiff[];
  present: Manuscript;
  future: ManuscriptDiff[];
}

export function getInitialHistory(present: Manuscript): ManuscriptHistory {
  return { past: [], present, future: [] };
}
