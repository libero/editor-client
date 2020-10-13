import { DOMSerializer, ResolvedPos, Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { isEqualWith } from 'lodash';

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

export function findChildrenByType(node: ProsemirrorNode, nodeType: NodeSpec) {
  const foundChildren = [];
  node.descendants((childNode) => {
    if (nodeType === childNode.type) {
      foundChildren.push(childNode);
    }
  });
  return foundChildren;
}
