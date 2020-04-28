import { Manuscript } from '../models/manuscript';
import * as manuscriptActions from '../actions/manuscript.actions';
import {
  getInitialHistory,
  getInitialLoadableState,
  getLoadableStateError,
  getLoadableStateProgress,
  getLoadableStateSuccess
} from '../utils/state.utils';
import { manuscriptEditorReducer } from './manuscript-editor.reducer';
import { ManuscriptHistoryState } from '../store';

const initialState = getInitialLoadableState() as ManuscriptHistoryState;

export function manuscriptReducer(
  state: ManuscriptHistoryState = initialState,
  action: manuscriptActions.ActionType
): ManuscriptHistoryState {
  switch (action.type) {
    case manuscriptActions.loadManuscriptAction.request.type:
      return {
        ...state,
        ...getLoadableStateProgress()
      };
    case manuscriptActions.loadManuscriptAction.success.type:
      return {
        ...state,
        ...getLoadableStateSuccess(getInitialHistory(action.payload as Manuscript))
      };

    case manuscriptActions.loadManuscriptAction.error.type:
      return {
        ...state,
        ...getLoadableStateError(action.payload as Error)
      };

    case manuscriptActions.updateTitleAction.type:
    case manuscriptActions.updateKeywordsAction.type:
    case manuscriptActions.deleteKeywordAction.type:
    case manuscriptActions.addNewKeywordAction.type:
    case manuscriptActions.redoAction.type:
    case manuscriptActions.undoAction.type:
      return {
        ...state,
        data: manuscriptEditorReducer(state.data, action)
      };

    default:
      return state;
  }
}
