import { createSelector } from 'reselect';
import { EditorState } from 'prosemirror-state';
import { get } from 'lodash';

import { ApplicationState, ManuscriptEditorState } from 'app/store';
import { getManuscriptData } from './manuscript.selectors';
import { canWrapInList, isWrappedInList } from 'app/utils/prosemirror/list.helpers';
import { ListType } from 'app/types/utility.types';

function isMarkActive(state: EditorState, mark: string): boolean {
  const { from, $from, to, empty } = state.selection;
  const type = state.schema.marks[mark];
  if (!type) {
    return false;
  }
  if (empty) {
    return Boolean(type.isInSet(state.storedMarks || $from.marks()));
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

export const getLastSyncTimestamp = createSelector(getManuscriptEditorState, (manuscriptEditorState) =>
  get(manuscriptEditorState, 'lastSyncTimestamp')
);

export const isLastSyncSuccesful = createSelector(getManuscriptEditorState, (manuscriptEditorState) =>
  get(manuscriptEditorState, 'lastSyncSuccessful')
);

export const getManuscriptId = createSelector(getManuscriptEditorState, (manuscriptEditorState) =>
  get(manuscriptEditorState, 'manuscriptId')
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
  (editorState: EditorState) => (markName: string) => {
    return editorState && editorState.schema.marks[markName];
  }
);

export const canInsertNodeAtSelection = createSelector(
  getFocusedEditorState,
  (editorState: EditorState) => (nodeName: string) => {
    return editorState && editorState.schema.nodes[nodeName];
  }
);

export const canInsertFigureCitationAtSelection = createSelector(
  getFocusedEditorState,
  canInsertNodeAtSelection,
  (editorState: EditorState, checkNodeAllowed) => () => {
    return editorState && checkNodeAllowed('figureCitation');
  }
);

export const canToggleHeadingAtSelection = createSelector(
  getFocusedEditorState,
  (editorState: EditorState) => (headingLevel: number) => {
    if (editorState && editorState.schema.nodes.heading) {
      const wrapperNode = editorState.selection.$from.parent;
      return (
        (wrapperNode.type.name === 'heading' && wrapperNode.attrs.level !== headingLevel) ||
        wrapperNode.type.name !== 'heading'
      );
    }
  }
);

export const canToggleParagraphAtSelection = createSelector(getFocusedEditorState, (editorState: EditorState) => {
  if (editorState && editorState.schema.nodes.heading) {
    const wrapperNode = editorState.selection.$from.parent;
    return wrapperNode.type.name !== 'paragraph';
  }
});

export const canToggleListAtSelection = createSelector(
  getFocusedEditorState,
  (editorState: EditorState) => (listType: ListType) => {
    if (editorState && editorState.schema.nodes.orderedList && editorState.schema.nodes.bulletList) {
      const listNodeType =
        listType === 'order' ? editorState.schema.nodes.orderedList : editorState.schema.nodes.bulletList;
      const alternativeListType =
        listType === 'order' ? editorState.schema.nodes.bulletList : editorState.schema.nodes.orderedList;
      return (
        (!isWrappedInList(editorState, listNodeType) && canWrapInList(editorState, listNodeType)) ||
        isWrappedInList(editorState, alternativeListType)
      );
    }
  }
);

export const hasUnsavedChanges = createSelector(
  (_) => _,
  (state: ApplicationState) => () => {
    return (
      state.manuscriptEditor.lastSyncTimestamp <
      state.manuscript.data.past[state.manuscript.data.past.length - 1].timestamp
    );
  }
);

export const isActiveContainer = createSelector(
  getFocusedEditorState,
  (editorState: EditorState) => (nodeName: string, attrs?: Record<string, number | string>) => {
    if (!editorState) {
      return false;
    }

    const { $from } = editorState.selection;
    const node = get(editorState.selection, 'node', $from.parent);
    return node.type.name === nodeName && (attrs && attrs.level ? node.attrs.level === attrs.level : true);
  }
);

export const isModalVisible = createSelector(getManuscriptEditorState, ({ modal }) => modal.isVisible);
export const getModalParams = createSelector(getManuscriptEditorState, ({ modal }) => modal.params);
export const getManuscriptBodyTOC = createSelector(
  getManuscriptEditorState,
  ({ manuscriptBodyTOC }) => manuscriptBodyTOC
);
