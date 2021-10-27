import { EditorState, TextSelection } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';

import { getInitialHistory, getInitialLoadableState } from '../../utils/state.utils';
import {
  canApplyMarkToSelection,
  canRedoChanges,
  canUndoChanges,
  isMarkAppliedToSelection
} from '../manuscript-editor.selectors';
import { Manuscript } from '../../types/manuscript';
import { Keyword } from '../../models/keyword';
import { givenState } from '../../test-utils/reducer-test-helpers';

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

  it('checks if selection can be marked', () => {
    state.manuscript.data = getInitialHistory(givenManuscript());
    state.manuscriptEditor.focusedManuscriptPath = 'title';
    state.manuscript.data.present.title = {
      ...new EditorState(),
      selection: { empty: false },
      schema: {
        marks: { bold: {} }
      }
    };
    expect(canApplyMarkToSelection(state)('bold')).toBeTruthy();
  });

  it('checks if selection is already marked', () => {
    const newKeyword = new Keyword();
    const docXML = document.createElement('keyword');
    docXML.innerHTML = '<italic>Test</italic>';
    newKeyword.content.doc = ProseMirrorDOMParser.fromSchema(newKeyword.content.schema).parse(docXML);
    const tr = newKeyword.content.tr;
    tr.setSelection(TextSelection.create(newKeyword.content.apply(tr).doc, newKeyword.content.selection.from + 4));
    newKeyword.content = newKeyword.content.apply(tr);

    state.manuscript.data = getInitialHistory(givenManuscript());
    state.manuscriptEditor.focusedManuscriptPath = 'keywordGroups.group.newKeyword.content';
    state.manuscript.data.present.keywordGroups = {
      group: {
        title: '',
        keywords: [],
        newKeyword: newKeyword
      }
    };

    expect(isMarkAppliedToSelection(state)('italic')).toBeTruthy();
  });
});

function givenManuscript(): Manuscript {
  const state = givenState({});
  return state.data.present;
}
