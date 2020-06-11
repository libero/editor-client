import React, { useCallback } from 'react';
import { EditorState, Transaction } from 'prosemirror-state';

import { NewKeywordSection } from 'app/containers/manuscript/keyword-group-seciton/new-keyword-section';
import { Keyword } from 'app/containers/manuscript/keyword-group-seciton/keyword';
import { makeKeywordContainerStyles } from 'app/containers/manuscript/keyword-group-seciton/styles';
import { SectionContainer } from 'app/components/section-container';
import { memoizeBind } from 'app/utils/memoize-bind';
import { isEqual } from 'lodash';

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

export const KeywordsEditor: React.FC<KeywordsEditorProps> = React.memo((props) => {
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
          onChange={memoizeBind(onChange, index)}
          editorState={keywordEditorState}
          onDelete={memoizeBind(onDelete, index)}
          onFocus={memoizeBind(handleFocus, index)}
          onBlur={memoizeBind(handleBlur, index)}
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
}, isEqual);
