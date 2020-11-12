import { DOMParser as ProseMirrorDOMParser, Schema } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { set } from 'lodash';

import * as titleConfig from './config/title.config';
import * as keywordConfig from './config/keywords.config';
import * as abstractConfig from './config/abstract.config';
import * as bodyConfig from './config/body.config';
import * as acknowledgementsConfig from './config/acknowledgements.config';

import { buildInputRules } from './plugins/input-rules';
import { KeywordGroups } from './manuscript';
import { createReference, Reference, sortReferencesList } from 'app/models/reference';
import { makeSchemaFromConfig } from 'app/models/utils';
import { SelectPlugin } from './plugins/selection.plugin';
import { PlaceholderPlugin } from 'app/models/plugins/placeholder.plugin';
import { createListKeymap } from 'app/utils/prosemirror/list.helpers';

export function createTitleState(content: Element, changeSteps?: [Step]): EditorState {
  const schema = makeSchemaFromConfig(titleConfig.topNode, titleConfig.nodes, titleConfig.marks);

  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  const editorState = EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), SelectPlugin, PlaceholderPlugin('Enter title')]
  });

  return applyStepsToEditor(editorState, schema, changeSteps);
}

export function createAbstractState(content: Element, changeSteps?: [Step]): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  const editorState =  EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), SelectPlugin, PlaceholderPlugin('Enter abstract')]
  });

  return applyStepsToEditor(editorState, schema, changeSteps);
}

export function createBodyState(content: Element, id: string, changeSteps?: [Step]): EditorState {
  const schema = makeSchemaFromConfig(bodyConfig.topNode, bodyConfig.nodes, bodyConfig.marks);
  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  set(xmlContentDocument, 'manuscriptPath', `/manuscripts/${id}`);

  const editorState = EditorState.create({
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

  return applyStepsToEditor(editorState, schema, changeSteps);
}

export function createImpactStatementState(content: Element, changeSteps?:[Step]): EditorState {
  const schema = makeSchemaFromConfig(abstractConfig.topNode, abstractConfig.nodes, abstractConfig.marks);
  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  const editorState = EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), SelectPlugin, PlaceholderPlugin('Enter impact statement')]
  });

  return applyStepsToEditor(editorState, schema, changeSteps);
}

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

  const editorState = EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), SelectPlugin, PlaceholderPlugin('Enter acknowledgements')]
  });

  return applyStepsToEditor(editorState, schema, changeSteps);
}

export function createKeywordGroupsState(keywordGroupsXml: Element[]): KeywordGroups {
  return keywordGroupsXml.reduce((acc, kwdGroup) => {
    const kwdGroupType = kwdGroup.getAttribute('kwd-group-type') || 'keywords-1';
    const groupTitle = kwdGroup.querySelector('title');
    // TODO: How do we pass changeSteps to this?
    const moreKeywords = Array.from(kwdGroup.querySelectorAll('kwd')).map((keyword, _) => createKeywordState(keyword));
    acc[kwdGroupType] = {
      title: groupTitle ? groupTitle.textContent : undefined,
      keywords: moreKeywords,
      newKeyword: createNewKeywordState()
    };

    return acc;
  }, {});
}

export function createNewKeywordState(): EditorState {
  return createKeywordState();
}

export function createReferencesState(referencesXml: Element[]): Reference[] {
  const referencesList = referencesXml.map((referenceXml: Element) => {
    const id = (referenceXml.parentNode as Element).getAttribute('id');
    return createReference(id, referenceXml);
  });
  sortReferencesList(referencesList);
  return referencesList;
}

function applyStepsToEditor(editorState: EditorState, schema: Schema, changeSteps?: [Step]) {
  if(changeSteps) {
    const changeTransaction = editorState.tr;

    changeSteps.forEach(changeStep => {
      changeTransaction.maybeStep(Step.fromJSON(schema, changeStep));
    });    
    return editorState.apply(changeTransaction);
  }

  return editorState;
}

function createKeywordState(keyword?: Element, changeSteps?:[Step]): EditorState {
  const schema = makeSchemaFromConfig(keywordConfig.topNode, keywordConfig.nodes, keywordConfig.marks);
  const editorState = EditorState.create({
    doc: keyword ? ProseMirrorDOMParser.fromSchema(schema).parse(keyword) : undefined,
    schema,
    plugins: [buildInputRules(), gapCursor(), dropCursor(), keymap(baseKeymap)]
  });

  return applyStepsToEditor(editorState, schema, changeSteps);
}
