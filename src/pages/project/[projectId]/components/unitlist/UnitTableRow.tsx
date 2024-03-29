import { useState, useCallback, MouseEventHandler } from 'react';
// @mui
// import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, MenuItem, Divider } from '@mui/material';
import TableMoreMenu from 'src/components/table/TableMoreMenu';
import Iconify from 'src/components/iconify';
// components
// import Label from '../../components/Label';

// ----------------------------------------------------------------------

type UnitTableRowProps = {
  row: {
    tag: string;
    qty: string;
    unit_type: string;
    unit_model: string;
    cfm: string;
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

  const { tag, qty, unit_type, unit_model, cfm } = row || {};

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
        {unit_type}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {unit_model}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {cfm}
      </TableCell>
      <TableCell align="right">
        <TableMoreMenu
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
        />
      </TableCell>
    </TableRow>
  );
}
