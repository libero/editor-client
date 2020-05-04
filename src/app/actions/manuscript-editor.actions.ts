import { createAction, ofActionType } from '../utils/action.utils';

export const setFocusAction = createAction<string>('SET_FOCUS');
export const removeFocusAction = createAction<void>('REMOVE_FOCUS');

export type ActionType = ofActionType<typeof setFocusAction> | ofActionType<typeof removeFocusAction>;
