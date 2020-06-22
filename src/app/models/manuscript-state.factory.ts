import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';

import { baseKeymap } from 'prosemirror-commands';
import * as titleConfig from './config/title.config';
import * as keywordConfig from './config/keywords.config';
import * as abstractConfig from './config/abstract.config';

import { buildInputRules } from './plugins/input-rules';
import { KeywordGroups } from './manuscript';
import { createAuthor, Person } from './person';
import { Affiliation, createAffiliation } from 'app/models/affiliation';
import { createReference, Reference } from 'app/models/reference';
import { getTextContentFromPath, makeSchemaFromConfig } from 'app/models/utils';

export function createTitleState(content: Node): EditorState {
  const schema = makeSchemaFromConfig(titleConfig.topNode, titleConfig.nodes, titleConfig.marks);

  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor()]
  });
}

export function createAuthorsState(authorsXml: Element[]): Person[] {
  return authorsXml.map((author) =>
    createAuthor(author.getAttribute('id'), {
      firstName: getTextContentFromPath(author, 'name > given-names'),
      lastName: getTextContentFromPath(author, 'name > surname'),
      suffix: getTextContentFromPath(author, 'name > suffix'),
      email: getTextContentFromPath(author, 'email'),
      orcId: getTextContentFromPath(author, 'contrib-id[contrib-id-type="orcid"]'),
      affiliations: Array.from(author.querySelectorAll('xref[ref-type="aff"]')).map((xRef) => xRef.getAttribute('rid'))
    })
  );
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

export function createAbstractState(content: Node): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);

  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor()]
  });
}

export function createKeywordGroupsState(keywordGroupsXml: Element[]): KeywordGroups {
  return keywordGroupsXml.reduce((acc, kwdGroup) => {
    const kwdGroupType = kwdGroup.getAttribute('kwd-group-type') || 'keywords-1';
    const groupTitle = kwdGroup.querySelector('title');
    const moreKeywords = Array.from(kwdGroup.querySelectorAll('kwd')).map(createKeywordState);
    acc[kwdGroupType] = {
      title: groupTitle ? groupTitle.textContent : undefined,
      keywords: moreKeywords,
      newKeyword: createNewKeywordState()
    };

    return acc;
  }, {});
}

export function createNewKeywordState(): EditorState {
  return createKeywordState();
}

export function createReferencesState(referencesXml: Element[]): Reference[] {
  return referencesXml.map((referenceXml: Element) => {
    const id = (referenceXml.parentNode as Element).getAttribute('id');
    return createReference(id, referenceXml);
  });
}

function createKeywordState(keyword?: Element): EditorState {
  const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);
  return EditorState.create({
    doc: keyword ? ProseMirrorDOMParser.fromSchema(schema).parse(keyword) : undefined,
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap)]
  });
}
