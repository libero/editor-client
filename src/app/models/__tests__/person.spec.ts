import { createAuthor, getAuthorDisplayName } from 'app/models/person';

describe('Person model helpers', () => {
  it('creates an author with specified data', () => {
    const xmlData = {
      firstName: 'Test',
      lastName: 'Testerson'
    };

    expect(createAuthor(undefined, xmlData)).toEqual({
      id: expect.any(String),
      firstName: 'Test',
      lastName: 'Testerson'
    });
  });

  it('creates an author with specified data and ID', () => {
    const xmlData = {
      firstName: 'Test',
      lastName: 'Testerson'
    };

    expect(createAuthor('ID_FROM_XML', xmlData)).toEqual({
      id: 'ID_FROM_XML',
      firstName: 'Test',
      lastName: 'Testerson'
    });
  });

  it('produces author display name with first name last name and suffix', () => {
    const author = {
      id: 'SUPER_UNIQUE',
      firstName: 'Test',
      lastName: 'Testerson',
      suffix: 'Capt.'
    };

    expect(getAuthorDisplayName(author)).toEqual('Test Testerson Capt.');
  });

  it('produces author display even when some details are missing', () => {
    const author = {
      id: 'SUPER_UNIQUE',
      firstName: 'Total',
      lastName: undefined,
      suffix: 'Commander'
    };

    expect(getAuthorDisplayName(author)).toEqual('Total Commander');
  });
});
