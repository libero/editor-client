import React from 'react';
import { create } from 'react-test-renderer';
import { ModalContainer } from 'app/containers/modal-container/modal-container';

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
  it('renders modal', () => {
    const wrapper = create(
      <ModalContainer title="test" params={{}} component={() => <div data-cmp="test-component" />} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
