import React from 'react';
import { create, act } from 'react-test-renderer';

import { ReferenceContributorsList } from '../reference-contributors-list';
import { ActionButton } from '../../../components/action-button';

jest.mock('@material-ui/core', () => ({
  Menu: ({ children }) => <div data-cmp="Menu">{children}</div>,
  Select: ({ children }) => <div data-cmp="Index">{children}</div>,
  MenuItem: ({ children }) => <div data-cmp="MenuItem">{children}</div>,
  FormControl: ({ children }) => <div data-cmp="FormControl">{children}</div>,
  InputLabel: ({ children }) => <div data-cmp="InputLabel">{children}</div>,
  TextField: () => <div data-cmp="TextField"></div>,
  IconButton: () => <div data-cmp="iconButton"></div>,
  Button: () => <div data-cmp="Button"></div>
}));

describe('Reference Contributors List', () => {
  const AUTHORS = [
    { firstName: 'Test 1', lastName: 'Test 2' },
    { firstName: 'Test 3', lastName: 'Test 4' },
    { groupName: 'Test 55' }
  ];

  it('should render a list', () => {
    const wrapper = create(
      <ReferenceContributorsList
        entityName="contributor"
        addCtaLabel="Add Contributor"
        className="class-name"
        refContributors={AUTHORS}
        onChange={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should add a new contributor entry', () => {
    const onChange = jest.fn();
    const wrapper = create(
      <ReferenceContributorsList
        entityName="contributor"
        addCtaLabel="Add Contributor"
        className="class-name"
        refContributors={AUTHORS}
        onChange={onChange}
      />
    );
    act(() => {
      wrapper.root.findByType(ActionButton).props['onClick']();
    });
    expect(wrapper).toMatchSnapshot();
    expect(onChange).toHaveBeenCalledWith([...AUTHORS, { firstName: '', lastName: '' }]);
  });

  it('should delete contributor', () => {
    const onChange = jest.fn();
    const wrapper = create(
      <ReferenceContributorsList
        entityName="contributor"
        addCtaLabel="Add Contributor"
        className="class-name"
        refContributors={AUTHORS}
        onChange={onChange}
      />
    );
    act(() => {
      wrapper.root.findAllByProps({ 'test-id': 'delete-contributor-btn' })[0].props['onClick']();
    });
    expect(wrapper).toMatchSnapshot();
    expect(onChange).toHaveBeenCalledWith([AUTHORS[1], AUTHORS[2]]);
  });

  it('should update contributor', () => {
    const onChange = jest.fn();
    const wrapper = create(
      <ReferenceContributorsList
        entityName="contributor"
        addCtaLabel="Add Contributor"
        className="class-name"
        refContributors={AUTHORS}
        onChange={onChange}
      />
    );
    act(() => {
      wrapper.root
        .findAllByProps({ name: 'firstName' })[0]
        .props['onChange']({ target: { name: 'firstName', value: 'ABC' } });
    });
    expect(onChange).toHaveBeenCalledWith([{ firstName: 'ABC', lastName: 'Test 2' }, AUTHORS[1], AUTHORS[2]]);
  });

  it('should toggle contributor type to group author', () => {
    const onChange = jest.fn();
    const wrapper = create(
      <ReferenceContributorsList
        entityName="contributor"
        addCtaLabel="Add Contributor"
        className="class-name"
        refContributors={AUTHORS}
        onChange={onChange}
      />
    );
    act(() => {
      wrapper.root.findAllByProps({ 'test-id': 'toggle-contributor-type-btn' })[0].props['onClick']();
    });
    expect(wrapper).toMatchSnapshot();
    expect(onChange).toHaveBeenCalledWith([{ groupName: 'Test 2 Test 1' }, AUTHORS[1], AUTHORS[2]]);
  });

  it('should toggle contributor type to individual author', () => {
    const onChange = jest.fn();
    const wrapper = create(
      <ReferenceContributorsList
        entityName="contributor"
        addCtaLabel="Add Contributor"
        className="class-name"
        refContributors={AUTHORS}
        onChange={onChange}
      />
    );
    act(() => {
      wrapper.root.findAllByProps({ 'test-id': 'toggle-contributor-type-btn' })[2].props['onClick']();
    });
    expect(wrapper).toMatchSnapshot();
    expect(onChange).toHaveBeenCalledWith([AUTHORS[0], AUTHORS[1], { firstName: '', lastName: 'Test 55' }]);
  });

  it('should rearrange contributors', () => {
    const onChange = jest.fn();
    const wrapper = create(
      <ReferenceContributorsList
        entityName="contributor"
        addCtaLabel="Add Contributor"
        className="class-name"
        refContributors={AUTHORS}
        onChange={onChange}
      />
    );
    act(() => {
      const onSortEnd = wrapper.root.find((n) => n.props['onSortEnd']).props['onSortEnd'];
      onSortEnd({ oldIndex: 0, newIndex: 1 });
    });
    expect(onChange).toHaveBeenCalledWith([AUTHORS[1], AUTHORS[0], AUTHORS[2]]);
  });
});
