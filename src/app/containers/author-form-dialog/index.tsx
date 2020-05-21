import React, { SyntheticEvent, useCallback, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import { useAuthorFormStyles } from './styles';
import { createAuthor, Person } from '../../models/person';
import * as manuscriptEditorActions from '../../actions/manuscript-editor.actions';
import * as manuscriptActions from '../../actions/manuscript.actions';

interface AuthorFormDialogProps {
  author?: Person;
}

const labelProps = { shrink: true };

export const AuthorFormDialog: React.FC<AuthorFormDialogProps> = (props) => {
  const dispatch = useDispatch();
  const isNewAuthor = !props.author;
  console.log(props.author, isNewAuthor);
  const [author, setAuthor] = useState<Person>(
    props.author || createAuthor(undefined, { firstName: '', lastName: '' })
  );

  const classes = useAuthorFormStyles();

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleFormChange = useCallback(
    (event: SyntheticEvent) => {
      const fieldName = event.target['name'];
      const newValue = event.target['value'];
      setAuthor({
        ...author,
        [fieldName]: newValue
      });
    },
    [author, setAuthor]
  );

  const handleDone = useCallback(() => {
    if (isNewAuthor) {
      dispatch(manuscriptActions.addAuthorAction(author));
    } else {
      dispatch(manuscriptActions.updateAuthorAction(author));
    }
    closeDialog();
  }, [author, closeDialog, dispatch, isNewAuthor]);

  return (
    <section className={classes.root}>
      <TextField
        fullWidth
        name="firstName"
        label="Given name"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={author.firstName}
        onChange={handleFormChange}
      />
      <TextField
        fullWidth
        name="lastName"
        label="Surname"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={author.lastName}
        onChange={handleFormChange}
      />
      <TextField
        name="suffix"
        label="Suffix"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={author.suffix || ''}
        onChange={handleFormChange}
      />
      <TextField
        name="email"
        fullWidth
        label="Email"
        classes={{ root: classes.inputField }}
        InputLabelProps={labelProps}
        variant="outlined"
        value={author.email || ''}
        onChange={handleFormChange}
      />
      <div className={classes.buttonPanel}>
        {!isNewAuthor ? (
          <Button variant="outlined" classes={{ root: classes.deleteButton }}>
            Delete
          </Button>
        ) : undefined}
        <div aria-hidden={true} className={classes.spacer}></div>
        <Button variant="outlined" onClick={closeDialog}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={handleDone}>
          Done
        </Button>
      </div>
    </section>
  );
};
