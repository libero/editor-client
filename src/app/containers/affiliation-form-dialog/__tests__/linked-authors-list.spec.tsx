import React from 'react';
import { IconButton } from '@material-ui/core';
import { create, act } from 'react-test-renderer';
import { mount } from 'enzyme';

import { LinkedAuthorsList } from '../../../containers/affiliation-form-dialog/linked-authors-list';
import { Person } from '../../../models/person';
import { ActionButton } from '../../../components/action-button';
import { Select } from '../../../components/select';

jest.mock('app/components/select', () => ({
  Select: ({ onChange, value }) => <input onChange={onChange} value={value} data-cmp="Index" />
}));

jest.mock('@material-ui/core', () => {
  return {
    IconButton: () => <div data-cmo="iconButton"></div>,
    Button: () => <div data-cmo="Button"></div>
  };
});

describe('Linked Authors List', () => {
  it('renders component', () => {
    const allAuthors = givenAuthors();
    const linkedAuthors = [allAuthors[0]];
    const wrapper = create(
      <LinkedAuthorsList linkedAuthors={linkedAuthors} allAuthors={allAuthors} onChange={jest.fn()} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('adds empty fields to the end of the list', () => {
    const allAuthors = givenAuthors();
    const clickHandler = jest.fn();
    const linkedAuthors = [allAuthors[0]];

    const wrapper = create(
      <LinkedAuthorsList linkedAuthors={linkedAuthors} allAuthors={allAuthors} onChange={clickHandler} />
    );

    act(() => {
      wrapper.root.findByType(ActionButton).props.onClick();
    });

    expect(clickHandler).not.toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('removes elements from the list', () => {
    const allAuthors = givenAuthors();
    const clickHandler = jest.fn();
    const linkedAuthors = [allAuthors[0]];
    const wrapper = create(
      <LinkedAuthorsList linkedAuthors={linkedAuthors} allAuthors={allAuthors} onChange={clickHandler} />
    );

    act(() => {
      wrapper.root.findByType(ActionButton).props.onClick();
    });

    act(() => {
      wrapper.root.findByType(ActionButton).props.onClick();
    });

    expect(wrapper.root.findAllByType(Select).length).toBe(3);

    act(() => {
      wrapper.root.findAllByType(IconButton).pop().props.onClick();
    });

    expect(wrapper.root.findAllByType(Select).length).toBe(2);
    expect(wrapper).toMatchSnapshot();
    expect(clickHandler).toHaveBeenCalled();
  });

  it('fires an event when changes happen', () => {
    const allAuthors = givenAuthors();
    const clickHandler = jest.fn();
    const linkedAuthors = [allAuthors[0]];
    const wrapper = mount(
      <LinkedAuthorsList linkedAuthors={linkedAuthors} allAuthors={allAuthors} onChange={clickHandler} />
    );

    wrapper.find(ActionButton).prop('onClick')();
    wrapper.update();
    const event = document.createEvent('Event');
    (wrapper.find(Select).at(1).getDOMNode() as HTMLSelectElement).value = allAuthors[1].id;
    wrapper.find(Select).at(1).simulate('change', event);

    expect(clickHandler).toHaveBeenCalledWith([allAuthors[0], allAuthors[1]]);
  });
});

function givenAuthors(): Person[] {
  return [
    {
      firstName: 'Fred',
      lastName: 'Atherden',
      email: 'f.atherden@elifesciences.org',
      orcid: 'https://orcid.org/0000-0002-6048-1470',
      affiliations: ['aff1', 'aff2'],
      _id: '149aa8ef-ed62-4ef9-aeaa-9758ce99c136'
    },
    {
      firstName: 'Jeanine',
      lastName: 'Smith',
      suffix: 'III',
      affiliations: ['aff2'],
      _id: '8c62aed8-45c5-47fd-93bd-0816c3d2a110'
    },
    {
      firstName: 'Jack',
      lastName: 'London',
      suffix: 'III',
      affiliations: ['aff2'],
      _id: '5a0204e2-5f4c-4947-9cbb-2f306d6702f9'
    },
    {
      firstName: 'Mark',
      lastName: 'Twain',
      suffix: 'III',
      affiliations: ['aff2'],
      _id: '9da79de3-a9e2-47dd-bc1d-5c8c633c12f6'
    },
    {
      firstName: 'Alexandr',
      lastName: 'Solzhenitsin',
      suffix: 'III',
      affiliations: ['aff2'],
      _id: '92f5e98a-e255-4c59-934c-fa174368e9ac'
    }
  ].map((json) => new Person(json));
}
