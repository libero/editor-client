import { DOMParser as ProseMirrorDOMParser, Schema, SchemaSpec } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { pick, get } from 'lodash';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { v4 as uuidv4 } from 'uuid';

import { baseKeymap } from 'prosemirror-commands';
import * as titleConfig from './config/title.config';
import * as keywordConfig from './config/keywords.config';
import * as abstractConfig from './config/abstract.config';
import { nodes } from './config/nodes';
import { marks } from './config/marks';
import { buildInputRules } from './plugins/input-rules';
import { KeywordGroups, Person } from './manuscript';

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
  return authorsXml.map((author) => ({
    _id: uuidv4(),
    firstName: getTextContentFromPath(author, 'name > given-names'),
    lastName: getTextContentFromPath(author, 'name > surname'),
    suffix: getTextContentFromPath(author, 'name > suffix'),
    email: getTextContentFromPath(author, 'email'),
    orcId: getTextContentFromPath(author, 'contrib-id[contrib-id-type="orcid"]')
  }));
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

function createKeywordState(keyword?: Element): EditorState {
  const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);
  return EditorState.create({
    doc: keyword ? ProseMirrorDOMParser.fromSchema(schema).parse(keyword) : undefined,
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap)]
  });
}

function makeSchemaFromConfig(topNode: string, nodeNames: string[], markNames: string[]): Schema {
  const filteredNodes = pick(nodes, nodeNames);
  const filteredMarks = pick(marks, markNames);

  return new Schema({
    nodes: filteredNodes,
    marks: filteredMarks,
    topNode
  } as SchemaSpec<keyof typeof filteredNodes, keyof typeof filteredMarks>);
}

function getTextContentFromPath(el: Element, path): string {
  return get(el.querySelector(path), 'textContent');
}
