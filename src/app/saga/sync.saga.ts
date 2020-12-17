import { all, takeLatest, call, put, takeEvery, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

import * as manuscriptActions from 'app/actions/manuscript.actions';
import { getLastSyncTimestamp, getManuscriptId } from 'app/selectors/manuscript-editor.selectors';
import { getChangesMadeBetween } from 'app/selectors/manuscript.selectors';
import { ManuscriptDiff } from 'app/types/manuscript';
import { setLastSyncTimestamp } from 'app/actions/manuscript-editor.actions';
import { syncChanges } from 'app/api/manuscript.api';

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
    const changes: ManuscriptDiff[] = changesSelector(lastSyncTimeStamp, now);
    if (changes.length > 0) {
      const manuscriptId = yield select(getManuscriptId);
      try {
        yield call(syncChanges, manuscriptId, changes);
        yield put(setLastSyncTimestamp(now));
      } catch (e) {}
    }
  });
}

export default function* () {
  yield all([takeLatest(manuscriptActions.loadManuscriptAction.success, watchChangesSaga)]);
}
