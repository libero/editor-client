import React, { useCallback, SyntheticEvent, useState, ChangeEvent } from 'react';
import { TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual, set } from 'lodash';

import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import * as manuscriptActions from 'app/actions/manuscript.actions';
import { ActionButton } from 'app/components/action-button';
import { useArticleInfoFormStyles } from 'app/containers/article-info-form-dialog/styles';
import { getArticleInformation } from 'app/selectors/manuscript.selectors';
import formGrid from 'app/styles/form-grid.module.scss';
import { Select } from 'app/components/select';
import { ArticleInformation } from 'app/models/manuscript';

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

  const closeDialog = useCallback(() => {
    dispatch(manuscriptEditorActions.hideModalDialog());
  }, [dispatch]);

  const handleFormChange = useCallback(
    (event: SyntheticEvent) => {
      const fieldName = event.target['name'];
      const newValue = event.target['value'];
      setArticleInfo({
        ...userArticleInfo,
        [fieldName]: newValue
      });
    },
    [userArticleInfo, setArticleInfo]
  );

  const handleSubjectChange = useCallback(
    (event: ChangeEvent<{ name: string; value: string }>) => {
      const fieldName = event.target['name'];
      const newValue = event.target['value'];
      const updatedArticleInfo = {
        ...userArticleInfo,
        subjects: [...userArticleInfo.subjects]
      };

      set(updatedArticleInfo, fieldName, newValue);
      updatedArticleInfo.subjects = updatedArticleInfo.subjects.filter(Boolean);
      setArticleInfo(updatedArticleInfo);
    },
    [userArticleInfo, setArticleInfo]
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
      </div>
      <div className={classes.buttonPanel}>
        <ActionButton variant="secondaryOutlined" onClick={closeDialog} title="Cancel" />
        <ActionButton variant="primaryContained" onClick={handleAccept} title="Done" />
      </div>
    </section>
  );
};
