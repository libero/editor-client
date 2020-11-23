import React from 'react';
import { create } from 'react-test-renderer';
import { EditorView } from 'prosemirror-view';
import { mount } from 'enzyme';

import configureMockStore from 'redux-mock-store';
import { createBodyState } from 'app/models/manuscript-state.factory';
import { ReferenceCitationEditorPopup } from 'app/components/reference-citation-editor-popup/index';
import { Provider } from 'react-redux';
import { createReferenceAnnotatedValue, Reference } from 'app/models/reference';
import { givenState } from 'app/test-utils/reducer-test-helpers';
import { ClickAwayListener } from '@material-ui/core';
import { EditorState } from 'prosemirror-state';
import { ReferenceFormDialog } from 'app/containers/reference-form-dialog/reference-form-dialog';

jest.mock('@material-ui/core', () => ({
  Popper: ({ children }) => <div data-cmp="Popper">{children}</div>,
  Paper: ({ children }) => <div data-cmp="Paper">{children}</div>,
  ClickAwayListener: ({ children }) => <div data-cmp="ClickAwayListener">{children}</div>,
  IconButton: ({ children }) => <div data-cmp="IconButton">{children}</div>,
  InputAdornment: ({ children }) => <div data-cmp="InputAdornment">{children}</div>,
  Button: ({ children }) => <div data-cmp="Button">{children}</div>,
  TextField: ({ value, onChange, children }) => (
    <input onChange={onChange} value={value} data-cmp="TextField">
      {children}
    </input>
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
    id: 'bib1',
    authors: [
      {
        firstName: 'V',
        lastName: 'Berk'
      }
    ],
    type: 'journal',
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
    id: 'bib2',
    authors: [
      {
        firstName: 'PK',
        lastName: 'Feyerabend'
      }
    ],
    type: 'book',
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
] as Reference[];

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
});

function stringToEditorState(xmlContent: string): EditorState {
  const el = document.createElement('div');
  el.innerHTML = xmlContent;
  return createReferenceAnnotatedValue(el);
}
