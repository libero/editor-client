import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootSaga } from '../saga';
import { manuscriptReducer } from '../reducers/manuscript.reducer';
import { LoadableState, ManuscriptHistory } from '../utils/state.utils';
import { manuscriptEditorReducer } from '../reducers/manuscript-editor.reducer';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { history } from './history';
import { ModalPayload } from '../actions/manuscript-editor.actions';

const sagaMiddleware = createSagaMiddleware();

export type ManuscriptHistoryState = LoadableState<ManuscriptHistory>;

export interface ManuscriptEditorState {
  focusedManuscriptPath: string | undefined;
  modal: {
    params?: ModalPayload;
    isVisible: boolean;
  };
}

export interface ApplicationState {
  manuscript: ManuscriptHistoryState;
  manuscriptEditor: ManuscriptEditorState;
}

export const store = createStore(
  combineReducers({
    router: connectRouter(history),
    manuscript: manuscriptReducer,
    manuscriptEditor: manuscriptEditorReducer
  }),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), sagaMiddleware))
);

sagaMiddleware.run(rootSaga);
