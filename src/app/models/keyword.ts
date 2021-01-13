import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { v4 as uuidv4 } from 'uuid';

import { Keyword, KeywordGroups } from 'app/types/manuscript';
import { makeSchemaFromConfig } from 'app/models/utils';
import * as keywordConfig from 'app/models/config/keywords.config';
import { buildInputRules } from 'app/models/plugins/input-rules';

export function createKeywordGroupsState(keywordGroupsXml: Element[]): KeywordGroups {
  return keywordGroupsXml.reduce((acc, kwdGroup) => {
    const kwdGroupType = kwdGroup.getAttribute('kwd-group-type') || 'keywords-1';
    const groupTitle = kwdGroup.querySelector('title');
    const moreKeywords = Array.from(kwdGroup.querySelectorAll('kwd')).map((keyword, _) => createKeywordState(keyword));
    acc[kwdGroupType] = {
      title: groupTitle ? groupTitle.textContent : undefined,
      keywords: moreKeywords,
      newKeyword: createNewKeywordState()
    };

    return acc;
  }, {});
}

export function createNewKeywordState(): Keyword {
  return createKeywordState();
}

function createKeywordState(keyword?: Element): Keyword {
  const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);

  return {
    id: uuidv4(),
    content: EditorState.create({
      doc: keyword ? ProseMirrorDOMParser.fromSchema(schema).parse(keyword) : undefined,
      schema,
      plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap)]
    })
  };
}
