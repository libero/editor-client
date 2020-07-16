import { manuscriptEditorReducer } from 'app/reducers/manuscript-editor.reducer';
import {
  hideModalDialog,
  removeFocusAction,
  showModalDialog,
  updateFocusPathAction
} from 'app/actions/manuscript-editor.actions';
import { ActionButton } from 'app/components/action-button';

describe('manuscript editor reducer', () => {
  it('sets focused path', () => {
    const state = manuscriptEditorReducer(undefined, updateFocusPathAction('focus.path'));
    expect(state.focusedManuscriptPath).toBe('focus.path');
  });

  it('removes focused path', () => {
    const state = manuscriptEditorReducer(undefined, removeFocusAction());
    expect(state.focusedManuscriptPath).toBeFalsy();
  });

  it('shows modal container', () => {
    const state = manuscriptEditorReducer(
      undefined,
      showModalDialog({
        component: ActionButton
      })
    );
    expect(state.modal).toEqual({
      isVisible: true,
      params: {
        component: ActionButton
      }
    });
  });

  it('hides modal container', () => {
    let state = manuscriptEditorReducer(
      undefined,
      showModalDialog({
        component: ActionButton
      })
    );

    state = manuscriptEditorReducer(state, hideModalDialog());

    expect(state.modal).toEqual({ isVisible: false });
  });
});
