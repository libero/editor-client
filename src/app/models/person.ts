import { v4 as uuidv4 } from 'uuid';

export interface Person {
  readonly id: string;
  firstName: string;
  lastName: string;
  suffix?: string;
  email?: string;
  orcId?: string;
}

export function createAuthor(xmlId: string | undefined, author: Omit<Person, 'id'>): Person {
  return {
    ...author,
    id: xmlId || uuidv4()
  };
}

export function getAuthorDisplayName(author: Person): string {
  return [author.firstName, author.lastName, author.suffix].filter((_) => _).join(' ');
}
