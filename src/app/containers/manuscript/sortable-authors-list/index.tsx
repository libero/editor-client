import React, { useCallback } from 'react';
import { Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import * as manuscriptActions from '../../../actions/manuscript.actions';
import { getAuthors } from '../../../selectors/manuscript.selectors';
import { useAuthorsListStyles } from './styles';
import { SectionContainer } from '../../../components/section-container';
import { Person } from '../../../models/manuscript';
import { AddEntityButton } from '../../../components/add-entity-button';

const SortableItem = SortableElement(({ value, classes, onEdit }) => (
  <Chip
    classes={{ root: classes.chip, label: classes.chipLabel }}
    label={`${value.firstName} ${value.lastName}`}
    onDelete={onEdit}
    color="primary"
    deleteIcon={<EditIcon />}
  />
));

const SortableList = SortableContainer(({ children, className }) => {
  return <div className={className}> {children} </div>;
});

export const SortableAuthorsList: React.FC = () => {
  const authors = useSelector(getAuthors);
  const dispatch = useDispatch();

  const handleEdit = useCallback((author: Person) => {
    /* toggle edit dialog */
  }, []);
  const classes = useAuthorsListStyles();

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const author = authors[oldIndex];

    dispatch(manuscriptActions.moveAuthorAction({ index: newIndex, author }));
  };

  return (
    <section>
      <SectionContainer label="Authors">
        <SortableList className={classes.sortableContainer} onSortEnd={onSortEnd} axis="x">
          {authors.map((value, index) => (
            <SortableItem key={`item-${value.id}`} index={index} value={value} classes={classes} onEdit={handleEdit} />
          ))}
        </SortableList>
      </SectionContainer>
      <AddEntityButton />
    </section>
  );
};
