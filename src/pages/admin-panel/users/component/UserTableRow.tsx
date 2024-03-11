// @mui
import { styled } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Stack, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
// components

// ----------------------------------------------------------------------

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: 30,
  height: 30,
  color: theme.palette.primary.main,
}));

// ----------------------------------------------------------------------

interface UserTableRowProps {
  row: any;
  selected: boolean;
  isCheckbox: boolean;
  onEditRow: Function;
  onSelectRow: Function;
  onDeleteRow: Function;
}

export default function UserTableRow({
  row,
  selected,
  isCheckbox = true,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: UserTableRowProps) {
  const {
    username,
    first_name,
    last_name,
    email,
    name,
    access,
    access_level,
    access_pricing,
    created_date,
  } = row || {};

  console.log(row);

  return (
    <TableRow hover sx={{ borderBottom: '1px solid #a7b1bc' }} selected={selected}>
      {isCheckbox && (
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={() => onSelectRow()} />
        </TableCell>
      )}

      <CustomTableCell label={username} onClick={() => onEditRow()} />
      <CustomTableCell label={first_name} onClick={() => onEditRow()} />
      <CustomTableCell label={last_name} onClick={() => onEditRow()} />
      <CustomTableCell label={email} onClick={() => onEditRow()} />
      <CustomTableCell label={name} onClick={() => onEditRow()} />
      <CustomTableCell label={access} onClick={() => onEditRow()} />
      <CustomTableCell label={access_level} onClick={() => onEditRow()} />
      <CustomTableCell label={access_pricing} onClick={() => onEditRow()} />
      <CustomTableCell label={created_date} onClick={() => onEditRow()} />
      <TableCell align="right">
        <Stack direction="row">
          <StyledIconButton onClick={() => onEditRow()}>
            <Iconify icon="fa-solid:pen" />
          </StyledIconButton>
          <StyledIconButton onClick={() => onDeleteRow()}>
            <Iconify icon="eva:trash-2-outline" />
          </StyledIconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

const CustomTableCell = ({ label, onClick }: { label: string; onClick: Function }) => (
  <TableCell
    align="left"
    sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
    onClick={() => onClick()}
  >
    {label}
  </TableCell>
);
