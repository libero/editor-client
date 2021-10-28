import { cloneDeep } from 'lodash';

import { givenState } from '../../test-utils/reducer-test-helpers';
import { addAffiliation, deleteAffiliation, linkAffiliations, updateAffiliation } from '../affiliations.handlers';
import { Person } from '../../models/person';
import { BatchChange } from '../../utils/history/batch-change';
import { Affiliation } from '../../models/affiliation';

describe('affiliations reducers', () => {
  it('should update affiliation', () => {
    const state = givenState({
      affiliations: [
        new Affiliation({
          _id: 'some_id',
          label: '1',
          institution: {
            name: 'Hogwarts'
          },
          address: {
            city: ''
          },
          country: 'UK'
        })
      ]
    });

    const updateAff = new Affiliation({
      _id: 'some_id',
      label: '1',
      institution: {
        name: 'Cambridge University'
      },
      address: {
        city: 'Cambridge'
      },
      country: 'UK'
    });

    const updatedState = cloneDeep(state);
    updatedState.data.present.affiliations[0] = updateAff;
    updatedState.data.past = [expect.any(BatchChange)];
    const newState = updateAffiliation(state, updateAff);
    expect(newState).toEqual(updatedState);
  });

  it('should add affiliation', () => {
    const aff = new Affiliation({
      _id: 'some_id',
      label: '1',
      institution: {
        name: 'Hogwarts'
      },
      address: {
        city: ''
      },
      country: 'UK'
    });

    const state = givenState({});
    const updatedState = cloneDeep(state);
    updatedState.data.present.affiliations.push(aff);
    updatedState.data.past = [expect.any(BatchChange)];
    const newState = addAffiliation(state, aff);
    expect(newState).toEqual(updatedState);
  });

  it('should delete affiliation', () => {
    const state = givenState({
      affiliations: [
        new Affiliation({
          _id: 'some_id',
          label: '1',
          institution: {
            name: 'Hogwarts'
          },
          address: {
            city: ''
          },
          country: 'UK'
        })
      ]
    });

    const updatedState = cloneDeep(state);
    updatedState.data.present.affiliations = [];
    updatedState.data.past = [expect.any(BatchChange)];
    const newState = deleteAffiliation(state, state.data.present.affiliations[0]);
    expect(newState).toEqual(updatedState);
  });

  it('should link authors to affiliation', () => {
    const aff = new Affiliation({
      _id: 'some_id',
      label: '1',
      institution: {
        name: 'Hogwarts'
      },
      address: {
        city: ''
      },
      country: 'UK'
    });

    const authors: Person[] = [
      new Person({ _id: 'id1', firstName: 'Jules', lastName: 'Verne', affiliations: [], orcid: '' }),
      new Person({ _id: 'id2', firstName: 'H G', lastName: 'Wells', affiliations: [], orcid: '' })
    ];

    const state = givenState({
      affiliations: [aff],
      authors
    });

    const updatedState = cloneDeep(state);
    updatedState.data.present.authors.forEach((author) => (author.affiliations = [aff.id]));
    updatedState.data.past = [expect.any(BatchChange)];
    const newState = linkAffiliations(state, { affiliation: aff, authors });
    expect(newState).toEqual(updatedState);
  });
});
