import React from 'react';
import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { SectionContainer } from 'app/components/section-container';
import { ActionButton } from 'app/components/action-button';
import { getAffiliations } from 'app/selectors/manuscript.selectors';
import { Affiliation } from 'app/models/affiliation';
import { useAffiliationStyles } from './styles';

export const AffiliationsList: React.FC<{}> = () => {
  const classes = useAffiliationStyles();
  const affiliations = useSelector(getAffiliations);

  const renderAffiliation = (aff: Affiliation) => (
    <div key={aff.id} className={classes.listItem}>
      <div className={classes.affiliationInfo}>
        <sup className={classes.orderLabel}>({aff.label})</sup>
        {[aff.institution.department, aff.institution.name, aff.address.city, aff.country]
          .filter((field) => Boolean(field))
          .join(', ')}
      </div>
      <IconButton classes={{ root: classes.editButton }} onClick={() => {}}>
        <EditIcon fontSize="small" />
      </IconButton>
    </div>
  );

  return (
    <section>
      <SectionContainer label="Affiliations">{affiliations.map(renderAffiliation)}</SectionContainer>
      <ActionButton title="Affiliation" variant="addEntity" onClick={() => {}} className={classes.addButton} />
    </section>
  );
};
