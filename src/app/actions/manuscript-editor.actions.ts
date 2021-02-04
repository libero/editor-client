import { createAction } from 'redux-act';
import { TableOfContents, TOCEntry } from 'app/types/manuscript';

export interface ModalPayload<P = {}> {
  component: React.FC<P>;
  props?: P;
  title?: string;
}

export const setFocusAction = createAction<string>('SET_FOCUS');
export const setBodyTOCAction = createAction<TableOfContents>('SET_BODY_TOC');
export const setLastSyncTimestamp = createAction<number>('SET_LAST_SYNC_TIMESTAMP');
export const setLastSyncFailed = createAction<void>('SET_LAST_SYNC_FAILED');
export const setManuscriptId = createAction<string>('SET_MANUSCRIPT_ID');
export const scrollIntoViewAction = createAction<TOCEntry>('SCROLL_INTO_VIEW');
export const removeFocusAction = createAction<void>('REMOVE_FOCUS');
export const updateFocusPathAction = createAction<string>('UPDATE_FOCUS_PATH');
export const showModalDialog = createAction<ModalPayload>('SHOW_MODAL');
export const hideModalDialog = createAction<void>('HIDE_MODAL');
