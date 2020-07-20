import { EditorState, Transaction } from 'prosemirror-state';
import { Person } from './person';
import { Affiliation } from 'app/models/affiliation';
import { Reference } from 'app/models/reference';

export interface KeywordGroups {
  [keywordType: string]: {
    title: string | undefined;
    keywords: EditorState[];
    newKeyword: EditorState;
  };
}

export interface ArticleInformation {
  articleType: string;
  dtd: string;
  articleDOI: string;
}

export type Manuscript = {
  title: EditorState;
  articleInfo: ArticleInformation;
  authors: Person[];
  affiliations: Affiliation[];
  abstract: EditorState;
  keywordGroups: KeywordGroups;
  references: Reference[];
};

export type ManuscriptDiff = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [path: string]: Array<any> | Record<string, any> | Transaction | undefined;
};
