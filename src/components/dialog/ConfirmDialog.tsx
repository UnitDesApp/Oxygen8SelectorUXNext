import React, { useMemo } from 'react';
// material
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: Function;
  onConfirm: Function;
  isOneRow: boolean;
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isOneRow,
}: ConfirmDialogProps) {
  const text = useMemo(
    () =>
      isOneRow
        ? 'Are you sure you want to delete this unit?'
        : 'Are you sure you want to delete the selected data?',
    [isOneRow]
  );

  return (
    <Dialog open={isOpen} onClose={() => onClose && onClose()}>
      <DialogTitle id="responsive-dialog-title">{text}</DialogTitle>
      <DialogActions>
        <Button autoFocus onClick={() => onClose && onClose()}>
          Cancel
        </Button>
        <Button onClick={() => onConfirm && onConfirm()} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
