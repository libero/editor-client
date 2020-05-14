import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { EditorState, Transaction } from 'prosemirror-state';

import { NewKeywordSection } from './new-keyword-section';
import { Keyword } from './keyword';
import { makeKeywordContainerStyles } from './styles';

interface KeywordsEditorProps {
  className?: string;
  keywords: EditorState[];
  newKeyword: EditorState;
  label?: string;
  onDelete: (index: number) => void;
  onChange: (index: number, change: Transaction) => void;
  onNewKeywordChange: (change: Transaction) => void;
  onAdd: (state: EditorState) => void;
  onFocus: (index: number) => void;
  onBlur: (index: number) => void;
}

export const KeywordsEditor: React.FC<KeywordsEditorProps> = (props) => {
  const {
    className,
    keywords,
    label,
    onChange,
    onDelete,
    onAdd,
    onFocus,
    onBlur,
    newKeyword,
    onNewKeywordChange
  } = props;
  const classes = makeKeywordContainerStyles();

  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback(
    (index: number) => {
      console.log('Focused');
      onFocus(index);
      setFocused(true);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (index: number) => {
      console.log('blurred');
      onBlur(index);
      setFocused(false);
    },
    [onBlur]
  );

  const renderKeywords = (keywords: EditorState[]) => {
    return keywords.map((keywordEditorState, index) => {
      return (
        <Keyword
          key={index}
          onChange={onChange.bind(null, index)}
          editorState={keywordEditorState}
          onDelete={onDelete.bind(null, index)}
          onFocus={handleFocus.bind(null, index)}
          onBlur={handleBlur.bind(null, index)}
        />
      );
    });
  };

  const handleNewKeywordFocus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const handleNewKeywordBlur = useCallback(() => {
    setFocused(false);
  }, [setFocused]);

  return (
    <fieldset className={classNames(classes.keywordsEditor, className, { [classes.focused]: focused })} tabIndex={0}>
      {label ? <legend className={classes.label}>{label}</legend> : undefined}
      <section className={classes.keywordsSection}>
        {renderKeywords(keywords)}
        <NewKeywordSection
          className={classes.newKeywordEditor}
          onChange={onNewKeywordChange}
          editorState={newKeyword}
          onEnter={onAdd}
          onBlur={handleNewKeywordBlur}
          onFocus={handleNewKeywordFocus}
        />
      </section>
    </fieldset>
  );
};
