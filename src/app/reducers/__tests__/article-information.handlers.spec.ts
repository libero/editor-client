import { givenState } from 'app/test-utils/reducer-test-helpers';
import { cloneDeep } from 'lodash';
import { updateArticleInformation } from 'app/reducers/article-information.handlers';
import { BatchChange } from 'app/utils/history/batch-change';

describe('article information handler', () => {
  it('updates article info', () => {
    const state = givenState({});
    const updatedInfo = {
      ...state.data.present.articleInfo,
      articleDOI: 'newID',
      dtd: '1',
      publisherId: '12345',
      publicationDate: '',
      articleType: 'insight-article',
      elocationId: '',
      subjects: [],
      volume: ''
    };
    const updatedState = cloneDeep(state);
    updatedState.data.present.articleInfo = updatedInfo;
    updatedState.data.past = [expect.any(BatchChange)];

    const newState = updateArticleInformation(state, updatedInfo);
    expect(newState).toEqual(updatedState);
  });
});
