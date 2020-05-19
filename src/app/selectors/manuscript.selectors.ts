import { createSelector } from 'reselect';
import { ApplicationState, ManuscriptHistoryState } from '../store';
import { get } from 'lodash';

const getManuscriptState = (state: ApplicationState): ManuscriptHistoryState => {
  return state.manuscript;
};
export const getManuscriptData = createSelector(getManuscriptState, (state) => get(state, 'data'));

export const isManuscriptLoaded = createSelector(getManuscriptData, (data) => Boolean(data));

export const getTitle = createSelector(getManuscriptData, (data) => get(data, 'present.title'));

export const getAbstract = createSelector(getManuscriptData, (data) => get(data, 'present.abstract'));

export const getKeywordGroups = createSelector(getManuscriptData, (data) => get(data, 'present.keywordGroups'));

export const getAuthors = createSelector(getManuscriptData, (data) => get(data, 'present.authors', []));
