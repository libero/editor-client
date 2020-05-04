import { getInitialHistory, getInitialLoadableState } from '../../utils/state.utils';
import {
  getAbstract, getKeywords,
  getManuscriptData,
  getTitle,
  isManuscriptLoaded
} from '../manuscript.selectors';
import { cloneDeep } from 'lodash';
import { EditorState } from 'prosemirror-state';

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
    expect(getKeywords(state)).toBe(state.manuscript.data.present.keywords);
  });

  it('gets manuscript load status', () => {
    expect(isManuscriptLoaded(state)).toBeFalsy();
    const newState = cloneDeep(state);

    newState.manuscript.data = getInitialHistory(givenManuscript());
    expect(isManuscriptLoaded(newState)).toBeTruthy();
  });
});

function givenManuscript() {
  return {
    title: new EditorState(),
    abstract: new EditorState(),
    keywords: {}
  };
}