import { givenState } from 'app/test-utils/reducer-test-helpers';
import { cloneDeep } from 'lodash';
import { updateArticleInformation } from 'app/reducers/article-information.handlers';

jest.mock('../../utils/history.utils');

describe('article information handler', () => {
  it('updates article info', () => {
    const state = givenState({});
    const updatedInfo = {
      articleDOI: 'newID',
      dtd: '1',
      publisherId: '12345',
      articleType: 'insight-article'
    };
    const updatedState = cloneDeep(state);
    updatedState.data.present.articleInfo = updatedInfo;
    updatedState.data.past = [{ articleInfo: { articleDOI: '', dtd: '', articleType: '', publisherId: '' } }];

    const newState = updateArticleInformation(state, updatedInfo);
    expect(newState).toEqual(updatedState);
  });
});
