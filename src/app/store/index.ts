import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootSaga } from '../saga';
import {manuscriptReducer, ManuscriptState} from '../reducers/manuscript.reducer';

const sagaMiddleware = createSagaMiddleware();

export interface ApplicationState {
  manuscript: ManuscriptState;
}

export const store = createStore(combineReducers({
  manuscript: manuscriptReducer
}), composeWithDevTools(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);