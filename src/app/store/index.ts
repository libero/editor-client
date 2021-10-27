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
import { TableOfContents } from '../types/manuscript';

const sagaMiddleware = createSagaMiddleware();

export type ManuscriptHistoryState = LoadableState<ManuscriptHistory>;

export enum PDF_TASK_STATUSES {
  PDF_EXPORT_RUNNING = 'in-progress',
  PDF_EXPORT_SUCCESS = 'completed',
  PDF_EXPORT_ERROR = 'failed'
}

export interface ManuscriptEditorState {
  focusedManuscriptPath: string | undefined;
  manuscriptBodyTOC: TableOfContents;
  lastSyncTimestamp: number;
  lastSyncSuccessful: boolean;
  exportTask: {
    taskId: string;
    status: PDF_TASK_STATUSES;
  };
  manuscriptId: string;
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
