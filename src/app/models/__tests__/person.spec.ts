import { createAuthorsState, Person } from 'app/models/person';

jest.mock('uuid', () => ({
  v5: () => 'unique_id',
  v4: () => 'unique_id'
}));

describe('Person model helpers', () => {
  it('creates an author with specified data', () => {
    const xmlData = {
      firstName: 'Test',
      lastName: 'Testerson'
    };

    expect(new Person(xmlData)).toMatchSnapshot();
  });

  it('creates an author with specified data and ID', () => {
    const xmlData = {
      firstName: 'Test',
      lastName: 'Testerson'
    };

    expect(new Person(xmlData)).toMatchSnapshot();
  });

  it('produces author display name with first name last name and suffix', () => {
    const author = {
      id: 'SUPER_UNIQUE',
      firstName: 'Test',
      lastName: 'Testerson',
      suffix: 'Capt.'
    };

    expect(new Person(author).getDisplayName()).toEqual('Test Testerson Capt.');
  });

  it('produces author display even when some details are missing', () => {
    const author = {
      id: 'SUPER_UNIQUE',
      firstName: 'Total',
      lastName: undefined,
      suffix: 'Commander'
    };

    expect(new Person(author).getDisplayName()).toEqual('Total Commander');
  });

  it('creates authors state', () => {
    const authorsContainer = document.createElement('div');
    authorsContainer.innerHTML = `
        <name><surname>Atherden</surname><given-names>Fred</given-names><suffix>Capt.</suffix></name>
        <contrib-id authenticated="true" contrib-id-type="orcid">https://orcid.org/0000-0002-6048-1470</contrib-id>
        <email>f.atherden@elifesciences.org</email>`;

    expect(createAuthorsState([authorsContainer], document.createElement('author-notes'))).toMatchSnapshot();
  });

  it('creates a blank authors', () => {
    expect(new Person()).toMatchSnapshot();
  });

  it('clones author', () => {
    const author1 = new Person();
    const author2 = author1.clone();
    expect(author1).not.toBe(author2);
    expect(author1).toEqual(author2);
  });

  it('creates author from JSON', () => {
    const personJSON = {
      _id: 'author-3888',
      firstName: 'Siu Sylvia',
      lastName: 'Lee',
      isAuthenticated: true,
      orcid: '0000-0001-5225-4203',
      email: 'sylvia.lee@cornell.edu',
      bio: {
        doc: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', marks: [{ type: 'bold' }], text: 'Siu Sylvia Lee' },
                {
                  type: 'text',
                  text:
                    ' is in the Department of Molecular Biology and Genetics, Cornell University, Ithaca, United States'
                }
              ]
            }
          ]
        },
        selection: { type: 'text', anchor: 1, head: 1 }
      },
      isCorrespondingAuthor: true,
      affiliations: ['aff2']
    };

    const author = new Person(personJSON);
    expect(author.id).toMatchSnapshot();
  });

  it('sets competing interests', () => {
    const authorsContainer = document.createElement('div');
    authorsContainer.innerHTML = `
      <name><surname>Atherden</surname><given-names>Fred</given-names><suffix>Capt.</suffix></name>
      <contrib-id authenticated="true" contrib-id-type="orcid">https://orcid.org/0000-0002-6048-1470</contrib-id>
      <xref ref-type="author-notes" rid="con1"/>
      <xref ref-type="aff" rid="aff2">2</xref>
      <email>f.atherden@elifesciences.org</email>`;
    const notesContainer = document.createElement('div');
    notesContainer.innerHTML = `<fn fn-type="COI-statement" id="con1">
              <p>Is an employee of eLife. No other competing interests exist</p>
            </fn>
            <fn fn-type="COI-statement" id="con2">
              <p>No competing interests declared</p>
            </fn>
            <fn fn-type="con" id="equal-contrib1">
              <p>These authors contributed equally to this work</p>
            </fn>`;
    const author = new Person(authorsContainer, notesContainer);
    expect(author.hasCompetingInterest).toBe(true);
    expect(author.competingInterestStatement).toBe('Is an employee of eLife. No other competing interests exist');
  });
});
