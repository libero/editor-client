import { EditorState, TextSelection } from 'prosemirror-state';

import { hasParentNodeOf, objectsEqual, stringifyEditorState, getImageFileUpload } from 'app/utils/view.utils';
import { createBodyState } from 'app/models/body';

describe('view utils', () => {
  it('stringifies editor state content', () => {
    const editorState = givenEditorState();
    expect(stringifyEditorState(editorState)).toMatchSnapshot();
  });

  it('compares objects with editor state', () => {
    const obj1 = { value1: givenEditorState(), value2: 'Some value' };
    const obj2 = {
      value1: obj1.value1.apply(obj1.value1.tr.setSelection(TextSelection.create(obj1.value1.doc, 2, 3))),
      value2: 'Some value'
    };

    expect(objectsEqual(obj1, obj2)).toBeTruthy();
    expect(obj1.value1).not.toEqual(obj2.value1);
  });

  it('checks if node at position has specific parent', () => {
    const editorState = givenEditorState();
    const xrefPos = editorState.doc.resolve(57);
    expect(hasParentNodeOf(xrefPos, ['paragraph'])).toBeTruthy();
    expect(hasParentNodeOf(xrefPos, ['boxText'])).toBeTruthy();

    const pTextPos = editorState.doc.resolve(7);
    expect(hasParentNodeOf(pTextPos, ['paragraph'])).toBeTruthy();
    expect(hasParentNodeOf(pTextPos, ['boxText'])).toBeFalsy();
  });

  it('uploads an image', () => {
    const fileReader = new FileReaderMock();
    jest.spyOn(window, 'FileReader').mockImplementation(() => fileReader);

    const callback = jest.fn();
    jest.spyOn(document, 'createElement');
    getImageFileUpload(callback);
    const input = (document.createElement as jest.Mock).mock.results[0].value;
    const file = new File(['foo'], 'test.png', { type: 'image/png' });
    jest.spyOn(input.files.__proto__, 'item').mockReturnValue(file);

    input.dispatchEvent(new Event('change'));
    fileReader.onload({ target: { result: 'base 64 string' } });
    expect(callback).toBeCalledWith(expect.any(File));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

function givenEditorState(): EditorState {
  const el = document.createElement('main-text');
  el.innerHTML = `
    <p>Example text</p>
    <p>Example text 2</p>
    <boxed-text>
      <p>
        <bold>Related research article</bold>
        <xref ref-type="bibr" rid="bib5">Harmon (2019)</xref>
      </p>
    </boxed-text>
  `;
  return createBodyState(el, '');
}

class FileReaderMock {
  DONE = FileReader.DONE;
  EMPTY = FileReader.EMPTY;
  LOADING = FileReader.LOADING;
  readyState = 0;
  error: FileReader['error'] = null;
  result: FileReader['result'] = null;
  abort = jest.fn();
  addEventListener = jest.fn();
  dispatchEvent = jest.fn();
  onabort = jest.fn();
  onerror = jest.fn();
  onload = jest.fn();
  onloadend = jest.fn();
  onloadprogress = jest.fn();
  onloadstart = jest.fn();
  onprogress = jest.fn();
  readAsArrayBuffer = jest.fn();
  readAsBinaryString = jest.fn();
  readAsDataURL = jest.fn();
  readAsText = jest.fn();
  removeEventListener = jest.fn();
}
