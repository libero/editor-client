import { createSelector } from 'reselect';
import { EditorState } from 'prosemirror-state';
import { get } from 'lodash';

import { ApplicationState, ManuscriptEditorState } from 'app/store';
import { getManuscriptData } from './manuscript.selectors';

function isMarkActive(state: EditorState, mark: string): boolean {
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

export const canUndoChanges = createSelector(getManuscriptData, (data) => get(data, 'past.length') > 0);

export const canRedoChanges = createSelector(getManuscriptData, (data) => get(data, 'future.length') > 0);

export const isMarkAppliedToSelection = createSelector(
  getFocusedEditorState,
  (editorState: EditorState) => (mark: string) => {
    if (editorState) {
      return isMarkActive(editorState, mark);
    }
    return false;
  }
);

export const canApplyMarkToSelection = createSelector(
  getFocusedEditorState,
  (editorState: EditorState) => (mark: string) => {
    return editorState && editorState.schema.marks[mark];
  }
);

export const isModalVisible = createSelector(getManuscriptEditorState, ({ modal }) => modal.isVisible);
export const getModalParams = createSelector(getManuscriptEditorState, ({ modal }) => modal.params);
