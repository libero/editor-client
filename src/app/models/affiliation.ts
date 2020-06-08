import { v4 as uuidv4 } from 'uuid';

export interface Affiliation {
  readonly id: string;
  label: string;
  institution: {
    name: string;
    department: string;
  };
  address: {
    city: string;
  };
  country: string;
}

export function createAffiliation(xmlId: string, affiliationData?: Omit<Affiliation, 'id'>): Affiliation {
  return {
    ...affiliationData,
    id: xmlId || uuidv4()
  };
}

export function getAffiliationDisplayName(affiliation: Affiliation): string {
  return [
    affiliation.institution.department,
    affiliation.institution.name,
    affiliation.address.city,
    affiliation.country
  ]
    .filter(Boolean)
    .join(', ');
}
