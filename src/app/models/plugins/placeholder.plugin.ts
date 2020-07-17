import { DecorationSet, Decoration } from 'prosemirror-view';
import { Plugin, EditorState } from 'prosemirror-state';

export function PlaceholderPlugin(placeholderText: string): Plugin {
  return new Plugin({
    props: {
      decorations(state: EditorState) {
        const doc = state.doc;

        if (doc.childCount > 1 || !doc.firstChild.isTextblock || doc.firstChild.content.size > 0) {
          return;
        }

        const placeHolder = document.createElement('div');
        placeHolder.classList.add('placeholder');
        placeHolder.textContent = placeholderText;

        return DecorationSet.create(doc, [Decoration.widget(1, placeHolder)]);
      }
    }
  });
}
