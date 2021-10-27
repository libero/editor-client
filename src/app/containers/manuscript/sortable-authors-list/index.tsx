import React, { Ref, useCallback } from 'react';
import { Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { isEqual } from 'lodash';

import DragIcon from '../../../assets/drag-indicator.svg';
import * as manuscriptActions from '../../../actions/manuscript.actions';
import * as manuscriptEditorActions from '../../../actions/manuscript-editor.actions';
import { getAffiliations, getAuthors } from '../../../selectors/manuscript.selectors';
import { useAuthorsListStyles } from './styles';
import { SectionContainer } from '../../../components/section-container';
import { Person } from '../../../models/person';
import { AuthorFormDialog } from '../../author-form-dialog';
import { ActionButton } from '../../../components/action-button';
import { ComponentWithId } from '../../../types/utility.types';

const DragHandle = React.memo(
  SortableHandle(() => <img src={DragIcon} alt="drag handle" aria-hidden={true} className="drag-handle" />),
  isEqual
);

interface ChipRenderComponent {
  className: string;
}

const ChipRenderComponent: React.FC<ChipRenderComponent> = React.memo(
  React.forwardRef((props, ref: Ref<HTMLDivElement>) => {
    return (
      <div className={props.className} ref={ref}>
        <DragHandle />
        {props.children}
      </div>
    );
  }),
  isEqual
);

const SortableItem = SortableElement(({ value, classes, onEdit }) => {
  const affLabels = value.author.getAffiliationsLabels(value.affiliations);

  return (
    <Chip
      classes={{ root: classes.chip, label: classes.chipLabel }}
      label={
        <span>
          {value.author.getDisplayName()}
          <sup>
            {affLabels.length > 0 ? affLabels.join(',') : undefined}
            {value.author.isCorrespondingAuthor ? '*' : undefined}
          </sup>
        </span>
      }
      onDelete={() => onEdit(value.author)}
      component={ChipRenderComponent}
      color="primary"
      deleteIcon={<EditIcon />}
    />
  );
});

const SortableList = React.memo(
  SortableContainer(({ children, className }) => {
    return <div className={className}> {children} </div>;
  }),
  isEqual
);

export const SortableAuthorsList: React.FC<ComponentWithId> = React.memo(({ id }) => {
  const authors = useSelector(getAuthors);
  const affiliations = useSelector(getAffiliations);
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
    (author: Person) => {
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
      <SectionContainer label="Authors" id={id}>
        <SortableList className={classes.sortableContainer} onSortEnd={onSortEnd} axis="xy" useDragHandle={true}>
          {authors.map((value, index) => (
            <SortableItem
              key={`item-${value.id}`}
              index={index}
              value={{ author: value, affiliations }}
              classes={classes}
              onEdit={onEditAuthor}
            />
          ))}
        </SortableList>
      </SectionContainer>
      <ActionButton
        title="Add Author"
        variant="addEntity"
        onClick={onAddNewAuthor}
        className={classes.addAuthorButton}
      />
    </section>
  );
}, isEqual);
