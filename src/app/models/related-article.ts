export interface RelatedArticle {
  linkType: string;
  articleType: string;
  href: string;
}

export function createRelatedArticleState(relatedArticlesXml: Element[]): RelatedArticle[] {
  return relatedArticlesXml.map((el: Element) => ({
    linkType: el.getAttribute('ext-link-type'),
    articleType: el.getAttribute('related-article-type'),
    href: el.getAttribute('xlink:href')
  }));
}
