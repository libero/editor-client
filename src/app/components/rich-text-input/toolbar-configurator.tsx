import React, { SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import { toggleMark } from 'prosemirror-commands';
import LinkIcon from '@material-ui/icons/Link';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import { redo, undo } from 'prosemirror-history';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import { history } from 'prosemirror-history';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ToggleButton } from '@material-ui/lab';
import { ThemeProvider } from '@material-ui/core/styles';

import { SubscriptIcon, SuperscriptIcon } from 'app/assets/icons';
import { LinkEditorPopup } from 'app/components/link-editor-popup';
import { theme } from 'app/styles/theme';

const applyMark = (markName: string, editorState: EditorState, editorView: EditorView) => {
  const mark = editorState.schema.marks[markName];
  toggleMark(mark, {})(editorState, editorView.dispatch);
};

const canApplyMark = (markName: string, editorState: EditorState) => {
  return Boolean(editorState.schema.marks[markName]);
};

const isMarkActive = (markName: string, editorState: EditorState) => {
  const { from, $from, to, empty } = editorState.selection;
  const type = editorState.schema.marks[markName];

  if (empty) {
    return Boolean(type.isInSet(editorState.storedMarks || $from.marks()));
  } else {
    return editorState.doc.rangeHasMark(from, to, type);
  }
};

/* Link Actions */
const canLink = (editorState: EditorState) => {
  const { from, to } = editorState.selection;
  return (editorState.selection && to - from > 0) || !isMarkActive('link', editorState);
};

const getLastTransaction = (state: EditorState): Transaction => {
  const historyState = history().getState(state);
  return historyState.done.items.get(historyState.done.items.length - 1);
};

const makeSelectionLink = (editorState: EditorState, href: string): Transaction => {
  const markType = editorState.schema.marks.link;
  const { from, to } = editorState.selection;
  const transaction = editorState.tr;
  getLastTransaction(editorState);
  transaction.removeMark(from, to, markType);
  transaction.addMark(from, to, markType.create({ href }));
  return transaction;
};

const renderLinkPopup = (editorState: EditorState, editorView: EditorView) => {
  const linkContainer = editorView.dom.parentNode.appendChild(document.createElement('div'));
  linkContainer.style.position = 'absolute';
  linkContainer.style.zIndex = '10';
  const { from } = editorView.state.selection;
  const selectionPosition = editorView.coordsAtPos(from) as DOMRect;
  const coords = {
    x: selectionPosition.left,
    y: selectionPosition.bottom
  };

  const onClose = () => {
    ReactDOM.unmountComponentAtNode(linkContainer);
    linkContainer.parentNode.removeChild(linkContainer);
  };

  const onApply = (href: string) => {
    if (href) {
      editorView.dispatch(makeSelectionLink(editorState, href));
    }
    onClose();
  };

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <LinkEditorPopup editorView={editorView} onApply={onApply} onClose={onClose} {...coords} />
    </ThemeProvider>,
    linkContainer
  );
};

/* History Actions */
const canUndo = (editorState: EditorState) => undo(editorState);
const canRedo = (editorState: EditorState) => redo(editorState);

const runUndo = (editorState: EditorState, editorView: EditorView) => undo(editorState, editorView.dispatch);
const runRedo = (editorState: EditorState, editorView: EditorView) => redo(editorState, editorView.dispatch);

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
    run: renderLinkPopup,
    icon: LinkIcon
  }
};

export const getMenuForEditor = (editorState: EditorState, editorView: EditorView) => {
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
        disabled={!option.enabled(editorState)}
        selected={option.isActive(editorState)}
        size="small"
      >
        <ActionIconComponent />
      </ToggleButton>
    );
  });
};
