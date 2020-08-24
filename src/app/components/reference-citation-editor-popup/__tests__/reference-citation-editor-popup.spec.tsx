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
import { Popover } from '@material-ui/core';
import { EditorState } from 'prosemirror-state';

jest.mock('@material-ui/core', () => ({
  Popover: ({ children }) => <div data-cmp="Popover">{children}</div>,
  IconButton: ({ children }) => <div data-cmp="IconButton">{children}</div>,
  InputAdornment: ({ children }) => <div data-cmp="InputAdornment">{children}</div>,
  Button: ({ children }) => <div data-cmp="Button">{children}</div>,
  TextField: ({ value, onChange, children }) => (
    <input onChange={onChange} value={value} data-cmp="TextField">
      {children}
    </input>
  )
}));

jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles
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
    const editorState = createBodyState(el);

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
          x={100}
          y={200}
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
    const editorState = createBodyState(el);

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
          x={100}
          y={200}
        />
      </Provider>
    );

    wrapper.find('li').at(0).simulate('click');

    expect(handleChange).toHaveBeenCalledWith(ReferenceData[0]);
  });

  it('should trigger close event', () => {
    const handleClose = jest.fn();
    const handleChange = jest.fn();
    const el = document.createElement('main-text');
    el.innerHTML = `<p><xref ref-type="bibr" rid="bib5">Harmon (2019)</xref></p>`;
    const editorState = createBodyState(el);

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
          x={100}
          y={200}
        />
      </Provider>
    );

    wrapper.find(Popover).prop('onClose')(new Event('input'), 'backdropClick');

    expect(handleClose).toHaveBeenCalled();
  });
});

function stringToEditorState(xmlContent: string): EditorState {
  const el = document.createElement('div');
  el.innerHTML = xmlContent;
  return createReferenceAnnotatedValue(el);
}
