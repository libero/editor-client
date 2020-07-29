import React, { useCallback, SyntheticEvent } from 'react';
import { TextField, IconButton, Menu, MenuItem } from '@material-ui/core';
import { has, isEqual } from 'lodash';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SortableHandle, SortableContainer, SortableElement } from 'react-sortable-hoc';

import { ReferencePerson } from 'app/models/reference';
import { useReferenceAuthorStyles } from 'app/containers/reference-form-dialog/styles';
import { ActionButton } from 'app/components/action-button';
import DragIcon from 'app/assets/drag-indicator-grey.svg';

interface ReferenceAuthorsListProps {
  refAuthors: ReferencePerson[];
  onChange(refAuthors: ReferencePerson[]): void;
}

interface RefAuthorInputProps {
  refAuthor: ReferencePerson;
  onDelete(): void;
  onChange(refAuthors: ReferencePerson): void;
}

const labelProps = { shrink: true };

const isGroupAuthor = (refAuthor: ReferencePerson) => {
  return has(refAuthor, 'groupName');
};

const DragHandle = React.memo(
  SortableHandle(() => <img src={DragIcon} alt="drag handle" aria-hidden={true} className="drag-handle" />),
  isEqual
);

const SortableList = React.memo(
  SortableContainer(({ children }) => <section> {children} </section>),
  isEqual
);

const renderSingleAuthorForm = (classes, refAuthor, handleFormChange) => (
  <>
    <TextField
      fullWidth
      name="lastName"
      label="Surname(s)"
      classes={{ root: classes.lastName }}
      InputLabelProps={labelProps}
      variant="outlined"
      value={refAuthor['lastName']}
      onChange={handleFormChange}
    />
    <TextField
      fullWidth
      name="firstName"
      label="Given name"
      InputLabelProps={labelProps}
      variant="outlined"
      value={refAuthor['firstName']}
      onChange={handleFormChange}
    />
  </>
);

const renderGroupAuthorForm = (classes, refAuthor, handleFormChange) => (
  <TextField
    fullWidth
    name="firstName"
    label="Group Author"
    InputLabelProps={labelProps}
    variant="outlined"
    value={refAuthor['groupName']}
    onChange={handleFormChange}
  />
);

const RefAuthorInput = SortableElement(({ value, onChange, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const refAuthor = value.author;
  const handleFormChange = useCallback(
    (event: SyntheticEvent) => {
      const newRefAuthor = { ...refAuthor, [event.target['name']]: event.target['value'] };
      onChange(newRefAuthor);
    },
    [refAuthor, onChange]
  );

  const openMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleToggleAuthorType = useCallback(() => {
    if (isGroupAuthor(refAuthor)) {
      onChange({ firstName: '', lastName: refAuthor['groupName'] });
    } else {
      onChange({ groupName: `${refAuthor['firstName']} ${refAuthor['lastName']}` });
    }
    closeMenu();
  }, [refAuthor, onChange, closeMenu]);

  const handleDelete = useCallback(() => {
    onDelete();
    closeMenu();
  }, [closeMenu, onDelete]);

  const classes = useReferenceAuthorStyles();

  return (
    <section className={classes.authorInputFields}>
      <DragHandle />
      {isGroupAuthor(refAuthor)
        ? renderGroupAuthorForm(classes, refAuthor, handleFormChange)
        : renderSingleAuthorForm(classes, refAuthor, handleFormChange)}
      <IconButton onClick={openMenu} classes={{ root: classes.menuButton }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem test-id={'toggle-author-type-btn'} onClick={handleToggleAuthorType}>
          {isGroupAuthor(refAuthor) ? 'Set to individual author' : 'Set to group author'}
        </MenuItem>
        <MenuItem test-id={'delete-author-btn'} onClick={handleDelete}>
          Delete author
        </MenuItem>
      </Menu>
    </section>
  );
});

export const ReferenceAuthorsList: React.FC<ReferenceAuthorsListProps> = ({ refAuthors, onChange }) => {
  const handleAuthorChange = useCallback(
    (index: number) => (author: ReferencePerson) => {
      const updatedAuthorsList = [...refAuthors];
      updatedAuthorsList[index] = author;
      onChange(updatedAuthorsList);
    },
    [onChange, refAuthors]
  );

  const addNewAuthor = useCallback(() => {
    onChange([...refAuthors, { firstName: '', lastName: '' }]);
  }, [onChange, refAuthors]);

  const handleAuthorDelete = useCallback(
    (index: number) => () => {
      const updatedAuthorsList = [...refAuthors];
      updatedAuthorsList.splice(index, 1);
      onChange(updatedAuthorsList);
    },
    [refAuthors, onChange]
  );

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      const authorsList = [...refAuthors];

      const movedAuthor = authorsList[oldIndex];
      authorsList.splice(oldIndex, 1);
      authorsList.splice(newIndex, 0, movedAuthor);
      onChange(authorsList);
    },
    [onChange, refAuthors]
  );

  return (
    <SortableList onSortEnd={onSortEnd} axis="y" useDragHandle={true}>
      {refAuthors.map((author, index) => (
        <RefAuthorInput
          index={index}
          key={index}
          value={{ author }}
          onChange={handleAuthorChange(index)}
          onDelete={handleAuthorDelete(index)}
        />
      ))}
      <ActionButton variant="addEntity" title="Author" onClick={addNewAuthor} />
    </SortableList>
  );
};
