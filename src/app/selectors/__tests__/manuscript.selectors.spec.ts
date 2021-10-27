import { cloneDeep } from 'lodash';

import { getInitialHistory, getInitialLoadableState } from '../../utils/state.utils';
import {
  getAbstract,
  getAffiliatedAuthors,
  getAuthors,
  getKeywordGroups,
  getManuscriptData,
  getTitle,
  isManuscriptLoaded
} from '../manuscript.selectors';
import { Manuscript } from '../../types/manuscript';
import { Person } from '../../models/person';
import { givenState } from '../../test-utils/reducer-test-helpers';

describe('manuscript selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      manuscript: getInitialLoadableState()
    };
  });

  it('gets manuscript data', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());
    expect(getManuscriptData(state)).toBe(state.manuscript.data);
    expect(getTitle(state)).toBe(state.manuscript.data.present.title);
    expect(getAbstract(state)).toBe(state.manuscript.data.present.abstract);
    expect(getKeywordGroups(state)).toBe(state.manuscript.data.present.keywordGroups);
    expect(getAuthors(state)).toBe(state.manuscript.data.present.authors);
  });

  it('gets manuscript load status', () => {
    expect(isManuscriptLoaded(state)).toBeFalsy();
    const newState = cloneDeep(state);

    newState.manuscript.data = getInitialHistory(givenManuscript());
    expect(isManuscriptLoaded(newState)).toBeTruthy();
  });

  it('gets affiliated authors', () => {
    const affiliation = {
      id: 'some_id',
      label: '1',
      institution: {
        name: 'Hogwarts'
      },
      address: {
        city: ''
      },
      country: 'UK'
    };

    const authors: Person[] = [
      { id: 'id1', firstName: 'Jules', lastName: 'Verne', affiliations: ['some_id'] },
      { id: 'id2', firstName: 'H G', lastName: 'Wells', affiliations: [] }
    ];

    state.manuscript.data = getInitialHistory(
      givenManuscript({
        authors,
        affiliations: [affiliation]
      })
    );

    expect(getAffiliatedAuthors(state)(affiliation.id)).toEqual([authors[0]]);
  });
});

function givenManuscript(overrides: Partial<Manuscript> = {}): Manuscript {
  return givenState(overrides).data.present;
}
