import React from 'react';
import configureMockStore from 'redux-mock-store';
import { create } from 'react-test-renderer';
import { EditorState } from 'prosemirror-state';
import { Provider } from 'react-redux';

import { ReferenceList } from '../';
import { givenState } from '../../../../test-utils/reducer-test-helpers';
import { Reference } from '../../../../models/reference';
import { createReferenceAnnotatedValue } from '../../../../models/reference-type';

jest.mock('@material-ui/core', () => ({
  Button: ({ label }) => <div data-cmp="Button">{label}</div>,
  IconButton: () => <div data-cmp="IconButton"></div>
}));

jest.mock('@material-ui/core/styles', () => {
  return {
    ThemeProvider: ({ children }) => <>{children}</>,
    createMuiTheme: jest.fn(),
    makeStyles: jest.requireActual('@material-ui/core/styles').makeStyles
  };
});

jest.mock('@material-ui/lab', () => ({
  ToggleButtonGroup: ({ children }) => <div data-cmp="ToggleButtonGroup">{children}</div>,
  ToggleButton: ({ children }) => <div data-cmp="ToggleButton">{children}</div>
}));

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

describe('References List', () => {
  const mockStore = configureMockStore([]);

  it('renders the component', () => {
    const store = mockStore({ manuscript: givenState({ references: ReferenceData }) });

    const wrapper = create(
      <Provider store={store}>
        <ReferenceList />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

function stringToEditorState(xmlContent: string): EditorState {
  const el = document.createElement('div');
  el.innerHTML = xmlContent;
  return createReferenceAnnotatedValue(el);
}
