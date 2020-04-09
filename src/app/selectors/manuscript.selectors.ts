import { createSelector } from 'reselect';
import {ApplicationState} from "../store";
import { get } from 'lodash';

const getManuscriptState = (state: ApplicationState) => {
  return state.manuscript;
};

export const getManuscriptData = createSelector(
  getManuscriptState,
  state => get(state, 'data')
);

export const isManuscriptLoaded = createSelector(
  getManuscriptData,
  data => Boolean(data)
);

export const getManuscriptTitle = createSelector(
  getManuscriptData,
  data => get(data, 'present.title')
);

export const canUndoChanges = createSelector(
  getManuscriptData,
  data => get(data, 'past.length') > 0
);

export const canRedoChanges = createSelector(
  getManuscriptData,
  data => get(data, 'future.length') > 0
);