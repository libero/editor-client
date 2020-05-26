import React, { useCallback } from 'react';
import { Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import DragIcon from 'app/assets/drag-indicator.svg';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { getAuthors } from 'app/selectors/manuscript.selectors';
import { useAuthorsListStyles } from './styles';
import { SectionContainer } from 'app/components/section-container';
import { Person } from 'app/models/person';
import { AuthorFormDialog } from 'app/containers/author-form-dialog';
import { ActionButton } from 'app/components/action-button';

const DragHandle = SortableHandle(() => <img src={DragIcon} className="drag-handle" />);

const ChipRenderComponent = (props) => (
  <div className={props.className}>
    <DragHandle />
    {props.children}
  </div>
);

const SortableItem = SortableElement(({ value, classes, onEdit }) => (
  <Chip
    classes={{ root: classes.chip, label: classes.chipLabel }}
    label={`${value.firstName} ${value.lastName}`}
    onDelete={onEdit}
    component={ChipRenderComponent}
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
        <SortableList className={classes.sortableContainer} onSortEnd={onSortEnd} axis="x" useDragHandle={true}>
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
      <ActionButton title="Add author" variant="addEntity" onClick={onAddNewAuthor} />
    </section>
  );
};
