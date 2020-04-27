import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootSaga } from '../saga';
import { manuscriptReducer } from '../reducers/manuscript.reducer';
import { LoadableState, ManuscriptHistory } from '../utils/state.utils';

const sagaMiddleware = createSagaMiddleware();

export type ManuscriptHistoryState = LoadableState<ManuscriptHistory>;

export interface ApplicationState {
  manuscript: ManuscriptHistoryState;
}

export const store = createStore(
  combineReducers({
    manuscript: manuscriptReducer
  }),
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
