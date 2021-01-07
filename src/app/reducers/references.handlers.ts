import { Node as ProsemirrorNode } from 'prosemirror-model';

import { ManuscriptHistoryState } from 'app/store';
import { getRefNodeText, Reference, sortReferencesList } from 'app/models/reference';
import { UpdateObjectChange } from 'app/utils/history/update-object-change';
import { ProsemirrorChange } from 'app/utils/history/prosemirror-change';
import { BatchChange } from 'app/utils/history/change';
import { AddObjectChange } from 'app/utils/history/add-object-change';
import { RearrangingChange } from 'app/utils/history/rearranging-change';
import { DeleteObjectChange } from 'app/utils/history/delete-object-change';

export function updateReference(state: ManuscriptHistoryState, payload: Reference): ManuscriptHistoryState {
  const referenceIndex = state.data.present.references.findIndex(({ id }) => id === payload.id);
  const referenceChange = new UpdateObjectChange(
    `references.${referenceIndex}`,
    state.data.present.references[referenceIndex],
    payload
  );

  const { body } = state.data.present;
  const transaction = body.tr;
  const newAttrs = { refId: payload.id, refText: getRefNodeText(payload) };

  body.doc.descendants((node: ProsemirrorNode, pos: number, parent: ProsemirrorNode) => {
    if (node.type.name === 'refCitation' && node.attrs['refId'] === payload.id) {
      transaction.replaceWith(pos, pos + node.nodeSize, body.schema.nodes['refCitation'].create(newAttrs));
    }
    return Boolean(node.childCount);
  });

  const change = new BatchChange([referenceChange, new ProsemirrorChange('body', transaction)]);

  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
      future: []
    }
  };
}

export function addReference(state: ManuscriptHistoryState, payload: Reference): ManuscriptHistoryState {
  const addReferenceChange = new AddObjectChange('references', payload, 'id');
  const updatedManuscript = addReferenceChange.applyChange(state.data.present);
  const updatedReferenceList = [...updatedManuscript.references];
  sortReferencesList(updatedReferenceList);

  const sortReferencesChange = RearrangingChange.createFromListRearrange(
    'references',
    updatedManuscript.references,
    updatedReferenceList
  );

  return {
    ...state,
    data: {
      past: [...state.data.past, new BatchChange([addReferenceChange, sortReferencesChange])],
      present: sortReferencesChange.applyChange(updatedManuscript),
      future: []
    }
  };
}

export function deleteReference(state: ManuscriptHistoryState, payload: Reference): ManuscriptHistoryState {
  const referenceChange = new DeleteObjectChange('references', payload, 'id');
  const { body } = state.data.present;
  const transaction = body.tr;
  let documentReducedBy = 0;
  transaction.doc.descendants((node: ProsemirrorNode, pos: number, parent: ProsemirrorNode) => {
    if (node.type.name === 'refCitation' && node.attrs['refId'] === payload.id) {
      transaction.replace(pos - documentReducedBy, pos - documentReducedBy + node.nodeSize);
      documentReducedBy += node.nodeSize;
    }
    return Boolean(node.childCount);
  });

  const change = new BatchChange([referenceChange, new ProsemirrorChange('body', transaction)]);

  return {
    ...state,
    data: {
      past: [...state.data.past, change],
      present: change.applyChange(state.data.present),
      future: []
    }
  };
}
