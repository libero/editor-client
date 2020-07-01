import React, { SyntheticEvent, useCallback, useMemo, useRef, useState } from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { redo, undo } from 'prosemirror-history';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import classNames from 'classnames';
import { toggleMark } from 'prosemirror-commands';
import LinkIcon from '@material-ui/icons/Link';
import { history } from 'prosemirror-history';

import { SectionContainer } from 'app/components/section-container';
import { ProseMirrorEditorView } from 'app/components/rich-text-editor/prosemirror-editor-view';
import { useRichTextInputStyles } from 'app/components/rich-text-input/styles';
import { LinkEditorPopup, LinkNodeView } from 'app/components/link-editor-popup';

interface Coords {
  x: number;
  y: number;
}

interface RichTextInputProps {
  editorState: EditorState;
  name: string;
  className?: string;
  label: string;
  onChange(value: Transaction): void;
}

const getLastTransaction = (state: EditorState): Transaction => {
  const historyState = history().getState(state);
  return historyState.done.items.get(historyState.done.items.length - 1);
};

const applyMark = (
  editorState: EditorState,
  markName: string,
  onChangeCallback: (value: Transaction) => void
): void => {
  const mark = editorState.schema.marks[markName];
  toggleMark(mark, {})(editorState, onChangeCallback);
};

const setLinkToSelection = (editorState: EditorState, href: string): Transaction => {
  const markType = editorState.schema.marks.link;
  const { from, to } = editorState.selection;
  const transaction = editorState.tr;
  getLastTransaction(editorState);
  transaction.removeMark(from, to, markType);
  transaction.addMark(from, to, markType.create({ href }));
  return transaction;
};

const canUndo = (state: EditorState) => undo(state);
const canRedo = (state: EditorState) => redo(state);

export const RichTextInput: React.FC<RichTextInputProps> = ({ label, onChange, editorState, className }) => {
  const [isFocused, setFocused] = useState(false);
  const [linkPopupPos, setLinkPopupPos] = useState<Coords>({ x: 0, y: 0 });
  const [isLinkPopupShown, setLinkPopupShown] = useState(false);
  const classes = useRichTextInputStyles();
  const prosemirrorEditorView = useRef();
  const onFocus = useCallback(() => setFocused(true), [setFocused]);
  const onBlur = useCallback(() => setFocused(false), [setFocused]);

  const options = useMemo(
    () => ({
      nodeViews: {
        link(node, view) {
          return new LinkNodeView(node, view);
        }
      },
      handleDOMEvents: {
        focus: onFocus,
        blur: onBlur
      }
    }),
    [onFocus, onBlur]
  );

  const onFormatButtonClicked = useCallback(
    (markName: string, event: SyntheticEvent) => {
      event.stopPropagation();
      event.preventDefault();
      applyMark(editorState, markName, onChange);
    },
    [editorState, onChange]
  );

  const handleLinkAddPopupClose = useCallback(
    (href) => {
      setLinkPopupShown(false);
      if (href && prosemirrorEditorView.current) {
        const editorView = (prosemirrorEditorView.current as ProseMirrorEditorView).editorView;
        editorView.dispatch(setLinkToSelection(editorView.state, href));
      }
    },
    [prosemirrorEditorView]
  );

  const canApplyMark = useCallback(
    (markName: string) => {
      return Boolean(editorState.schema.marks[markName]);
    },
    [editorState]
  );

  const onUndoClick = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      event.preventDefault();
      undo(editorState, onChange);
    },
    [editorState, onChange]
  );

  const onRedoClick = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      event.preventDefault();
      redo(editorState, onChange);
    },
    [editorState, onChange]
  );

  const isMarkApplied = useCallback(
    (markName: string) => {
      if (!editorState) {
        return false;
      }
      const { from, $from, to, empty } = editorState.selection;
      const type = editorState.schema.marks[markName];
      if (!type) {
        return false;
      }

      if (empty) {
        return Boolean(type.isInSet(editorState.storedMarks || $from.marks()));
      } else {
        return editorState.doc.rangeHasMark(from, to, type);
      }
    },
    [editorState]
  );

  const canLink = useCallback(() => {
    if (!editorState) {
      return false;
    }
    const { from, to } = editorState.selection;
    return (editorState.selection && to - from > 0) || isMarkApplied('link');
  }, [editorState, isMarkApplied]);

  const onAddLinkClicked = useCallback(() => {
    setLinkPopupShown(true);
    const editorView = (prosemirrorEditorView.current as ProseMirrorEditorView).editorView;
    const { from } = editorView.state.selection;
    const coords = editorView.coordsAtPos(from) as DOMRect;
    setLinkPopupPos({ x: coords.left, y: coords.bottom + coords.height });
  }, [prosemirrorEditorView]);

  return (
    <SectionContainer variant="outlined" label={label} className={className}>
      {isLinkPopupShown ? (
        <LinkEditorPopup
          editorView={prosemirrorEditorView.current}
          {...linkPopupPos}
          onClose={handleLinkAddPopupClose}
        />
      ) : undefined}
      <ToggleButtonGroup classes={{ root: classNames(classes.toolbar, { [classes.hideToolbar]: !isFocused }) }}>
        <ToggleButton onMouseDown={onUndoClick} disabled={!canUndo(editorState)} selected={false} size="small">
          <UndoIcon />
        </ToggleButton>
        <ToggleButton onMouseDown={onRedoClick} disabled={!canRedo(editorState)} selected={false} size="small">
          <RedoIcon />
        </ToggleButton>
        <ToggleButton
          selected={isMarkApplied('bold')}
          onMouseDown={onFormatButtonClicked.bind(null, 'bold')}
          disabled={!canApplyMark('bold')}
          size="small"
        >
          <FormatBoldIcon />
        </ToggleButton>
        <ToggleButton
          selected={isMarkApplied('italic')}
          onMouseDown={onFormatButtonClicked.bind(null, 'italic')}
          disabled={!canApplyMark('italic')}
          size="small"
        >
          <FormatItalicIcon />
        </ToggleButton>
        <ToggleButton
          selected={isMarkApplied('link')}
          onMouseDown={onAddLinkClicked}
          disabled={!canLink()}
          size="small"
        >
          <LinkIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      {editorState ? (
        <ProseMirrorEditorView
          ref={prosemirrorEditorView}
          options={options}
          editorState={editorState}
          onChange={onChange}
        />
      ) : null}
    </SectionContainer>
  );
};
