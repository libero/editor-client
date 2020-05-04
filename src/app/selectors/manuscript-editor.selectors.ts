import { createSelector } from 'reselect';
import { ApplicationState, ManuscriptEditorState } from '../store';
import { get } from 'lodash';
import { EditorState } from 'prosemirror-state';
import { getManuscriptData } from './manuscript.selectors';

const getManuscriptEditorState = (state: ApplicationState): ManuscriptEditorState => {
  return state.manuscriptEditor;
};

export const getFocusedEditor = createSelector(
  getManuscriptEditorState,
  getManuscriptData,
  (manuscriptEditorState, manuscriptState) => {
    const path = get(manuscriptEditorState, 'focusedManuscriptPath');
    return get(manuscriptState, ['present', path].join('.'));
  }
);

export const canItalicizeSelection = createSelector(getFocusedEditor, (editorState: EditorState) => {
  if (editorState) {
    return editorState.schema.marks.italic && !editorState.selection.empty;
  }
  return false;
});

export const canUndoChanges = createSelector(getManuscriptData, (data) => get(data, 'past.length') > 0);

export const canRedoChanges = createSelector(getManuscriptData, (data) => get(data, 'future.length') > 0);

export const canBoldSelection = createSelector(getFocusedEditor, (editorState: EditorState) => {
  if (editorState) {
    return editorState.schema.marks.bold && !editorState.selection.empty;
  }
  return false;
});

export const canLinkSelection = createSelector(getFocusedEditor, (state) => {
  const retVal = false;
  if (state) {
    // TODO: Add logic here to determine if creating a Link should be enabled for the current selection.
  }
  return retVal;
});
