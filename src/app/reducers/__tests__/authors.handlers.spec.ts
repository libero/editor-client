import { cloneDeep } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { addAuthor, deleteAuthor, moveAuthor, updateAuthor } from 'app/reducers/authors.handlers';
import { BatchChange } from 'app/utils/history/change';

describe('Authors reducers', () => {
  it('should add new author', () => {
    const state = givenState({});
    const newAuthor = { id: 'newId', firstName: 'Jules', lastName: 'Verne', affiliations: [] };
    const updatedState = cloneDeep(state);
    updatedState.data.present.authors = [newAuthor];
    updatedState.data.past = [expect.any(BatchChange)];

    const newState = addAuthor(state, newAuthor);
    expect(newState).toEqual(updatedState);
  });

  it('should update existing author', () => {
    const state = givenState({
      authors: [{ id: 'newId', firstName: 'Jules', lastName: 'Verne', affiliations: [] }]
    });
    const updatedAuthor = { id: 'newId', firstName: 'Jules Gabriel', lastName: 'Verne', affiliations: [] };
    const updatedState = cloneDeep(state);
    updatedState.data.present.authors = [updatedAuthor];
    updatedState.data.past = [expect.any(BatchChange)];

    const newState = updateAuthor(state, updatedAuthor);
    expect(newState).toEqual(updatedState);
  });

  it('should move author', () => {
    const state = givenState({
      authors: [
        { id: 'id1', firstName: 'Jules', lastName: 'Verne', affiliations: [] },
        { id: 'id2', firstName: 'H G', lastName: 'Wells', affiliations: [] }
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
        { id: 'id1', firstName: 'Jules', lastName: 'Verne', affiliations: [] },
        { id: 'id2', firstName: 'H G', lastName: 'Wells', affiliations: [] }
      ]
    });

    const updatedState = cloneDeep(state);
    updatedState.data.present.authors = updatedState.data.present.authors.slice(1);
    updatedState.data.past = [expect.any(BatchChange)];
    const newState = deleteAuthor(state, state.data.present.authors[0]);
    expect(newState).toEqual(updatedState);
  });
});
