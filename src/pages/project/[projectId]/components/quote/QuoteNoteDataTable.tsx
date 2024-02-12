import React, { useState, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Stack,
  TextField,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import Iconify from 'src/components/iconify';

type QuoteNoteDataTableProps = {
  tableData: any[];
  addRow: Function;
  deleteRow: Function;
  updateRow: Function;
};

export default function QuoteNoteDataTable({
  tableData,
  addRow,
  deleteRow,
  updateRow,
}: QuoteNoteDataTableProps) {
  const [txbNotes, setNotes] = useState('');
  const [selectedID, setSelectedID] = useState(-1);
  const theme = useTheme();

  const addNoteClicked = useCallback(async () => {
    if (txbNotes) {
      await addRow(txbNotes);
      setNotes('');
      setSelectedID(-1);
    }
  }, [addRow, txbNotes]);

  const updateNoteClicked = useCallback(async () => {
    await updateRow(txbNotes, selectedID);
    setNotes('');
    setSelectedID(-1);
  }, [selectedID, txbNotes, updateRow]);

  const cancelEditClicked = useCallback(() => {
    setNotes('');
    setSelectedID(-1);
  }, []);

  const selectRowClicked = useCallback((txt: string, id: number) => {
    setNotes(txt);
    setSelectedID(id);
  }, []);

  return (
    <>
      <Stack direction="row" spacing={2}>
        <TextField
          sx={{ width: '70%' }}
          size="small"
          name="txbNotes"
          label="Enter Note"
          value={txbNotes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {selectedID > 0 ? (
          <Stack direction="row" spacing={1} sx={{ width: '30%' }}>
            <Button
              sx={{ width: '50%', borderRadius: '5px', mt: '1px' }}
              variant="contained"
              onClick={updateNoteClicked}
            >
              Update Notes
            </Button>
            <Button
              sx={{ width: '30%', borderRadius: '5px', mt: '1px' }}
              variant="contained"
              onClick={cancelEditClicked}
            >
              Cancel
            </Button>
          </Stack>
        ) : (
          <Button
            sx={{ width: '30%', borderRadius: '5px', mt: '1px' }}
            variant="contained"
            onClick={addNoteClicked}
          >
            Add Notes
          </Button>
        )}
      </Stack>
      <Box sx={{ pt: '10px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" sx={{ width: '20%' }} align="center">
                No
              </TableCell>
              <TableCell component="th" sx={{ width: '70%' }} align="center">
                Notes
              </TableCell>
              <TableCell component="th" sx={{ width: '5%' }} align="center" />
              <TableCell component="th" sx={{ width: '5%' }} align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData !== undefined &&
              tableData.map((row) => (
                <TableRow
                  key={row.notes_no}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {row.notes_no}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.notes}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    <IconButton
                      sx={{ color: theme.palette.success.main }}
                      onClick={() => selectRowClicked(row.notes, row.notes_no)}
                    >
                      <Iconify icon="material-symbols:edit-square-outline" />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    onClick={() => deleteRow(row.notes_no)}
                  >
                    <IconButton sx={{ color: theme.palette.warning.main }}>
                      <Iconify icon="ion:trash-outline" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
