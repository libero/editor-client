import { cloneDeep } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import {
  addAffiliation,
  deleteAffiliation,
  linkAffiliations,
  updateAffiliation
} from 'app/reducers/affiliations.handlers';
import { Person } from 'app/models/person';

jest.mock('../../utils/history.utils');

describe('affiliations reducers', () => {
  it('should update affiliation', () => {
    const state = givenState({
      affiliations: [
        {
          id: 'some_id',
          label: '1',
          institution: {
            name: 'Hogwarts'
          },
          address: {
            city: ''
          },
          country: 'UK'
        }
      ]
    });

    const updateAff = {
      id: 'some_id',
      label: '1',
      institution: {
        name: 'Cambridge University'
      },
      address: {
        city: 'Cambridge'
      },
      country: 'UK'
    };

    const updatedState = cloneDeep(state);
    updatedState.data.present.affiliations[0] = updateAff;
    updatedState.data.past = [{ affiliations: state.data.present.affiliations }];
    const newState = updateAffiliation(state, updateAff);
    expect(newState).toEqual(updatedState);
  });

  it('should add affiliation', () => {
    const aff = {
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

    const state = givenState({});
    const updatedState = cloneDeep(state);
    updatedState.data.present.affiliations.push(aff);
    updatedState.data.past = [{ affiliations: state.data.present.affiliations }];
    const newState = addAffiliation(state, aff);
    expect(newState).toEqual(updatedState);
  });

  it('should delete affiliation', () => {
    const state = givenState({
      affiliations: [
        {
          id: 'some_id',
          label: '1',
          institution: {
            name: 'Hogwarts'
          },
          address: {
            city: ''
          },
          country: 'UK'
        }
      ]
    });

    const updatedState = cloneDeep(state);
    updatedState.data.present.affiliations = [];
    updatedState.data.past = [{ affiliations: state.data.present.affiliations }];
    const newState = deleteAffiliation(state, state.data.present.affiliations[0]);
    expect(newState).toEqual(updatedState);
  });

  it('should link authors to affiliation', () => {
    const aff = {
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
      { id: 'id1', firstName: 'Jules', lastName: 'Verne', affiliations: [] },
      { id: 'id2', firstName: 'H G', lastName: 'Wells', affiliations: [] }
    ];

    const state = givenState({
      affiliations: [aff],
      authors
    });

    const updatedState = cloneDeep(state);
    updatedState.data.present.authors.forEach((author) => (author.affiliations = [aff.id]));
    updatedState.data.past = [{ authors: state.data.present.authors, affiliations: state.data.present.affiliations }];
    const newState = linkAffiliations(state, { affiliation: aff, authors });
    expect(newState).toEqual(updatedState);
  });
});
