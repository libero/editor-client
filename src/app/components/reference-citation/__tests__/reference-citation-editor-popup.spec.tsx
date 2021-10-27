import React from 'react';
import { create } from 'react-test-renderer';
import { act } from 'react-dom/test-utils';
import { EditorView } from 'prosemirror-view';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import ClearIcon from '@material-ui/icons/Clear';
import { Provider } from 'react-redux';
import { ClickAwayListener } from '@material-ui/core';

import { createBodyState } from '../../../models/body';
import { ReferenceCitationEditorPopup } from '../reference-citation-editor-popup';
import { Reference } from '../../../models/reference';
import { givenState } from '../../../test-utils/reducer-test-helpers';
import { ReferenceFormDialog } from '../../../containers/reference-form-dialog/reference-form-dialog';
import { ModalContainer } from '../../../containers/modal-container';
import * as manuscriptActions from '../../../actions/manuscript.actions';
import { JSONObject } from '../../../types/utility.types';
import { createReferenceAnnotatedValue } from '../../../models/reference-type';

jest.mock('@material-ui/core', () => ({
  Popper: ({ children }) => <div data-cmp="Popper">{children}</div>,
  Paper: ({ children }) => <div data-cmp="Paper">{children}</div>,
  ClickAwayListener: ({ children }) => <div data-cmp="ClickAwayListener">{children}</div>,
  IconButton: ({ children }) => <div data-cmp="IconButton">{children}</div>,
  InputAdornment: ({ children }) => <div data-cmp="InputAdornment">{children}</div>,
  Button: ({ children }) => <div data-cmp="Button">{children}</div>,
  TextField: ({ value, onChange, children, InputProps }) => (
    <>
      {InputProps.endAdornment}
      <input onChange={onChange} value={value} data-cmp="TextField">
        {children}
      </input>
    </>
  )
}));

jest.mock('app/containers/reference-form-dialog/reference-form-dialog', () => ({
  ReferenceFormDialog: ({ children }) => <div data-cmp="ReferenceFormDialog">{children}</div>
}));

jest.mock('app/containers/modal-container', () => ({
  ModalContainer: (props) => {
    const Component = props.component;
    return (
      <div data-cmp="ModalContainer">
        <Component />
      </div>
    );
  }
}));

jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles,
    withStyles: jest.requireActual('@material-ui/core/styles').withStyles
  };
});

const ReferenceData = [
  {
    _id: 'bib1',
    authors: [
      {
        firstName: 'V',
        lastName: 'Berk'
      }
    ],
    _type: 'journal',
    referenceInfo: {
      year: '2012',
      source: stringToEditorState('Science'),
      articleTitle: stringToEditorState(
        'Molecular architecture and assembly principles of <italic>Vibrio cholerae</italic> biofilms'
      ),
      doi: '',
      pmid: '',
      elocationId: '',
      firstPage: '236',
      lastPage: '239',
      inPress: false,
      volume: '337'
    }
  },
  {
    _id: 'bib2',
    authors: [
      {
        firstName: 'PK',
        lastName: 'Feyerabend'
      }
    ],
    _type: 'book',
    referenceInfo: {
      year: '2010',
      source: stringToEditorState('The skull and brain'),
      chapterTitle: stringToEditorState('The skull and brain'),
      publisherLocation: 'London',
      publisherName: 'Verso',
      edition: '4th Edition',
      editors: [],
      doi: '',
      pmid: '',
      elocationId: '',
      firstPage: '0',
      lastPage: '0',
      inPress: false,
      volume: '0'
    }
  }
].map((json) => new Reference(json));

describe('ReferenceCitationEditor', () => {
  const mockStore = configureMockStore([]);

  it('should render component', () => {
    const el = document.createElement('main-text');
    el.innerHTML = `<p><xref ref-type="bibr" rid="bib5">Harmon (2019)</xref></p>`;
    const editorState = createBodyState(el, '');

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const store = mockStore({
      manuscript: givenState({ references: ReferenceData })
    });

    const node = editorView.state.doc.firstChild.content.firstChild;

    const wrapper = create(
      <Provider store={store}>
        <ReferenceCitationEditorPopup
          editorView={editorView}
          onChange={jest.fn()}
          node={node}
          onClose={jest.fn()}
          anchorEl={null}
        />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger apply event', () => {
    const handleClose = jest.fn();
    const handleChange = jest.fn();
    const el = document.createElement('main-text');
    el.innerHTML = `<p><xref ref-type="bibr" rid="bib5">Harmon (2019)</xref></p>`;
    const editorState = createBodyState(el, '');

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const store = mockStore({
      manuscript: givenState({ references: ReferenceData })
    });

    const node = editorView.state.doc.firstChild.content.firstChild;
    const wrapper = mount(
      <Provider store={store}>
        <ReferenceCitationEditorPopup
          editorView={editorView}
          onChange={handleChange}
          node={node}
          onClose={handleClose}
          anchorEl={null}
        />
      </Provider>
    );

    wrapper.find('li').at(1).simulate('click');
    expect(handleChange).toHaveBeenCalledWith(ReferenceData[0]);
  });

  it('should trigger close event', () => {
    const handleClose = jest.fn();
    const handleChange = jest.fn();
    const el = document.createElement('main-text');
    el.innerHTML = `<p><xref ref-type="bibr" rid="bib5">Harmon (2019)</xref></p>`;
    const editorState = createBodyState(el, '');

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const store = mockStore({
      manuscript: givenState({ references: ReferenceData })
    });

    const node = editorView.state.doc.firstChild.content.firstChild;

    const wrapper = mount(
      <Provider store={store}>
        <ReferenceCitationEditorPopup
          editorView={editorView}
          onChange={handleChange}
          node={node}
          onClose={handleClose}
          anchorEl={null}
        />
      </Provider>
    );

    wrapper.find(ClickAwayListener).prop('onClickAway')({} as React.MouseEvent<Document, MouseEvent>);

    expect(handleClose).toHaveBeenCalled();
  });

  it('should clear filter field', () => {
    const handleClose = jest.fn();
    const handleChange = jest.fn();
    const el = document.createElement('main-text');
    el.innerHTML = `<p><xref ref-type="bibr" rid="bib5">Harmon (2019)</xref></p>`;
    const editorState = createBodyState(el, '');

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const store = mockStore({
      manuscript: givenState({ references: ReferenceData })
    });

    const node = editorView.state.doc.firstChild.content.firstChild;

    const wrapper = mount(
      <Provider store={store}>
        <ReferenceCitationEditorPopup
          editorView={editorView}
          onChange={handleChange}
          node={node}
          onClose={handleClose}
          anchorEl={null}
        />
      </Provider>
    );

    act(() => {
      wrapper.find('input[data-cmp="TextField"]').simulate('change', { target: { value: 'SOME_TEXT' } });
      wrapper.update();

      wrapper.find(ClearIcon).prop('onClick').call(null);
      wrapper.update();
    });

    expect(wrapper.find('input[data-cmp="TextField"]').prop('value')).toBe('');
  });

  it('should open add reference dialog', () => {
    const handleClose = jest.fn();
    const handleChange = jest.fn();
    const el = document.createElement('main-text');
    el.innerHTML = `<p><xref ref-type="bibr" rid="bib5">Harmon (2019)</xref></p>`;
    const editorState = createBodyState(el, '');

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const store = mockStore({
      manuscript: givenState({ references: ReferenceData })
    });

    const node = editorView.state.doc.firstChild.content.firstChild;

    const wrapper = mount(
      <Provider store={store}>
        <ReferenceCitationEditorPopup
          editorView={editorView}
          onChange={handleChange}
          node={node}
          anchorEl={null}
          onClose={handleClose}
        />
      </Provider>
    );

    expect(wrapper.find(ReferenceFormDialog).length).toBe(0);
    wrapper.find('li').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find(ReferenceFormDialog).length).toBe(1);
  });

  it('should add reference', () => {
    const handleClose = jest.fn();
    const handleChange = jest.fn();
    const el = document.createElement('main-text');
    el.innerHTML = `<p><xref ref-type="bibr" rid="bib5">Harmon (2019)</xref></p>`;
    const editorState = createBodyState(el, '');

    const viewContainer = document.createElement('div');
    const editorView = new EditorView(viewContainer, {
      state: editorState,
      dispatchTransaction: jest.fn()
    });

    const store = mockStore({
      manuscript: givenState({ references: ReferenceData })
    });
    jest.spyOn(store, 'dispatch');

    const node = editorView.state.doc.firstChild.content.firstChild;

    const wrapper = mount(
      <Provider store={store}>
        <ReferenceCitationEditorPopup
          editorView={editorView}
          onChange={handleChange}
          node={node}
          anchorEl={null}
          onClose={handleClose}
        />
      </Provider>
    );

    wrapper.find('li').at(0).simulate('click');
    wrapper.update();
    const ref = new Reference();
    act(() => {
      wrapper.find(ModalContainer).prop('params')['onAccept'].call(null, ref);
    });
    expect(store.dispatch).toBeCalledWith(manuscriptActions.addReferenceAction(ref));
  });
});

function stringToEditorState(xmlContent: string): JSONObject {
  const el = document.createElement('div');
  el.innerHTML = xmlContent;
  return createReferenceAnnotatedValue(el).toJSON();
}
