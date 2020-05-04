import { createSelector } from 'reselect';
import { ApplicationState, ManuscriptHistoryState } from '../store';
import { get } from 'lodash';
import { EditorState } from 'prosemirror-state';

const getManuscriptState = (state: ApplicationState): ManuscriptHistoryState => {
  return state.manuscript;
};
export const getManuscriptData = createSelector(getManuscriptState, (state) => get(state, 'data'));

export const isManuscriptLoaded = createSelector(getManuscriptData, (data) => Boolean(data));

export const getTitle = createSelector(getManuscriptData, (data) => get(data, 'present.title'));

export const getAbstract = createSelector(getManuscriptData, (data) => get(data, 'present.abstract'));

export const getKeywords = createSelector(getManuscriptData, (data) => get(data, 'present.keywords'));
