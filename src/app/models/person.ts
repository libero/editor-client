import { v4 as uuidv4 } from 'uuid';
import { Affiliation } from 'app/models/affiliation';

export interface Person {
  readonly id: string;
  firstName: string;
  lastName: string;
  suffix?: string;
  email?: string;
  orcId?: string;
  affiliations?: string[];
}

export function createAuthor(xmlId: string | undefined, author: Omit<Person, 'id'>): Person {
  return {
    ...author,
    affiliations: author.affiliations || [],
    id: xmlId || uuidv4()
  };
}

export function getAuthorDisplayName(author: Person): string {
  return [author.firstName, author.lastName, author.suffix].filter((_) => _).join(' ');
}

export function getAuthorAffiliationsLabels(author: Person, affiliations: Affiliation[]): string[] {
  return author.affiliations
    .map((affiliationId) => {
      const affiliation = affiliations.find(({ id }) => id === affiliationId);
      return affiliation ? affiliation.label : undefined;
    })
    .filter(Boolean)
    .sort((a, b) => Number(a) - Number(b));
}
