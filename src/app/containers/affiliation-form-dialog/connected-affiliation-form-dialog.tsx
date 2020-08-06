import React, { useCallback } from 'react';
import { Affiliation } from 'app/models/affiliation';
import { useDispatch, useSelector } from 'react-redux';
import { AffiliationFormDialog } from 'app/containers/affiliation-form-dialog/affiliation-form-dialog';
import { Person } from 'app/models/person';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { linkAffiliationsAction } from 'app/actions/manuscript.actions';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { objectsEqual } from 'app/utils/view.utils';
import { getAffiliatedAuthors } from 'app/selectors/manuscript.selectors';

interface ConnectedAffiliationsFormDialogProps {
  affiliation?: Affiliation;
}

export const ConnectedAffiliationFormDialog: React.FC<ConnectedAffiliationsFormDialogProps> = (props) => {
  const dispatch = useDispatch();
  const isNewAffiliation = !props.affiliation;

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const affiliatedAuthors = useSelector(getAffiliatedAuthors)(props.affiliation?.id);

  const handleAccept = useCallback(
    (userAffiliation: Affiliation, linkedAuthors: Person[]) => {
      if (isNewAffiliation) {
        dispatch(manuscriptActions.addAffiliationAction(userAffiliation));
        dispatch(linkAffiliationsAction({ affiliation: userAffiliation, authors: linkedAuthors }));
      } else {
        if (!objectsEqual(props.affiliation, userAffiliation) || !objectsEqual(linkedAuthors, affiliatedAuthors)) {
          dispatch(manuscriptActions.updateAffiliationAction(userAffiliation));
          dispatch(linkAffiliationsAction({ affiliation: userAffiliation, authors: linkedAuthors }));
        }
      }
      closeDialog();
    },
    [props.affiliation, closeDialog, dispatch, isNewAffiliation, affiliatedAuthors]
  );

  const handleDelete = useCallback(
    (affiliation: Affiliation) => {
      dispatch(manuscriptActions.deleteAffiliationAction(affiliation));
      closeDialog();
    },
    [closeDialog, dispatch]
  );

  return (
    <AffiliationFormDialog
      affiliation={props.affiliation}
      allowLinkAuthors={true}
      onAccept={handleAccept}
      onDelete={handleDelete}
      onCancel={closeDialog}
    />
  );
};
