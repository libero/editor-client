import { ManuscriptHistoryState } from 'app/store';
import { cloneManuscript } from 'app/utils/state.utils';
import { ArticleInformation } from 'app/models/manuscript';

export function updateArticleInformation(
  state: ManuscriptHistoryState,
  payload: ArticleInformation
): ManuscriptHistoryState {
  const newDiff = {
    articleInfo: state.data.present.articleInfo
  };

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.articleInfo = payload;

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}
