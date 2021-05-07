import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { isUndefined } from 'lodash';

import { Manuscript } from 'app/types/manuscript';
import { createTitleState } from 'app/models/title';
import { createAuthorsState } from 'app/models/person';
import { createAffiliationsState } from 'app/models/affiliation';
import { getTextContentFromPath } from 'app/models/utils';
import { createRelatedArticleState } from 'app/models/related-article';
import { ArticleInformation } from 'app/models/article-information';
import { createKeywordGroupsState } from 'app/models/keyword';
import { createReferencesState } from 'app/models/reference';
import { createAbstractState, createImpactStatementState } from 'app/models/abstract';
import { createBodyState } from 'app/models/body';
import { createAcknowledgementsState } from 'app/models/acknowledgements';
import { Change } from 'app/utils/history/change';

import { JSONObject } from 'app/types/utility.types';
import { PDF_EXPORT_ERROR, PDF_EXPORT_RUNNING, PDF_EXPORT_SUCCESS } from 'app/store';

const RECORDS_PER_PAGE = 100;

interface ManuscriptChangesResponse {
  changes: Array<JSONObject>;
  total: number;
}

const manuscriptUrl = (id: string): string => {
  return `/api/v1/articles/${id}`;
};

const figureUploadUrl = (id: string): string => {
  return `/api/v1/articles/${id}/assets`;
};

const changesUrl = (id: string, page?: number): string => {
  return !isUndefined(page) ? `/api/v1/articles/${id}/changes?page=${page}` : `/api/v1/articles/${id}/changes`;
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
    articleInfo: new ArticleInformation(doc.documentElement, authorsState),
    journalMeta: {
      publisherName: getTextContentFromPath(doc, 'journal-meta publisher publisher-name'),
      issn: getTextContentFromPath(doc, 'journal-meta issn')
    }
  } as Manuscript;
}

export function syncChanges(id: string, changes: Change[]): Promise<void> {
  return axios.post(changesUrl(id), { changes });
}

export async function getManuscriptChanges(id: string): Promise<JSONObject[]> {
  const { data } = await axios.get<ManuscriptChangesResponse>(changesUrl(id, 0));
  const pagesRemaining = Math.ceil((data.total - data.changes.length) / RECORDS_PER_PAGE);

  const remainingPages = await Promise.all(
    Array(pagesRemaining)
      .fill(undefined)
      .map((_, index) => axios.get<ManuscriptChangesResponse>(changesUrl(id, index + 1)))
  );

  return remainingPages.reduce((acc, response) => [...acc, ...response.data.changes], data.changes);
}

// mock call
// returns export task id
export async function startManuscriptExport(manuscriptId: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(uuidv4()), 1000);
  });
}

// mock call
// returns export task id
export async function cancelManuscriptExport(manuscriptId: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
}

// mock call
// returns export task id
export async function getManuscriptExportStatus(taskId: string): Promise<string> {
  return new Promise((resolve) => {
    const coinFlip = Math.round(Math.random() * 100);
    setTimeout(
      () =>
        resolve(coinFlip % 19 === 0 ? PDF_EXPORT_ERROR : coinFlip % 17 === 0 ? PDF_EXPORT_SUCCESS : PDF_EXPORT_RUNNING),
      500
    );
  });
}

export async function uploadFigureImage(articleId: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axios.post<{ assetName: string }>(figureUploadUrl(articleId), formData);
  return data.assetName;
}
