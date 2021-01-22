import { BackmatterEntity } from 'app/models/backmatter-entity';
import { JSONObject } from 'app/types/utility.types';

export class RelatedArticle extends BackmatterEntity {
  articleType: string;
  href: string;

  constructor(data?: JSONObject | Element, notesXml?: Element) {
    super();
    this.createEntity(data);
  }

  public clone(): RelatedArticle {
    const newArticle = new RelatedArticle();
    newArticle._id = this._id;
    newArticle.articleType = this.articleType;
    newArticle.href = this.href;
    return newArticle;
  }

  protected fromXML(xmlNode: Element): void {
    this.articleType = xmlNode.getAttribute('related-article-type');
    this.href = xmlNode.getAttribute('xlink:href');
  }

  protected fromJSON(json: JSONObject): void {
    this._id = (json._id as string) || this.id;
    this.articleType = json.articleType as string;
    this.href = json.href as string;
  }

  protected createBlank(): void {
    this.articleType = '';
    this.href = '';
  }
}

export function createRelatedArticleState(relatedArticlesXml: Element[]): RelatedArticle[] {
  return relatedArticlesXml.map((xml: Element) => new RelatedArticle(xml));
}
