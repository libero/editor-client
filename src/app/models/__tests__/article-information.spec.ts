import { ArticleInformation } from '../article-information';
import { Person } from '../person';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

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
    <subj-group subj-group-type="major-subject"> <subject>Cell Biology</subject> </subj-group>
    <subj-group subj-group-type="major-subject"> <subject>Genetics and Genomics</subject> </subj-group>
    <permissions>
      <license xlink:href="http://creativecommons.org/licenses/by/4.0/"></license>
    </permissions>
  </article-meta>`;

describe('Article Information model helpers', () => {
  it('gets copyright statement for authors list', () => {
    let articleInfo = new ArticleInformation(xmlWrapper, [new Person(AUTHORS[0])]);
    expect(articleInfo.copyrightStatement).toBe('© 2019, Last name 1');

    articleInfo = new ArticleInformation(xmlWrapper, [new Person(AUTHORS[0]), new Person(AUTHORS[1])]);
    expect(articleInfo.copyrightStatement).toBe('© 2019, Last name 1 and Last name 2');

    articleInfo = new ArticleInformation(xmlWrapper, [
      new Person(AUTHORS[0]),
      new Person(AUTHORS[1]),
      new Person(AUTHORS[2])
    ]);
    expect(articleInfo.copyrightStatement).toBe('© 2019, Last name 1 et al');
  });

  it('creates article info state from XML with CC-BY-4', () => {
    const articleInfo = new ArticleInformation(xmlWrapper, [new Person(AUTHORS[0])]);
    expect(articleInfo).toMatchSnapshot();
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
        <subj-group subj-group-type="major-subject"> <subject>Cell Biology</subject> </subj-group>
        <subj-group subj-group-type="major-subject"> <subject>Genetics and Genomics</subject> </subj-group>
        <permissions>
          <license xlink:href="http://creativecommons.org/publicdomain/zero/1.0/"></license>
        </permissions>
      </article-meta>`;

    const articleInfo = new ArticleInformation(xmlWrapper, [new Person(AUTHORS[0])]);
    expect(articleInfo).toMatchSnapshot();
  });
});
