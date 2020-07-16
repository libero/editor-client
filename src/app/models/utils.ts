import { pick, get } from 'lodash';
import { Schema, SchemaSpec } from 'prosemirror-model';

import { nodes } from 'app/models/config/nodes';
import { marks } from 'app/models/config/marks';

export function makeSchemaFromConfig(topNode: string, nodeNames: string[], markNames: string[]): Schema {
  const filteredNodes = pick(nodes, nodeNames);
  const filteredMarks = pick(marks, markNames);

  return new Schema({
    nodes: filteredNodes,
    marks: filteredMarks,
    topNode
  } as SchemaSpec<keyof typeof filteredNodes, keyof typeof filteredMarks>);
}

export function getTextContentFromPath(el: ParentNode, path): string {
  return get(el.querySelector(path), 'textContent');
}
