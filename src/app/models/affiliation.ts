import { v4 as uuidv4 } from 'uuid';
import {getTextContentFromPath} from "app/models/utils";

export interface Affiliation {
  readonly id: string;
  label: string;
  institution: {
    name: string;
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
  return [affiliation.institution.name, affiliation.address.city, affiliation.country].filter(Boolean).join(', ');
}

export function createAffiliationsState(affiliations: Element[]): Affiliation[] {
  return affiliations.map((aff) => {
    return createAffiliation(aff.getAttribute('id'), {
      label: getTextContentFromPath(aff, 'label'),
      institution: {
        name: [
          getTextContentFromPath(aff, 'institution[content-type="dept"]'),
          getTextContentFromPath(aff, 'institution:not([content-type])')
        ]
          .filter(Boolean)
          .join(', ')
      },
      address: {
        city: getTextContentFromPath(aff, 'addr-line named-content[content-type="city"]')
      },
      country: getTextContentFromPath(aff, 'country')
    });
  });
}