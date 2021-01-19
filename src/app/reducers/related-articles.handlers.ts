import { ManuscriptHistoryState } from 'app/store';
import { RelatedArticle } from 'app/models/related-article';
import { UpdateObjectChange } from 'app/utils/history/update-object-change';
import { AddObjectChange } from 'app/utils/history/add-object-change';
import { DeleteObjectChange } from 'app/utils/history/delete-object-change';

export function updateRelatedArticle(state: ManuscriptHistoryState, payload: RelatedArticle): ManuscriptHistoryState {
  const articleIndex = state.data.present.relatedArticles.findIndex(({ id }) => id === payload.id);

  const change = UpdateObjectChange.createFromTwoObjects(
    `relatedArticles.${articleIndex}`,
    state.data.present.relatedArticles[articleIndex],
    payload
  );
  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
      future: []
    }
  };
}

export function addRelatedArticle(state: ManuscriptHistoryState, payload: RelatedArticle): ManuscriptHistoryState {
  const change = new AddObjectChange('relatedArticles', payload, 'id');

  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
      future: []
    }
  };
}

export function deleteRelatedArticle(state: ManuscriptHistoryState, payload: RelatedArticle): ManuscriptHistoryState {
  const change = new DeleteObjectChange('relatedArticles', payload, 'id');

  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
      future: []
    }
  };
}
