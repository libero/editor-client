import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { gapCursor } from 'prosemirror-gapcursor';

import * as titleConfig from './config/title.config';
import { buildInputRules } from './plugins/input-rules';
import { makeSchemaFromConfig } from 'app/models/utils';
import { PlaceholderPlugin } from 'app/models/plugins/placeholder.plugin';

export function createTitleState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(titleConfig.topNode, titleConfig.nodes, titleConfig.marks);

  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), PlaceholderPlugin('Enter title')]
  });
}
