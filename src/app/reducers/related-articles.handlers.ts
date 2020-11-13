import { cloneManuscript } from 'app/utils/state.utils';
import { ManuscriptHistoryState } from 'app/store';
import { RelatedArticle } from 'app/models/related-article';
import { createDiff } from 'app/utils/history.utils';

export function updateRelatedArticle(state: ManuscriptHistoryState, payload: RelatedArticle): ManuscriptHistoryState {
  const articleIndex = state.data.present.relatedArticles.findIndex(({ id }) => id === payload.id);

  const newDiff = createDiff({
    relatedArticles: state.data.present.relatedArticles
  });

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.relatedArticles[articleIndex] = payload;

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}

export function addRelatedArticle(state: ManuscriptHistoryState, payload: RelatedArticle): ManuscriptHistoryState {
  const newDiff = createDiff({
    relatedArticles: state.data.present.relatedArticles
  });

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.relatedArticles.push(payload);

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}

export function deleteRelatedArticle(state: ManuscriptHistoryState, payload: RelatedArticle): ManuscriptHistoryState {
  const articleIndex = state.data.present.relatedArticles.findIndex(({ id }) => id === payload.id);

  const newDiff = createDiff({
    relatedArticles: state.data.present.relatedArticles
  });

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.relatedArticles.splice(articleIndex, 1);

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}
