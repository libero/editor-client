import { put } from 'redux-saga/effects';
import { LOCATION_CHANGE, LocationChangePayload, push } from 'connected-react-router';

import { routerLocationChangeSaga } from 'app/saga/router.saga';
import { loadManuscriptAction } from 'app/actions/manuscript.actions';

describe('router saga', () => {
  it('loads an article by id', () => {
    const saga = routerLocationChangeSaga({
      type: LOCATION_CHANGE,
      payload: {
        location: {
          pathname: '/',
          search: '?articleId=12345',
          hash: ''
        },
        action: 'PUSH',
        isFirstRendering: false
      } as LocationChangePayload<{}>
    });

    expect(saga.next().value).toEqual(put(loadManuscriptAction.request('12345')));
  });

  it('navigate to a default url', () => {
    const saga = routerLocationChangeSaga({
      type: LOCATION_CHANGE,
      payload: {
        location: {
          pathname: '/',
          search: '',
          hash: ''
        },
        action: 'PUSH',
        isFirstRendering: true
      } as LocationChangePayload<{}>
    });

    expect(saga.next().value).toEqual(put(push('/?articleId=54296')));
  });
});
