import React, { useState, useCallback } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { get } from 'lodash';
import { IconButton } from '@material-ui/core';

import { Person } from '../../models/person';
import { useAffiliationFormStyles } from './styles';
import { ActionButton } from '../../components/action-button';
import { Select } from '../../components/select';

interface LinkedAuthorsListProps {
  linkedAuthors: Person[];
  allAuthors: Person[];
  onChange: (selectedAuthors: Person[]) => void;
}

export const LinkedAuthorsList: React.FC<LinkedAuthorsListProps> = ({ linkedAuthors, allAuthors, onChange }) => {
  const [userLinkedAuthors, setUserLinkedAuthors] = useState<Person[]>(
    linkedAuthors.length > 0 ? linkedAuthors : [null]
  );

  const triggerOnChange = useCallback(
    (authorsList) => {
      onChange(authorsList.filter((author) => Boolean(author)));
    },
    [onChange]
  );

  const getAuthorSelectList = useCallback(
    (selectedAuthor) => {
      const selectedAuthorId = get(selectedAuthor, 'id');
      const linkedIds = new Set(userLinkedAuthors.map((author: Person) => get(author, 'id')));
      return allAuthors.filter(({ id }) => !linkedIds.has(id) || selectedAuthorId === id);
    },
    [userLinkedAuthors, allAuthors]
  );

  const deleteRow = useCallback(
    (index) => () => {
      const updatedList = [...userLinkedAuthors];
      updatedList.splice(index, 1);
      setUserLinkedAuthors(updatedList);
      triggerOnChange(updatedList);
    },
    [userLinkedAuthors, setUserLinkedAuthors, triggerOnChange]
  );

  const updateRow = useCallback(
    (index) => (event) => {
      const updatedList = [...userLinkedAuthors];
      updatedList[index] = allAuthors.find(({ id }) => id === event.target.value);
      setUserLinkedAuthors(updatedList);
      triggerOnChange(updatedList);
    },
    [userLinkedAuthors, allAuthors, triggerOnChange]
  );

  const addEmptyRow = useCallback(() => {
    setUserLinkedAuthors([...userLinkedAuthors, null]);
  }, [userLinkedAuthors, setUserLinkedAuthors]);

  const classes = useAffiliationFormStyles();
  return (
    <div className={classes.inputField}>
      {userLinkedAuthors.map((author: Person, index: number) => (
        <div className={classes.affiliatedAuthorRow} key={author?.id || index}>
          <Select
            className={classes.affiliatedAuthorInput}
            placeholder="Select affiliated author"
            fullWidth
            blankValue={''}
            label="Affiliated Author"
            value={get(author, 'id', '')}
            onChange={updateRow(index)}
            options={getAuthorSelectList(author).map((person) => ({
              label: person.getDisplayName(),
              value: person.id
            }))}
          />
          <IconButton
            classes={{ root: classes.deleteButton }}
            onClick={deleteRow(index)}
            disabled={userLinkedAuthors.length <= 1}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ))}
      <ActionButton
        variant="addEntity"
        title="Add Author"
        onClick={addEmptyRow}
        disabled={userLinkedAuthors.length >= allAuthors.length}
      />
    </div>
  );
};
