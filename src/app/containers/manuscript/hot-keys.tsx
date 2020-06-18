import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalHotKeys } from 'react-hotkeys';
import { isMacOs } from 'react-device-detect';
import { configure } from 'react-hotkeys';

import { canApplyMarkToSelection, canRedoChanges, canUndoChanges } from 'app/selectors/manuscript-editor.selectors';
import * as manuscriptActions from 'app/actions/manuscript.actions';

configure({
  ignoreEventsCondition(event) {
    return false;
  }
});

const withMod = (shortcut: string) => {
  const mod = isMacOs ? 'cmd' : 'ctrl';
  return `${mod}+${shortcut}`;
};

export const HotKeyBindings: React.FC<{}> = () => {
  const dispatch = useDispatch();

  const canUndo = useSelector(canUndoChanges);
  const canRedo = useSelector(canRedoChanges);
  const canApply = useSelector(canApplyMarkToSelection);

  const invokeUndo = useCallback(() => {
    if (canUndo) {
      dispatch(manuscriptActions.undoAction());
    }
  }, [dispatch, canUndo]);

  const invokeRedo = useCallback(() => {
    if (canRedo) {
      dispatch(manuscriptActions.redoAction());
    }
  }, [dispatch, canRedo]);

  const invokeToggleMark = useCallback(
    (mark: string) => () => {
      if (canApply(mark)) {
        dispatch(manuscriptActions.toggleMarkAction(mark));
      }
    },
    [dispatch, canApply]
  );

  const keymap = {
    UNDO: withMod('z'),
    REDO: [withMod('y'), withMod('shift+z')],
    BOLD: withMod('b'),
    ITALIC: withMod('i'),
    UNDERLINE: withMod('u')
  };

  const handlers = {
    UNDO: invokeUndo,
    REDO: invokeRedo,
    BOLD: invokeToggleMark('bold'),
    ITALIC: invokeToggleMark('italic'),
    UNDERLINE: invokeToggleMark('underline')
  };

  return <GlobalHotKeys allowChanges={true} keyMap={keymap} handlers={handlers} />;
};
