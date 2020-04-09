import {Manuscript, ManuscriptDiff} from "../models/manuscript";

export interface LoadableState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

export function getInitialLoadableState() {
  return {
    data: undefined,
    isLoading: false,
    error: undefined
  }
}

export function getLoadableStateProgress() {
  return {
    data: undefined,
    isLoading: true,
    error: undefined
  };
}

export function getLoadableStateSuccess<T>(data: T) {
  return {
    data,
    isLoading: false,
    error: undefined
  };
}

export function getLoadableStateError<T>(error: Error) {
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
};

export function getInitialHistory<T>(present: T) {
  return { past: [], present, future: []};
}
