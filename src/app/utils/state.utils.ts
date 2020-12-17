import { EditorState } from 'prosemirror-state';
import { cloneDeepWith } from 'lodash';

import { Manuscript, ManuscriptDiff } from 'app/types/manuscript';

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

export function cloneManuscript(manuscript: Manuscript): Manuscript {
  const cloneCustomizer = (value): EditorState | undefined => (value instanceof EditorState ? value : undefined);
  return cloneDeepWith(manuscript, cloneCustomizer);
}
