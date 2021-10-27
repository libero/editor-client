import { Node as ProsemirrorNode } from 'prosemirror-model';
import { nodes } from '../nodes';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

jest.mock('app/models/figure', () => ({
  getFigureImageUrlFromXml: () => 'IMAGE_URL',
  createFigureLicenseAttributes: () => ({
    copyrightHolder: 'Copyright holder',
    copyrightStatement: 'Copyright stmt',
    copyrightYear: 'Copyright year',
    licenseType: 'License type'
  }),
  createEmptyLicenseAttributes: () => ({
    copyrightHolder: '',
    copyrightStatement: '',
    copyrightYear: '',
    licenseType: ''
  })
}));

describe('nodes spec', () => {
  it('checks nodes spec definition', () => {
    expect(nodes).toMatchSnapshot();
  });

  it('checks annotatedReferenceInfoDoc spec', () => {
    expect(nodes['annotatedReferenceInfoDoc'].toDOM()).toEqual(['p', 0]);
  });

  it('checks article-title spec', () => {
    expect(nodes['article-title'].toDOM()).toEqual(['h1', { class: 'article-title' }, 0]);
  });

  it('checks abstract spec', () => {
    expect(nodes['abstract'].toDOM()).toEqual(['p', { class: 'abstract' }, 0]);
  });

  it('checks keyword spec', () => {
    expect(nodes['keyword'].toDOM()).toEqual(['div', 0]);
  });

  it('checks paragraph spec', () => {
    expect(nodes['paragraph'].toDOM()).toEqual(['p', { class: 'paragraph' }, 0]);
  });

  it('checks section spec', () => {
    expect(nodes['section'].toDOM()).toEqual(['section', 0]);
  });

  it('checks boxText spec', () => {
    expect(nodes['boxText'].toDOM()).toEqual(['section', { class: 'box-text' }, 0]);
  });

  it('checks figureTitle spec', () => {
    expect(nodes['figureTitle'].toDOM()).toEqual(['p', 0]);
  });

  it('checks figureLegend spec', () => {
    expect(nodes['figureLegend'].toDOM()).toEqual(['p', 0]);
  });

  it('checks figureAttribution spec', () => {
    expect(nodes['figureAttribution'].toDOM()).toEqual(['p', 0]);
  });

  it('checks orderedList spec', () => {
    expect(nodes['orderedList'].toDOM()).toEqual(['ol', 0]);
  });

  it('checks bulletList spec', () => {
    expect(nodes['bulletList'].toDOM()).toEqual(['ul', 0]);
  });

  it('checks listItem spec', () => {
    expect(nodes['listItem'].toDOM()).toEqual(['li', 0]);
  });

  it('checks heading spec attributes', () => {
    const body = document.createElement('body');
    body.innerHTML = `<body><sec>
        <title id="title1">Test</title>
        <sec>
            <title id="title2"> Second level heading </title>
        </sec>
    </sec><body>`;
    expect(nodes['heading'].parseDOM[0].getAttrs(body.querySelector('#title1'))).toEqual({
      domId: 'unique_id',
      level: 1
    });
    expect(nodes['heading'].parseDOM[0].getAttrs(body.querySelector('#title2'))).toEqual({
      domId: 'unique_id',
      level: 2
    });
  });

  it('checks heading spec rendering', () => {
    const node = new ProsemirrorNode();
    node.attrs = { level: 3, domId: 'SOME_ID' };
    expect(nodes['heading'].toDOM(node)).toEqual(['h3', { id: 'SOME_ID' }, 0]);
  });

  it('checks refCitation spec XML attributes', () => {
    const node = document.createElement('xref');
    node.innerHTML = 'SOME_TEXT';
    node.setAttribute('rid', 'SOME_ID');
    expect(nodes['refCitation'].parseDOM[0].getAttrs(node)).toEqual({ refText: 'SOME_TEXT', refId: 'SOME_ID' });
  });

  it('checks refCitation spec HTML (clipboards) attributes', () => {
    const node = document.createElement('a');
    node.innerHTML = 'SOME_TEXT';
    node.setAttribute('data-cit-type', 'reference');
    node.setAttribute('data-ref-id', 'SOME_ID');
    node.setAttribute('data-ref-text', 'SOME_TEXT');
    expect(nodes['refCitation'].parseDOM[1].getAttrs(node)).toEqual({ refText: 'SOME_TEXT', refId: 'SOME_ID' });
  });

  it('checks refCitation spec HTML (clipboards) rendering', () => {
    const node = new ProsemirrorNode();
    node.attrs = { refId: 'SOME_ID', refText: 'SOME_TEXT' };
    expect((nodes['refCitation'].toClipboardDOM(node) as HTMLElement).outerHTML).toEqual(
      '<a href="#" data-cit-type="reference" data-ref-id="SOME_ID" data-ref-text="SOME_TEXT" class="citation">SOME_TEXT</a>'
    );
  });

  it('checks refCitation spec text (clipboards) rendering', () => {
    const node = new ProsemirrorNode();

    node.attrs = { refId: 'SOME_ID', refText: 'SOME_TEXT' };
    expect(nodes['refCitation'].toClipboardText(node)).toEqual('SOME_TEXT');
  });

  it('checks refCitation spec rendering', () => {
    const node = new ProsemirrorNode();

    node.attrs = { refId: 'SOME_ID', refText: 'SOME_TEXT' };
    expect(nodes['refCitation'].toDOM(node)).toEqual([
      'a',
      {
        href: '#',
        class: 'citation',
        'data-cit-type': 'reference',
        'data-ref-id': 'SOME_ID',
        'data-ref-text': 'SOME_TEXT'
      }
    ]);
  });

  it('checks figure spec rendering', () => {
    const node = document.createElement('fig');
    node.setAttribute('id', 'SOME_ID');
    node.setAttribute('position', 'SOME_POS');
    node.innerHTML = '<label>SOME_LABEL</label>';
    expect(nodes['figure'].parseDOM[0].getAttrs(node)).toEqual({
      id: 'SOME_ID',
      label: 'SOME_LABEL',
      img: 'IMAGE_URL',
      position: 'SOME_POS'
    });
  });

  it('checks figureLicese attributes', () => {
    const node = document.createElement('fig');
    expect(nodes['figureLicense'].parseDOM[0].getAttrs(node)).toEqual({
      licenseInfo: {
        copyrightHolder: 'Copyright holder',
        copyrightStatement: 'Copyright stmt',
        copyrightYear: 'Copyright year',
        licenseType: 'License type'
      }
    });
  });

  it('checks figureLicese rendering', () => {
    expect(nodes['figureLicense'].toDOM()).toEqual(['p', 0]);
  });

  it('checks figureCitation spec XML attributes', () => {
    const node = document.createElement('xref');
    node.setAttribute('rid', 'SOME_ID');
    expect(nodes['figureCitation'].parseDOM[0].getAttrs(node)).toEqual({ figIds: ['SOME_ID'] });
  });

  it('checks figureCitation spec HTML (clipboards) attributes', () => {
    const node = document.createElement('a');
    node.setAttribute('data-fig-ids', 'SOME_ID1 SOME_ID2');
    expect(nodes['figureCitation'].parseDOM[1].getAttrs(node)).toEqual({ figIds: ['SOME_ID1', 'SOME_ID2'] });
  });

  it('checks figureCitation spec rendering', () => {
    const node = new ProsemirrorNode();

    node.attrs = { figIds: ['SOME_ID1', 'SOME_ID2'] };
    expect(nodes['figureCitation'].toDOM(node)).toEqual([
      'a',
      {
        href: '#',
        class: 'citation',
        'data-cit-type': 'figure',
        'data-fig-ids': 'SOME_ID1 SOME_ID2'
      },
      0
    ]);
  });
});
