import { get } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { AddObjectChange } from 'app/utils/history/add-object-change';
import { createNewKeywordState } from 'app/models/keyword';

describe('AddObjectChange', () => {
  const manuscript = givenState({}).data.present;
  beforeAll(() => {
    manuscript.keywordGroups['kwdGroup'] = {
      title: 'group',
      keywords: [createNewKeywordState()],
      newKeyword: createNewKeywordState()
    };
  });

  it('should apply change', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const newObject = createNewKeywordState();
    const change = new AddObjectChange(path, newObject, 'id');
    const updatedManuscript = change.applyChange(manuscript);

    expect(get(updatedManuscript, path)).toEqual([get(manuscript, path)[0], newObject]);
  });

  it('should revert change', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const newObject = createNewKeywordState();
    const change = new AddObjectChange(path, newObject, 'id');
    const updatedManuscript = change.applyChange(manuscript);

    expect(get(change.rollbackChange(updatedManuscript), path)).toEqual([get(manuscript, path)[0]]);
  });

  it('should indicate empty change', () => {
    const change = new AddObjectChange('', {}, 'id');
    expect(change.isEmpty).toBeFalsy();
  });
});
