import { ManuscriptHistoryState } from 'app/store';
import { cloneManuscript } from 'app/utils/state.utils';
import { ArticleInformation } from 'app/models/article-information';
import { ManuscriptDiff } from 'app/models/manuscript';
import { createDiff } from 'app/utils/history.utils';

export function updateArticleInformation(
  state: ManuscriptHistoryState,
  payload: ArticleInformation
): ManuscriptHistoryState {
  const newDiff: ManuscriptDiff = createDiff({
    articleInfo: state.data.present.articleInfo
  });

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
