import { createAction, ofActionType } from '../utils/action.utils';

export interface ModalPayload<P = {}> {
  component: React.FC<P>;
  props?: P;
  title?: string;
}

export const setFocusAction = createAction<string>('SET_FOCUS');
export const removeFocusAction = createAction<void>('REMOVE_FOCUS');
export const showModalDialog = createAction<ModalPayload>('SHOW_MODAL');
export const hideModalDialog = createAction<void>('HIDE_MODAL');

export type ActionType =
  | ofActionType<typeof setFocusAction>
  | ofActionType<typeof removeFocusAction>
  | ofActionType<typeof showModalDialog>
  | ofActionType<typeof hideModalDialog>;
