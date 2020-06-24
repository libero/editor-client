import { EditorState } from 'prosemirror-state';
import { createReferenceAnnotatedValue, Reference } from 'app/models/reference';

export default [
  {
    id: 'bib1',
    authors: [
      {
        firstName: 'V',
        lastName: 'Berk'
      }
    ],
    type: 'journal',
    referenceInfo: {
      year: 2012,
      source: stringToEditorState('Science'),
      articleTitle: stringToEditorState(
        'Molecular architecture and assembly principles of <italic>Vibrio cholerae</italic> biofilms'
      ),
      doi: '',
      pmid: '',
      elocationId: '',
      firstPage: 236,
      lastPage: 239,
      inPress: false,
      volume: 337
    }
  },
  {
    id: 'bib2',
    authors: [
      {
        firstName: 'PK',
        lastName: 'Feyerabend'
      }
    ],
    type: 'book',
    referenceInfo: {
      year: 2010,
      source: stringToEditorState('The skull and brain'),
      chapterTitle: stringToEditorState('The skull and brain'),
      publisherLocation: 'London',
      publisherName: 'Verso',
      edition: '4th Edition',
      doi: '',
      pmid: '',
      elocationId: '',
      firstPage: 0,
      lastPage: 0,
      inPress: false,
      volume: 0
    }
  }
] as Reference[];

function stringToEditorState(xmlContent: string): EditorState {
  const el = document.createElement('div');
  el.innerHTML = xmlContent;
  return createReferenceAnnotatedValue(el);
}
