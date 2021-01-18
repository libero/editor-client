import { get } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { DeleteObjectChange } from 'app/utils/history/delete-object-change';
import { createNewKeywordState } from 'app/models/keyword';

describe('DeleteObjectChange', () => {
  const manuscript = givenState({}).data.present;
  beforeAll(() => {
    manuscript.keywordGroups['kwdGroup'] = {
      title: 'group',
      keywords: [createNewKeywordState(), createNewKeywordState()],
      newKeyword: createNewKeywordState()
    };
  });

  it('should apply change', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const deletedObject = get(manuscript, path)[1];
    const change = new DeleteObjectChange(path, deletedObject, 'id');
    const updatedManuscript = change.applyChange(manuscript);

    expect(get(updatedManuscript, path)).toEqual([get(manuscript, path)[0]]);
  });

  it('should revert change', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const deletedObject = get(manuscript, path)[1];
    const change = new DeleteObjectChange(path, deletedObject, 'id');
    const updatedManuscript = change.applyChange(manuscript);

    expect(get(change.rollbackChange(updatedManuscript), path)).toEqual([get(manuscript, path)[0], deletedObject]);
  });

  it('should indicate empty change', () => {
    const change = new DeleteObjectChange('', {}, 'id');
    expect(change.isEmpty).toBeFalsy();
  });

  it('should serialize to JSON', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const deletedObject = get(manuscript, path)[1];
    const change = new DeleteObjectChange(path, deletedObject, 'id');
    change.applyChange(manuscript);

    expect(change.toJSON()).toEqual({
      idField: 'id',
      removedIndex: 1,
      path: 'keywordGroups.kwdGroup.keywords',
      timestamp: expect.any(Number),
      type: 'delete-object',
      object: {
        id: expect.any(String),
        content: { type: 'keyword' }
      }
    });
  });
});
