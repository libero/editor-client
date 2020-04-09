import React from "react";
import { create } from "react-test-renderer";
import configureMockStore from 'redux-mock-store'
import {Provider} from 'react-redux'

import {ManuscriptEditor} from "../manuscript-editor";
import {
  getInitialLoadableState,
  getLoadableStateSuccess
} from "../../../utils/state.utils";
import {RichTextEditor} from "../../../components/rich-text-editor";

describe('manuscript editor', () => {
  const mockStore = configureMockStore([]);

  it('should render', () => {
    const store = mockStore({ manuscript: getInitialLoadableState() });
    const wrapper = create(<Provider store={store}>
      <ManuscriptEditor />
    </Provider>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should update state when RichTextEditor changes', () => {
    const mockEditorState = {
      title: { apply: jest.fn() }
    };

    const store = mockStore({ manuscript: getLoadableStateSuccess(mockEditorState) });
    const wrapper = create(<Provider store={store}> <ManuscriptEditor /> </Provider>);
    const changeArg = Symbol();
    wrapper.root.findByType(RichTextEditor).props.onChange(changeArg);

    expect(mockEditorState.title.apply).toBeCalledWith(changeArg);
  });
})