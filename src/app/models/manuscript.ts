import { EditorState, Transaction } from 'prosemirror-state';
import { Person } from './person';

export interface KeywordGroups {
  [keywordType: string]: {
    title: string | undefined;
    keywords: EditorState[];
    newKeyword: EditorState;
  };
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
