import React, {useCallback, useEffect, useRef, useState} from "react";
import {EditorState, Transaction} from "prosemirror-state";
import {EditorView} from "prosemirror-view";

import {ProseMirrorEditorView} from "../rich-text-editor/prosemirror-editor-view";
import './styles.scss';
import {createNewKeywordState} from "../../models/manuscript-state.factory";

const ENTER_KEY_CODE = 'Enter';

interface KeywordsEditorProps {
  keywords: EditorState[];
  label?: string;
  onDelete: (index: number) => void;
  onChange: (index: number, change: Transaction) => void;
  onAdd: (state: EditorState) => void;
}

export const KeywordsEditor: React.FC<KeywordsEditorProps> = (props) => {
  const {keywords, label, onChange, onDelete, onAdd} = props;
  const renderKeywords = (keywords: EditorState[]) => {
    return keywords.map((keywordEditorState, index) => {
        return <Keyword
          key={index}
          onChange={onChange.bind(null, index)}
          editorState={keywordEditorState}
          onDelete={onDelete.bind(null, index)} />
      });
  }

  const newKeyword = createNewKeywordState();

  return (<div className='editorview-wrapper'>
    {label ? <div className="editor-label">{label}</div> : undefined}
    <div className="keyword-group">
      {renderKeywords(keywords)}
      <div className="new-keyword-container">
        <NewKeywordSection editorState={newKeyword} onEnter={onAdd}/>
      </div>
    </div>
  </div>);
}

interface NewKeywordSection {
  editorState: EditorState;
  onEnter: (editorState: EditorState) => void;
}

const NewKeywordSection:React.FC<NewKeywordSection> = ({editorState, onEnter}) => {
  const [internalState, setInternalState] = useState(editorState);

  useEffect(() => {
    setInternalState(editorState);
  }, [editorState, setInternalState]);

  const updateNewKeywordState = useCallback((tr: Transaction) => {
    setInternalState(internalState.apply(tr));
  }, [internalState]);

  const options = {
    handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
      if (event.key === ENTER_KEY_CODE) {
        onEnter(view.state)
      }
    }
  }

  return <ProseMirrorEditorView options={options} editorState={internalState} onChange={updateNewKeywordState} />
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
