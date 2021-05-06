import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootSaga } from 'app/saga';
import { manuscriptReducer } from 'app/reducers/manuscript.reducer';
import { LoadableState, ManuscriptHistory } from 'app/utils/state.utils';
import { manuscriptEditorReducer } from 'app/reducers/manuscript-editor.reducer';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { history } from './history';
import { ModalPayload } from 'app/actions/manuscript-editor.actions';
import { TableOfContents } from 'app/types/manuscript';

const sagaMiddleware = createSagaMiddleware();

export type ManuscriptHistoryState = LoadableState<ManuscriptHistory>;

export const PDF_EXPORT_RUNNING = 'RUNNING';
export const PDF_EXPORT_SUCCESS = 'SUCCESS';
export const PDF_EXPORT_ERROR = 'ERROR';

export type ExportPdfTaskStatus = 'RUNNING' | 'SUCCESS' | 'ERROR';

export interface ManuscriptEditorState {
  focusedManuscriptPath: string | undefined;
  manuscriptBodyTOC: TableOfContents;
  lastSyncTimestamp: number;
  lastSyncSuccessful: boolean;
  exportTask: {
    taskId: string;
    status: ExportPdfTaskStatus;
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
