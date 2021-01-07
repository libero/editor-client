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
import { ManuscriptChangeJSON } from 'app/types/changes.types';

export interface Person {
  readonly id: string;
  firstName: string;
  lastName: string;
  suffix?: string;
  isAuthenticated?: boolean;
  orcid?: string;
  email?: string;
  bio?: EditorState;
  isCorrespondingAuthor?: boolean;
  affiliations?: string[];
  hasCompetingInterest?: boolean;
  competingInterestStatement?: string;
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

export function createAuthorsState(authorsXml: Element[], notesXml: Element | undefined): Person[] {
  return authorsXml.map((author) => {
    const competingInterest = getCompetingInterest(author, notesXml);

    const orcidEl = author.querySelector('contrib-id[contrib-id-type="orcid"]');

    return createAuthor(author.getAttribute('id'), {
      firstName: getTextContentFromPath(author, 'name > given-names'),
      lastName: getTextContentFromPath(author, 'name > surname'),
      suffix: getTextContentFromPath(author, 'name > suffix'),
      isAuthenticated: orcidEl ? orcidEl.getAttribute('authenticated') === 'true' : false,
      orcid: orcidEl ? getOrcid(orcidEl.textContent) : '',
      bio: createBioEditorState(author.querySelector('bio')),
      email: getTextContentFromPath(author, 'email'),
      isCorrespondingAuthor: author.getAttribute('corresp') === 'yes',
      affiliations: Array.from(author.querySelectorAll('xref[ref-type="aff"]')).map((xRef) => xRef.getAttribute('rid')),
      hasCompetingInterest: Boolean(competingInterest)
        ? competingInterest !== 'No competing interests declared'
        : undefined,
      competingInterestStatement: competingInterest
    });
  });
}

export function createBioEditorState(bio?: Element): EditorState {
  const schema = makeSchemaFromConfig(bioConfig.topNode, bioConfig.nodes, bioConfig.marks);
  return EditorState.create({
    doc: bio ? ProseMirrorDOMParser.fromSchema(schema).parse(bio) : undefined,
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap), history()]
  });
}

export function applyAuthorsChanges(authors: Person[], changes: Array<ManuscriptChangeJSON>): Person[] {
  return changes.reduce((authorsList: Person[], change: ManuscriptChangeJSON) => {
    if (Array.isArray(change.object)) {
      return deserealizeChange(change) as Person[];
    }
    const index = parseInt(change.path.split('.')[1]);
    authorsList[index] = deserealizeChange(change) as Person;
    return authorsList;
  }, authors);
}

function getCompetingInterest(author: Element, notesXml: Element | undefined): string {
  if (notesXml) {
    const getCompetingInterestsXml = (authorEl: Element): Element => {
      return Array.from(notesXml.querySelectorAll('[fn-type="COI-statement"]')).find((fnEl: Element) => {
        const id = fnEl.getAttribute('id');
        return authorEl.querySelector(`xref[ref-type="fn"][rid="${id}"]`);
      });
    };
    const competingInterestsXml = getCompetingInterestsXml(author);
    return competingInterestsXml ? competingInterestsXml.textContent.trim() : '';
  }
  return '';
}

function deserealizeChange(change: ManuscriptChangeJSON): Person | Person[] {
  const deserializeOne = (obj): Person => {
    const emptyBioEditorState = createBioEditorState();
    const bioEditorState = EditorState.fromJSON(
      {
        schema: emptyBioEditorState.schema,
        plugins: emptyBioEditorState.plugins
      },
      obj.bio
    );
    return {
      ...obj,
      bio: bioEditorState
    };
  };

  return Array.isArray(change.object)
    ? (change.object as Array<unknown>).map(deserializeOne)
    : deserializeOne(change.object);
}

function getOrcid(orcidUrl: string): string {
  const matches = orcidUrl.match(/(([0-9]{4}-?){4})/g);
  if (matches) {
    return matches[0];
  }

  return '';
}
