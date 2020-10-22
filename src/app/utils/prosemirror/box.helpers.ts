import { splitBlockKeepMarks } from 'prosemirror-commands';
import { EditorState, Transaction, NodeSelection } from 'prosemirror-state';

export async function insertBox(editorState: EditorState): Promise<Transaction> {
  const { empty, $from, $to } = editorState.selection;
  const content =
    !empty && $from.sameParent($to) && $from.parent.inlineContent
      ? $from.parent.content.cut($from.parentOffset, $to.parentOffset)
      : editorState.schema.nodes.paragraph.createAndFill(null, editorState.schema.text(' '));

  const change = await new Promise<Transaction>((resolve) => {
    // only split paragraph if it has content
    if (editorState.selection.$from.parent.textContent.trim()) {
      splitBlockKeepMarks(editorState, (tr: Transaction) => resolve(tr));
    } else {
      resolve(editorState.tr);
    }
  });

  const box = editorState.schema.nodes['boxText'].createAndFill(null, content);
  if (!change.selection.$from.parent.textContent.trim()) {
    change.setSelection(NodeSelection.create(change.doc, change.selection.$from.pos - 1)).replaceSelectionWith(box);
  } else {
    change.insert(change.selection.$from.pos - 1, box);
  }
  return change;
}
