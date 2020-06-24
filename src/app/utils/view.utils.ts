import { DOMSerializer } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';

export function stringifyEditorState(editorState: EditorState) {
  const fragment = DOMSerializer.fromSchema(editorState.schema).serializeFragment(editorState.doc.content);
  const temporaryContainer = document.createElement('div');
  temporaryContainer.appendChild(fragment);
  return temporaryContainer.innerHTML;
}
