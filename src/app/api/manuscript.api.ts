import axios from 'axios';
import { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';

import { Manuscript, ManuscriptDiff, ManuscriptDiffValues } from 'app/models/manuscript';
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
import { has, set, get } from 'lodash';

const manuscriptUrl = (id: string): string => {
  // TODO
  // Enable the below once the the article-store is working again!
  // return process.env.REACT_APP_NO_SERVER ? `./manuscripts/${id}/manuscript.xml` : `/api/v1/articles/${id}`
  return `./manuscripts/${id}/manuscript.xml`;
};

type SerializableChangeType = 'steps' | 'object';
type SerializableObjectValue = Exclude<ManuscriptDiffValues, Transaction>;

interface SerializableChanges {
  path: string;
  steps?: Step[];
  object?: SerializableObjectValue;
  timestamp: number;
  type: SerializableChangeType;
}

export interface ManuscriptChangesResponse {
  changes: Array<{
    _id: string;
    articleId: string;
    steps: Array<ReturnType<Step['toJSON']>>;
    applied: boolean;
    user: string;
    path: string;
    timestamp: number;
  }>;
}

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

export function syncChanges(id: string, changes: ManuscriptDiff[]): Promise<void> {
  const backendTranscations = changes.reduce(reduceHistory, {});
  compressChanges(backendTranscations);
  return axios.post(manuscriptUrl(id) + '/changes', { changes: backendTranscations });
}

export async function getManuscriptChanges(id: string): Promise<ManuscriptChangesResponse['changes']> {
  const manuscriptChangesResponse = await axios.get<ManuscriptChangesResponse>(`./changes/${id}/changes.json`);
  return manuscriptChangesResponse.data.changes;
}

function reduceHistory(
  acc: Record<string, SerializableChanges>,
  diff: ManuscriptDiff
): Record<string, SerializableChanges> {
  Object.keys(diff).forEach((path) => {
    if (path === '_timestamp') {
      return;
    }

    const type: SerializableChangeType = diff[path] instanceof Transaction ? 'steps' : 'object';
    if (!acc[path]) {
      acc[path] = {
        path,
        type,
        timestamp: diff._timestamp
      };
    }

    if (diff[path] instanceof Transaction) {
      acc[path].steps = (acc[path].steps || []).concat((diff[path] as Transaction).steps);
    } else {
      acc[path].object = diff[path] as SerializableObjectValue;
    }
  });
  return acc;
}

function compressChanges(changes: Record<string, SerializableChanges>): Record<string, SerializableChanges> {
  const mergeOptions = Object.keys(changes).reduce((mergeAcc: Record<string, string>, path: string) => {
    const crumbs = path.split('.');

    for (let i = 1; i < crumbs.length; i++) {
      const changesPath = crumbs.slice(0, i);

      if (has(changes, changesPath.join('.'))) {
        mergeAcc[path] = changesPath.join('.');
        break;
      }
    }
    return mergeAcc;
  }, {});

  for (const [mergeSourcePath, mergeDestPath] of Object.entries(mergeOptions)) {
    changes[mergeDestPath] = mergeChanges(changes, mergeSourcePath, mergeDestPath);
    delete changes[mergeSourcePath];
  }

  return changes;
}

function mergeChanges(
  changes: Record<string, SerializableChanges>,
  sourcePath: string,
  destPath: string
): SerializableChanges {
  const source = changes[sourcePath];
  const dest = changes[destPath];

  if (dest.timestamp > source.timestamp) {
    return dest;
  }

  if (dest.type === 'object' && source.type === 'object') {
    const pathToSourceInDest = sourcePath.replace(`${destPath}.`, '');
    set<SerializableObjectValue>(dest.object, pathToSourceInDest, source);
  } else if (source.type === 'steps' && dest.type === 'object') {
    const pathToSourceInDest = sourcePath.replace(`${destPath}.`, '');
    if (get(dest.object, pathToSourceInDest) instanceof EditorState) {
      const state = get(dest.object, pathToSourceInDest, source).tr;
      const transaction = state.tr;
      source.steps.forEach((stepJson) => {
        transaction.maybeStep(Step.fromJSON(state.schema, stepJson));
      });
      set(dest.object, pathToSourceInDest, state.apply(transaction));
    }
  }
  return dest;
}
