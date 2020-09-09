import { EditorState } from 'prosemirror-state';
import { cloneDeep } from 'lodash';

import { givenState } from 'app/test-utils/reducer-test-helpers';
import { Reference } from 'app/models/reference';
import { addReference, deleteReference, updateReference } from 'app/reducers/references.handlers';

jest.mock('app/utils/history.utils', () => ({
  updateManuscriptState: jest.fn((state) => {
    return {
      past: [{}],
      present: jest.requireActual('app/utils/state.utils').cloneManuscript(state.present),
      future: []
    };
  })
}));

const REFERENCE: Reference = {
  id: 'bib1',
  authors: [
    {
      firstName: 'V',
      lastName: 'Berk'
    }
  ],
  type: 'journal',
  referenceInfo: {
    year: '2012',
    source: new EditorState(),
    articleTitle: new EditorState(),
    doi: '',
    pmid: '',
    elocationId: '',
    firstPage: '236',
    lastPage: '239',
    inPress: false,
    volume: '337'
  }
};

describe('references reducers', () => {
  it('should update reference', () => {
    const state = givenState({
      references: [REFERENCE]
    });

    const updatedRef = cloneDeep(REFERENCE);
    updatedRef.referenceInfo['year'] = 2011;
    const updatedState = cloneDeep(state);
    updatedState.data.present.references[0] = updatedRef;
    updatedState.data.past = [{ references: state.data.present.references }];
    const newState = updateReference(state, updatedRef);
    expect(newState).toEqual(updatedState);
  });

  it('should add reference', () => {
    const state = givenState({});
    const updatedState = cloneDeep(state);
    updatedState.data.present.references.push(REFERENCE);
    updatedState.data.past = [{ references: state.data.present.references }];
    const newState = addReference(state, REFERENCE);
    expect(newState).toEqual(updatedState);
  });

  it('should delete reference', () => {
    const state = givenState({
      references: [REFERENCE]
    });

    const updatedState = cloneDeep(state);
    updatedState.data.present.references = [];
    updatedState.data.past = [{ references: state.data.present.references }];
    const newState = deleteReference(state, REFERENCE);
    expect(newState).toEqual(updatedState);
  });
});
