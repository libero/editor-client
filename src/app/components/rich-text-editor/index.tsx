import React from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction, TextSelection } from 'prosemirror-state';
import { debounce, get } from 'lodash';
import { DOMSerializer, Slice } from 'prosemirror-model';
import 'prosemirror-example-setup/style/style.css';
import 'prosemirror-menu/style/menu.css';
import { SectionContainer, SectionContainerVariant } from 'app/components/section-container';
import { ReferenceCitationNodeView } from 'app/components/reference-citation';
import { ComponentWithId } from 'app/utils/types';
import { BoxTextNodeView } from 'app/components/box-text';
import { hasParentNodeOf } from 'app/utils/view.utils';
import { LinkNodeView } from 'app/components/link-editor-popup';
import { FigureNodeView } from 'app/components/figure';
import { FigureCitationNodeView } from 'app/components/figure-citation';

/*
 * available classes:
 *   - root: applied to SectionContainer
 * */

export interface RichTextEditorProps {
  editorState: EditorState;
  label?: string;
  classes?: Record<string, string>;
  name?: string;
  isActive: boolean;
  variant?: SectionContainerVariant;
  onChange?: (change: Transaction, name: string) => void;
  onFocus?: (state: EditorState, name: string) => void;
  onBlur?: (state: EditorState, name: string) => void;
}

const restoreSelection = debounce((editorView, from, to) => {
  if (editorView.state.selection) {
    const $from = editorView.state.doc.resolve(from);
    const $to = editorView.state.doc.resolve(to);
    const change = editorView.state.tr.setSelection(new TextSelection($from, $to));
    editorView.dispatch(change);
  }
}, 50);

export class RichTextEditor extends React.Component<ComponentWithId<RichTextEditorProps>> {
  private options;
  public editorView: EditorView;

  constructor(props: ComponentWithId<RichTextEditorProps>) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.options = {
      nodeViews: {
        refCitation(node, view, getPos) {
          return new ReferenceCitationNodeView(node, view, getPos);
        },
        boxText: (node, view, getPos) => {
          return new BoxTextNodeView(node, view, getPos);
        },
        link(node, view) {
          return new LinkNodeView(node, view);
        },
        figure: (node, view, getPos) => {
          return new FigureNodeView(node, view, getPos);
        },
        figureCitation: (node, view, getPos) => {
          return new FigureCitationNodeView(node, view, getPos);
        }
      },
      handleDOMEvents: {
        focus: ({ state }: EditorView) => {
          if (this.props.onFocus && !this.props.isActive) {
            this.props.onFocus(state, this.props.name);
          }
          return true;
        },
        blur: ({ state }: EditorView) => {
          if (this.props.onBlur && this.props.isActive) {
            this.props.onBlur(state, this.props.name);
          }
          return true;
        }
      }
    };
  }

  focus() {
    this.focusEditor();
  }

  blur() {
    (this.editorView.dom as HTMLDivElement).blur();
  }

  shouldComponentUpdate(nextProps: RichTextEditorProps) {
    // editor state is kept in sync between app state and editor state. App state will change when using formatting
    // or any toolbar menu. In this case when change comes from outside it needs to override editor state
    if (!nextProps.editorState.doc.eq(this.props.editorState.doc)) {
      this.updateEditorState(nextProps.editorState);
    }

    return (
      this.props.label !== nextProps.label ||
      this.props.isActive !== nextProps.isActive ||
      this.props.variant !== nextProps.variant
    );
  }

  componentDidUpdate() {
    // when component updates we need to restore focus
    this.restoreFocus();
  }

  componentWillUnmount() {
    if (this.editorView) {
      this.editorView.destroy();
    }
  }

  preventClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  updateEditorState(editorState: EditorState) {
    if (editorState !== this.editorView.state) {
      this.editorView.updateState(editorState);
    }
  }

  render() {
    return (
      <SectionContainer
        label={this.props.label}
        className={get(this.props, 'classes.root', '')}
        focused={this.props.isActive}
        id={this.props.id}
        variant={this.props.variant}
      >
        <div ref={this.createEditorView} className="prosemirrorContainer" onClick={this.preventClick} />
      </SectionContainer>
    );
  }

  private async handleChange(change: Transaction) {
    const newState = this.editorView.state.apply(change);
    this.updateEditorState(newState);
    this.props.onChange(change, this.props.name);
  }

  private createEditorView = (element: HTMLElement) => {
    if (element) {
      const clipboardSerializer = DOMSerializer.fromSchema(this.props.editorState.schema);
      Object.entries(this.props.editorState.schema.nodes).forEach(([nodeName, nodeType]) => {
        clipboardSerializer.nodes[nodeName] = get(nodeType, 'spec.toClipboardDOM', clipboardSerializer.nodes[nodeName]);
      });

      const additionalOptions = this.options || {};
      this.editorView = new EditorView(element, {
        ...additionalOptions,
        clipboardSerializer,
        handleScrollToSelection: (view: EditorView) => {
          return this.isFocusControlDelegated();
        },
        clipboardTextSerializer,
        state: this.props.editorState,
        dispatchTransaction: this.handleChange
      });
    }
  };

  private focusEditor() {
    const { from, to } = this.editorView.state.selection;
    restoreSelection(this.editorView, from, to);
    this.editorView.focus();
  }

  private isFocusControlDelegated() {
    const { $from } = this.editorView.state.selection;
    return this.editorView.dom.contains(document.activeElement) || hasParentNodeOf($from, ['boxText', 'figure']);
  }

  // focus is restored based on 3 conditions
  // #1 - component is active acc. to application state (prop: isActive)
  // #2 - editor does not have focus
  // #3 - focus is not delegated to a node view
  private restoreFocus() {
    if (this.props.isActive && this.editorView && !this.editorView.hasFocus()) {
      if (!this.isFocusControlDelegated()) {
        this.focusEditor();
      }
    }
  }
}

function clipboardTextSerializer(slice: Slice): string {
  const content = slice.content;
  const text = [];
  let separated = true;
  const blockSeparator = ' ';
  content.nodesBetween(0, content.size, (node, pos) => {
    if (node.isText) {
      text.push(node.text);
      separated = !blockSeparator;
    } else if (node.isLeaf && node.type.spec.toClipboardText) {
      text.push(node.type.spec.toClipboardText(node));
      separated = !blockSeparator;
    } else if (!separated && node.isBlock) {
      text.push(blockSeparator);
      separated = true;
    }
    return true;
  });

  return text.join('');
}
