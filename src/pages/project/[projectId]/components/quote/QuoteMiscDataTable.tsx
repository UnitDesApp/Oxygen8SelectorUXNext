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

const DefaultMiscValues = {
  txbMisc: '',
  txbMiscQty: '1',
  txbMiscPrice: '0.0',
};

type QuoteMiscDataTableProps = {
  tableData: any[];
  addRow: (objMisc: { txbMisc: string; txbMiscQty: string; txbMiscPrice: string }) => void;
  deleteRow: (selectedID: number) => void;
  updateRow: (
    objMisc: { txbMisc: string; txbMiscQty: string; txbMiscPrice: string },
    selectedID: number
  ) => void;
};

export default function QuoteMiscDataTable({
  tableData,
  addRow,
  deleteRow,
  updateRow,
}: QuoteMiscDataTableProps) {
  const [objMisc, setMisc] = useState(DefaultMiscValues);
  const [selectedID, setSelectedID] = useState(-1);
  const theme = useTheme();

  const addMiscClicked = useCallback(() => {
    if (objMisc.txbMisc) {
      addRow(objMisc);
      setMisc(DefaultMiscValues);
      setSelectedID(-1);
    }
  }, [addRow, objMisc]);

  const updateMiscClicked = useCallback(() => {
    updateRow(objMisc, selectedID);
    setMisc(DefaultMiscValues);
    setSelectedID(-1);
  }, [objMisc, selectedID, updateRow]);

  const cancelEditClicked = useCallback(() => {
    setMisc(DefaultMiscValues);
    setSelectedID(-1);
  }, []);

  const selectRowClicked = useCallback((row: any) => {
    setMisc({
      txbMisc: row.misc,
      txbMiscQty: row.qty,
      txbMiscPrice: row.price.substring(1),
    });
    setSelectedID(row.misc_no);
  }, []);

  return (
    <>
      <Stack direction="row" spacing={2}>
        <TextField
          sx={{ width: '55%' }}
          size="small"
          name="txbMisc"
          label="Enter Miscellaneous"
          value={objMisc.txbMisc}
          onChange={(e) => setMisc({ ...objMisc, txbMisc: e.target.value })}
        />
        <TextField
          sx={{ width: '15%' }}
          size="small"
          name="txbQty"
          label="Enter QTY"
          value={objMisc.txbMiscQty}
          onChange={(e) => setMisc({ ...objMisc, txbMiscQty: e.target.value })}
        />
        <TextField
          sx={{ width: '15%' }}
          size="small"
          name="txbPrice"
          label="Enter Price"
          value={objMisc.txbMiscPrice}
          onChange={(e) => setMisc({ ...objMisc, txbMiscPrice: e.target.value })}
        />

        {selectedID > 0 ? (
          <Stack direction="row" spacing={1} sx={{ width: '30%' }}>
            <Button
              sx={{ width: '50%', borderRadius: '5px', mt: '1px' }}
              variant="contained"
              onClick={updateMiscClicked}
            >
              Update Misc
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
            onClick={addMiscClicked}
          >
            Add Misc
          </Button>
        )}
      </Stack>
      <Box sx={{ pt: '10px' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" sx={{ width: '10%' }} scope="row" align="center">
                No
              </TableCell>
              <TableCell component="th" sx={{ width: '60%' }} scope="row" align="center">
                Miscellaneous
              </TableCell>
              <TableCell component="th" sx={{ width: '15%' }} scope="row" align="center">
                Qty
              </TableCell>
              <TableCell component="th" sx={{ width: '15%' }} scope="row" align="center">
                Price
              </TableCell>
              <TableCell component="th" sx={{ width: '5%' }} align="center" />
              <TableCell component="th" sx={{ width: '5%' }} align="center" />
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData !== undefined &&
              tableData.map((row) => (
                <TableRow
                  key={row.misc_no}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {row.misc_no}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.misc}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.qty}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.price}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    <IconButton
                      sx={{ color: theme.palette.success.main }}
                      onClick={() => selectRowClicked(row)}
                    >
                      <Iconify icon="material-symbols:edit-square-outline" />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="center"
                    onClick={() => deleteRow(row.misc_no)}
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
