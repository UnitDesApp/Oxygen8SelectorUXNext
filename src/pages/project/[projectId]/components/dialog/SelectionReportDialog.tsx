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
  Radio,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useExport } from 'src/hooks/useExport';

const EXPORT_METHODS = [
  { label: 'Selection in PDF', id: 'pdfSelection' },
  { label: 'Selection in Excel', id: 'excelSelection' },
  { label: 'Revit files', id: 'revit_files' },
];

interface SelectionReportDialogProps {
  isOpen: boolean;
  onClose: Function;
  intProjectID: string;
  intUnitNo: string;
}

export default function SelectionReportDialog({
  isOpen,
  onClose,
  intProjectID,
  intUnitNo,
}: SelectionReportDialogProps) {
  const [methods, setMethods] = useState<{ [name: string]: any }>({
    pdfSelection: false,
    excelSelection: false,
    revit_files: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [openSuccessNotify, setOpenSuccessNotify] = useState(false);
  const [successNotifyText, setSuccessNotifyText] = useState(false);
  const [openFailNotify, setOpenFailNotify] = useState(false);
  const [failNotifyText, setFailNotifyText] = useState(false);
  const { ExportUnitSelectionPdf, ExportUnitSelectionExcel, ExportUnitSelectionRevit } = useExport();

  const onChangeMethods = useCallback(
    (label: string, value: any) => {
      setMethods({ ...methods, [label]: !value });
    },
    [methods]
  );

  const onClickExports = useCallback(async () => {
    setIsLoading(true);
    if (methods.pdfSelection) {
      const isSubmittalSuccess = await ExportUnitSelectionPdf(intProjectID, intUnitNo);
    }

    if (methods.excelSelection) {
      const isSubmittalSuccess = await ExportUnitSelectionExcel(Number(intProjectID), intUnitNo);
    }

    if (methods.revit_files) {
      const isSubmittalSuccess = await ExportUnitSelectionRevit(Number(intProjectID), intUnitNo);
    }

    setIsLoading(false);
  }, [
    ExportUnitSelectionPdf,
    ExportUnitSelectionExcel,
    ExportUnitSelectionRevit,
    intProjectID,
    intUnitNo,
    methods.excelSelection,
    methods.pdfSelection,
    methods.revit_files,
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
    </Dialog>
  );
}
