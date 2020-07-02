import { DOMSerializer } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';

export function stringifyEditorState(editorState: EditorState): string {
  const fragment = DOMSerializer.fromSchema(editorState.schema).serializeFragment(editorState.doc.content);
  const temporaryContainer = document.createElement('div');
  temporaryContainer.appendChild(fragment);
  return temporaryContainer.innerHTML;
}

export const SelectPlugin = new Plugin({
  state: {
    init(config, instance) {
      return { deco: DecorationSet.empty };
    },
    apply(transaction, state, prevEditorState, editorState) {
      const sel = transaction.selection;
      if (sel) {
        const decos = [
          Decoration.inline(
            sel.$from.pos,
            sel.$to.pos,
            { class: 'selection-marker' },
            { inclusiveLeft: true, inclusiveRight: true }
          )
        ];
        const deco = DecorationSet.create(editorState.doc, decos);
        return { deco };
      }

      return state;
    }
  },
  props: {
    decorations(state) {
      if (state && this.getState(state)) {
        return this.getState(state).deco;
      }
      return null;
    }
  }
});
