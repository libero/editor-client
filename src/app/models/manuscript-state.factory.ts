import {DOMParser as ProseMirrorDOMParser, Schema, SchemaSpec} from "prosemirror-model";
import {EditorState} from "prosemirror-state";
import {pick} from 'lodash';
import {gapCursor} from "prosemirror-gapcursor"
import {dropCursor} from "prosemirror-dropcursor"

import * as titleConfig from './config/title.config';
import {nodes} from "./config/nodes";
import {marks} from "./config/marks";
import {buildInputRules} from "./plugins/input-rules";

export function createTitleState(content: Node) {
  const docSchema = makeSchemaFromConfig(titleConfig.topNode, titleConfig.nodes, titleConfig.marks);

  const xmlContentDocument = document.implementation.createDocument('', '', null)
  if(content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(docSchema).parse(xmlContentDocument),
    schema: docSchema,
    plugins: [
      buildInputRules(docSchema),
      gapCursor(),
      dropCursor()
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