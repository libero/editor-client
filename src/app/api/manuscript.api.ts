import axios from 'axios';
import { Manuscript } from 'app/models/manuscript';
import {
  createTitleState,
  createKeywordGroupsState,
  createAbstractState,
  createAuthorsState,
  createAffiliationsState
} from 'app/models/manuscript-state.factory';

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

  return {
    title: createTitleState(title),
    abstract: createAbstractState(abstract),
    keywordGroups: createKeywordGroupsState(Array.from(keywordGroups)),
    authors: createAuthorsState(Array.from(authors)),
    affiliations: createAffiliationsState(Array.from(affiliations))
  } as Manuscript;
}
