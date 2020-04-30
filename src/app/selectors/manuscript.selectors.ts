import { createSelector } from 'reselect';
import { ApplicationState, ManuscriptHistoryState } from '../store';
import { get } from 'lodash';
import { EditorState } from 'prosemirror-state';

const getManuscriptState = (state: ApplicationState): ManuscriptHistoryState => {
  return state.manuscript;
};
export const getManuscriptData = createSelector(getManuscriptState, (state) => get(state, 'data'));

export const isManuscriptLoaded = createSelector(getManuscriptData, (data) => Boolean(data));

export const getTitle = createSelector(getManuscriptData, (data) => get(data, 'present.title'));

export const getAbstract = createSelector(getManuscriptData, (data) => get(data, 'present.abstract'));

export const getKeywords = createSelector(getManuscriptData, (data) => get(data, 'present.keywords'));

export const canUndoChanges = createSelector(getManuscriptData, (data) => get(data, 'past.length') > 0);

export const canRedoChanges = createSelector(getManuscriptData, (data) => get(data, 'future.length') > 0);

// TODO: This should return the state of the currently focused editor.
const getFocusedEditor = (): EditorState | undefined => {
  return undefined;
};

export const canBoldSelection = createSelector(getFocusedEditor, (state) => {
  const retVal = false;
  if (state) {
    // TODO: Add logic here to determine if the Bold should be enabled for the current selection.
  }
  return retVal;
});

export const canItalicizeSelection = createSelector(getFocusedEditor, (state) => {
  const retVal = false;
  if (state) {
    // TODO: Add logic here to determine if the Italics should be enabled for the current selection.
  }
  return retVal;
});

export const canLinkSelection = createSelector(getFocusedEditor, (state) => {
  const retVal = false;
  if (state) {
    // TODO: Add logic here to determine if creating a Link should be enabled for the current selection.
  }
  return retVal;
});
