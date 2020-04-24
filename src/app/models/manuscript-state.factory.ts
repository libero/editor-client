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
  const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);

  return keywords.reduce((acc, kwdGroup) => {
    const kwdGroupType = kwdGroup.getAttribute('kwd-group-type');
    acc[kwdGroupType] = Array.from(kwdGroup.querySelectorAll('kwd'))
      .map((keyword: Element) => {
        return EditorState.create({
          doc: ProseMirrorDOMParser.fromSchema(schema).parse(keyword),
          schema,
          plugins: [
            buildInputRules(schema),
            gapCursor(),
            dropCursor(),
            keymap(baseKeymap)
          ]
        });
      });

    return acc;
  }, {});
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