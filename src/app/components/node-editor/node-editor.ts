import React from 'react';
import { EditorState, Transaction, Selection, TextSelection } from 'prosemirror-state';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { get } from 'lodash';
import { baseKeymap } from 'prosemirror-commands';
import { StepMap } from 'prosemirror-transform';

import { buildInputRules } from '../../models/plugins/input-rules';
import { NodeViewContext } from '../../utils/view.utils';
import { RichTextEditor } from '../rich-text-editor';
import { SelectionPlugin } from '../../models/plugins/selection.plugins';

export interface NodeEditorProps {
  node: ProsemirrorNode;
  offset: number;
}

export interface NodeEditorState {
  editorState: EditorState;
  isEditorActive: boolean;
}

export abstract class NodeEditor<T> extends React.Component<NodeEditorProps & T, NodeEditorState> {
  static contextType = NodeViewContext;

  protected editorRef = React.createRef<RichTextEditor>();

  constructor(props) {
    super(props);
    this.state = {
      editorState: this.createInternalEditorState(),
      isEditorActive: false
    };
  }

  shouldComponentUpdate(nextProps: NodeEditorProps, nextState: NodeEditorState): boolean {
    if (
      this.state.isEditorActive !== nextState.isEditorActive ||
      this.props.offset !== nextProps.offset ||
      !nextProps.node.sameMarkup(this.props.node)
    ) {
      return true;
    }

    const change = this.getUpdatesForNode(nextProps.node, this.getInternalState());
    if (change) {
      this.updateInternalEditorState(change);
      this.updateActiveStateFromSelection(this.context.view.state.selection);
      return true;
    }

    return false;
  }

  protected getEditorActiveState(): boolean {
    return this.state.isEditorActive;
  }

  protected handleEditorFocus = (): void => {
    if (!this.editorRef.current.editorView.state.doc.childCount) {
      this.updateSelectionOnEmptyContent();
    }

    this.setState({ isEditorActive: true });
  };

  protected handleEditorBlur = (): void => {
    this.setState({ isEditorActive: false });
  };

  protected handleInternalEditorStateChange = (change: Transaction): void => {
    this.setState({ editorState: this.getInternalState() });
    if (!change.getMeta('parentChange')) {
      this.context.view.dispatch(this.translateChanges(change));
    }
  };

  private createInternalEditorState(): EditorState {
    return EditorState.create({
      doc: this.props.node,
      plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap), SelectionPlugin]
    });
  }

  private updateActiveStateFromSelection(selection: Selection): void {
    const state = this.getInternalState();
    const cursorPos = selection.$from.pos;
    const parentNodePos = this.context.getPos();
    const isCursorInNode =
      parentNodePos + this.props.offset <= cursorPos &&
      cursorPos <= parentNodePos + this.props.offset + state.doc.nodeSize;

    if (isCursorInNode) {
      this.setState({ isEditorActive: true });
    }
  }

  private getUpdatesForNode(updatedNode: ProsemirrorNode, state: EditorState): Transaction | null {
    const start = updatedNode.content.findDiffStart(state.doc.content);
    if (start !== null) {
      let { a: endA, b: endB } = updatedNode.content.findDiffEnd(get(state, 'doc.content'));
      const overlap = start - Math.min(endA, endB);
      if (overlap > 0) {
        endA += overlap;
        endB += overlap;
      }
      return state.tr.replace(start, endB, updatedNode.slice(start, endA)).setMeta('parentChange', true);
    }
    return null;
  }

  private translateChanges(change: Transaction): Transaction {
    const translatedChange = this.context.view.state.tr;
    if (change.docChanged) {
      const offsetMap = StepMap.offset(this.context.getPos() + this.props.offset);
      const steps = change.steps;
      for (let i = 0; i < steps.length; i++) {
        translatedChange.step(steps[i].map(offsetMap));
      }
    }

    const { anchor, head } = change.selection;
    const start = Math.min(anchor, head);
    const end = Math.max(anchor, head);
    const selection = TextSelection.create(
      translatedChange.doc,
      start + this.props.offset + this.context.getPos(),
      end + this.props.offset + this.context.getPos()
    );

    if (!selection.eq(this.context.view.state.selection)) {
      translatedChange.setSelection(selection);
      this.context.view.dom.dispatchEvent(new FocusEvent('focus'));
    }

    return translatedChange;
  }

  /*
    when a content of a node editor is empty a selection change will happen and we need to manually dispatch a selection
    change to the parent
  */
  private updateSelectionOnEmptyContent(): void {
    const change = this.context.view.state.tr;

    const selection = TextSelection.create(
      change.doc,
      this.props.offset + this.context.getPos(),
      this.props.offset + this.context.getPos()
    );
    change.setSelection(selection);
    this.context.view.dispatch(change);
    this.context.view.dom.dispatchEvent(new FocusEvent('focus'));
  }

  private updateInternalEditorState(change: Transaction): void {
    const internalEditorView = get(this.editorRef.current, 'editorView');
    internalEditorView && internalEditorView.dispatch(change);
  }

  private getInternalState(): EditorState {
    return get(this.editorRef, 'current.editorView.state');
  }
}
