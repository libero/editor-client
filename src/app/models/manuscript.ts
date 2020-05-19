import { EditorState, Transaction } from 'prosemirror-state';

export interface KeywordGroups {
  [keywordType: string]: {
    title: string | undefined;
    keywords: EditorState[];
    newKeyword: EditorState;
  };
}

export interface Person {
  readonly id: string;
  firstName: string;
  lastName: string;
  suffix?: string;
  email?: string;
  orcId?: string;
}

export type Manuscript = {
  title: EditorState;
  authors: Person[];
  abstract: EditorState;
  keywordGroups: KeywordGroups;
};

export type ManuscriptDiff = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [path: string]: Array<any> | Record<string, any> | Transaction | undefined;
};
