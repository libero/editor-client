import { cloneDeep } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { addRelatedArticle, deleteRelatedArticle, updateRelatedArticle } from 'app/reducers/related-articles.handlers';
import { UpdateObjectChange } from 'app/utils/history/update-object-change';
import { DeleteObjectChange } from 'app/utils/history/delete-object-change';
import { AddObjectChange } from 'app/utils/history/add-object-change';

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
    updatedState.data.past = [expect.any(UpdateObjectChange)];
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
