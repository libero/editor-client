import { all, takeLatest, put } from 'redux-saga/effects';
import * as manuscriptActions from '../actions/manuscript.actions';
import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { getKeyFromQueryParams } from '../utils/url.utils';

/**
 * Side effect handler for a location change event that will, if present, start to load the specified article.
 *
 * @export
 * @param {LocationChangeAction} action
 */
export function* routerLocationChanged(action: LocationChangeAction) {
  const articleId = getKeyFromQueryParams(action.payload.location.search, 'articleId');
  if (articleId) {
    yield put(manuscriptActions.loadManuscriptAction.request(articleId));
  } else if (action.payload.isFirstRendering) {
    yield put(manuscriptActions.loadManuscriptAction.request('00104'));
  }
}

/**
 * A redux-saga that binds location change events to the handler function.
 *
 * @export
 */
export function* routerSaga() {
  yield all([takeLatest(LOCATION_CHANGE, routerLocationChanged)]);
}
