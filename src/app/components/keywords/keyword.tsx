import { EditorState, Transaction } from 'prosemirror-state';
import React, { useCallback, useEffect, useRef } from 'react';
import { EditorView } from 'prosemirror-view';

import { ProseMirrorEditorView } from '../rich-text-editor/prosemirror-editor-view';

interface KeywordProps {
  editorState: EditorState;
  onChange: (state: Transaction) => void;
  onDelete: () => void;
  onFocus: (state: EditorState) => void;
  onBlur: (state: EditorState) => void;
}

export const Keyword: React.FC<KeywordProps> = ({ editorState, onDelete, onChange, onFocus, onBlur }) => {
  const prosemirrorRef = useRef<ProseMirrorEditorView>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (onFocus) {
      onFocus(view.state);
    }
  };

  const handleBlurEvent = (view: EditorView): void => {
    if (onBlur) {
      onBlur(view.state);
    }
  };

  const options = {
    handleDOMEvents: {
      focus: handleFocusEvent,
      blur: handleBlurEvent
    }
  };

  return (
    <div className="keyword" ref={containerRef}>
      <ProseMirrorEditorView options={options} ref={prosemirrorRef} editorState={editorState} onChange={onChange} />
      <div className="keyword-delete-cta" onClick={onDelete}>
        &#10006;
      </div>
    </div>
  );
};
