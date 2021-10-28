import React, { useCallback, useRef, useEffect } from 'react';
import { EditorState, Transaction } from 'prosemirror-state';

import { NewKeywordSection } from './new-keyword-section';
import { KeywordSection } from './keyword-section';
import { makeKeywordContainerStyles } from './styles';
import { SectionContainer } from '../section-container';
import { Keyword } from '../../models/keyword';

interface KeywordsEditorProps {
  keywords: Keyword[];
  newKeyword: Keyword;
  label?: string;
  name: string;
  activeKeywordPath?: string;
  onDelete: (groupType: string, keyword: Keyword) => void;
  onChange: (groupType: string, id: string, change: Transaction) => void;
  onNewKeywordChange: (groupType: string, change: Transaction) => void;
  onAdd: (groupType: string, keyword: Keyword) => void;
  onFocus: (editorState: EditorState, path: string) => void;
  onBlur: () => void;
}

const isActiveKeyword = (group: string, index: number, activeKeywordPath?: string): boolean => {
  return activeKeywordPath === `keywordGroups.${group}.keywords.${index}.content`;
};

const preventClickPropagation = (e: Event): void => {
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
    (state: EditorState, id: string) => {
      const index = keywords.findIndex((kwd) => kwd.id === id);
      if (index === -1) {
        onBlur();
      } else {
        onFocus(state, `keywordGroups.${name}.keywords.${index}.content`);
      }
    },
    [keywords, name, onBlur, onFocus]
  );

  useEffect(() => {
    if (keywordsDomContainer.current) {
      const container = keywordsDomContainer.current;
      container.addEventListener('click', preventClickPropagation);
      return () => container.removeEventListener('click', preventClickPropagation);
    }
  }, [keywordsDomContainer]);

  const renderKeywords = (keywords: Keyword[]): React.ReactNode[] => {
    return keywords.map((keyword, index) => {
      return (
        <KeywordSection
          key={index}
          isActive={isActiveKeyword(name, index, activeKeywordPath)}
          onChange={onChange.bind(null, name)}
          keyword={keyword}
          onDelete={onDelete.bind(null, name)}
          onFocus={handleFocus.bind(null)}
          onBlur={onBlur}
        />
      );
    });
  };

  const handleNewKeywordFocus = useCallback(
    (state: EditorState) => {
      onFocus(state, `keywordGroups.${name}.keywords.newKeyword.content`);
    },
    [name, onFocus]
  );

  const handleAddKeyword = useCallback(
    (editorState: EditorState) => {
      if (editorState.doc.textContent.trim().length > 0) {
        const kwd = newKeyword.clone();
        kwd.content = editorState;
        onAdd(name, kwd);
      }
    },
    [onAdd, name, newKeyword]
  );

  const isGroupFocused = activeKeywordPath && activeKeywordPath.startsWith(`keywordGroups.${name}`);

  return (
    <SectionContainer label={label} focused={isGroupFocused}>
      <section className={classes.keywordsSection} ref={keywordsDomContainer}>
        {renderKeywords(keywords)}
        <NewKeywordSection
          className={classes.newKeywordEditor}
          onChange={onNewKeywordChange.bind(null, name)}
          editorState={newKeyword.content}
          onEnter={handleAddKeyword}
          onFocus={handleNewKeywordFocus}
        />
      </section>
    </SectionContainer>
  );
};
