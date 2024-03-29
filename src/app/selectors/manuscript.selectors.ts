import { createSelector } from 'reselect';
import { ApplicationState, ManuscriptHistoryState } from '../store';
import { get } from 'lodash';
import { Person } from '../models/person';

const getManuscriptState = (state: ApplicationState): ManuscriptHistoryState => {
  return state.manuscript;
};

export const getManuscriptData = createSelector(getManuscriptState, (state) => get(state, 'data'));

export const isManuscriptLoaded = createSelector(getManuscriptData, (data) => Boolean(data));

export const getTitle = createSelector(getManuscriptData, (data) => get(data, 'present.title'));

export const getAbstract = createSelector(getManuscriptData, (data) => get(data, 'present.abstract'));

export const getBody = createSelector(getManuscriptData, (data) => get(data, 'present.body'));

export const getAcknowledgements = createSelector(getManuscriptData, (data) => get(data, 'present.acknowledgements'));

export const getImpactStatement = createSelector(getManuscriptData, (data) => get(data, 'present.impactStatement'));

export const getKeywordGroups = createSelector(getManuscriptData, (data) => get(data, 'present.keywordGroups'));

export const getAuthors = createSelector(getManuscriptData, (data) => get(data, 'present.authors', []));

export const getAffiliations = createSelector(getManuscriptData, (data) => get(data, 'present.affiliations', []));

export const getRelatedArticles = createSelector(getManuscriptData, (data) => get(data, 'present.relatedArticles', []));

export const getArticleInformation = createSelector(getManuscriptData, (data) => get(data, 'present.articleInfo', []));

export const getReferences = createSelector(getManuscriptData, (data) => get(data, 'present.references', []));

export const getJournalMeta = createSelector(getManuscriptData, (data) => get(data, 'present.journalMeta', []));

export const getAffiliatedAuthors = createSelector(getManuscriptData, ({ present }) => (affId: string) => {
  return present.authors.filter((author) => author.affiliations.includes(affId));
});

export const getAuthorAffiliations = createSelector(getManuscriptData, ({ present }) => (author: Person) => {
  return present.affiliations.filter((affiliation) => author.affiliations.includes(affiliation.id));
});

export const getChangesMadeBetween = createSelector(
  getManuscriptData,
  ({ past }) => (startTs: number, endTs: number) => {
    return past.filter(({ timestamp }) => timestamp >= startTs && timestamp <= endTs);
  }
);
