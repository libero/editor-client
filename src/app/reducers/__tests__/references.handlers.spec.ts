import { EditorState } from 'prosemirror-state';
import { cloneDeep } from 'lodash';

import { createDummyEditorState, givenState } from 'app/test-utils/reducer-test-helpers';
import { JournalReference, Reference } from 'app/models/reference';
import { addReference, deleteReference, updateReference } from 'app/reducers/references.handlers';
import { BatchChange } from 'app/utils/history/batch-change';
import { createBodyState } from 'app/models/body';

let REFERENCE: Reference;

describe('references reducers', () => {
  beforeEach(() => {
    REFERENCE = {
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
        source: createDummyEditorState(),
        articleTitle: createDummyEditorState(),
        doi: '',
        pmid: '',
        elocationId: '',
        firstPage: '236',
        lastPage: '239',
        inPress: false,
        volume: '337'
      }
    };
    (REFERENCE.referenceInfo as JournalReference).source.apply(
      (REFERENCE.referenceInfo as JournalReference).source.tr.insertText('Some text')
    );

    (REFERENCE.referenceInfo as JournalReference).articleTitle.apply(
      (REFERENCE.referenceInfo as JournalReference).articleTitle.tr.insertText('Some other text')
    );
  });
  it('should update reference', () => {
    const state = givenState({
      references: [REFERENCE]
    });

    state.data.present.body = givenBodyState('Berk, 2011');

    const updatedRef = cloneDeep(REFERENCE);
    updatedRef.referenceInfo['year'] = 2011;
    const newState = updateReference(state, updatedRef);

    expect(newState.data.present.references).toEqual([updatedRef]);
    expect(newState.data.present.body.doc.toJSON()).toEqual(givenBodyState('Berk, 2011').doc.toJSON());
    expect(newState.data.past[0]).toEqual(expect.any(BatchChange));
  });

  it('should add reference', () => {
    const state = givenState({});
    const updatedState = cloneDeep(state);
    updatedState.data.present.references.push(REFERENCE);
    updatedState.data.past = [expect.any(BatchChange)];
    const newState = addReference(state, REFERENCE);
    expect(newState).toEqual(updatedState);
  });

  it('should delete reference', () => {
    const state = givenState({
      references: [REFERENCE],
      body: givenBodyState('Berk, 2011')
    });

    const newState = deleteReference(state, REFERENCE);
    expect(newState.data.present.references).toEqual([]);
    expect(newState.data.present.body.doc.toJSON()).toEqual(givenBodyState('').doc.toJSON());
    expect(newState.data.past[0]).toEqual(expect.any(BatchChange));
  });

  function givenBodyState(refText: string): EditorState {
    const el = document.createElement('div');
    if (refText) {
      el.innerHTML = `<p>test<xref ref-type="bibr" rid="bib1">${refText}</xref>test</p>`;
    } else {
      el.innerHTML = `<p>testtest</p>`;
    }

    return createBodyState(el, '');
  }
});
