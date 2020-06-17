import { EditorState, TextSelection } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';

import { getInitialHistory, getInitialLoadableState } from 'app/utils/state.utils';
import {
  canBoldSelection,
  canItalicizeSelection,
  canRedoChanges,
  canUndoChanges,
  isSelectionItalicised
} from 'app/selectors/manuscript-editor.selectors';
import { Manuscript } from 'app/models/manuscript';
import { createNewKeywordState } from 'app/models/manuscript-state.factory';

describe('manuscript selectors', () => {
  let state;

  beforeEach(() => {
    state = {
      manuscript: getInitialLoadableState(),
      manuscriptEditor: {
        focusedManuscriptPath: undefined
      }
    };
  });

  it('checks if changes can be undone', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());

    state.manuscript.data.past.push({ title: undefined });
    expect(canUndoChanges(state)).toBeTruthy();
  });

  it('checks if changes can be redone', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());

    state.manuscript.data.future.push({ title: undefined });
    expect(canRedoChanges(state)).toBeTruthy();
  });

  it('checks if selection can be italicised', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());
    state.manuscriptEditor.focusedManuscriptPath = 'title';
    state.manuscript.data.present.title = {
      ...new EditorState(),
      selection: { empty: false },
      schema: {
        marks: { italic: {} }
      }
    };
    expect(canItalicizeSelection(state)).toBeTruthy();
  });

  it('checks if selection can be bold', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());
    state.manuscriptEditor.focusedManuscriptPath = 'title';
    state.manuscript.data.present.title = {
      ...new EditorState(),
      selection: { empty: false },
      schema: {
        marks: { bold: {} }
      }
    };
    expect(canBoldSelection(state)).toBeTruthy();
  });

  it('checks if selection is already bold', () => {
    let newKeyword = createNewKeywordState();
    const docXML = document.createElement('keyword');
    docXML.innerHTML = '<italic>Test</italic>';
    newKeyword.doc = ProseMirrorDOMParser.fromSchema(newKeyword.schema).parse(docXML);
    const tr = newKeyword.tr;
    tr.setSelection(TextSelection.create(newKeyword.apply(tr).doc, newKeyword.selection.from + 4));
    newKeyword = newKeyword.apply(tr);

    state.manuscript.data = getInitialHistory(givenManuscript());
    state.manuscriptEditor.focusedManuscriptPath = 'keywordGroups.group.newKeyword';
    state.manuscript.data.present.keywordGroups = {
      group: {
        title: '',
        keywords: [],
        newKeyword: newKeyword
      }
    };

    expect(isSelectionItalicised(state)).toBeTruthy();
  });
});

function givenManuscript(): Manuscript {
  return {
    title: new EditorState(),
    abstract: new EditorState(),
    keywordGroups: {},
    authors: [],
    affiliations: []
  };
}
