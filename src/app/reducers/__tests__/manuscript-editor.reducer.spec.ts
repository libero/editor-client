import { manuscriptEditorReducer } from '../manuscript-editor.reducer';
import { setFocusAction } from '../../actions/manuscript-editor.actions';

describe('manuscript editor reducer', () => {
  it('sets focused path', () => {
    const state = manuscriptEditorReducer(undefined, setFocusAction('focus.path'));
    expect(state.focusedManuscriptPath).toBe('focus.path');
  });
});
