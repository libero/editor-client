import axios from 'axios';
import { cloneDeepWith } from 'lodash';
import { EditorState, Transaction } from 'prosemirror-state';

import { Manuscript, ManuscriptDiff } from 'app/models/manuscript';
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
    // TODO: apply chnages to keywordGroups
    keywordGroups: createKeywordGroupsState(Array.from(keywordGroups)),
    // TODO: apply author state changes
    authors: authorsState,
    body: createBodyState(body, id),
    // TODO: apply affiliations changes
    affiliations: createAffiliationsState(Array.from(affiliations)),
    // TODO: apply references changes
    references: createReferencesState(Array.from(references)),
    // TODO: Apply related article changes
    relatedArticles: createRelatedArticleState(Array.from(relatedArticles)),
    acknowledgements: createAcknowledgementsState(acknowledgements),
    articleInfo: createArticleInfoState(doc, authorsState),
    //TODO: apply journalMetaChanges
    journalMeta: {
      publisherName: getTextContentFromPath(doc, 'journal-meta publisher publisher-name'),
      issn: getTextContentFromPath(doc, 'journal-meta issn')
    }
  } as Manuscript;
}

export function syncChanges(id: string, changes: ManuscriptDiff[]): Promise<void> {
  // TODO: squash changes here
  return axios.put(manuscriptUrl(id), changes.map(makeChangesSeralizable));
}

function makeChangesSeralizable(diff: ManuscriptDiff): Record<string, unknown> {
  return cloneDeepWith(diff, function (value) {
    if (value instanceof EditorState) {
      return value.doc.toJSON();
    }
    if (value instanceof Transaction) {
      return value.steps.map((step) => step.toJSON());
    }
  });
}

//
// export async function getManuscriptChanges(id: string) {
//   const {
//     data: { changes = [] }
//   } = await axios.get<any>(`./changes/${id}/changes.json`);
//
//   const paths = changes.reduce((acc, step) => {
//     if (!acc[step.path]) {
//       acc[step.path] = { steps: [] }; // push transaction
//     }
//     acc[step.path].steps = [...acc[step.path].steps, ...step.steps];
//     return acc;
//   }, {});
// }
//
// function applyStepsToEditor(editorState: EditorState, schema: Schema, changeSteps?: [Step]): EditorState {
//   if (changeSteps) {
//     const changeTransaction = editorState.tr;
//
//     changeSteps.forEach((changeStep) => {
//       changeTransaction.maybeStep(Step.fromJSON(schema, changeStep));
//     });
//     return editorState.apply(changeTransaction);
//   }
//
//   return editorState;
// }
