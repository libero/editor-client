import { givenState } from 'app/test-utils/reducer-test-helpers';
import { updateAbstract } from 'app/reducers/abstract.handlers';
import { updateManuscriptState } from 'app/utils/history.utils';
import {updateAuthor} from "app/reducers/authors.handlers";

jest.mock('../../utils/history.utils');

describe('article information reducer', () => {
  const state = givenState({});
  const updatedInfo = { id: 'newId', firstName: 'Jules Gabriel', lastName: 'Verne', affiliations: [] };
  const updatedState = cloneDeep(state);
  updatedState.data.present.authors = [updatedAuthor];
  updatedState.data.past = [{ 'authors.0': state.data.present.authors[0], affiliations: [] }];

  const newState = updateAuthor(state, updatedAuthor);
  expect(newState).toEqual(updatedState);
  });
});
