import React, {useCallback, useEffect, useRef} from "react";
import {EditorState, Transaction} from "prosemirror-state";
import {ProseMirrorEditorView} from "../rich-text-editor/prosemirror-editor-view";
import './styles.scss';

interface KeywordsEditorProps {
  keywords: EditorState[];
  label?: string;
  onDelete: (index: number) => void;
  onChange: (index: number, state: Transaction) => void;
}

export const KeywordsEditor: React.FC<KeywordsEditorProps> = ({keywords, label, onChange, onDelete}) => {

  const renderKeywords = (keywords: EditorState[]) => {
    return keywords.map((keywordEditorState, index) => {
        return <Keyword
          key={index}
          onChange={onChange.bind(null, index)}
          editorState={keywordEditorState}
          onDelete={onDelete.bind(null, index)} />
      });
  }

  return (<div className='editorview-wrapper'>
    {label ? <div className="editor-label">{label}</div> : undefined}
    <div className="keyword-group">{renderKeywords(keywords)}</div>
  </div>);
}

interface KeywordProps {
  editorState: EditorState;
  onChange: (state: Transaction) => void;
  onDelete: () => void;
}

const Keyword: React.FC<KeywordProps> = ({editorState, onDelete, onChange}) => {

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

  return <div className="keyword" ref={containerRef}>
    <ProseMirrorEditorView
      ref={prosemirrorRef}
      editorState={editorState}
      onChange={onChange}
    />
    <div className="keyword-delete-cta" onClick={onDelete}>&#10006;</div>
  </div>
}
