import { DOMSerializer } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { isEqualWith } from 'lodash';

export function stringifyEditorState(editorState: EditorState): string {
  const fragment = DOMSerializer.fromSchema(editorState.schema).serializeFragment(editorState.doc.content);
  const temporaryContainer = document.createElement('div');
  temporaryContainer.appendChild(fragment);
  return temporaryContainer.innerHTML;
}

type ManuscriptObject = Record<string, unknown>;

export function objectsEqual(obj1: ManuscriptObject, obj2: ManuscriptObject): boolean {
  return isEqualWith(obj1, obj2, (value1, value2) => {
    if (value1 instanceof EditorState && value2 instanceof EditorState) {
      return value1.doc.eq(value2.doc);
    }
    return undefined;
  });
}
