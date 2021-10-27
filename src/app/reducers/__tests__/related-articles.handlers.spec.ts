import { cloneDeep } from 'lodash';

import { givenState } from '../../test-utils/reducer-test-helpers';
import { addRelatedArticle, deleteRelatedArticle, updateRelatedArticle } from '../related-articles.handlers';
import { DeleteObjectChange } from '../../utils/history/delete-object-change';
import { AddObjectChange } from '../../utils/history/add-object-change';
import { BatchChange } from '../../utils/history/batch-change';

const RELATED_ARTICLES = [
  {
    id: 'ra1',
    articleType: 'commentary-article',
    href: '10.7554/eLife.42697'
  },
  {
    id: 'ra2',
    articleType: 'commentary-article',
    href: '10.7554/eLife.00067'
  }
];

describe('related articles reducers', () => {
  it('should update related article article', () => {
    const state = givenState({
      relatedArticles: RELATED_ARTICLES
    });

    const updateArticle = {
      id: 'ra1',
      articleType: 'commentary-article',
      href: '10.7554/eLife.00000'
    };

    const updatedState = cloneDeep(state);
    updatedState.data.present.relatedArticles[0] = updateArticle;
    updatedState.data.past = [expect.any(BatchChange)];
    const newState = updateRelatedArticle(state, updateArticle);
    expect(newState).toEqual(updatedState);
  });

  it('should add related article', () => {
    const article = {
      id: 'ra3',
      articleType: 'commentary',
      href: '10.7554/eLife.00000111'
    };

    const state = givenState({});
    const updatedState = cloneDeep(state);
    updatedState.data.present.relatedArticles.push(article);
    updatedState.data.past = [expect.any(AddObjectChange)];
    const newState = addRelatedArticle(state, article);
    expect(newState).toEqual(updatedState);
  });

  it('should delete affiliation', () => {
    const state = givenState({
      relatedArticles: RELATED_ARTICLES
    });

    const updatedState = cloneDeep(state);
    updatedState.data.present.relatedArticles = [RELATED_ARTICLES[1]];
    updatedState.data.past = [expect.any(DeleteObjectChange)];
    const newState = deleteRelatedArticle(state, state.data.present.relatedArticles[0]);
    expect(newState).toEqual(updatedState);
  });
});
