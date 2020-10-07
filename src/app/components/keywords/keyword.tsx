import { EditorState, Transaction } from 'prosemirror-state';
import React, { useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { EditorView } from 'prosemirror-view';
import { IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

import { ProseMirrorEditorView } from 'app/components/rich-text-editor/prosemirror-editor-view';
import { useKeywordStyles } from './styles';

const ENTER_KEY_CODE = 'Enter';

interface KeywordProps {
  editorState: EditorState;
  onChange: (state: Transaction) => void;
  onDelete: () => void;
  isActive: boolean;
  onFocus: (state: EditorState) => void;
  onBlur: () => void;
}

export const Keyword: React.FC<KeywordProps> = (props) => {
  const { editorState, onDelete, onChange, onFocus, isActive, onBlur } = props;
  const prosemirrorRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const classes = useKeywordStyles();

  const focusOnDblClick = useCallback(() => {
    prosemirrorRef.current.focus();
  }, []);

  const preventSingleClickWhenInactive = useCallback(
    (event: Event) => {
      if (!isActive) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    [isActive]
  );

  useEffect(() => {
    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('dblclick', focusOnDblClick, true);
      containerEl.addEventListener('mousedown', preventSingleClickWhenInactive, true);
    }

    return () => {
      containerEl.removeEventListener('dblclick', focusOnDblClick, true);
      containerEl.removeEventListener('mousedown', preventSingleClickWhenInactive, true);
    };
  }, [containerRef, focusOnDblClick, preventSingleClickWhenInactive]);

  const handleFocusEvent = (view: EditorView): boolean => {
    onFocus(view.state);
    return true;
  };

  const options = {
    handleDOMEvents: {
      focus: handleFocusEvent,
      keydown: (view: EditorView, event: KeyboardEvent): boolean => {
        if (event.key === ENTER_KEY_CODE) {
          prosemirrorRef.current.blur();
          onBlur();
          return true;
        }
        return false;
      }
    }
  };

  return (
    <div
      className={classNames(classes.keyword, { focused: isActive })}
      ref={containerRef}
      data-test-id="keyword-container"
    >
      <ProseMirrorEditorView options={options} ref={prosemirrorRef} editorState={editorState} onChange={onChange} />
      <IconButton
        onClick={onDelete}
        aria-label="delete keyword"
        tabIndex={0}
        color="primary"
        size="small"
        className={isActive ? classes.hidden : ''}
      >
        <CancelIcon className={classes.deleteIcon} />
      </IconButton>
    </div>
  );
};
