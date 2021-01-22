import { cloneDeep } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { addAuthor, deleteAuthor, moveAuthor, updateAuthor } from 'app/reducers/authors.handlers';
import { BatchChange } from 'app/utils/history/batch-change';
import { Person } from 'app/models/person';

describe('Authors reducers', () => {
  it('should add new author', () => {
    const state = givenState({});
    const newAuthor = new Person({ _id: 'newId', firstName: 'Jules', lastName: 'Verne', affiliations: [] });
    const updatedState = cloneDeep(state);
    updatedState.data.present.authors = [newAuthor];
    updatedState.data.past = [expect.any(BatchChange)];

    const newState = addAuthor(state, newAuthor);
    expect(newState).toEqual(updatedState);
  });

  it('should update existing author', () => {
    const state = givenState({
      authors: [new Person({ _id: 'newId', firstName: 'Jules', lastName: 'Verne', affiliations: [] })]
    });
    const updatedAuthor = state.data.present.authors[0].clone();
    updatedAuthor.firstName = 'Jules Gabriel';

    const newState = updateAuthor(state, updatedAuthor);
    expect(newState.data.past[0]).toBeInstanceOf(BatchChange);
    expect(newState.data.present.authors[0]).toEqual(updatedAuthor);
  });

  it('should move author', () => {
    const state = givenState({
      authors: [
        new Person({ _id: 'id1', firstName: 'Jules', lastName: 'Verne', affiliations: [] }),
        new Person({ _id: 'id2', firstName: 'H G', lastName: 'Wells', affiliations: [] })
      ]
    });

    const updatedState = cloneDeep(state);
    updatedState.data.present.authors.reverse();
    updatedState.data.past = [expect.any(BatchChange)];
    const newState = moveAuthor(state, { index: 1, author: state.data.present.authors[0] });
    expect(newState).toEqual(updatedState);
  });

  it('should delete author', () => {
    const state = givenState({
      authors: [
        new Person({ _id: 'id1', firstName: 'Jules', lastName: 'Verne', affiliations: [] }),
        new Person({ _id: 'id2', firstName: 'H G', lastName: 'Wells', affiliations: [] })
      ]
    });

    const updatedState = cloneDeep(state);
    updatedState.data.present.authors = updatedState.data.present.authors.slice(1);
    updatedState.data.past = [expect.any(BatchChange)];
    const newState = deleteAuthor(state, state.data.present.authors[0]);
    expect(newState).toEqual(updatedState);
  });
});
