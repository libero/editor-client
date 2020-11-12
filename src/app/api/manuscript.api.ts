import axios from 'axios';
import { Manuscript } from 'app/models/manuscript';
import {
  createTitleState,
  createKeywordGroupsState,
  createAbstractState,
  createReferencesState,
  createImpactStatementState,
  createAcknowledgementsState,
  createBodyState
} from 'app/models/manuscript-state.factory';
import { createAuthorsState } from 'app/models/person';
import { createAffiliationsState } from 'app/models/affiliation';
import { getTextContentFromPath } from 'app/models/utils';
import { createRelatedArticleState } from 'app/models/related-article';
import { createArticleInfoState } from 'app/models/article-information';
import { reduce } from 'lodash';

const manuscriptUrl = (id: string): string => {
  // TODO
  // Enable the below once the the article-store is working again!
  return `http://localhost:9000/api/v1/articles/${id}`;
  //return `./manuscripts/${id}/manuscript.xml`;
};

export async function getManuscriptContent(id: string): Promise<Manuscript> {
  const { data } = await axios.get<string>(manuscriptUrl(id), { headers: { Accept: 'application/xml' } });
  // data structure that we need for the backend
  // [{path: 'title', steps: [...]}, {path: 'keywords', steps: [...]}, {path: 'abstract', steps: [...]}] OR
  // {'title': {steps: []}, 'keywords': {steps: []}, 'abstract': {steps: []}}
  // db collections:
  // const steps = await axios.get<any>(`/api/v1/articles/${id}/changes?version=1&status=pending`);
  // CONSIDER: sort order mattters
  const { data: { changes }} = await axios.get<any>(`http://localhost:9000/api/v1/articles/${id}/changes?version=1&status=pending`);

  // state of changes as per {path: {steps[transcations]}}
  const paths = changes.reduce((acc, step) => {
    if (acc[step.path]) {
      acc[step.path].steps.push(step.steps); // push transcation
    } else {
      acc[step.path] ? acc[step.path].steps = [step.steps] : acc[step.path] = { steps: [step.steps]};
    }
    return acc;
  }, {});

  console.log(paths);

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
    title: createTitleState(title, paths.title.steps),
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
