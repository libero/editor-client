import { givenState } from 'app/test-utils/reducer-test-helpers';
import { addAuthor, deleteAuthor, moveAuthor, updateAuthor } from 'app/reducers/authors.handlers';
import { BatchChange } from 'app/utils/history/batch-change';
import { Person } from 'app/models/person';
jest.mock('uuid', () => ({ v4: () => 'some_uuid' }));

describe('Authors reducers', () => {
  const originalDateNow = Date.now;

  beforeAll(() => {
    Date.now = jest.fn(() => 1487076708000);
  });

  afterAll(() => {
    Date.now = originalDateNow;
  });
  it('should add new author', () => {
    const state = givenState({});
    const newAuthor = new Person({ _id: 'newId', firstName: 'Jules', lastName: 'Verne', affiliations: [] });
    const newState = addAuthor(state, newAuthor);
    expect(newState).toMatchSnapshot();
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
    const newState = moveAuthor(state, { index: 1, author: state.data.present.authors[0] });
    expect(newState).toMatchSnapshot();
  });

  it('should delete author', () => {
    const state = givenState({
      authors: [
        new Person({ _id: 'id1', firstName: 'Jules', lastName: 'Verne', affiliations: [] }),
        new Person({ _id: 'id2', firstName: 'H G', lastName: 'Wells', affiliations: [] })
      ]
    });

    const newState = deleteAuthor(state, state.data.present.authors[0]);
    expect(newState).toMatchSnapshot();
  });
});
