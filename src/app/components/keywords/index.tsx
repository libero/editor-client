import React, { useCallback } from 'react';
import { EditorState, Transaction } from 'prosemirror-state';

import { NewKeywordSection } from './new-keyword-section';
import { Keyword } from './keyword';
import { makeKeywordContainerStyles } from './styles';
import { SectionContainer } from 'app/components/section-container';

interface KeywordsEditorProps {
  keywords: EditorState[];
  newKeyword: EditorState;
  label?: string;
  onDelete: (index: number) => void;
  onChange: (index: number, change: Transaction) => void;
  onNewKeywordChange: (change: Transaction) => void;
  onAdd: (state: EditorState) => void;
  onFocus: (index: number | undefined, isNewKeywordFocused?: boolean) => void;
  onBlur: (index: number | undefined, isNewKeywordFocused?: boolean) => void;
}

export const KeywordsEditor: React.FC<KeywordsEditorProps> = (props) => {
  const { keywords, label, onChange, onDelete, onAdd, onFocus, onBlur, newKeyword, onNewKeywordChange } = props;
  const classes = makeKeywordContainerStyles();

  const handleFocus = useCallback(
    (index: number) => {
      onFocus(index);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (index: number) => {
      onBlur(index);
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
    onFocus(undefined, true);
  }, [onFocus]);

  const handleNewKeywordBlur = useCallback(() => {
    onBlur(undefined, false);
  }, [onBlur]);

  return (
    <SectionContainer label={label}>
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
    </SectionContainer>
  );
};
