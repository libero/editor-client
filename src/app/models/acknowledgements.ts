import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { gapCursor } from 'prosemirror-gapcursor';

import * as acknowledgementsConfig from './config/acknowledgements.config';
import { buildInputRules } from './plugins/input-rules';
import { makeSchemaFromConfig } from 'app/models/utils';
import { PlaceholderPlugin } from 'app/models/plugins/placeholder.plugin';

export function createAcknowledgementsState(content?: Element, changeSteps?: [Step]): EditorState {
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
    plugins: [buildInputRules(), gapCursor(), PlaceholderPlugin('Enter acknowledgements')]
  });
}
