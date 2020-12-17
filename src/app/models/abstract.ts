import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { gapCursor } from 'prosemirror-gapcursor';

import { makeSchemaFromConfig } from 'app/models/utils';
import * as abstractConfig from 'app/models/config/abstract.config';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { PlaceholderPlugin } from 'app/models/plugins/placeholder.plugin';

export function createAbstractState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), PlaceholderPlugin('Enter abstract')]
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
    plugins: [buildInputRules(), gapCursor(), PlaceholderPlugin('Enter impact statement')]
  });
}
