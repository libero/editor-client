import React from 'react';
import { DOMSerializer, ResolvedPos, Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { isEqualWith } from 'lodash';
import { EditorView } from 'prosemirror-view';

export function stringifyEditorState(editorState: EditorState): string {
  const fragment = DOMSerializer.fromSchema(editorState.schema).serializeFragment(editorState.doc.content);
  const temporaryContainer = document.createElement('div');
  temporaryContainer.appendChild(fragment);
  return temporaryContainer.innerHTML;
}

export function objectsEqual(obj1: unknown, obj2: unknown): boolean {
  return isEqualWith(obj1, obj2, (value1, value2) => {
    if (value1 instanceof EditorState && value2 instanceof EditorState) {
      return value1.doc.eq(value2.doc);
    }
    return undefined;
  });
}

export function hasParentNodeOf($pos: ResolvedPos, nodeNames: string[]): boolean {
  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);
    if (nodeNames.includes(node.type.name)) {
      return true;
    }
  }
  return false;
}

const SUPPORTED_IMAGE_TYPES = ['image/*'];

export function getImageFileUpload(onFileSelectCallback: (file: File) => void): void {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = SUPPORTED_IMAGE_TYPES.join(',');
  fileInput.addEventListener('change', () => {
    const file: File = fileInput.files.item(0);
    onFileSelectCallback(file);
  });
  fileInput.click();
}

interface NodeViewContext {
  view: EditorView;
  getNode: () => ProsemirrorNode;
  getPos: () => number;
}

export const NodeViewContext = React.createContext<NodeViewContext>(null);
