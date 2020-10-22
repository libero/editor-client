import { NodeType, Schema } from 'prosemirror-model';
import { EditorState, Transaction, NodeSelection, TextSelection } from 'prosemirror-state';
import { wrapInList, splitListItem, liftListItem, sinkListItem } from 'prosemirror-schema-list';
import { get } from 'lodash';

export function canWrapInList(state: EditorState, listType: NodeType): boolean {
  return Boolean(wrapInList(listType, null)(state, null));
}

export function isWrappedInList(state: EditorState, listType: NodeType): boolean {
  const { $from } = state.selection;
  return get($from.node(-2), 'type') === listType;
}

export function wrapInListOrChangeListType(state: EditorState, listType: NodeType): Promise<Transaction> {
  const alternativeListType =
    state.schema.nodes.bulletList === listType ? state.schema.nodes.orderedList : state.schema.nodes.bulletList;

  if (isWrappedInList(state, alternativeListType)) {
    return new Promise<Transaction>((resolve) => {
      const originalList = state.selection.$from.node(-2);
      const replacementList = listType.createAndFill(null, originalList.content);
      const { $from } = state.selection;
      const selection = new NodeSelection(state.doc.resolve($from.start(-2) - 1));
      const change = state.tr.setSelection(selection).replaceSelectionWith(replacementList);

      change.setSelection(new TextSelection(change.doc.resolve($from.pos)));
      resolve(change);
    });
  } else {
    return new Promise<Transaction>((resolve) => {
      wrapInList(listType, null)(state, resolve);
    });
  }
}

export function createListKeymap(schema: Schema): Record<string, Function> {
  const listItemNodeType = get(schema, 'nodes.listItem');
  if (!listItemNodeType) {
    return {};
  }

  return {
    Enter: splitListItem(listItemNodeType),
    'Mod-[': liftListItem(listItemNodeType),
    'Mod-]': sinkListItem(listItemNodeType)
  };
}
