import React, { useCallback, SyntheticEvent, useState, ChangeEvent } from 'react';
import { TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual, set } from 'lodash';
import Interweave from 'interweave';
import classNames from 'classnames';

import * as manuscriptEditorActions from '../../actions/manuscript-editor.actions';
import * as manuscriptActions from '../../actions/manuscript.actions';
import { ActionButton } from '../../components/action-button';
import { useArticleInfoFormStyles } from './styles';
import { getArticleInformation, getAuthors } from '../../selectors/manuscript.selectors';
import formGrid from '../../styles/form-grid.module.scss';
import { Select } from '../../components/select';
import { ArticleInformation, LICENSE_CC0, LICENSE_CC_BY_4 } from '../../models/article-information';
import { SectionContainer } from '../../components/section-container';
import { stringifyEditorState } from '../../utils/view.utils';

const labelProps = { shrink: true };

const SubjectOptions = [
  'Biochemistry and Chemical Biology',
  'Cancer Biology',
  'Cell Biology',
  'Chromosomes and Gene Expression',
  'Computational and Systems Biology',
  'Developmental Biology',
  'Ecology',
  'Epidemiology and Global Health',
  'Evolutionary Biology',
  'Genetics and Genomics',
  'Medicine',
  'Immunology and Inflammation',
  'Microbiology and Infectious Disease',
  'Neuroscience',
  'Physics of Living Systems',
  'Plant Biology',
  'Stem Cells and Regenerative Medicine',
  'Structural Biology and Molecular Biophysics'
].map((title) => ({ label: title, value: title }));

export const ArticleInfoFormDialog: React.FC<{}> = () => {
  const classes = useArticleInfoFormStyles();
  const dispatch = useDispatch();
  const articleInfo = useSelector(getArticleInformation);

  const [userArticleInfo, setArticleInfo] = useState<ArticleInformation>(articleInfo);
  const authors = useSelector(getAuthors);
  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleFormChange = useCallback(
    (event: SyntheticEvent) => {
      const fieldName = event.target['name'];
      const newValue = event.target['value'];
      const newArticleInfo = userArticleInfo.clone();
      newArticleInfo[fieldName] = newValue;
      if (fieldName === 'publicationDate') {
        newArticleInfo.updateCopyrightStatement(authors);
      }
      setArticleInfo(newArticleInfo);
    },
    [userArticleInfo, authors]
  );

  const handleSubjectChange = useCallback(
    (event: ChangeEvent<{ name: string; value: string }>) => {
      const fieldName = event.target['name'];
      const newValue = event.target['value'];
      const newArticleInfo = userArticleInfo.clone();
      set(newArticleInfo, fieldName, newValue);
      newArticleInfo.subjects = newArticleInfo.subjects.filter(Boolean);
      setArticleInfo(newArticleInfo);
    },
    [userArticleInfo]
  );

  const handleLicenseTypeChange = useCallback(
    (event: ChangeEvent<{ name: string; value: string }>) => {
      const newLicenseType = event.target['value'];
      const newArticleInfo = userArticleInfo.clone();
      newArticleInfo.licenseType = newLicenseType;
      newArticleInfo.licenseText = ArticleInformation.getLicenseText(newLicenseType);
      newArticleInfo.updateCopyrightStatement(authors);
      setArticleInfo(newArticleInfo);
    },
    [userArticleInfo, authors]
  );

  const handleAccept = useCallback(() => {
    if (!isEqual(userArticleInfo, articleInfo)) {
      dispatch(manuscriptActions.updateArticleInformationAction(userArticleInfo));
    }
    closeDialog();
  }, [closeDialog, articleInfo, userArticleInfo, dispatch]);

  return (
    <section className={classes.root}>
      <div className={formGrid.container}>
        <Select
          className={formGrid.fullWidth}
          name="subjects.0"
          placeholder="Please select"
          fullWidth
          canUnselect={true}
          blankValue={undefined}
          label="Subject *"
          value={userArticleInfo.subjects[0]}
          onChange={handleSubjectChange}
          options={SubjectOptions}
        />
        <Select
          className={formGrid.fullWidth}
          name="subjects.1"
          placeholder="Please select"
          fullWidth
          canUnselect={true}
          blankValue={undefined}
          label="Subject"
          value={userArticleInfo.subjects[1]}
          onChange={handleSubjectChange}
          options={SubjectOptions}
        />
        <TextField
          fullWidth
          name="articleDOI"
          label="Article DOI"
          classes={{ root: formGrid.fullWidth }}
          InputLabelProps={labelProps}
          variant="outlined"
          value={userArticleInfo.articleDOI}
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          name="publisherId"
          label="Publisher ID"
          classes={{ root: formGrid.fullWidth }}
          InputLabelProps={labelProps}
          variant="outlined"
          value={userArticleInfo.publisherId}
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          name="elocationId"
          label="eLocation ID"
          classes={{ root: formGrid.fullWidth }}
          InputLabelProps={labelProps}
          variant="outlined"
          value={userArticleInfo.elocationId}
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          name="volume"
          label="Volume"
          classes={{ root: formGrid.firstCol }}
          InputLabelProps={labelProps}
          variant="outlined"
          value={userArticleInfo.volume}
          onChange={handleFormChange}
        />
        <TextField
          fullWidth
          name="publicationDate"
          label="Published"
          type="date"
          classes={{ root: formGrid.fullWidth }}
          InputLabelProps={labelProps}
          variant="outlined"
          value={userArticleInfo.publicationDate}
          onChange={handleFormChange}
        />
        <Select
          className={formGrid.fullWidth}
          placeholder="Please select"
          fullWidth
          blankValue={''}
          label="License type"
          value={userArticleInfo.licenseType}
          onChange={handleLicenseTypeChange}
          options={[
            { label: LICENSE_CC_BY_4, value: LICENSE_CC_BY_4 },
            { label: LICENSE_CC0, value: LICENSE_CC0 }
          ]}
        />
        {userArticleInfo.licenseType === LICENSE_CC_BY_4 ? (
          <SectionContainer
            label="Copyright statement"
            variant="outlined"
            className={classNames(formGrid.fullWidth, classes.contentSection)}
          >
            {userArticleInfo.copyrightStatement}
          </SectionContainer>
        ) : undefined}
        {userArticleInfo.licenseType ? (
          <SectionContainer
            label="Permissions"
            variant="outlined"
            className={classNames(formGrid.fullWidth, classes.contentSection)}
          >
            <Interweave content={stringifyEditorState(userArticleInfo.licenseText)} />
          </SectionContainer>
        ) : undefined}
      </div>
      <div className={classes.buttonPanel}>
        <ActionButton variant="secondaryOutlined" onClick={closeDialog} title="Cancel" />
        <ActionButton variant="primaryContained" onClick={handleAccept} title="Done" />
      </div>
    </section>
  );
};
