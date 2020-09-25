import { Node as ProsemirrorNode } from 'prosemirror-model';

import { ManuscriptHistoryState } from 'app/store';
import { getRefNodeText, Reference, sortReferencesList } from 'app/models/reference';
import { cloneManuscript } from 'app/utils/state.utils';
import { updateManuscriptState } from 'app/utils/history.utils';

export function updateReference(state: ManuscriptHistoryState, payload: Reference): ManuscriptHistoryState {
  const referenceIndex = state.data.present.references.findIndex(({ id }) => id === payload.id);
  const { body } = state.data.present;
  const changes = body.tr;
  const newAttrs = { refId: payload.id, refText: getRefNodeText(payload) };

  body.doc.descendants((node: ProsemirrorNode, pos: number, parent: ProsemirrorNode) => {
    if (node.type.name === 'refCitation' && node.attrs['refId'] === payload.id) {
      changes.replaceWith(pos, pos + node.nodeSize, body.schema.nodes['refCitation'].create(newAttrs));
    }
    return Boolean(node.childCount);
  });
  const newState = updateManuscriptState(state.data, 'body', changes);
  newState.present.references[referenceIndex] = payload;
  sortReferencesList(newState.present.references);
  newState.past[newState.past.length - 1]['references'] = state.data.present.references;

  return {
    ...state,
    data: newState
  };
}

export function addReference(state: ManuscriptHistoryState, payload: Reference): ManuscriptHistoryState {
  const newDiff = {
    references: state.data.present.references
  };

  const newManuscript = cloneManuscript(state.data.present);
  newManuscript.references.push(payload);
  sortReferencesList(newManuscript.references);

  return {
    ...state,
    data: {
      past: [...state.data.past, newDiff],
      present: newManuscript,
      future: []
    }
  };
}

export function deleteReference(state: ManuscriptHistoryState, payload: Reference): ManuscriptHistoryState {
  const referenceIndex = state.data.present.references.findIndex(({ id }) => id === payload.id);

  const { body } = state.data.present;
  const changes = body.tr;
  let documentReducedBy = 0;
  changes.doc.descendants((node: ProsemirrorNode, pos: number, parent: ProsemirrorNode) => {
    if (node.type.name === 'refCitation' && node.attrs['refId'] === payload.id) {
      changes.replace(pos - documentReducedBy, pos - documentReducedBy + node.nodeSize);
      documentReducedBy += node.nodeSize;
    }
    return Boolean(node.childCount);
  });
  const newState = updateManuscriptState(state.data, 'body', changes);

  newState.present.references.splice(referenceIndex, 1);
  newState.past[newState.past.length - 1]['references'] = state.data.present.references;

  return {
    ...state,
    data: newState
  };
}
