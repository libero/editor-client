import { Decoration, DecorationSet } from 'prosemirror-view';
import { Plugin } from 'prosemirror-state';

interface DecorationConfig {
  deco: DecorationSet;
}

export const SelectionPlugin = new Plugin({
  state: {
    init(config, instance): DecorationConfig {
      return { deco: DecorationSet.empty };
    },
    apply(transaction, value: DecorationConfig, prevEditorState, editorState): DecorationConfig {
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

      return value;
    }
  },
  props: {
    decorations(state): DecorationSet {
      if (state && this.getState(state)) {
        return this.getState(state).deco;
      }
      return null;
    }
  }
});
