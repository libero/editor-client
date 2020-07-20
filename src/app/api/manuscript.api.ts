import axios from 'axios';
import { Manuscript } from 'app/models/manuscript';
import {
  createTitleState,
  createKeywordGroupsState,
  createAbstractState,
  createReferencesState
} from 'app/models/manuscript-state.factory';
import { createAuthorsState } from 'app/models/person';
import { createAffiliationsState } from 'app/models/affiliation';
import { getTextContentFromPath } from 'app/models/utils';

const manuscriptUrl = (id: string): string => {
  return process.env.NODE_ENV === 'development' ? `./manuscripts/${id}/manuscript.xml` : `/api/v1/articles/${id}/`;
};

export async function getManuscriptContent(id: string): Promise<Manuscript> {
  const { data } = await axios.get<string>(manuscriptUrl(id), { headers: { Accept: 'application/xml' } });

  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const title = doc.querySelector('title-group article-title');
  const keywordGroups = doc.querySelectorAll('kwd-group');
  const abstract = doc.querySelector('abstract:not([abstract-type])');
  const authors = doc.querySelectorAll('contrib[contrib-type="author"]');
  const affiliations = doc.querySelectorAll('contrib-group:first-of-type aff');
  const references = doc.querySelectorAll('ref-list ref element-citation');
  const authorNotes = doc.querySelector('author-notes');

  return {
    title: createTitleState(title),
    abstract: createAbstractState(abstract),
    keywordGroups: createKeywordGroupsState(Array.from(keywordGroups)),
    authors: createAuthorsState(Array.from(authors), authorNotes),
    affiliations: createAffiliationsState(Array.from(affiliations)),
    references: createReferencesState(Array.from(references)),
    articleInfo: {
      articleType: doc.querySelector('article').getAttribute('article-type'),
      dtd: doc.querySelector('article').getAttribute('dtd-version'),
      articleDOI: getTextContentFromPath(doc, 'article-id[pub-id-type="doi"]')
    }
  } as Manuscript;
}
