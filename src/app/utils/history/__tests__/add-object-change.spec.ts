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

    const group = manuscript.keywordGroups['kwdGroup'];
    group.keywords[0].content.apply(group.keywords[0].content.tr.insertText('test'));
    group.newKeyword.content.apply(group.newKeyword.content.tr.insertText('test'));
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

  it('should serialize to JSON', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const newObject = createNewKeywordState();
    newObject.content.apply(newObject.content.tr.insertText('new keyword'));

    const change = new AddObjectChange(path, newObject, 'id');
    expect(change.toJSON()).toEqual({
      idField: 'id',
      path: 'keywordGroups.kwdGroup.keywords',
      timestamp: expect.any(Number),
      type: 'add-object',
      object: {
        id: expect.any(String),
        content: { type: 'keyword' }
      }
    });
  });
});
