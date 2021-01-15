import { cloneDeep } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { UpdateObjectChange } from 'app/utils/history/update-object-change';

describe('UpdateObjectChange', () => {
  const manuscript = givenState({}).data.present;
  const affiliation = {
    id: '1',
    label: 'elife',
    institution: { name: 'Name' },
    address: { city: 'Cambridge' },
    country: 'United Kingdom'
  };

  beforeAll(() => {
    manuscript.affiliations.push(affiliation);
  });

  it('should apply change', () => {
    const updatedAff = cloneDeep(affiliation);
    updatedAff.label = 'eLife Sciences';
    const change = new UpdateObjectChange('affiliations.0', affiliation, updatedAff);

    const updatedManuscript = change.applyChange(manuscript);
    expect(change.isEmpty).toBeFalsy();
    expect(updatedManuscript.affiliations[0]).toEqual(updatedAff);
  });

  it('should revert change', () => {
    const updatedAff = cloneDeep(affiliation);
    updatedAff.label = 'eLife Sciences';
    const change = new UpdateObjectChange('affiliations.0', affiliation, updatedAff);

    const updatedManuscript = change.applyChange(manuscript);
    expect(change.rollbackChange(updatedManuscript)).toEqual(manuscript);
  });

  it('should indicate empty change', () => {
    const updatedAff = cloneDeep(affiliation);
    const change = new UpdateObjectChange('affiliations.0', affiliation, updatedAff);
    expect(change.isEmpty).toBeTruthy();
  });
});