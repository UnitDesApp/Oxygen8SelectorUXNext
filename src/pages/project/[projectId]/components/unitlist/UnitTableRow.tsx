import { useState, useCallback, MouseEventHandler } from 'react';
// @mui
// import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, MenuItem, Divider, Stack, IconButton } from '@mui/material';
import TableMoreMenu from 'src/components/table/TableMoreMenu';
import Iconify from 'src/components/iconify';
// components
// import Label from '../../components/Label';

// ----------------------------------------------------------------------

type UnitTableRowProps = {
  row: {
    tag: string;
    qty: string;
    prod_type: string;
    unit_type: string;
    unit_model: string;
    cfm: string;
    sel_comp: string;
    actions: string;
  };
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: MouseEventHandler<HTMLButtonElement>;
  onDuplicate: () => void;
  onDeleteRow: () => void;
};

export default function UnitTableRow({
  row,
  selected,
  onEditRow,
  onDuplicate,
  onSelectRow,
  onDeleteRow,
}: UnitTableRowProps) {
  // const theme = useTheme();

  const { tag, qty, prod_type, unit_type, unit_model, cfm, sel_comp } = row || {};

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = useCallback((event: any) => {
    setOpenMenuActions(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenuActions(null);
  }, []);

  return (
    <TableRow hover sx={{ borderBottom: '1px solid #a7b1bc' }} selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {tag}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {qty}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {prod_type}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {unit_type}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {unit_model}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {cfm}
      </TableCell>
      <TableCell align="center" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
       <Stack direction="row" spacing={1} justifyContent="center"  alignItems="center">
       {sel_comp === "Yes" ? (
        <IconButton aria-label="check" sx={{ backgroundColor: 'white', color: 'green' }}>
          <Iconify icon="mdi:check-circle" />
        </IconButton>
        ) : (
          <IconButton aria-label="close" sx={{ backgroundColor: 'white', color: 'red' }}>
              <Iconify icon="mdi:close-circle" /> 
            </IconButton>
        )}
      </Stack>
    </TableCell>
      <TableCell align="right">
      <TableCell align="left" sx={{ cursor: 'pointer' }}>
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="edit" onClick={onDuplicate}>
            <Iconify icon="ic:outline-file-copy" />
          </IconButton>
          <IconButton aria-label="delete" onClick={onDeleteRow}>
            <Iconify icon="mdi:trash-outline" />
          </IconButton>
        </Stack>
      </TableCell>

         {/* <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem sx={{ color: 'info.main' }} onClick={onEditRow}>
                <Iconify icon="fa-solid:pen" />
                Edit Unit
              </MenuItem>
              <MenuItem sx={{ color: 'info.main' }} onClick={onDuplicate}>
                <Iconify icon="codicon:copy" />
                Duplicate
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon="eva:trash-2-outline" />
                Delete
              </MenuItem>
            </>
          }
        />  */}
      </TableCell>    
    </TableRow>
  );
}
