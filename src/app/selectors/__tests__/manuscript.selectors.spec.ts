import { getInitialHistory, getInitialLoadableState } from '../../utils/state.utils';
import {
  getAbstract,
  getAuthors,
  getKeywordGroups,
  getManuscriptData,
  getTitle,
  isManuscriptLoaded
} from '../manuscript.selectors';
import { cloneDeep } from 'lodash';
import { EditorState } from 'prosemirror-state';
import { Manuscript } from '../../models/manuscript';

describe('manuscript selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      manuscript: getInitialLoadableState()
    };
  });

  it('gets manuscript data', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());
    expect(getManuscriptData(state)).toBe(state.manuscript.data);
    expect(getTitle(state)).toBe(state.manuscript.data.present.title);
    expect(getAbstract(state)).toBe(state.manuscript.data.present.abstract);
    expect(getKeywordGroups(state)).toBe(state.manuscript.data.present.keywordGroups);
    expect(getAuthors(state)).toBe(state.manuscript.data.present.authors);
  });

  it('gets manuscript load status', () => {
    expect(isManuscriptLoaded(state)).toBeFalsy();
    const newState = cloneDeep(state);

    newState.manuscript.data = getInitialHistory(givenManuscript());
    expect(isManuscriptLoaded(newState)).toBeTruthy();
  });
});

function givenManuscript(): Manuscript {
  return {
    title: new EditorState(),
    abstract: new EditorState(),
    keywordGroups: {},
    authors: []
  };
}
