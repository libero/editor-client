import { createAction } from 'redux-act';

export interface ModalPayload<P = {}> {
  component: React.FC<P>;
  props?: P;
  title?: string;
}

export const setFocusAction = createAction<string>('SET_FOCUS');
export const removeFocusAction = createAction<void>('REMOVE_FOCUS');
export const showModalDialog = createAction<ModalPayload>('SHOW_MODAL');
export const hideModalDialog = createAction<void>('HIDE_MODAL');
