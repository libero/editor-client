import { EditorState, Transaction } from 'prosemirror-state';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { EditorView } from 'prosemirror-view';
import { fade, IconButton, Theme } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/core/styles';

import { ProseMirrorEditorView } from '../rich-text-editor/prosemirror-editor-view';

const ENTER_KEY_CODE = 'Enter';

interface KeywordProps {
  editorState: EditorState;
  onChange: (state: Transaction) => void;
  onDelete: () => void;
  onFocus: (state: EditorState) => void;
  onBlur: (state: EditorState) => void;
}

const DeleteKeywordIcon: React.FC<{}> = () => {
  const useStyles = makeStyles((theme: Theme) => {
    return {
      deleteIcon: {
        WebkitTapHighlightColor: 'transparent',
        color: fade(theme.palette.primary.contrastText, 0.7),
        height: 20,
        width: 20,
        margin: '-3px 0 0 0',
        cursor: 'pointer',
        '&:hover, &:active, &:focus': {
          color: theme.palette.primary.contrastText
        }
      }
    };
  });

  const classes = useStyles();

  return <CancelIcon className={classes.deleteIcon} />;
};

export const Keyword: React.FC<KeywordProps> = ({ editorState, onDelete, onChange, onFocus, onBlur }) => {
  const prosemirrorRef = useRef<ProseMirrorEditorView>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setFocused] = useState(false);

  const focusOnDblClick = useCallback(() => {
    prosemirrorRef.current.focus();
  }, []);

  const preventSingleClick = useCallback((event: Event) => {
    event.stopPropagation();
    event.preventDefault();
  }, []);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('dblclick', focusOnDblClick, true);
      containerEl.addEventListener('mousedown', preventSingleClick, true);
    }

    return () => {
      containerEl.removeEventListener('dblclick', focusOnDblClick, true);
      containerEl.removeEventListener('mousedown', preventSingleClick, true);
    };
  }, [containerRef, focusOnDblClick, preventSingleClick]);

  const handleFocusEvent = (view: EditorView): void => {
    setFocused(true);
    if (onFocus) {
      onFocus(view.state);
    }
  };

  const handleBlurEvent = (view: EditorView): void => {
    setFocused(false);
    if (onBlur) {
      onBlur(view.state);
    }
  };

  const options = {
    handleDOMEvents: {
      focus: handleFocusEvent,
      blur: handleBlurEvent,
      keydown: (view: EditorView, event: KeyboardEvent) => {
        if (event.key === ENTER_KEY_CODE) {
          prosemirrorRef.current.blur();
        }
      }
    }
  };

  return (
    <div className={classNames('keyword', { focused: isFocused })} ref={containerRef}>
      <ProseMirrorEditorView options={options} ref={prosemirrorRef} editorState={editorState} onChange={onChange} />
      <IconButton onClick={onDelete} aria-label="delete keyword" tabIndex={0} color="primary" size="small" className="keyword-delete-cta">
        <DeleteKeywordIcon />
      </IconButton>
    </div>
  );
};
