import React, { useCallback, SyntheticEvent } from 'react';
import { TextField, IconButton, Menu, MenuItem } from '@material-ui/core';
import { has, isEqual } from 'lodash';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SortableHandle, SortableContainer, SortableElement } from 'react-sortable-hoc';
import DragIcon from 'app/assets/drag-indicator-grey.svg';

import { ReferenceContributor } from 'app/models/reference';
import { useReferenceContributorStyles } from 'app/containers/reference-form-dialog/styles';
import { ActionButton } from 'app/components/action-button';

interface ReferenceRefContributorsListProps {
  refContributors: ReferenceContributor[];
  addCtaLabel: string;
  className: string;
  entityName: string;
  onChange(refContributors: ReferenceContributor[]): void;
}

interface RefContributorInputProps {
  value: {
    contributor: ReferenceContributor;
    entityName: string;
  };
  onDelete(): void;
  onChange(refContributors: ReferenceContributor): void;
}

const labelProps = { shrink: true };

const isGroupRefContributor = (refContributor: ReferenceContributor) => {
  return has(refContributor, 'groupName');
};

const DragHandle = React.memo(
  SortableHandle(() => <img src={DragIcon} alt="drag handle" aria-hidden={true} className="drag-handle" />),
  isEqual
);

const SortableList = React.memo(
  SortableContainer(({ className, children }) => <section className={className}> {children} </section>),
  isEqual
);

const renderRefContributorForm = (classes, refContributor, handleFormChange) => (
  <>
    <TextField
      fullWidth
      name="lastName"
      label="Surname(s)"
      classes={{ root: classes.lastName }}
      InputLabelProps={labelProps}
      variant="outlined"
      value={refContributor['lastName']}
      onChange={handleFormChange}
    />
    <TextField
      fullWidth
      name="firstName"
      label="Given name"
      InputLabelProps={labelProps}
      variant="outlined"
      value={refContributor['firstName']}
      onChange={handleFormChange}
    />
  </>
);

const renderGroupForm = (classes, refGroup, handleFormChange) => (
  <TextField
    fullWidth
    name="groupName"
    label="Group Name"
    InputLabelProps={labelProps}
    variant="outlined"
    value={refGroup['groupName']}
    onChange={handleFormChange}
  />
);

const RefContributorInput = SortableElement<RefContributorInputProps>(({ value, onChange, onDelete }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { contributor, entityName } = value;
  const handleFormChange = useCallback(
    (event: SyntheticEvent) => {
      onChange({ ...contributor, [event.target['name']]: event.target['value'] });
    },
    [contributor, onChange]
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

  const handleToggleRefContributorType = useCallback(() => {
    if (isGroupRefContributor(contributor)) {
      onChange({ firstName: '', lastName: contributor['groupName'] });
    } else {
      onChange({ groupName: `${contributor['lastName']} ${contributor['firstName']} ` });
    }
    closeMenu();
  }, [contributor, onChange, closeMenu]);

  const handleDelete = useCallback(() => {
    onDelete();
    closeMenu();
  }, [closeMenu, onDelete]);

  const classes = useReferenceContributorStyles();

  return (
    <section className={classes.contributorInputFields}>
      <DragHandle />
      {isGroupRefContributor(contributor)
        ? renderGroupForm(classes, contributor, handleFormChange)
        : renderRefContributorForm(classes, contributor, handleFormChange)}
      <IconButton onClick={openMenu} classes={{ root: classes.menuButton }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem test-id={'toggle-contributor-type-btn'} onClick={handleToggleRefContributorType}>
          {isGroupRefContributor(contributor) ? `Set to individual ${entityName}` : `Set to group ${entityName}`}
        </MenuItem>
        <MenuItem test-id={'delete-contributor-btn'} onClick={handleDelete}>
          Delete {entityName}
        </MenuItem>
      </Menu>
    </section>
  );
});

export const ReferenceContributorsList: React.FC<ReferenceRefContributorsListProps> = ({
  addCtaLabel,
  className,
  entityName,
  refContributors,
  onChange
}) => {
  const handleRefContributorChange = useCallback(
    (index: number) => (refContributor: ReferenceContributor) => {
      const updatedRefContributorsList = [...refContributors];
      updatedRefContributorsList[index] = refContributor;
      onChange(updatedRefContributorsList);
    },
    [onChange, refContributors]
  );

  const addNewRefContributor = useCallback(() => {
    onChange([...refContributors, { firstName: '', lastName: '' }]);
  }, [onChange, refContributors]);

  const handleRefContributorDelete = useCallback(
    (index: number) => () => {
      const updatedRefContributorList = [...refContributors];
      updatedRefContributorList.splice(index, 1);
      onChange(updatedRefContributorList);
    },
    [refContributors, onChange]
  );

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      const refContributorsList = [...refContributors];

      const movedRefContributor = refContributorsList[oldIndex];
      refContributorsList.splice(oldIndex, 1);
      refContributorsList.splice(newIndex, 0, movedRefContributor);
      onChange(refContributorsList);
    },
    [onChange, refContributors]
  );

  return (
    <SortableList onSortEnd={onSortEnd} axis="y" className={className} useDragHandle={true}>
      {refContributors.map((contributor, index) => (
        <RefContributorInput
          index={index}
          key={index}
          value={{ contributor, entityName }}
          onChange={handleRefContributorChange(index)}
          onDelete={handleRefContributorDelete(index)}
        />
      ))}
      <ActionButton variant="addEntity" title={addCtaLabel} onClick={addNewRefContributor} />
    </SortableList>
  );
};
