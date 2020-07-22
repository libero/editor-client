import { v4 as uuidv4 } from 'uuid';

export interface RelatedArticle {
  readonly id: string;
  articleType: string;
  href: string;
}

export function createNewRelatedArticle(article: Partial<RelatedArticle> = {}): RelatedArticle {
  return {
    id: uuidv4(),
    articleType: '',
    href: '',
    ...article
  };
}

export function createRelatedArticleState(relatedArticlesXml: Element[]): RelatedArticle[] {
  return relatedArticlesXml.map((el: Element) => ({
    id: el.getAttribute('id') || uuidv4(),
    articleType: el.getAttribute('related-article-type'),
    href: el.getAttribute('xlink:href')
  }));
}
