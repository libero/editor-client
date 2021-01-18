import axios from 'axios';

import { Manuscript } from 'app/types/manuscript';
import { createTitleState } from 'app/models/title';
import { createAuthorsState } from 'app/models/person';
import { createAffiliationsState } from 'app/models/affiliation';
import { getTextContentFromPath } from 'app/models/utils';
import { createRelatedArticleState } from 'app/models/related-article';
import { createArticleInfoState } from 'app/models/article-information';
import { ManuscriptChangesResponse } from 'app/types/changes.types';
import { createKeywordGroupsState } from 'app/models/keyword';
import { createReferencesState } from 'app/models/reference';
import { createAbstractState, createImpactStatementState } from 'app/models/abstract';
import { createBodyState } from 'app/models/body';
import { createAcknowledgementsState } from 'app/models/acknowledgements';
import { Change } from 'app/utils/history/change';

const manuscriptUrl = (id: string): string => {
  // TODO
  // Enable the below once the the article-store is working again!
  // return process.env.REACT_APP_NO_SERVER ? `./manuscripts/${id}/manuscript.xml` : `/api/v1/articles/${id}`
  return `./manuscripts/${id}/manuscript.xml`;
};

export async function getManuscriptContent(id: string): Promise<Manuscript> {
  const { data } = await axios.get<string>(manuscriptUrl(id), { headers: { Accept: 'application/xml' } });

  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  const title = doc.querySelector('title-group article-title');
  const keywordGroups = doc.querySelectorAll('kwd-group');
  const abstract = doc.querySelector('abstract:not([abstract-type])');
  const impactStatement = doc.querySelector('abstract[abstract-type="toc"]');
  const authors = doc.querySelectorAll('contrib[contrib-type="author"]');
  const affiliations = doc.querySelectorAll('contrib-group:first-of-type aff');
  const references = doc.querySelectorAll('ref-list ref element-citation');
  const authorNotes = doc.querySelector('author-notes');
  const relatedArticles = doc.querySelectorAll('related-article');
  const acknowledgements = doc.querySelector('ack');
  const body = doc.querySelector('body');

  const authorsState = createAuthorsState(Array.from(authors), authorNotes);

  return {
    title: createTitleState(title),
    abstract: createAbstractState(abstract),
    impactStatement: createImpactStatementState(impactStatement),
    keywordGroups: createKeywordGroupsState(Array.from(keywordGroups)),
    authors: authorsState,
    body: createBodyState(body, id),
    affiliations: createAffiliationsState(Array.from(affiliations)),
    references: createReferencesState(Array.from(references)),
    relatedArticles: createRelatedArticleState(Array.from(relatedArticles)),
    acknowledgements: createAcknowledgementsState(acknowledgements),
    articleInfo: createArticleInfoState(doc, authorsState),
    journalMeta: {
      publisherName: getTextContentFromPath(doc, 'journal-meta publisher publisher-name'),
      issn: getTextContentFromPath(doc, 'journal-meta issn')
    }
  } as Manuscript;
}

export function syncChanges(id: string, changes: Change[]): Promise<void> {
  return axios.post(manuscriptUrl(id) + '/changes', { changes });
}

export async function getManuscriptChanges(id: string): Promise<ManuscriptChangesResponse['changes']> {
  const manuscriptChangesResponse = await axios.get<ManuscriptChangesResponse>(manuscriptUrl(id) + '/changes');
  return manuscriptChangesResponse.data.changes;
}
