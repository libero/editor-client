import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Button, CircularProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { isManuscriptLoaded } from 'app/selectors/manuscript.selectors';
import { ManuscriptToolbar } from './manuscript-toolbar';
import { ManuscriptEditor } from './manuscript-editor';
import * as manuscriptEditorActions from 'app/actions/manuscript-editor.actions';
import { ManuscriptTOC } from './manuscript-toc';
import { HotKeyBindings } from './hot-keys';
import { getExportTask, hasUnsavedChanges } from 'app/selectors/manuscript-editor.selectors';
import { useAlertStyles } from 'app/containers/manuscript/styles';
import { PDF_EXPORT_ERROR, PDF_EXPORT_RUNNING, PDF_EXPORT_SUCCESS } from 'app/store';

const renderBackdrop = (): JSX.Element => (
  <Backdrop open={true}>
    <CircularProgress color="inherit" />
  </Backdrop>
);

export const ManuscriptContainer: React.FC = () => {
  const [tocOpen, setTocOpen] = React.useState<boolean>(false);
  const checkForUnsavedChanges = useSelector(hasUnsavedChanges);
  const exportTask = useSelector(getExportTask);
  const alertClasses = useAlertStyles();
  const dispatch = useDispatch();

  const handleTocToggle = useCallback(() => {
    setTocOpen(!tocOpen);
  }, [tocOpen, setTocOpen]);

  const handleCancel = useCallback(() => {
    dispatch(manuscriptEditorActions.cancelExportPdfTask());
  }, [dispatch]);

  const handleOpenPDF = useCallback(() => {
    // open PDF
  }, []);

  const handleRetry = useCallback(() => {
    dispatch(manuscriptEditorActions.exportPdfAction());
  }, [dispatch]);

  useEffect(() => {
    const eventHandler = (e): boolean => {
      if (checkForUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = true;
        return true;
      }
    };

    window.addEventListener('beforeunload', eventHandler);
    return () => window.removeEventListener('beforeunload', eventHandler);
  }, [checkForUnsavedChanges]);

  const renderExportTaskAlert = useCallback(
    (exportTaskStatus: string) => {
      if (exportTaskStatus === PDF_EXPORT_RUNNING) {
        return (
          <Alert severity="info" classes={{ icon: alertClasses.alertIcon }} elevation={6} color="info" variant="filled">
            Your PDF is processing and will be ready shortly.
            <Button onClick={handleCancel} classes={{ root: alertClasses.actionButton }} disableElevation>
              Cancel
            </Button>
          </Alert>
        );
      } else if (exportTaskStatus === PDF_EXPORT_SUCCESS) {
        return (
          <Alert
            severity="success"
            classes={{ icon: alertClasses.alertIcon }}
            elevation={6}
            color="success"
            variant="filled"
          >
            Your PDF is ready.
            <Button onClick={handleOpenPDF} classes={{ root: alertClasses.actionButton }} disableElevation>
              View now
            </Button>
          </Alert>
        );
      } else if (exportTaskStatus === PDF_EXPORT_ERROR) {
        return (
          <Alert
            severity="success"
            classes={{ icon: alertClasses.alertIcon }}
            elevation={6}
            color="error"
            variant="filled"
          >
            Your PDF could not be generated.
            <Button onClick={handleRetry} classes={{ root: alertClasses.actionButton }} disableElevation>
              Try again
            </Button>
          </Alert>
        );
      } else {
        return undefined;
      }
    },
    [alertClasses.actionButton, alertClasses.alertIcon, handleCancel, handleOpenPDF, handleRetry]
  );

  const isLoaded = useSelector(isManuscriptLoaded);

  const renderContent = (): JSX.Element => (
    <React.Fragment>
      <HotKeyBindings />

      <Snackbar
        classes={{ anchorOriginTopRight: alertClasses.snackBarPosition }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={!!exportTask}
      >
        {exportTask && renderExportTaskAlert(exportTask.status)}
      </Snackbar>

      <ManuscriptTOC tocOpen={tocOpen} handleTocToggle={handleTocToggle.bind(null, this)} />
      <ManuscriptToolbar tocOpen={tocOpen} handleTocToggle={handleTocToggle.bind(null, this)} />
      <ManuscriptEditor />
    </React.Fragment>
  );

  return isLoaded ? renderContent() : renderBackdrop();
};
