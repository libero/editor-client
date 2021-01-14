import { cloneDeep } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { updateManuscriptState } from 'app/utils/history.utils';
import { addKeyword, deleteKeyword, updateKeyword, updateNewKeyword } from 'app/reducers/keywords.handlers';
import { createNewKeywordState } from 'app/models/keyword';
import { DeleteObjectChange } from 'app/utils/history/delete-object-change';
import { KeywordDeletePayload } from 'app/actions/manuscript.actions';
import { BatchChange } from 'app/utils/history/change';

jest.mock('app/utils/history.utils', () => ({
  updateManuscriptState: jest.fn()
}));

describe('Keywords handler', () => {
  it('should delete keyword', () => {
    const state = givenState({
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [createNewKeywordState(), createNewKeywordState()],
          newKeyword: createNewKeywordState()
        }
      }
    });

    const expectedState = cloneDeep(state);
    const deletedKeyword = expectedState.data.present.keywordGroups['kwd-group'].keywords.splice(1, 1)[0];
    expectedState.data.past = [expect.any(DeleteObjectChange)];
    const payload: KeywordDeletePayload = { keywordGroup: 'kwd-group', keyword: deletedKeyword };
    expect(deleteKeyword(state, payload)).toEqual(expectedState);
  });

  it('should add keyword', () => {
    const state = givenState({
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [createNewKeywordState()],
          newKeyword: createNewKeywordState()
        }
      }
    });

    const payload = { keywordGroup: 'kwd-group', keyword: createNewKeywordState() };
    const actualState = addKeyword(state, payload);

    expect(actualState.data.past).toEqual([expect.any(BatchChange)]);

    expect(actualState.data.present.keywordGroups['kwd-group'].keywords[1]).toEqual(payload.keyword);
  });

  it('should update keyword', () => {
    const state = givenState({
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [createNewKeywordState()],
          newKeyword: createNewKeywordState()
        }
      }
    });

    const payload = {
      keywordGroup: 'kwd-group',
      id: state.data.present.keywordGroups['kwd-group'].keywords[0].id,
      change: state.data.present.keywordGroups['kwd-group'].keywords[0].content.tr
    };

    updateKeyword(state, payload);
    expect(updateManuscriptState).toBeCalledWith(
      state.data,
      'keywordGroups.kwd-group.keywords.0.content',
      payload.change
    );
  });

  it('should update new keyword', () => {
    const state = givenState({
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [createNewKeywordState()],
          newKeyword: createNewKeywordState()
        }
      }
    });

    const payload = {
      keywordGroup: 'kwd-group',
      change: state.data.present.keywordGroups['kwd-group'].newKeyword.content.tr
    };

    updateNewKeyword(state, payload);
    expect(updateManuscriptState).toBeCalledWith(
      state.data,
      'keywordGroups.kwd-group.newKeyword.content',
      payload.change
    );
  });
});
