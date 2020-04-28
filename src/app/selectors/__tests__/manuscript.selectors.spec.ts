import { getInitialHistory, getInitialLoadableState } from '../../utils/state.utils';
import {
  canRedoChanges,
  canUndoChanges,
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
    state.manuscript.data = getInitialHistory({ title: new EditorState() });
    expect(getManuscriptData(state)).toBe(state.manuscript.data);
    expect(getTitle(state)).toBe(state.manuscript.data.present.title);
    expect(canUndoChanges(state)).toBeFalsy();
    expect(canRedoChanges(state)).toBeFalsy();
  });

  it('gets manuscript load status', () => {
    expect(isManuscriptLoaded(state)).toBeFalsy();
    const newState = cloneDeep(state);

    newState.manuscript.data = getInitialHistory({ title: new EditorState() });
    expect(isManuscriptLoaded(newState)).toBeTruthy();
  });

  it('checks if changes can be undone', () => {
    state.manuscript.data = getInitialHistory({ title: new EditorState() });

    state.manuscript.data.past.push({ title: undefined });
    expect(canUndoChanges(state)).toBeTruthy();
  });

  it('checks if changes can be redone', () => {
    state.manuscript.data = getInitialHistory({ title: new EditorState() });

    state.manuscript.data.future.push({ title: undefined });
    expect(canRedoChanges(state)).toBeTruthy();
  });
});
