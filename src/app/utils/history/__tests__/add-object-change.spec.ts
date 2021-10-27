import { get } from 'lodash';

import { givenState } from '../../../test-utils/reducer-test-helpers';
import { AddObjectChange } from '../add-object-change';
import { Keyword } from '../../../models/keyword';

describe('AddObjectChange', () => {
  const manuscript = givenState({}).data.present;
  beforeAll(() => {
    manuscript.keywordGroups['kwdGroup'] = {
      title: 'group',
      keywords: [new Keyword()],
      newKeyword: new Keyword()
    };

    const group = manuscript.keywordGroups['kwdGroup'];
    group.keywords[0].content.apply(group.keywords[0].content.tr.insertText('test'));
    group.newKeyword.content.apply(group.newKeyword.content.tr.insertText('test'));
  });

  it('should apply change', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const newObject = new Keyword();
    const change = new AddObjectChange(path, newObject, 'id');
    const updatedManuscript = change.applyChange(manuscript);

    expect(get(updatedManuscript, path)).toEqual([get(manuscript, path)[0], newObject]);
  });

  it('should revert change', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const newObject = new Keyword();
    const change = new AddObjectChange(path, newObject, 'id');
    const updatedManuscript = change.applyChange(manuscript);

    expect(get(change.rollbackChange(updatedManuscript), path)).toEqual([get(manuscript, path)[0]]);
  });

  it('should indicate empty change', () => {
    const change = new AddObjectChange('', new Keyword(), 'id');
    expect(change.isEmpty).toBeFalsy();
  });

  it('should check if path is affected', () => {
    const change = new AddObjectChange('keywords.someKeywordGroup', new Keyword(), 'id');
    expect(change.isPathAffected(/^keywords\./)).toBeTruthy();
  });

  it('should serialize to JSON', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const newObject = new Keyword();
    newObject.content = newObject.content.apply(newObject.content.tr.insertText('new keyword'));

    const change = new AddObjectChange(path, newObject, 'id');
    expect(change.toJSON()).toEqual({
      idField: 'id',
      path: 'keywordGroups.kwdGroup.keywords',
      timestamp: expect.any(Number),
      type: 'add-object',
      object: {
        _id: expect.any(String),
        content: newObject.content.toJSON()
      }
    });
  });
});
