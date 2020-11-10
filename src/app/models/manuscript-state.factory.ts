import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { set } from 'lodash';

import * as titleConfig from './config/title.config';
import * as keywordConfig from './config/keywords.config';
import * as abstractConfig from './config/abstract.config';
import * as bodyConfig from './config/body.config';
import * as acknowledgementsConfig from './config/acknowledgements.config';

import { buildInputRules } from './plugins/input-rules';
import { KeywordGroups } from './manuscript';
import { createReference, Reference, sortReferencesList } from 'app/models/reference';
import { makeSchemaFromConfig } from 'app/models/utils';
import { SelectPlugin } from './plugins/selection.plugin';
import { PlaceholderPlugin } from 'app/models/plugins/placeholder.plugin';
import { createListKeymap } from 'app/utils/prosemirror/list.helpers';
import { collab } from 'prosemirror-collab';

export function createTitleState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(titleConfig.topNode, titleConfig.nodes, titleConfig.marks);

  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), SelectPlugin, PlaceholderPlugin('Enter title'), collab()]
  });
}

export function createAbstractState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), SelectPlugin, PlaceholderPlugin('Enter abstract'), collab()]
  });
}

export function createBodyState(content: Element, id: string): EditorState {
  const schema = makeSchemaFromConfig(bodyConfig.topNode, bodyConfig.nodes, bodyConfig.marks);
  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  set(xmlContentDocument, 'manuscriptPath', `/manuscripts/${id}`);

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [
      buildInputRules(),
      gapCursor(),
      dropCursor(),
      keymap(createListKeymap(schema)),
      keymap(baseKeymap),
      SelectPlugin,
      PlaceholderPlugin('Enter main text'),
      collab()
    ]
  });
}

export function createImpactStatementState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), SelectPlugin, PlaceholderPlugin('Enter impact statement')]
  });
}

export function createAcknowledgementsState(content?: Element): EditorState {
  if (content) {
    const ackTitle = content.querySelector('title');
    if (ackTitle) {
      content.removeChild(ackTitle);
    }
  }

  const schema = makeSchemaFromConfig(
    acknowledgementsConfig.topNode,
    acknowledgementsConfig.nodes,
    acknowledgementsConfig.marks
  );
  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), SelectPlugin, PlaceholderPlugin('Enter acknowledgements'), collab()]
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
  const referencesList = referencesXml.map((referenceXml: Element) => {
    const id = (referenceXml.parentNode as Element).getAttribute('id');
    return createReference(id, referenceXml);
  });
  sortReferencesList(referencesList);
  return referencesList;
}

function createKeywordState(keyword?: Element): EditorState {
  const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);
  return EditorState.create({
    doc: keyword ? ProseMirrorDOMParser.fromSchema(schema).parse(keyword) : undefined,
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap), collab()]
  });
}
