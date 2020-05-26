import React, { useCallback } from 'react';
import { Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import * as manuscriptActions from '../../../actions/manuscript.actions';
import * as manuscriptEditorActions from '../../../actions/manuscript-editor.actions';
import { getAuthors } from '../../../selectors/manuscript.selectors';
import { useAuthorsListStyles } from './styles';
import { SectionContainer } from '../../../components/section-container';
import { Person } from '../../../models/person';
import { AddEntityButton } from '../../../components/add-entity-button';
import { AuthorFormDialog } from '../../author-form-dialog';

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

  const classes = useAuthorsListStyles();

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      if (oldIndex !== newIndex) {
        const author = authors[oldIndex];
        dispatch(manuscriptActions.moveAuthorAction({ index: newIndex, author }));
      }
    },
    [authors, dispatch]
  );

  const onAddNewAuthor = useCallback(() => {
    dispatch(
      manuscriptEditorActions.showModalDialog({
        component: AuthorFormDialog,
        title: 'Add Author'
      })
    );
  }, [dispatch]);

  const onEditAuthor = useCallback(
    (author: Person) => () => {
      dispatch(
        manuscriptEditorActions.showModalDialog({
          component: AuthorFormDialog,
          props: { author },
          title: 'Edit Author'
        })
      );
    },
    [dispatch]
  );

  return (
    <section>
      <SectionContainer label="Authors">
        <SortableList className={classes.sortableContainer} onSortEnd={onSortEnd} axis="x" pressDelay={100}>
          {authors.map((value, index) => (
            <SortableItem
              key={`item-${value.id}`}
              index={index}
              value={value}
              classes={classes}
              onEdit={onEditAuthor(value)}
            />
          ))}
        </SortableList>
      </SectionContainer>
      <AddEntityButton label="Add author" onClick={onAddNewAuthor} />
    </section>
  );
};
