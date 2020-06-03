import React, { useState, useCallback } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { get } from 'lodash';
import { FormControl, InputLabel, MenuItem, Select, IconButton } from '@material-ui/core';

import { getAuthorDisplayName, Person } from 'app/models/person';
import { useAffiliationFormStyles } from './styles';
import { ActionButton } from 'app/components/action-button';

interface LinkedAuthorsListProps {
  linkedAuthors: Person[];
  allAuthors: Person[];
  onChange: (selkectedAuthors: Person[]) => void;
}

const renderAuthorSelectListItem = (author: Person) => (
  <MenuItem key={author.id} value={author.id}>
    {getAuthorDisplayName(author)}
  </MenuItem>
);

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
          <FormControl key={get(author, 'id', index)} variant="outlined" className={classes.affiliatedAuthorInput}>
            <InputLabel shrink id="author-affiliations-label">
              Affiliated Author
            </InputLabel>
            <Select
              labelId="author-affiliations-label"
              displayEmpty
              value={get(author, 'id', '')}
              onChange={updateRow(index)}
              label="Affiliated Author"
            >
              <MenuItem value={''}>Select affiliated author</MenuItem>
              {getAuthorSelectList(author).map(renderAuthorSelectListItem)}
            </Select>
          </FormControl>
          <IconButton
            classes={{ root: classes.deleteButton }}
            onClick={deleteRow(index)}
            disabled={userLinkedAuthors.length <= 1}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      ))}
      <ActionButton variant="addEntity" title="Author" onClick={addEmptyRow} />
    </div>
  );
};
