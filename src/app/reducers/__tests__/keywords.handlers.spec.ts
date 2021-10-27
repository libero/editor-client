import { cloneDeep } from 'lodash';

import { givenState } from '../../test-utils/reducer-test-helpers';
import { updateManuscriptState } from '../../utils/history.utils';
import { addKeyword, deleteKeyword, updateKeyword, updateNewKeyword } from '../keywords.handlers';
import { Keyword } from '../../models/keyword';
import { DeleteObjectChange } from '../../utils/history/delete-object-change';
import { KeywordDeletePayload } from '../../actions/manuscript.actions';
import { BatchChange } from '../../utils/history/batch-change';

jest.mock('app/utils/history.utils', () => ({
  updateManuscriptState: jest.fn()
}));

describe('Keywords handler', () => {
  it('should delete keyword', () => {
    const state = givenState({
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [new Keyword(), new Keyword()],
          newKeyword: new Keyword()
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
          keywords: [new Keyword()],
          newKeyword: new Keyword()
        }
      }
    });

    const payload = { keywordGroup: 'kwd-group', keyword: new Keyword() };
    const actualState = addKeyword(state, payload);

    expect(actualState.data.past).toEqual([expect.any(BatchChange)]);

    expect(actualState.data.present.keywordGroups['kwd-group'].keywords[1]).toEqual(payload.keyword);
  });

  it('should update keyword', () => {
    const state = givenState({
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [new Keyword()],
          newKeyword: new Keyword()
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
          keywords: [new Keyword()],
          newKeyword: new Keyword()
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
