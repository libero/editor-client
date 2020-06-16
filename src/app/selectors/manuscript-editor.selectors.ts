import { createSelector } from 'reselect';
import { EditorState } from 'prosemirror-state';
import { get } from 'lodash';

import { ApplicationState, ManuscriptEditorState } from 'app/store';
import { getManuscriptData } from './manuscript.selectors';

function isMarkActive(state: EditorState, mark: string) {
  const { from, $from, to, empty } = state.selection;
  const type = state.schema.marks[mark];
  if (!type) {
    return false;
  }
  if (empty) {
    return type.isInSet(state.storedMarks || $from.marks());
  } else {
    return state.doc.rangeHasMark(from, to, type);
  }
}

const getManuscriptEditorState = (state: ApplicationState): ManuscriptEditorState => {
  return state.manuscriptEditor;
};

export const getFocusedEditorStatePath = createSelector(getManuscriptEditorState, (manuscriptEditorState) =>
  get(manuscriptEditorState, 'focusedManuscriptPath')
);

export const getFocusedEditorState = createSelector(
  getManuscriptEditorState,
  getManuscriptData,
  (manuscriptEditorState, manuscriptState) => {
    const path = get(manuscriptEditorState, 'focusedManuscriptPath');
    return get(manuscriptState, ['present', path].join('.'));
  }
);

export const isSelectionItalicised = createSelector(getFocusedEditorState, (editorState: EditorState) => {
  if (editorState) {
    return isMarkActive(editorState, 'italic');
  }
});

export const isSelectionBold = createSelector(getFocusedEditorState, (editorState: EditorState) => {
  if (editorState) {
    return isMarkActive(editorState, 'bold');
  }
});

export const canItalicizeSelection = createSelector(getFocusedEditorState, (editorState: EditorState) => {
  if (editorState) {
    return editorState.schema.marks.italic;
  }
  return false;
});

export const canUndoChanges = createSelector(getManuscriptData, (data) => get(data, 'past.length') > 0);

export const canRedoChanges = createSelector(getManuscriptData, (data) => get(data, 'future.length') > 0);

export const canBoldSelection = createSelector(getFocusedEditorState, (editorState: EditorState) => {
  if (editorState) {
    return editorState.schema.marks.bold && !editorState.selection.empty;
  }
  return false;
});

export const canLinkSelection = createSelector(getFocusedEditorState, (state) => {
  const retVal = false;
  if (state) {
    // TODO: Add logic here to determine if creating a Link should be enabled for the current selection.
  }
  return retVal;
});

export const isModalVisible = createSelector(getManuscriptEditorState, ({ modal }) => modal.isVisible);
export const getModalParams = createSelector(getManuscriptEditorState, ({ modal }) => modal.params);
