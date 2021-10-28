import { all, takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import * as manuscriptActions from '../actions/manuscript.actions';
import { getLastSyncTimestamp, getManuscriptId } from '../selectors/manuscript-editor.selectors';
import { getChangesMadeBetween } from '../selectors/manuscript.selectors';
import { setLastSyncFailed, setLastSyncTimestamp } from '../actions/manuscript-editor.actions';
import { syncChanges } from '../api/manuscript.api';
import { Change } from '../utils/history/change';

const SYNC_INTERVAL = 2000;

function createPollingEventChannel(delay: number) {
  return eventChannel((emitter) => {
    const interval = setInterval(() => {
      emitter(0);
    }, delay);

    return () => clearInterval(interval);
  });
}

export function* watchChangesSaga() {
  const channel = yield call(createPollingEventChannel, SYNC_INTERVAL);
  yield takeEvery(channel, function* () {
    const now = Date.now();
    const lastSyncTimeStamp = yield select(getLastSyncTimestamp);
    const changesSelector = yield select(getChangesMadeBetween);
    const changes: Change[] = changesSelector(lastSyncTimeStamp, now);
    if (changes.length > 0) {
      const manuscriptId = yield select(getManuscriptId);
      try {
        yield call(syncChanges, manuscriptId, changes);
        yield put(setLastSyncTimestamp(now));
      } catch (e) {
        yield put(setLastSyncFailed());
      }
    }
  });
}

export default function* () {
  yield all([takeLatest(manuscriptActions.loadManuscriptAction.success, watchChangesSaga)]);
}
