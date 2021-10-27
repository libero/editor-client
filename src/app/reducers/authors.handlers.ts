import { Person } from '../models/person';
import { ManuscriptHistoryState } from '../store';
import { MoveAuthorPayload } from '../actions/manuscript.actions';
import { RearrangingChange } from '../utils/history/rearranging-change';
import { BatchChange } from '../utils/history/batch-change';
import { getReorderedAffiliations } from './affiliations.handlers';
import { UpdateObjectChange } from '../utils/history/update-object-change';
import { AddObjectChange } from '../utils/history/add-object-change';
import { DeleteObjectChange } from '../utils/history/delete-object-change';
import { ArticleInformation } from '../models/article-information';
import { Change } from '../utils/history/change';

function getUpdatedArticleInfo(articleInfo: ArticleInformation, authors: Person[]): Change {
  const newArticleInfo = articleInfo.clone();
  newArticleInfo.updateCopyrightStatement(authors);
  return UpdateObjectChange.createFromTwoObjects('articleInfo', articleInfo, newArticleInfo);
}

export function updateAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  const authorIndex = state.data.present.authors.findIndex(({ id }) => id === payload.id);
  const authorUpdateChange = UpdateObjectChange.createFromTwoObjects(
    `authors.${authorIndex}`,
    state.data.present.authors[authorIndex],
    payload
  );

  let updatedManuscript = authorUpdateChange.applyChange(state.data.present);
  const articleInfoChange = getUpdatedArticleInfo(state.data.present.articleInfo, updatedManuscript.authors);
  updatedManuscript = articleInfoChange.applyChange(updatedManuscript);
  const affiliationsReorderChange = getReorderedAffiliations(updatedManuscript.authors, updatedManuscript.affiliations);

  return {
    ...state,
    data: {
      past: [...state.data.past, new BatchChange([authorUpdateChange, affiliationsReorderChange, articleInfoChange])],
      present: affiliationsReorderChange.applyChange(updatedManuscript),
      future: []
    }
  };
}

export function addAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  const addAuthorChange = new AddObjectChange('authors', payload, 'id');

  let updatedManuscript = addAuthorChange.applyChange(state.data.present);
  const articleInfoChange = getUpdatedArticleInfo(state.data.present.articleInfo, updatedManuscript.authors);
  updatedManuscript = articleInfoChange.applyChange(updatedManuscript);
  const affiliationsReorderChange = getReorderedAffiliations(updatedManuscript.authors, updatedManuscript.affiliations);

  return {
    ...state,
    data: {
      past: [...state.data.past, new BatchChange([addAuthorChange, affiliationsReorderChange, articleInfoChange])],
      present: affiliationsReorderChange.applyChange(updatedManuscript),
      future: []
    }
  };
}

export function moveAuthor(state: ManuscriptHistoryState, payload: MoveAuthorPayload): ManuscriptHistoryState {
  const { index, author } = payload;
  const currentIndex = state.data.present.authors.findIndex(({ id }) => id === author.id);
  const rearrangeAuthors = RearrangingChange.createFromItemMoved(
    'authors',
    currentIndex,
    index,
    state.data.present.authors
  );

  let updatedManuscript = rearrangeAuthors.applyChange(state.data.present);
  const articleInfoChange = getUpdatedArticleInfo(state.data.present.articleInfo, updatedManuscript.authors);
  updatedManuscript = articleInfoChange.applyChange(updatedManuscript);
  const affiliationsReorderChange = getReorderedAffiliations(updatedManuscript.authors, updatedManuscript.affiliations);

  const change = new BatchChange([rearrangeAuthors, affiliationsReorderChange, articleInfoChange]);
  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: affiliationsReorderChange.applyChange(updatedManuscript),
      future: []
    }
  };
}

export function deleteAuthor(state: ManuscriptHistoryState, payload: Person): ManuscriptHistoryState {
  const deleteAuthorChange = new DeleteObjectChange('authors', payload, 'id');

  let updatedManuscript = deleteAuthorChange.applyChange(state.data.present);
  const articleInfoChange = getUpdatedArticleInfo(state.data.present.articleInfo, updatedManuscript.authors);
  updatedManuscript = articleInfoChange.applyChange(updatedManuscript);
  const affiliationsReorderChange = getReorderedAffiliations(updatedManuscript.authors, updatedManuscript.affiliations);

  return {
    ...state,
    data: {
      past: [...state.data.past, new BatchChange([deleteAuthorChange, affiliationsReorderChange, articleInfoChange])],
      present: affiliationsReorderChange.applyChange(updatedManuscript),
      future: []
    }
  };
}
