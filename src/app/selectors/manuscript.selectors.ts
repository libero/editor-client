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
  data => get(data, 'title')
);