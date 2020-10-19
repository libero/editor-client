import { DOMSerializer, ResolvedPos } from 'prosemirror-model';
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

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export function uploadImage(onSelectCallback: (img: string) => void): void {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = SUPPORTED_IMAGE_TYPES.join(',');
  fileInput.addEventListener('change', () => {
    const file: File = fileInput.files[0];
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target.result instanceof ArrayBuffer) {
        throw new Error('Invalid FileReader return format. File reader must read a string via readAsDataUrl');
      }
      onSelectCallback(e.target.result);
    };
    reader.readAsDataURL(file);
  });
  fileInput.click();
}
