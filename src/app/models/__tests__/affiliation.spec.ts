import { Affiliation, createAffiliationsState } from 'app/models/affiliation';

jest.mock('uuid', () => ({
  v4: () => 'unique_id'
}));

describe('Affiliation model helpers', () => {
  it('creates an affiliation with specified data', () => {
    const jsonData = {
      label: 'label',
      institution: {
        name: 'eLife'
      },
      address: {
        city: 'Cambridge'
      },
      country: 'UK'
    };

    expect(new Affiliation(jsonData)).toMatchSnapshot();
  });

  it('creates an affiliation with specified data and ID', () => {
    const jsonData = {
      id: 'SOME_ID',
      label: 'label',
      institution: {
        name: 'eLife'
      },
      address: {
        city: 'Cambridge'
      },
      country: 'UK'
    };

    expect(new Affiliation(jsonData)).toMatchSnapshot();
  });

  it('returns an affilition display name', () => {
    const aff = new Affiliation({
      id: 'SOME_ID',
      label: 'label',
      institution: {
        name: 'eLife'
      },
      address: {
        city: 'Cambridge'
      },
      country: 'UK'
    });
    expect(aff.getDisplayName()).toBe('eLife, Cambridge, UK');
  });

  it('creates affilitioan state from XML', () => {
    const xmlWrapper = document.createElement('div');
    xmlWrapper.innerHTML = `<aff id="aff1">
        <label>1</label>
        <institution content-type="dept">Production Department</institution>
        <institution>eLife Sciences</institution>
        <addr-line><named-content content-type="city">Cambridge</named-content></addr-line>
        <country>United Kingdom</country>
      </aff>
      <aff id="aff2">
        <label>2</label>
        <institution content-type="dept">Department</institution>
        <institution>University</institution>
        <addr-line><named-content content-type="city">City</named-content></addr-line>
        <country>Country</country>
      </aff>`;

    const state = createAffiliationsState(Array.from(xmlWrapper.querySelectorAll('aff')));
    expect(state).toMatchSnapshot();
  });
});
