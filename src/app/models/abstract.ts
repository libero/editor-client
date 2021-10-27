import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { gapCursor } from 'prosemirror-gapcursor';

import { makeSchemaFromConfig } from './utils';
import * as abstractConfig from './config/abstract.config';
import { buildInputRules } from './plugins/input-rules';
import { PlaceholderPlugin } from './plugins/placeholder.plugin';
import { SelectionPlugin } from './plugins/selection.plugins';

export function createAbstractState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), SelectionPlugin, gapCursor(), PlaceholderPlugin('Enter abstract')]
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
    plugins: [buildInputRules(), SelectionPlugin, gapCursor(), PlaceholderPlugin('Enter impact statement')]
  });
}
