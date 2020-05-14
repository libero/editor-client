import { EditorState, Transaction } from 'prosemirror-state';

export interface KeywordGroups {
  [keywordType: string]: {
    title: string | undefined;
    keywords: EditorState[];
    newKeyword: EditorState;
  };
}

export type Manuscript = {
  title: EditorState;
  abstract: EditorState;
  keywordGroups: KeywordGroups;
};

export type ManuscriptDiff = {
  [K in keyof Manuscript]?: (Manuscript[K] extends EditorState ? Transaction : Manuscript[K]) | undefined;
};
