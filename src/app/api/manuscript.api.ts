import axios from 'axios';
import {Manuscript} from "../models/manuscript";
import {EditorState} from "prosemirror-state";
import {DOMParser as ProseMirrorDOMParser, Schema} from "prosemirror-model";
import {addListNodes} from "prosemirror-schema-list";
import {schema} from "../components/rich-text-editor/schema-jats";

const { exampleSetup } = require('prosemirror-example-setup');

const manuscriptUrl = (id: string) => `/manuscripts/${id}/manuscript.xml`;

export async function getManuscriptContent(id: string): Promise<Manuscript> {
  const { data } = await axios.get<string>(manuscriptUrl(id));

  const parser = new DOMParser();
  const doc =  parser.parseFromString(data, 'text/xml');

  const title = doc.getElementsByTagName('article-title');

  return {
    title: createEditorState(title[0])
  } as Manuscript;
}

function createEditorState(content: Node) {
  const docSchema = new Schema({
    nodes: addListNodes(schema.spec.nodes as any, 'paragraph block*', 'block'),
    marks: schema.spec.marks
  });

  return EditorState.create({
    doc: content ? ProseMirrorDOMParser.fromSchema(docSchema).parse(content) : undefined,
    schema: docSchema,
    plugins: exampleSetup({ schema: docSchema })
  });

}