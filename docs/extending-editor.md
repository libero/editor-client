# Extending Editor

This document details how to extend `libero-editor` to support a new editable fragment of XML. While it focuses on the example of **adding** a new section, alternatively the steps can be reversed to **remove** an existing section from the editor if it is not required for your own specific setup.

The following is a summary of what is needed to add an new editable XML section to `libero-editor`

1. [Data Model](#data-model) - Adding the property to the `Manuscript` model and creating a new model class / factory function for the section to be added.
2. [XML Parsing](#xml-parsing) - Extracting the data from the XML file to populate the property on `Manuscript` with an instance of the new data model.
3. [State Management](#state-management) - Creating the reducer to update the redux state store.
4. [UI Component](#ui-component) - Adding the UI component used to update the section to the `<ManuscriptEditor/>`.

For this example we will be adding an `extraInfo` section to the bottom of editor which will make the dummy XML tag `<extra-info/>` editable. `extraInfo` will need to be an editable rich text field which supports **bold**, *italic*, <sub>subscript</sub> and <sup>superscript</sup> text formatting (similar to `body` but without support for figures, boxes ect.). 

**Note** - we're using a simple editable text section in this example, see the [architecture docs](./architecture.md) for info on `BackmatterEntity` if you require a new modal editable section similar to the authors or references section.

## <a name="data-model"></a>Data Model

The type definition for `Manuscript` can be found [here](../src/app/types/manuscript.ts).

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
import { makeSchemaFromConfig } from '../models/utils';
import { SelectionPlugin } from '../models/plugins/selection.plugins';

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


## <a name="xml-parsing"></a>XML Parsing

`libero-editor` takes in XML as a string, converts this string to a DOM object then makes use of `querySelector` and `querySelectorAll` to extract fragments of XML to create the `Manuscript` object. This XML processing happens within the [`getManuscriptContent`](../src/app/api/manuscript.api.ts) function which eventually returns the `Manuscript` object.

Below is a truncated example of `getManuscriptContent` with the addition of `createExtraInfoState` being used to populate the `extraInfo` property on the returned `Manuscript`.

```
import { createExtraInfoState } from '../models/extraInfo';
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
## <a name="state-management"></a>State Management

Editor uses `Redux` for application state management. Now that we are parsing `<extra-info>` from the XML, the value of `extraInfo` will exist on the initially loaded `Manuscript` within the `Redux` store. We still need to add a `Selector` for retrieving the `extraTitle` data, an action definition for referencing an `extraInfo` change and a reducer function for handling a change action, taking the payload and returning a new redux state with that change applied.

### Selector

We can add a new selector by extending the [`manuscript.selectors.ts`](../src/app/selectors/manuscript.selectors.ts) file.

```
export const getExtraInfo = createSelector(getManuscriptData, (data) => get(data, 'present.extraInfo'));
```

This function is simply a getter for pulling the current `extraInfo` property off the redux stores `Manuscript` value.

### Action

We need to add a [redux action creator](https://github.com/pauldijou/redux-act) to [`manuscript.actions.ts`](../src/app/actions/manuscript.actions.ts) for updating the `extraInfo` section. 

```
export const updateExtraInfoAction = createAction<Transaction>('UPDATE_EXTRA_INFO');
```

`updateExtraInfoAction` is just an identifier for the action of updating `extraInfo`. Alternatively we could have just used a `const` to describe the action, however `createAction` creates a reference which is used to ensure an action is unique.

### Reducer

We then need to create a reducer for taking an `extraInfo` change and returning a new state object with the required change applied. This should live in a file called `extra-info.handler.ts` inside of the [reducers directory](../src/app/reducers) and look something like this:

```
import { Transaction } from 'prosemirror-state';
import { ManuscriptHistoryState } from '../store';
import { updateManuscriptState } from '../utils/history.utils';

export function updateExtraInfo(state: ManuscriptHistoryState, payload: Transaction): ManuscriptHistoryState {
  return {
    ...state,
    data: updateManuscriptState(state.data, 'extraInfo', payload)
  };
}
```

We also need to inform the redux store that an action of type `updateExtraInfoAction` needs to be passed to the reducer function `updateExtraInfo` to correctly update the state store. This can be done by adding a new action listener to the [`manuscript.reducer.ts`](../src/app/reducers/manuscript.reducer.ts) file.

```
manuscriptReducer.on(manuscriptActions.updateExtraInfoAction, updateExtraInfo);
```

## <a name="ui-component"></a>UI Component

We can now add the UI component for `extraInfo` and hook it up to our redux store to display and update the information. The editable sections of `libero-editor` are mounted within the [`ManuscriptEditor`](../src/app/containers/manuscript/manuscript-editor.tsx) container component.

(**Note** - As `extraInfo` is a simple rich text field we can extend `ManuscriptEditor` by adding a new `RichTextEditor` component and adding the selectors and change handlers directly to the file. For more complex fields (ie: authors, references ect.) you will likely want to put all of this logic into its own self contained container component, see [`ReferenceList`](../src/app/containers/manuscript/references-list/index.tsx) as an example.)


First include the selector call to pull through the current `Manuscript` `extraInfo` value into `ManuscriptEditor`.

```
import {
  ...
  getExtraInfo
} from '../../selectors/manuscript.selectors';
...
const extraInfo: EditorState = useSelector(getTitle);
```

Then define a callback to dispatch an action to redux on the inputs change 

```
const handleExtraInfoChange = useCallback(
    (diff: Transaction) => {
      dispatch(manuscriptActions.updateExtraInfoAction(diff));
    },
    [dispatch]
  );
```

Then add a new `RichTextEditor` to the JSX being returned. This can be placed anywhere within the `<div className={classes.content}>` JSX block.

```
<RichTextEditor
  editorState={extraInfo}
  label="Extra Information"
  id="extraInfo"
  isActive={isInputFocused('extraInfo', focusedPath)}
  name="extraInfo"
  onChange={handleExtraInfoChange}
  onFocus={handleFocusSwitch}
/>
```
