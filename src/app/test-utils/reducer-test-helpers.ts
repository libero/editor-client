import { EditorState } from 'prosemirror-state';
import { Schema } from 'prosemirror-model';

import { Manuscript } from '../types/manuscript';
import { getInitialHistory, getLoadableStateSuccess } from '../utils/state.utils';
import { ManuscriptHistoryState } from '../store';
import { ArticleInformation } from '../models/article-information';

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
      articleInfo: new ArticleInformation({
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
        licenseText: createDummyEditorState().toJSON()
      }),
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
