import { all, takeLatest, put } from 'redux-saga/effects';
import * as initActions from '../actions/init.actions';
import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';

const articleIdRegex = /A?articleId=[^&]+&*/;

export function* routerLocationChanged(action: LocationChangeAction) {
  const found = action.payload.location.search.match(articleIdRegex);
  if (found) {
    yield put(initActions.loadArticle(found[0].split('=')[1]));
  } else if (action.payload.isFirstRendering) {
    yield put(initActions.loadArticle('00104'));
  }
}

export function* routerSaga() {
  yield all([takeLatest(LOCATION_CHANGE, routerLocationChanged)]);
}
