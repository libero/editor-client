import { EditorState } from 'prosemirror-state';
import { v4 as uuidv4 } from 'uuid';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { gapCursor } from 'prosemirror-gapcursor';
import { history } from 'prosemirror-history';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import * as bioConfig from 'app/models/config/author-bio.config';
import { Affiliation } from 'app/models/affiliation';
import { getTextContentFromPath, makeSchemaFromConfig } from 'app/models/utils';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { SelectPlugin } from 'app/utils/view.utils';

export interface Person {
  readonly id: string;
  firstName: string;
  lastName: string;
  suffix?: string;
  email?: string;
  orcId?: string;
  bio?: EditorState;
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

export function createAuthorsState(authorsXml: Element[]): Person[] {
  return authorsXml.map((author) =>
    createAuthor(author.getAttribute('id'), {
      firstName: getTextContentFromPath(author, 'name > given-names'),
      lastName: getTextContentFromPath(author, 'name > surname'),
      suffix: getTextContentFromPath(author, 'name > suffix'),
      bio: createBioEditorState(author.querySelector('bio')),
      email: getTextContentFromPath(author, 'email'),
      orcId: getTextContentFromPath(author, 'contrib-id[contrib-id-type="orcid"]'),
      affiliations: Array.from(author.querySelectorAll('xref[ref-type="aff"]')).map((xRef) => xRef.getAttribute('rid'))
    })
  );
}

export function createBioEditorState(bio?: Element): EditorState {
  const schema = makeSchemaFromConfig(bioConfig.topNode, bioConfig.nodes, bioConfig.marks);
  return EditorState.create({
    doc: bio ? ProseMirrorDOMParser.fromSchema(schema).parse(bio) : undefined,
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap), history(), SelectPlugin]
  });
}
