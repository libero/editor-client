import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';

import { makeSchemaFromConfig } from 'app/models/utils';
import * as keywordConfig from 'app/models/config/keywords.config';
import { buildInputRules } from 'app/models/plugins/input-rules';
import { BackmatterEntity } from 'app/models/backmatter-entity';
import { JSONObject } from 'app/types/utility.types';
import { SelectionPlugin } from 'app/models/plugins/selection.plugins';

export class Keyword extends BackmatterEntity {
  content: EditorState;

  constructor(data?: JSONObject | Element | EditorState) {
    super();
    if (data instanceof EditorState) {
      this.content = data;
    } else {
      this.createEntity(data);
    }
  }

  public clone(): Keyword {
    const kwd = new Keyword();
    kwd._id = this.id;
    kwd.content = this.content.apply(this.content.tr);
    return kwd;
  }

  protected fromXML(xmlNode: Element): void {
    const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);
    this.content = EditorState.create({
      doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlNode),
      schema,
      plugins: [buildInputRules(), SelectionPlugin, gapCursor(), dropCursor(), keymap(baseKeymap)]
    });
  }

  protected fromJSON(json: JSONObject): void {
    this._id = (json._id as string) || this._id;
    const blankState = this.createEmptyEditorState();
    this.content = EditorState.fromJSON(
      { schema: blankState.schema, plugins: blankState.schema.plugins },
      json.content as JSONObject
    );
  }

  protected createBlank(): void {
    this.content = this.createEmptyEditorState();
  }

  private createEmptyEditorState(): EditorState {
    const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);
    return EditorState.create({
      doc: undefined,
      schema,
      plugins: [buildInputRules(), SelectionPlugin, gapCursor(), dropCursor(), keymap(baseKeymap)]
    });
  }
}

export interface KeywordGroup {
  title: string | undefined;
  keywords: Keyword[];
  newKeyword: Keyword;
}

export interface KeywordGroups {
  [keywordType: string]: KeywordGroup;
}

export function createKeywordGroupsState(keywordGroupsXml: Element[]): KeywordGroups {
  return keywordGroupsXml.reduce((acc, kwdGroup) => {
    const kwdGroupType = kwdGroup.getAttribute('kwd-group-type') || 'keywords-1';
    const groupTitle = kwdGroup.querySelector('title');
    const moreKeywords = Array.from(kwdGroup.querySelectorAll('kwd')).map(
      (keywordEl: Element, _) => new Keyword(keywordEl)
    );
    acc[kwdGroupType] = {
      title: groupTitle ? groupTitle.textContent : undefined,
      keywords: moreKeywords,
      newKeyword: new Keyword()
    };

    return acc;
  }, {});
}
