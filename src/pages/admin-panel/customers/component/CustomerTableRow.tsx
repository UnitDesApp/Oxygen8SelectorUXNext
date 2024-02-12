// @mui
import { styled } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Stack, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: 30,
  height: 30,
  color: theme.palette.primary.main,
}));

// ----------------------------------------------------------------------

const CustomerTypeOptions = ['All', 'Admin', 'Internal', 'Rep Firm', 'Specifying Firm'];

// ----------------------------------------------------------------------

interface CustomerTableRowProps {
  row: any;
  selected: boolean;
  onEditRow: Function;
  onSelectRow?: Function;
  onDeleteRow?: Function;
}

export default function CustomerTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: CustomerTableRowProps) {
  const { name, customer_type_id, address, shipping_factor_percent, region } = row || {};

  return (
    <TableRow hover sx={{ borderBottom: '1px solid #a7b1bc' }} selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={() => onSelectRow && onSelectRow()} />
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => onEditRow && onEditRow()}>
        {name}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => onEditRow && onEditRow()}>
        {CustomerTypeOptions[customer_type_id]}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => onEditRow && onEditRow()}>
        {region}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => onEditRow && onEditRow()}>
        {shipping_factor_percent}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={() => onEditRow && onEditRow()}>
        {address}
      </TableCell>
      <TableCell align="right">
        <Stack direction="row">
          <StyledIconButton onClick={() => onEditRow && onEditRow()}>
            <Iconify icon="fa-solid:pen" />
          </StyledIconButton>
          <StyledIconButton onClick={() => onDeleteRow && onDeleteRow()}>
            <Iconify icon="eva:trash-2-outline" />
          </StyledIconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
