import React from 'react';
import classNames from 'classnames';
import { EditorState, Transaction } from 'prosemirror-state';

import { createNewKeywordState } from '../../models/manuscript-state.factory';
import { NewKeywordSection } from './new-keyword-section';
import { Keyword } from './keyword';
import { makeProsemirrorStyles } from './styles';

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
  const classes = makeProsemirrorStyles();
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
    <fieldset className={classNames(classes.keywordsEditor, className)} tabIndex={0}>
      {label ? <legend className={classes.label}>{label}</legend> : undefined}
      <section className={classes.keywordsSection}>
        {renderKeywords(keywords)}
        <NewKeywordSection className={classes.newKeywordEditor} editorState={newKeyword} onEnter={onAdd} />
      </section>
    </fieldset>
  );
};
