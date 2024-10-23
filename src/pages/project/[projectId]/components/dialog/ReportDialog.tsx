import React, { useCallback, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Grid,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useExport } from 'src/hooks/useExport';
import { useGetSavedJob, useGetSavedQuote, useGetSubmittal } from 'src/hooks/useApi';

const EXPORT_METHODS = [
  { label: 'Quote', id: 'quote' },
  { label: 'Selection', id: 'selection' },
  { label: 'Mechanical Schedule', id: 'mech_schedule' },
  { label: 'Revit files', id: 'revit_files' },
  { label: 'Submittal', id: 'submittal' },
];

interface ReportDialogProps {
  isOpen: boolean;
  onClose: Function;
  intProjectID: string;
  // dtSavedJob: any;
  // dtSavedQuote: any;
  // dtSavedSubmittal: any;
}

// export default function ReportDialog({ isOpen, onClose, intProjectID, dtSavedJob, dtSavedQuote, dtSavedSubmittal }: ReportDialogProps) {
export default function ReportDialog({ isOpen, onClose, intProjectID }: ReportDialogProps) {
  const [methods, setMethods] = useState<{ [name: string]: any }>({
    quote: false,
    selection: false,
    mech_schedule: false,
    revit_files: false,
    submittal: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSuccessNotify, setOpenSuccessNotify] = useState<boolean>(false);
  const [successNotifyText, setSuccessNotifyText] = useState<string>('');
  const [openFailNotify, setOpenFailNotify] = useState<boolean>(false);
  const [failNotifyText, setFailNotifyText] = useState<string>('');
  const {
    ExportQuotePdf,
    ExportAllUnitsSelectionPdf,
    ExportMechanicalScheduleExcel,
    ExportAllUnitsSelectionRevit,
    ExportSubmittalPdf,
    ExportSubmittalEpicorExcel,
  } = useExport();



  const { data: dtSavedJob } = useGetSavedJob({intJobId: intProjectID}); // useGetSavedJob api call returns data and stores in dbtSavedJob
  
  const { data: dtSavedQuote } = useGetSavedQuote({
    intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
    intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
    intJobId: Number(intProjectID),
    // intUnitNo: 1,
  });
 
  const { data: dtSavedSubmittal } = useGetSubmittal({
    intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
    intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
    intJobId: intProjectID,
  });


  const onChangeMethods = useCallback(
    (label: string, value: any) => {
      setMethods({ ...methods, [label]: !value });
    },
    [methods]
  );

  const onClickExports = useCallback(async () => {
    setIsLoading(true);

    if (methods.quote) {
      if (dtSavedQuote.length === 0 ||Number(dtSavedQuote?.[0]?.quote_id) < 1) {
        setSnackbarMessage('Quote not available. Quote not saved.');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }
      const result = await ExportQuotePdf(Number(intProjectID), dtSavedJob);
      // if (result === 'server_error') {
      //   setFailNotifyText('Server Error!');
      //   setOpenFailNotify(true);
      // } else if (result === 'fail') {
      //   setFailNotifyText('Quote muste be saved. Please check Quote info!');
      //   setOpenFailNotify(true);
      // }
    }

    const storedArrayString = typeof window !== 'undefined' && localStorage?.getItem('unitlist');
    const storedArray = storedArrayString ? JSON.parse(storedArrayString) : [];

    if (methods.selection) {
      await ExportAllUnitsSelectionPdf(Number(intProjectID), dtSavedJob);
    }


    if (methods.mech_schedule) {
      await ExportMechanicalScheduleExcel(Number(intProjectID), dtSavedJob);
    }


    if (methods.revit_files) {
      await ExportAllUnitsSelectionRevit(Number(intProjectID), dtSavedJob);
    }


    if (methods.submittal) {
      if (dtSavedSubmittal.length === 0) {
        setSnackbarMessage('Submittal not available. Submittal must be saved.');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }
      const isSubmittalSuccess = await ExportSubmittalPdf(Number(intProjectID), dtSavedJob, dtSavedSubmittal);

      // if (isSubmittalSuccess) {
      //   setSuccessNotifyText('Success export report for Submitall!');
      //   setOpenSuccessNotify(true);
      // } else if (!isSubmittalSuccess) {
      //   setFailNotifyText('Unfortunately, fail in downloading Submttal Data.! Submittal must be saved!');
      //   setOpenFailNotify(true);
      // // } else if (!isSubmitallEpicorSuccess) {
      // //   setFailNotifyText(
      // //     'Unfortunately, fail in downloading file, please check  Submttal and Quote data!'
      // //   );
      // //   setOpenFailNotify(true);
      // } else {
      //   setFailNotifyText('Please check the project submittal!');
      //   setOpenFailNotify(true);
      // }
    }


    setIsLoading(false);
  }, [
    intProjectID,
    dtSavedJob,
    dtSavedQuote,
    dtSavedSubmittal,
    methods.quote,
    methods.selection,
    methods.mech_schedule,
    methods.revit_files,
    methods.submittal,
    ExportQuotePdf,
    ExportAllUnitsSelectionPdf,
    ExportMechanicalScheduleExcel,
    ExportAllUnitsSelectionRevit,
    ExportSubmittalPdf,
    // ExportSubmittalEpicorExcel,
  ]);


  const onCloseDialog = useCallback(() => {
    setIsLoading(false);
    onClose();
  }, [onClose]);


  const handleCloseNotify = useCallback((key: string) => {
    if (key === 'success') {
      setOpenSuccessNotify(false);
    } else if (key === 'fail') {
      setOpenFailNotify(false);
    }
  }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose && onClose()}
      aria-labelledby="responsive-dialog-title"
    >
      <Box sx={{ width: '100%', minWidth: 450 }}>
        <DialogTitle id="responsive-dialog-title" sx={{ px: '40px' }}>
          Select report(s) to export
        </DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {EXPORT_METHODS.map(({ label, id }) => (
              <ListItem key={id}>
                <ListItemButton
                  role={undefined}
                  onClick={() => onChangeMethods(id, methods[id])}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={methods[id]}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': 'checkbox-list-label-selection' }}
                    />
                  </ListItemIcon>
                  <ListItemText id="checkbox-list-label-selection" primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Grid container sx={{ width: '100%' }} spacing={3}>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={onCloseDialog}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                loading={isLoading}
                fullWidth
                onClick={onClickExports}
                variant="contained"
                autoFocus
              >
                Export
              </LoadingButton>
            </Grid>
          </Grid>
        </DialogActions>
        <Snackbar
          open={openSuccessNotify}
          autoHideDuration={3000}
          onClose={() => handleCloseNotify('success')}
        >
          <Alert
            onClose={() => handleCloseNotify('success')}
            severity="success"
            sx={{ width: '100%' }}
          >
            {successNotifyText}
          </Alert>
        </Snackbar>
        <Snackbar
          open={openFailNotify}
          autoHideDuration={3000}
          onClose={() => handleCloseNotify('warning')}
        >
          <Alert
            onClose={() => handleCloseNotify('fail')}
            severity="warning"
            sx={{ width: '100%' }}
          >
            {failNotifyText}
          </Alert>
        </Snackbar>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
