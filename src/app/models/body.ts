import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { set } from 'lodash';

import * as bodyConfig from './config/body.config';
import { buildInputRules } from './plugins/input-rules';
import { makeSchemaFromConfig } from 'app/models/utils';
import { PlaceholderPlugin } from 'app/models/plugins/placeholder.plugin';
import { createListKeymap } from 'app/utils/prosemirror/list.helpers';
import { SelectionPlugin } from 'app/models/plugins/selection.plugins';

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
      SelectionPlugin,
      dropCursor({ color: '#0078CF', class: 'drop-cursor' }),
      keymap(createListKeymap(schema)),
      keymap(baseKeymap),
      PlaceholderPlugin('Enter main text')
    ]
  });
}
