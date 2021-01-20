import { createAuthorsState, Person } from 'app/models/person';

jest.mock('uuid', () => ({
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
});
