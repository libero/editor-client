import { Affiliation, createAffiliation } from 'app/models/affiliation';

describe('Affiliation model helpers', () => {
  it('creates an affiliation with specified data', () => {
    const xmlData: Omit<Affiliation, 'id'> = {
      label: 'label',
      institution: {
        name: 'eLife'
      },
      address: {
        city: 'Cambridge'
      },
      country: 'UK'
    };

    expect(createAffiliation(undefined, xmlData)).toEqual({
      ...xmlData,
      id: expect.any(String)
    });
  });

  it('creates an affiliation with specified data and ID', () => {
    const xmlData: Omit<Affiliation, 'id'> = {
      label: 'label',
      institution: {
        name: 'eLife'
      },
      address: {
        city: 'Cambridge'
      },
      country: 'UK'
    };

    expect(createAffiliation('ID_FROM_XML', xmlData)).toEqual({
      ...xmlData,
      id: 'ID_FROM_XML'
    });
  });
});
