import { get } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { RearrangingChange } from 'app/utils/history/rearranging-change';
import { Keyword } from 'app/models/keyword';

describe('RearrangingChange', () => {
  const manuscript = givenState({}).data.present;
  beforeAll(() => {
    manuscript.keywordGroups['kwdGroup'] = {
      title: 'group',
      keywords: [new Keyword(), new Keyword(), new Keyword()],
      newKeyword: new Keyword()
    };
  });

  it('should apply rearranging change', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const change = RearrangingChange.createFromItemMoved(path, 2, 0, get(manuscript, path));
    const updatedManuscript = change.applyChange(manuscript);
    expect(get(updatedManuscript, path)).toEqual([
      get(manuscript, path)[2],
      get(manuscript, path)[0],
      get(manuscript, path)[1]
    ]);
  });

  it('should apply rearranging change from two lists', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const change = RearrangingChange.createFromListRearrange(path, get(manuscript, path), [
      get(manuscript, path)[2],
      get(manuscript, path)[0],
      get(manuscript, path)[1]
    ]);

    const updatedManuscript = change.applyChange(manuscript);
    expect(get(updatedManuscript, path)).toEqual([
      get(manuscript, path)[2],
      get(manuscript, path)[0],
      get(manuscript, path)[1]
    ]);
  });

  it('should revert prosemirror change', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const change = RearrangingChange.createFromItemMoved(path, 2, 0, get(manuscript, path));
    const updatedManuscript = change.applyChange(manuscript);

    expect(change.rollbackChange(updatedManuscript)).toEqual(manuscript);
  });

  it('should indicate empty change', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const change = RearrangingChange.createFromItemMoved(path, 2, 2, get(manuscript, path));
    expect(change.isEmpty).toBeTruthy();
  });

  it('should serialize to JSON', () => {
    const path = 'keywordGroups.kwdGroup.keywords';
    const change = RearrangingChange.createFromItemMoved(path, 2, 0, get(manuscript, path));

    expect(change.toJSON()).toEqual({
      path: 'keywordGroups.kwdGroup.keywords',
      timestamp: expect.any(Number),
      type: 'rearranging',
      order: [2, 0, 1]
    });
  });

  it('should serialize to JSON', () => {
    const JSONObject = {
      path: 'keywordGroups.kwdGroup.keywords',
      timestamp: 1610979099826,
      order: [2, 0, 1],
      type: 'prosemirror'
    };

    const change = RearrangingChange.fromJSON(JSONObject);

    expect(change).toMatchSnapshot();
    expect(change).toBeInstanceOf(RearrangingChange);
  });
});
