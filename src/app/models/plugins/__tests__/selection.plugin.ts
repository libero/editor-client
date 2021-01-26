import { EditorState, TextSelection } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

import { SelectionPlugin } from 'app/models/plugins/selection.plugins';
import { EditorView } from 'prosemirror-view';

describe('SelectionPlugin', () => {
  it('should create a decoration', () => {
    const view = createDummyView();
    let state = view.state;
    state = state.apply(state.tr.insertText('Sample text'));
    const changeSel = state.tr.setSelection(TextSelection.create(state.doc, 2, 4));
    state = state.apply(changeSel);

    view.updateState(state);
    expect(view.dom).toMatchSnapshot();
  });

  it('should not create decoration when no selection', () => {
    const view = createDummyView();
    let state = view.state;
    state = state.apply(state.tr.insertText('Sample text'));

    view.updateState(state);
    expect(view.dom).toMatchSnapshot();
  });
});

function createDummyView(): EditorView {
  const state = EditorState.create({
    schema: new Schema({
      nodes: {
        doc: { content: 'inline*' },
        text: { inline: true, group: 'inline' }
      }
    }),
    plugins: [SelectionPlugin]
  });

  const dom = document.createElement('div');
  return new EditorView(dom, {
    dispatchTransaction: jest.fn(),
    state
  });
}
