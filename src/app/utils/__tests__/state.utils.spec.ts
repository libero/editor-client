import { EditorState } from 'prosemirror-state';

import {
  cloneManuscript,
  getInitialHistory,
  getInitialLoadableState,
  getLoadableStateError,
  getLoadableStateProgress,
  getLoadableStateSuccess
} from 'app/utils/state.utils';

describe('state utils', () => {
  it('creates initial state', () => {
    expect(getInitialLoadableState()).toEqual({
      data: undefined,
      error: undefined,
      isLoading: false
    });
  });

  it('creates loading in progress state', () => {
    expect(getLoadableStateProgress()).toEqual({
      data: undefined,
      error: undefined,
      isLoading: true
    });
  });

  it('creates error state', () => {
    const error = new Error();
    expect(getLoadableStateError(error)).toEqual({
      data: undefined,
      error: error,
      isLoading: false
    });
  });

  it('creates error state', () => {
    const error = new Error();
    expect(getLoadableStateError(error)).toEqual({
      data: undefined,
      error: error,
      isLoading: false
    });
  });

  it('creates success state', () => {
    expect(getLoadableStateSuccess('DATA')).toEqual({
      data: 'DATA',
      error: undefined,
      isLoading: false
    });
  });

  it('create initial history', () => {
    const manuscript = {
      abstract: undefined,
      acknowledgements: undefined,
      affiliations: [],
      articleInfo: undefined,
      authors: [],
      body: undefined,
      impactStatement: undefined,
      journalMeta: undefined,
      keywordGroups: undefined,
      references: [],
      relatedArticles: [],
      title: undefined
    };

    expect(getInitialHistory(manuscript)).toEqual({
      past: [],
      present: manuscript,
      future: []
    });
  });

  it('clones manuscript preserving EditorState', () => {
    const manuscript = {
      abstract: new EditorState(),
      acknowledgements: undefined,
      affiliations: [],
      articleInfo: undefined,
      authors: [],
      body: undefined,
      impactStatement: undefined,
      journalMeta: undefined,
      keywordGroups: undefined,
      references: [],
      relatedArticles: [],
      title: undefined
    };

    const newManuscript = cloneManuscript(manuscript);
    expect(newManuscript.abstract).toBe(manuscript.abstract);
    expect(newManuscript.affiliations).not.toBe(manuscript.affiliations);
    expect(newManuscript.affiliations).toEqual(manuscript.affiliations);
  });
});
