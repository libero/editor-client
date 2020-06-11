import { EditorState } from 'prosemirror-state';
import { cloneDeep } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { updateManuscriptState } from 'app/utils/history.utils';
import { addKeyword, deleteKeyword, updateKeyword, updateNewKeyword } from 'app/reducers/keywords.handlers';

jest.mock('../../utils/history.utils');

describe('Keywords reducers', () => {
  it('should delete keyword', () => {
    const state = givenState({
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [new EditorState(), new EditorState()],
          newKeyword: new EditorState()
        }
      }
    });

    const expectedState = cloneDeep(state);
    expectedState.data.present.keywordGroups['kwd-group'].keywords.splice(1, 1);
    expectedState.data.past = [{ 'keywordGroups.kwd-group': state.data.present.keywordGroups['kwd-group'] }];
    const payload = { keywordGroup: 'kwd-group', index: 1 };
    expect(deleteKeyword(state, payload)).toEqual(expectedState);
  });

  it('should add keyword', () => {
    const state = givenState({
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [new EditorState()],
          newKeyword: new EditorState()
        }
      }
    });

    const payload = { keywordGroup: 'kwd-group', keyword: new EditorState() };
    const actualState = addKeyword(state, payload);

    expect(actualState.data.past).toEqual([
      { 'keywordGroups.kwd-group': state.data.present.keywordGroups['kwd-group'] }
    ]);

    expect(actualState.data.present.keywordGroups['kwd-group'].keywords).toContain(payload.keyword);
  });

  it('should update keyword', () => {
    const state = givenState({
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [new EditorState()],
          newKeyword: new EditorState()
        }
      }
    });

    const payload = {
      keywordGroup: 'kwd-group',
      index: 0,
      change: state.data.present.keywordGroups['kwd-group'].keywords[0].tr
    };

    updateKeyword(state, payload);
    expect(updateManuscriptState).toBeCalledWith(state.data, 'keywordGroups.kwd-group.keyword-group-seciton.0', payload.change);
  });

  it('should update new keyword', () => {
    const state = givenState({
      keywordGroups: {
        'kwd-group': {
          title: undefined,
          keywords: [new EditorState()],
          newKeyword: new EditorState()
        }
      }
    });

    const payload = {
      keywordGroup: 'kwd-group',
      change: state.data.present.keywordGroups['kwd-group'].newKeyword.tr
    };

    updateNewKeyword(state, payload);
    expect(updateManuscriptState).toBeCalledWith(state.data, 'keywordGroups.kwd-group.newKeyword', payload.change);
  });
});
