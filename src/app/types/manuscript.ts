import { EditorState } from 'prosemirror-state';

import { Person } from '../models/person';
import { Affiliation } from '../models/affiliation';
import { Reference } from '../models/reference';
import { RelatedArticle } from '../models/related-article';
import { ArticleInformation } from '../models/article-information';
import { KeywordGroups } from '../models/keyword';

interface JournalMeta {
  publisherName: string;
  issn: string;
}

export type Manuscript = {
  journalMeta: JournalMeta;
  title: EditorState;
  articleInfo: ArticleInformation;
  authors: Person[];
  affiliations: Affiliation[];
  abstract: EditorState;
  impactStatement: EditorState;
  body: EditorState;
  acknowledgements: EditorState;
  keywordGroups: KeywordGroups;
  references: Reference[];
  relatedArticles: RelatedArticle[];
};

export interface TOCEntry {
  id?: string;
  title: string;
  level: number;
}

export type TableOfContents = Array<TOCEntry>;
