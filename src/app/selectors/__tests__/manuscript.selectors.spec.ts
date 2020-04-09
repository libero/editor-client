import {getInitialLoadableState} from "../../utils/state.utils";
import {getManuscriptData, getManuscriptTitle, isManuscriptLoaded} from "../manuscript.selectors";
import {cloneDeep} from 'lodash';
import {EditorState} from "prosemirror-state";

describe('manuscript selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      manuscript: getInitialLoadableState()
    }
  });

  it('gets manuscript data', () => {
    state.manuscript.data = { title: new EditorState() };
    expect(getManuscriptData(state)).toBe(state.manuscript.data);
    expect(getManuscriptTitle(state)).toBe(state.manuscript.data.title);
  });

  it('gets manuscript load status', () => {
    expect(isManuscriptLoaded(state)).toBeFalsy();
    const newState = cloneDeep(state);

    newState.manuscript.data = { title: new EditorState() };
    expect(isManuscriptLoaded(newState)).toBeTruthy();
  });

})