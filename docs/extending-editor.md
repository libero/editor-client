# Extending Editor

This document details how to extend `libero-editor` to support a new fragment of XML. While it focuses on the example of **adding** a new section, alternatively the steps can be reversed to **remove** an existing section from the editor if it is not required for your own specific setup.

The following is a summary of what is needed to add an new editable XML section to `libero-editor`

1. [Data Model](#data-model) - Adding the property to the `Manuscript` model and creating a new model class / factory function for the section to be added.
2. [XML Parsing]() - Extracting the data from the XML file to populate the property on `Manuscript` with an instance of the new data model.
3. [UI Component]() - Adding the UI component used to update the section to the `<ManuscriptEditor/>`.
4. [State Management]() - Creating the reducer to update the redux state store.

For this example we will be adding an `extraInfo` section to the bottom of editor which will make the dummy XML tag `<extra-info/>` editable. `extraInfo` will need to be an editable rich text field which supports **bold**, *italic*, <sub>subscript</sub> and <sup>superscript</sup> text formatting (similar to `body` but without support for figures, boxes ect.). 

**Note** - we're using a simple editable text section in this example, see the [architecture docs](./architecture.md) for info on `BackmatterEntity` if you require a new modal editable section similar to the authors or references section.

## <a name="data-model"></a>Data Model

The type definition for `Manuscript` can be found [here](../src/app/types/manuscript.ts)

Being a rich text field we will add the `extraInfo` property to type `Manuscript` with the type of `EditorState`.

```
export type Manuscript = {
  ...
  extraInfo: EditorState;
};
```
(**Note** - This will produce typescript errors if dev server is running)

Next we need to create a new function which when given the content of `<extra-info/>` as an `Element` will return a ProseMirror `EditorState` object with that content in a format the ProseMirror editor can display and create changes for.

**Note** - for simple `EditorState` properties, we can create a  factory function to generate the `EditorState` object. For more complex `BackmatterEntity` properties (ie: affiliations, authors, references) we would want to create a new class extending the [`BackmatterEntity`](../src/app/models/backmatter-entity.ts) abstract. This is due to `EditorState` already implementing its own interfaces & implementations for `fromXML` and `fromJSON`.

Our new `createExtraInfoState` factory function should live in a file within the `src/app/models` directory. `extra-info.ts` may look something like this:

```
import { DOMParser as ProseMirrorDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { gapCursor } from 'prosemirror-gapcursor';

import * as extraInfoConfig from './config/extraInfo.config';
import { buildInputRules } from './plugins/input-rules';
import { makeSchemaFromConfig } from 'app/models/utils';
import { SelectionPlugin } from 'app/models/plugins/selection.plugins';

export function createExtraInfoState(content: Element): EditorState {
  const schema = makeSchemaFromConfig(extraInfoConfig.topNode, extraInfoConfig.nodes, extraInfoConfig.marks);

  const xmlContentDocument = document.implementation.createDocument('', '', null);

  if (content) {
    xmlContentDocument.appendChild(content);
  }

  return EditorState.create({
    doc: ProseMirrorDOMParser.fromSchema(schema).parse(xmlContentDocument),
    schema,
    plugins: [buildInputRules(), SelectionPlugin, gapCursor()]
  });
}
```

We'll also want to create a config file for storing the individual `topNode`, `nodes` and `marks` schema configuration options. This should exist within `src/app/models/config` with a name of `extraInfo.config.ts` and probably look something like this: 

```
export const marks = ['italic', 'bold', 'subscript', 'superscript'];
export const nodes = ['doc', 'text'];
export const topNode = 'doc';
```

See Prosemirror docs for more info on [`Schema`](https://prosemirror.net/docs/ref/#model.Schema) and [`SchemaSpec`](https://prosemirror.net/docs/ref/#model.SchemaSpec)

In this example there are some basic plugins on the `EditorState`. 

```
  ...
  plugins: [buildInputRules(), SelectionPlugin, gapCursor()]
  ...
```

These are to extend the functionality of the Prosemirror editor, for more information on plugins see the [ProseMirror plugin docs](https://prosemirror.net/docs/ref/#state.Plugin_System). 


## XML Parsing

`libero-editor` takes in XML as a string, converts this string to a DOM object then makes use of `querySelector` and `querySelectorAll` to extract fragments of XML to create the `Manuscript` object. This XML processing happens within the [`getManuscriptContent`](../src/app/api/manuscript.api.ts) function which eventually returns the `Manuscript` object.

Below is a truncated example of `getManuscriptContent` with the addition of `createExtraInfoState` being used to populate the `extraInfo` property on the returned `Manuscript`.

```
import { createExtraInfoState } from 'app/models/extraInfo';
...
export async function getManuscriptContent(id: string): Promise<Manuscript> {
  const { data } = await axios.get<string>(manuscriptUrl(id), { headers: { Accept: 'application/xml' } });

  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  ...

  const extraInfo = doc.querySelector('extra-info');

  return {
    ...
    extraInfo: createExtraInfoState(extraInfo)
  } as Manuscript;
}
```