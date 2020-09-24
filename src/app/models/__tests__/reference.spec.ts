import { createEmptyRefInfoByType, createReference, Reference, sortReferencesList } from 'app/models/reference';
import { set } from 'lodash';

describe('Reference model', () => {
  it('creates journal reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2012">2012</year>
        <article-title>Assembly principles of <italic>Vibrio cholerae</italic> biofilms</article-title>
        <source>Science</source>
        <volume>337</volume>
        <fpage>236</fpage>
        <lpage>239</lpage>`,
      'journal'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates book reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2010">2010</year>
        <source>Against Method</source>
        <edition>4th Edition</edition>
        <publisher-loc>London</publisher-loc>
        <publisher-name>Verso</publisher-name>
        <pub-id pub-id-type="isbn">978-1844674428</pub-id>`,
      'book'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates periodical reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <string-date><month>September</month> <day>9</day>, <year iso-8601-date="1993-09-09">1993</year></string-date>
        <article-title>Obesity affects economic, social status</article-title>
        <source>The Washington Post</source>
        <fpage>1</fpage>
        <lpage>4</lpage>`,
      'periodical'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates report reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2015">2015</year>
        <source>World Malaria Report 2015</source>
        <publisher-loc>Geneva</publisher-loc>
        <publisher-name>World Health Organization</publisher-name>
        <ext-link ext-link-type="uri" xlink:href="http://www.who.int/malaria/publications/world-malaria-report-2015/en/">http://www.who.int/malaria/publications/world-malaria-report-2015/en/</ext-link>
      `,
      'report'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates report reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2015">2015</year>
        <source>World Malaria Report 2015</source>
        <publisher-loc>Geneva</publisher-loc>
        <publisher-name>World Health Organization</publisher-name>
        <ext-link ext-link-type="uri" xlink:href="http://www.who.int/malaria/publications/world-malaria-report-2015/en/">http://www.who.int/malaria/publications/world-malaria-report-2015/en/</ext-link>
      `,
      'report'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates data reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2014">2014</year>
        <data-title>Mus musculus T-box 2 (Tbx2), mRNA</data-title>
        <source>NCBI Nucleotide</source>
        <pub-id pub-id-type="accession" assigning-authority="NCBI" xlink:href="http://www.ncbi.nlm.nih.gov/nuccore/120407038">NM_009324</pub-id>
        <version designator="NM_009324.2">NM_009324.2</version>`,
      'data'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates web reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2019">2019</year>
        <article-title>James Watson had a chance to salvage his reputation on race. He made things worse</article-title>
        <source>The New York Times</source>
        <ext-link ext-link-type="uri" xlink:href="https://www.nytimes.com/2019/01/01/science/watson-dna-genetics-race.html">https://www.nytimes.com/2019/01/01/science/watson-dna-genetics-race.html</ext-link>
        <date-in-citation iso-8601-date="2019-01-01">January 1, 2019</date-in-citation>`,
      'web'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates preprint reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2019">2019</year>
        <article-title>Gender and international diversity improves equity in peer review</article-title>
        <source>bioRxiv</source>
        <pub-id pub-id-type="doi">10.1101/400515</pub-id>`,
      'preprint'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates software reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2014">2014</year>
        <data-title>R: A Language and Environment for Statistical Computing</data-title>
        <publisher-loc>Vienna, Austria</publisher-loc>
        <publisher-name>R Foundation for Statistical Computing</publisher-name>
        <ext-link ext-link-type="uri" xlink:href="http://www.R-project.org/">http://www.R-project.org/</ext-link>`,
      'software'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates conference reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2014">2014</year>
        <article-title>Automated hypothesis generation based on mining scientific literature</article-title>
        <conf-name>Proceedings of the 20th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining</conf-name>
        <fpage>1877</fpage>
        <lpage>1886</lpage>
        <pub-id pub-id-type="doi">10.1145/2623330.2623667</pub-id>`,
      'confproc'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates thesis reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2014">2014</year>
        <article-title>Automated hypothesis generation based on mining scientific literature</article-title>
        <publisher-loc>Vienna, Austria</publisher-loc>
        <publisher-name>R Foundation for Statistical Computing</publisher-name>
        <conf-name>Proceedings of the 20th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining</conf-name>
        <ext-link ext-link-type="uri" xlink:href="http://www.R-project.org/">http://www.R-project.org/</ext-link>
        <pub-id pub-id-type="doi">10.7554/eLife.42697</pub-id>
        <pub-id pub-id-type="pmid">31038122</pub-id>`,
      'thesis'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('creates patent reference', () => {
    const el = document.createElement('p');
    el.innerHTML = givenReferenceXml(
      `
        <year iso-8601-date="2015">2015</year>
        <article-title>Imidazopyridine Derivative</article-title>
        <source>World Intellectual Property Organization</source>
        <patent country="Japan">2015087996</patent>
        <ext-link ext-link-type="uri" xlink:href="https://patents.google.com/patent/WO2015087996A1/en">https://patents.google.com/patent/WO2015087996A1/en</ext-link>`,
      'patent'
    );
    expect(createReference('id', el.querySelector('element-citation'))).toMatchSnapshot();
  });

  it('should sort references list', () => {
    const refs: Reference[] = [
      { id: '', type: 'web', authors: [{ groupName: 'Berk' }], referenceInfo: createEmptyRefInfoByType('web') },
      { id: '', type: 'web', authors: [{ groupName: 'Twerk' }], referenceInfo: createEmptyRefInfoByType('web') },
      { id: '', type: 'web', authors: [{ groupName: 'Schwerk' }], referenceInfo: createEmptyRefInfoByType('web') },
      { id: '', type: 'web', authors: [{ groupName: 'Berk' }], referenceInfo: createEmptyRefInfoByType('web') }
    ];

    set(refs[0], 'referenceInfo.year', '2009');
    set(refs[1], 'referenceInfo.year', '2001');
    set(refs[2], 'referenceInfo.year', '2011');
    set(refs[3], 'referenceInfo.year', '2007');

    const sortedList = [...refs];
    sortReferencesList(sortedList);
    expect(sortedList).toEqual([refs[3], refs[0], refs[2], refs[1]]);
  });
});

function givenReferenceXml(referenceData: string, type: string): string {
  return `
    <element-citation publication-type="${type}">
      <person-group person-group-type="author">
          <name>
            <surname>Berk</surname>
            <given-names>V</given-names>
          </name>
          <collab>R Development Core Team</collab>  
      </person-group>
      ${referenceData}
    </element-citation>
  `;
}
