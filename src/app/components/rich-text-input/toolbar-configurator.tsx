import React, { SyntheticEvent } from 'react';
import { toggleMark } from 'prosemirror-commands';
import LinkIcon from '@material-ui/icons/Link';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { redo, undo } from 'prosemirror-history';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import { history } from 'prosemirror-history';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ToggleButton } from '@material-ui/lab';

import { SubscriptIcon, SuperscriptIcon } from 'app/assets/icons';

const applyMark = (markName: string, editorState: EditorState, editorView: EditorView): void => {
  const mark = editorState.schema.marks[markName];
  toggleMark(mark, {})(editorState, editorView.dispatch);
};

const canApplyMark = (markName: string, editorState: EditorState): boolean => {
  return Boolean(editorState.schema.marks[markName]);
};

const isMarkActive = (markName: string, editorState: EditorState): boolean => {
  const { from, $from, to, empty } = editorState.selection;
  const type = editorState.schema.marks[markName];

  if (empty) {
    return Boolean(type.isInSet(editorState.storedMarks || $from.marks()));
  } else {
    return editorState.doc.rangeHasMark(from, to, type);
  }
};

/* Link Actions */
const canLink = (editorState: EditorState): boolean => {
  const { from, to } = editorState.selection;
  return (editorState.selection && to - from > 0) || !isMarkActive('link', editorState);
};

/* History Actions */
const canUndo = (editorState: EditorState): boolean => undo(editorState);
const canRedo = (editorState: EditorState): boolean => redo(editorState);

const runUndo = (editorState: EditorState, editorView: EditorView): boolean => undo(editorState, editorView.dispatch);
const runRedo = (editorState: EditorState, editorView: EditorView): boolean => redo(editorState, editorView.dispatch);

const HISTORY_ACTIONS = [
  {
    actionName: 'undo',
    enabled: canUndo,
    isActive: () => false,
    run: runUndo,
    icon: UndoIcon
  },
  {
    actionName: 'redo',
    enabled: canRedo,
    isActive: () => false,
    run: runRedo,
    icon: RedoIcon
  }
];

const FORMATTING_OPTIONS = {
  bold: {
    actionName: 'bold',
    enabled: canApplyMark.bind(null, 'bold'),
    isActive: isMarkActive.bind(null, 'bold'),
    run: applyMark.bind(null, 'bold'),
    icon: FormatBoldIcon
  },
  italic: {
    actionName: 'italic',
    enabled: canApplyMark.bind(null, 'italic'),
    isActive: isMarkActive.bind(null, 'italic'),
    run: applyMark.bind(null, 'italic'),
    icon: FormatItalicIcon
  },
  superscript: {
    actionName: 'superscript',
    enabled: canApplyMark.bind(null, 'superscript'),
    isActive: isMarkActive.bind(null, 'superscript'),
    run: applyMark.bind(null, 'superscript'),
    icon: SuperscriptIcon
  },
  subscript: {
    actionName: 'subscript',
    enabled: canApplyMark.bind(null, 'subscript'),
    isActive: isMarkActive.bind(null, 'subscript'),
    run: applyMark.bind(null, 'subscript'),
    icon: SubscriptIcon
  },
  link: {
    actionName: 'link',
    enabled: canLink,
    isActive: isMarkActive.bind(null, 'link'),
    run: applyMark.bind(null, 'link'),
    icon: LinkIcon
  }
};

export const getMenuForEditor = (editorState: EditorState, editorView: EditorView): React.ReactNode[] => {
  const actionsFromState = Object.entries(FORMATTING_OPTIONS).reduce((acc, [key, option]) => {
    if (editorState.schema.marks[key]) {
      acc.push(option);
    }
    return acc;
  }, []);

  const hasHistory = Boolean(history().getState(editorState));
  return [...(hasHistory ? HISTORY_ACTIONS : []), ...actionsFromState].map((option) => {
    const ActionIconComponent = option.icon;
    return (
      <ToggleButton
        key={option.actionName}
        onMouseDown={(event: SyntheticEvent) => {
          event.stopPropagation();
          event.preventDefault();
          option.run(editorState, editorView);
        }}
        value={true}
        disabled={!option.enabled(editorState)}
        selected={option.isActive(editorState)}
        size="small"
      >
        <ActionIconComponent />
      </ToggleButton>
    );
  });
};
