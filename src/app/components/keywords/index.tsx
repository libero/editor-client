import React from 'react';
import { EditorState, Transaction } from 'prosemirror-state';

import './styles.scss';
import { createNewKeywordState } from '../../models/manuscript-state.factory';
import { NewKeywordSection } from './new-keyword-section';
import { Keyword } from './keyword';

interface KeywordsEditorProps {
  keywords: EditorState[];
  label?: string;
  onDelete: (index: number) => void;
  onChange: (index: number, change: Transaction) => void;
  onAdd: (state: EditorState) => void;
  onFocus: (index: number) => void;
  onBlur: (index: number) => void;
}

export const KeywordsEditor: React.FC<KeywordsEditorProps> = (props) => {
  const { keywords, label, onChange, onDelete, onAdd, onFocus, onBlur } = props;
  const renderKeywords = (keywords: EditorState[]) => {
    return keywords.map((keywordEditorState, index) => {
      return (
        <Keyword
          key={index}
          onChange={onChange.bind(null, index)}
          editorState={keywordEditorState}
          onDelete={onDelete.bind(null, index)}
          onFocus={onFocus.bind(null, index)}
          onBlur={onBlur.bind(null, index)}
        />
      );
    });
  };

  const newKeyword = createNewKeywordState();

  return (
    <div className="editorview-wrapper">
      {label ? <div className="editor-label">{label}</div> : undefined}
      <div className="keyword-group">
        {renderKeywords(keywords)}
        <div className="new-keyword-container">
          <NewKeywordSection editorState={newKeyword} onEnter={onAdd} />
        </div>
      </div>
    </div>
  );
};

