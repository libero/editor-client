import {DOMParser as ProseMirrorDOMParser, Schema, SchemaSpec} from "prosemirror-model";
import {EditorState} from "prosemirror-state";
import {pick} from 'lodash';
import {gapCursor} from "prosemirror-gapcursor"
import {dropCursor} from "prosemirror-dropcursor";
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"

import * as titleConfig from './config/title.config';
import * as keywordConfig from './config/keywords.config';
import {nodes} from "./config/nodes";
import {marks} from "./config/marks";
import {buildInputRules} from "./plugins/input-rules";

export function createTitleState(content: Node) {
  const schema = makeSchemaFromConfig(undefined, titleConfig.nodes, titleConfig.marks);

  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if(content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [
      buildInputRules(schema),
      gapCursor(),
      dropCursor()
    ]
  });
}

export function createKeywordsState(keywords: Element[]) {
  return keywords.reduce((acc, kwdGroup) => {
    const kwdGroupType = kwdGroup.getAttribute('kwd-group-type') || 'keywords-1';
    const moreKeywords = Array.from(kwdGroup.querySelectorAll('kwd'))
      .map(createKeywordState)
    acc[kwdGroupType] = (acc[kwdGroupType] || []).contact(moreKeywords);
    return acc;
  }, {});
}

export function createNewKeywordState() {
  return createKeywordState();
}

function createKeywordState(keyword?: Element) {
  const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);
  return EditorState.create({
    doc: keyword ? ProseMirrorDOMParser.fromSchema(schema).parse(keyword) : undefined,
    schema,
    plugins: [
      buildInputRules(schema),
      gapCursor(),
      dropCursor(),
      keymap(baseKeymap)
    ]
  });
}

function makeSchemaFromConfig(topNode: string, nodeNames: string[], markNames: string[]) {
  const filteredNodes = pick(nodes, nodeNames);
  const filteredMarks = pick(marks, markNames);

  return new Schema({
    nodes: filteredNodes,
    marks: filteredMarks,
    topNode
  } as SchemaSpec<keyof typeof filteredNodes, keyof typeof filteredMarks>);
}