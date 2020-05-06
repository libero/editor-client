import React from 'react';
import classNames from 'classnames';
import { EditorState, Transaction } from 'prosemirror-state';

import './styles.scss';
import { createNewKeywordState } from '../../models/manuscript-state.factory';
import { NewKeywordSection } from './new-keyword-section';
import { Keyword } from './keyword';

interface KeywordsEditorProps {
  className?: string;
  keywords: EditorState[];
  label?: string;
  onDelete: (index: number) => void;
  onChange: (index: number, change: Transaction) => void;
  onAdd: (state: EditorState) => void;
  onFocus: (index: number) => void;
  onBlur: (index: number) => void;
}

export const KeywordsEditor: React.FC<KeywordsEditorProps> = (props) => {
  const { className, keywords, label, onChange, onDelete, onAdd, onFocus, onBlur } = props;
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
    <fieldset className={classNames('editorview-wrapper', 'keywords-group-container', className)}>
      {label ? <legend className="keyword-group-legend">{label}</legend> : undefined}
      <section className="keywords-section">
        {renderKeywords(keywords)}
        <div className="new-keyword-container">
          <NewKeywordSection editorState={newKeyword} onEnter={onAdd} />
        </div>
      </section>
    </fieldset>
  );
};

