import { createAction } from '../utils/action.utils';

export const initApplication = createAction<string>('INIT_LIBERO');
export const loadArticle = createAction<string>('LOAD_ARTICLE');
