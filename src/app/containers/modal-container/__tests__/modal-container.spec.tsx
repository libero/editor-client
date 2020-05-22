import React from 'react';
import { create } from 'react-test-renderer';
import { ModalContainer } from '../index';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

jest.mock('@material-ui/core', () => ({
  Dialog: ({ children }) => <div data-cmp="dialog">{children}</div>,
  DialogTitle: ({ children }) => <div data-cmp="dialog-title">{children}</div>,
  DialogActions: ({ children }) => <div data-cmp="dialog-actions">{children}</div>,
  DialogContent: ({ children }) => <div data-cmp="dialog-content">{children}</div>,
  DialogContentText: ({ children }) => <div data-cmp="dialog-content-text">{children}</div>,
  Content: ({ children }) => <div data-cmp="dialog-content">{children}</div>,
  Typography: () => <div data-cmp="typography"></div>,
  Button: () => <div data-cmp="Button"></div>
}));

describe('Modal Container', () => {
  const mockStore = configureMockStore([]);

  it('renders modal', () => {
    const store = mockStore({
      manuscriptEditor: {
        modal: {
          params: {
            component: () => <div data-cmp="test-component" />
          },
          isVisible: true
        }
      }
    });

    const wrapper = create(
      <Provider store={store}>
        <ModalContainer />
      </Provider>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
