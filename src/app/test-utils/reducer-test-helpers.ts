import { EditorState } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

import { Manuscript } from 'app/types/manuscript';
import { getInitialHistory, getLoadableStateSuccess } from 'app/utils/state.utils';
import { ManuscriptHistoryState } from 'app/store';

export function givenState(overrides: Partial<Manuscript>): ManuscriptHistoryState {
  return getLoadableStateSuccess(
    getInitialHistory({
      title: createDummyEditorState(),
      abstract: createDummyEditorState(),
      impactStatement: createDummyEditorState(),
      body: createDummyEditorState(),
      acknowledgements: createDummyEditorState(),
      journalMeta: {
        publisherName: '',
        issn: ''
      },
      authors: [],
      relatedArticles: [],
      affiliations: [],
      keywordGroups: {},
      articleInfo: {
        dtd: '',
        articleType: '',
        articleDOI: '',
        publisherId: '',
        volume: '',
        elocationId: '',
        subjects: [],
        publicationDate: '',
        licenseType: 'CC0',
        copyrightStatement: '',
        licenseText: createDummyEditorState()
      },
      references: [],
      ...overrides
    })
  );
}

export function createDummyEditorState(): EditorState {
  return EditorState.create({
    schema: new Schema({
      nodes: {
        doc: { content: 'inline*' },
        text: { inline: true, group: 'inline' }
      }
    }),
    plugins: []
  });
}
