import { EditorState, Transaction, NodeSelection } from 'prosemirror-state';
import { splitBlockKeepMarks } from 'prosemirror-commands';
import { v4 as uuidv4 } from 'uuid';

export async function insertFigure(editorState: EditorState, imageSource: string): Promise<Transaction> {
  const change = await new Promise<Transaction>((resolve) => {
    // only split paragraph if it has content
    if (editorState.selection.$from.parent.textContent.trim()) {
      splitBlockKeepMarks(editorState, (tr: Transaction) => resolve(tr));
    } else {
      resolve(editorState.tr);
    }
  });

  const figure = editorState.schema.nodes['figure'].createAndFill({ label: '', img: imageSource, id: uuidv4() });
  if (!change.selection.$from.parent.textContent.trim()) {
    change.setSelection(NodeSelection.create(change.doc, change.selection.$from.pos - 1)).replaceSelectionWith(figure);
  } else {
    change.insert(change.selection.$from.pos - 1, figure);
  }
  return change;
}

export function insertFigureCitation(editorState: EditorState): Transaction {
  const { empty, $from, $to } = editorState.selection;
  const content =
    !empty && $from.sameParent($to) && $from.parent.inlineContent
      ? $from.parent.content.cut($from.parentOffset, $to.parentOffset)
      : null;

  const citationNode = editorState.schema.nodes.figureCitation.createAndFill(null, content);
  return editorState.tr.replaceSelectionWith(citationNode);
}
