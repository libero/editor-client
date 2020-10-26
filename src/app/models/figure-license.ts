import { EditorState } from 'prosemirror-state';
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import { getTextContentFromPath, makeSchemaFromConfig } from 'app/models/utils';
import * as figureLicenseConfig from 'app/models/config/figure-license.config';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { createListKeymap } from 'app/utils/prosemirror/list.helpers';
import { SelectPlugin } from 'app/models/plugins/selection.plugin';
import { PlaceholderPlugin } from 'app/models/plugins/placeholder.plugin';

export interface FigureLicense {
  copyrightHolder: string;
  copyrightStatement: string;
  copyrightYear: string;
  license: EditorState;
}

export function createFigureLicenseState(el: Element): FigureLicense {
  return {
    copyrightHolder: getTextContentFromPath(el, 'copyright-statement'),
    copyrightStatement: getTextContentFromPath(el, 'copyright-statement'),
    copyrightYear: getTextContentFromPath(el, 'copyright-year'),
    license: createLicenseState(el.querySelector('license-p'))
  };
}

function createLicenseState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(
    figureLicenseConfig.topNode,
    figureLicenseConfig.nodes,
    figureLicenseConfig.marks
  );
  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

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
      PlaceholderPlugin('Enter main text')
    ]
  });
}
