import { ManuscriptHistoryState } from '../store';
import { ArticleInformation } from '../models/article-information';
import { UpdateObjectChange } from '../utils/history/update-object-change';

export function updateArticleInformation(
  state: ManuscriptHistoryState,
  payload: ArticleInformation
): ManuscriptHistoryState {
  const change = UpdateObjectChange.createFromTwoObjects('articleInfo', state.data.present.articleInfo, payload);

  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
      future: []
    }
  };
}
