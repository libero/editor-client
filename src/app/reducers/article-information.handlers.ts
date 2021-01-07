import { ManuscriptHistoryState } from 'app/store';
import { ArticleInformation } from 'app/models/article-information';
import { UpdateObjectChange } from 'app/utils/history/update-object-change';

export function updateArticleInformation(
  state: ManuscriptHistoryState,
  payload: ArticleInformation
): ManuscriptHistoryState {
  const change = new UpdateObjectChange('articleInfo', state.data.present.articleInfo, payload);

  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
      future: []
    }
  };
}
