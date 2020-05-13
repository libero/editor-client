import axios from 'axios';
import { Manuscript } from '../models/manuscript';
import { createTitleState, createKeywordsState, createAbstractState } from '../models/manuscript-state.factory';

export function getArticleId() {
  const params = new URLSearchParams(document.location.search.substring(1));
  return params.get('articleId') || '00104';
}

const manuscriptUrl = (id: string): string => {
  return process.env.NODE_ENV === 'development' ? `./manuscripts/${id}/manuscript.xml` : `/api/v1/articles/${id}/`;
};

export async function getManuscriptContent(id: string): Promise<Manuscript> {
  console.log(`${id}`);
  const { data } = await axios.get<string>(id, { headers: { Accept: 'application/xml' } });

  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const title = doc.querySelector('title-group article-title');
  const keywords = doc.querySelectorAll('kwd-group');
  const abstract = doc.querySelector('abstract:not([abstract-type])');

  return {
    title: createTitleState(title),
    abstract: createAbstractState(abstract),
    keywords: createKeywordsState(Array.from(keywords))
  } as Manuscript;
}
