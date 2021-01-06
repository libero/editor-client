import { EditorState } from 'prosemirror-state';

import {
  createArticleInfoState,
  getCopyrightStatement,
  getLicenseTextEditorState,
  LICENSE_CC0,
  LICENSE_CC_BY_4
} from 'app/models/article-information';

const AUTHORS = [
  {
    id: 'id1',
    firstName: 'First name 1',
    lastName: 'Last name 1'
  },
  {
    id: 'id2',
    firstName: 'First name 2',
    lastName: 'Last name 2'
  },
  {
    id: 'id3',
    firstName: 'First name 3',
    lastName: 'Last name 3'
  }
];

describe('Person model helpers', () => {
  it('gets copyright statement for authors list', () => {
    expect(getCopyrightStatement(AUTHORS.slice(0, 1), '2020-12-17')).toBe('© 2020, Last name 1');
    expect(getCopyrightStatement(AUTHORS.slice(0, 2), '2020-12-17')).toBe('© 2020, Last name 1 and Last name 2');
    expect(getCopyrightStatement(AUTHORS, '2020-12-17')).toBe('© 2020, Last name 1 et al');
  });

  it('creates article info state from XML with CC-BY-4', () => {
    const xmlWrapper = document.createElement('div');
    xmlWrapper.innerHTML = `<pub-date date-type="pub" publication-format="electronic">
        <day>30</day>
        <month>11</month>
        <year>2019</year>
      </pub-date>
      <article article-type="article-commentary" dtd-version="1.2" ></article>
      <article-meta>
        <subj-group subj-group-type="heading"> <subject>Insight</subject> </subj-group>
        <article-id pub-id-type="publisher-id">00104</article-id>
        <article-id pub-id-type="doi">10.7554/eLife.00104</article-id>
        <volume>8</volume>
        <elocation-id>e00104</elocation-id>
        <subj-group subj-group-type="subject"> <subject>Cell Biology</subject> </subj-group>
        <subj-group subj-group-type="subject"> <subject>Genetics and Genomics</subject> </subj-group>
        <permissions>
          <license xlink:href="http://creativecommons.org/licenses/by/4.0/"></license>
        </permissions>
      </article-meta>`;

    expect(createArticleInfoState((xmlWrapper as unknown) as Document, AUTHORS)).toEqual({
      articleDOI: '10.7554/eLife.00104',
      articleType: ' Insight ',
      copyrightStatement: '© 2019, Last name 1 et al',
      dtd: '1.2',
      elocationId: 'e00104',
      licenseText: expect.any(EditorState),
      licenseType: 'CC-BY-4',
      publicationDate: '2019-11-30',
      publisherId: '00104',
      subjects: ['Cell Biology', 'Genetics and Genomics'],
      volume: '8'
    });
  });

  it('creates article info state from XML with CC0', () => {
    const xmlWrapper = document.createElement('div');
    xmlWrapper.innerHTML = `<pub-date date-type="pub" publication-format="electronic">
        <day>30</day>
        <month>11</month>
        <year>2019</year>
      </pub-date>
      <article article-type="article-commentary" dtd-version="1.2" ></article>
      <article-meta>
        <subj-group subj-group-type="heading"> <subject>Insight</subject> </subj-group>
        <article-id pub-id-type="publisher-id">00104</article-id>
        <article-id pub-id-type="doi">10.7554/eLife.00104</article-id>
        <volume>8</volume>
        <elocation-id>e00104</elocation-id>
        <subj-group subj-group-type="subject"> <subject>Cell Biology</subject> </subj-group>
        <subj-group subj-group-type="subject"> <subject>Genetics and Genomics</subject> </subj-group>
        <permissions>
          <license xlink:href="http://creativecommons.org/publicdomain/zero/1.0/"></license>
        </permissions>
      </article-meta>`;

    expect(createArticleInfoState((xmlWrapper as unknown) as Document, AUTHORS)).toEqual({
      articleDOI: '10.7554/eLife.00104',
      articleType: ' Insight ',
      copyrightStatement: '',
      dtd: '1.2',
      elocationId: 'e00104',
      licenseText: expect.any(EditorState),
      licenseType: 'CC0',
      publicationDate: '2019-11-30',
      publisherId: '00104',
      subjects: ['Cell Biology', 'Genetics and Genomics'],
      volume: '8'
    });
  });

  it('should create license editor state', () => {
    expect(getLicenseTextEditorState(LICENSE_CC_BY_4).toJSON()).toMatchSnapshot();
    expect(getLicenseTextEditorState(LICENSE_CC0).toJSON()).toMatchSnapshot();
  });
});
