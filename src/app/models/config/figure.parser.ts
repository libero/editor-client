import { Schema, DOMParser as ProseMirrorDOMParser, Node as ProsemirrorNode, Fragment } from 'prosemirror-model';

const MISSING_NODES_SELECTORS_MAP = {
  figureTitle: 'caption > title',
  figureLegend: 'caption > p',
  figureAttribution: 'attrib'
};

export function parseFigure(dom: Element, schema: Schema): Fragment {
  const figureContent = ProseMirrorDOMParser.fromSchema(schema).parseSlice(dom).content;
  const missingNodes = Object.entries(MISSING_NODES_SELECTORS_MAP).reduce((acc, nodeEntry) => {
    const [nodeName, selector] = nodeEntry;
    if (!dom.querySelector(selector)) {
      acc.push(schema.nodes[nodeName].createAndFill(null, schema.text(' ')));
    }
    return acc;
  }, [] as ProsemirrorNode[]);
  const content = figureContent.append(Fragment.fromArray(missingNodes));
  return content;
}
