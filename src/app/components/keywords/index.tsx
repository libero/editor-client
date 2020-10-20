import React, { useCallback, useRef, useEffect } from 'react';
import { EditorState, Transaction } from 'prosemirror-state';

import { NewKeywordSection } from './new-keyword-section';
import { Keyword } from './keyword';
import { makeKeywordContainerStyles } from './styles';
import { SectionContainer } from 'app/components/section-container';

interface KeywordsEditorProps {
  keywords: EditorState[];
  newKeyword: EditorState;
  label?: string;
  name: string;
  activeKeywordPath?: string;
  onDelete: (groupType: string, index: number) => void;
  onChange: (groupType: string, index: number, change: Transaction) => void;
  onNewKeywordChange: (groupType: string, change: Transaction) => void;
  onAdd: (groupType: string, state: EditorState) => void;
  onFocus: (groupType: string, index: number | undefined, isNewKeywordFocused?: boolean) => void;
  onBlur: () => void;
}

const isActiveKeyword = (group: string, index: number, activeKeywordPath?: string) => {
  return activeKeywordPath === `keywordGroups.${group}.keywords.${index}`;
};

const preventClickPropagation = (e: Event) => {
  e.stopPropagation();
  e.preventDefault();
};

export const KeywordsEditor: React.FC<KeywordsEditorProps> = (props) => {
  const {
    keywords,
    label,
    onChange,
    onDelete,
    name,
    onAdd,
    onFocus,
    newKeyword,
    onNewKeywordChange,
    activeKeywordPath,
    onBlur
  } = props;
  const classes = makeKeywordContainerStyles();
  const keywordsDomContainer = useRef<HTMLElement>();

  const handleFocus = useCallback(
    (index: number) => {
      onFocus(name, index);
    },
    [name, onFocus]
  );

  useEffect(() => {
    if (keywordsDomContainer.current) {
      const container = keywordsDomContainer.current;
      container.addEventListener('click', preventClickPropagation);
      return () => container.removeEventListener('click', preventClickPropagation);
    }
  }, [keywordsDomContainer]);

  const renderKeywords = (keywords: EditorState[]) => {
    return keywords.map((keywordEditorState, index) => {
      return (
        <Keyword
          key={index}
          isActive={isActiveKeyword(name, index, activeKeywordPath)}
          onChange={onChange.bind(null, name, index)}
          editorState={keywordEditorState}
          onDelete={onDelete.bind(null, name, index)}
          onFocus={handleFocus.bind(null, index)}
          onBlur={onBlur}
        />
      );
    });
  };

  const handleNewKeywordFocus = useCallback(() => {
    onFocus(name, undefined, true);
  }, [name, onFocus]);

  const isGroupFocused = activeKeywordPath && activeKeywordPath.startsWith(`keywordGroups.${name}`);

  return (
    <SectionContainer label={label} focused={isGroupFocused}>
      <section className={classes.keywordsSection} ref={keywordsDomContainer}>
        {renderKeywords(keywords)}
        <NewKeywordSection
          className={classes.newKeywordEditor}
          onChange={onNewKeywordChange.bind(null, name)}
          editorState={newKeyword}
          onEnter={onAdd.bind(null, name)}
          onFocus={handleNewKeywordFocus}
        />
      </section>
    </SectionContainer>
  );
};
