import React, { useCallback } from 'react';
import { Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import DragIcon from 'app/assets/drag-indicator.svg';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { getAffiliations, getAuthors } from 'app/selectors/manuscript.selectors';
import { useAuthorsListStyles } from './styles';
import { SectionContainer } from 'app/components/section-container';
import { getAuthorAffiliationsLabels, getAuthorDisplayName, Person } from 'app/models/person';
import { AuthorFormDialog } from 'app/containers/author-form-dialog';
import { ActionButton } from 'app/components/action-button';
import { Affiliation } from 'app/models/affiliation';
import { isEqual } from 'lodash';

const DragHandle = React.memo(
  SortableHandle(() => <img src={DragIcon} alt="drag handle" aria-hidden={true} className="drag-handle" />),
  isEqual
);

interface ChipRenderComponent {
  className: string;
}

const ChipRenderComponent: React.FC<ChipRenderComponent> = React.memo((props) => {
  return (
    <div className={props.className}>
      <DragHandle />
      {props.children}
    </div>
  );
}, isEqual);

const SortableItem = React.memo(
  SortableElement(({ value, classes, onEdit }) => (
    <Chip
      classes={{ root: classes.chip, label: classes.chipLabel }}
      label={
        <span>
          {value.authorName}
          {value.affiliationLabels.length > 0 ? <sup>({value.affiliationLabels.join(',')})</sup> : ''}
        </span>
      }
      onDelete={() => onEdit()}
      component={ChipRenderComponent}
      color="primary"
      deleteIcon={<EditIcon />}
    />
  )),
  isEqual
);

const SortableList = React.memo(
  SortableContainer(({ children, className }) => {
    return <div className={className}> {children} </div>;
  }),
  isEqual
);

const getSortableItemLabel = (author: Person, affiliations: Affiliation[]) => {
  const affiliationLabels = getAuthorAffiliationsLabels(author, affiliations);
  return {
    authorName: getAuthorDisplayName(author),
    affiliationLabels
  };
};

export const SortableAuthorsList: React.FC = React.memo(() => {
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
      <SectionContainer label="Authors">
        <SortableList className={classes.sortableContainer} onSortEnd={onSortEnd} axis="xy" useDragHandle={true}>
          {authors.map((value, index) => (
            <SortableItem
              key={`item-${value.id}`}
              index={index}
              value={getSortableItemLabel(value, affiliations)}
              classes={classes}
              onEdit={onEditAuthor}
            />
          ))}
        </SortableList>
      </SectionContainer>
      <ActionButton title="Author" variant="addEntity" onClick={onAddNewAuthor} className={classes.addAuthorButton} />
    </section>
  );
}, isEqual);
