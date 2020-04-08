import {Manuscript} from '../models/manuscript';
import * as manuscriptActions from '../actions/manuscript.actions';
import {
  getInitialLoadableState,
  getLoadableStateError,
  getLoadableStateProgress,
  getLoadableStateSuccess,
  LoadableState
} from '../utils/state.utils';
import {
  manuscriptEditorReducer,
} from './manuscript-editor.reducer';

export interface ManuscriptState extends LoadableState<Manuscript> {
}

const initialState = getInitialLoadableState() as ManuscriptState;

export function manuscriptReducer(state: ManuscriptState = initialState, action: manuscriptActions.ActionType): ManuscriptState {
  switch(action.type) {
    case manuscriptActions.loadManuscript.request.type:
      return {
        ...state,
        ...getLoadableStateProgress()
      };
    case manuscriptActions.loadManuscript.success.type:
      return {
        ...state,
        ...getLoadableStateSuccess(action.payload as Manuscript)
      };

    case manuscriptActions.loadManuscript.error.type:
      return {
        ...state,
        ...getLoadableStateError(action.payload as Error)
      };

    case manuscriptActions.updateTitle.type:

      return {
        ...state,
        data: manuscriptEditorReducer(state.data, action)
      };

    default:
      return state;
  }

}