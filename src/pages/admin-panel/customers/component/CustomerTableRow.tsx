// @mui
import { styled } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Stack, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useCallback, useState } from 'react';
import { useGetAccountInfo } from 'src/hooks/useApi';
import customerDialog from '../../component/customerDialog';

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
  const [addCustomerDlgOpen, setAddCustomerDlgOpen] = useState(false);
  const [failDlgOpen, setFailDlgOpen] = useState(false);
  const [successDlgOpen, setSuccessDlgOpen] = useState(false);
  const [successText, setSuccessText] = useState('');

  const {refetch } = useGetAccountInfo();

  const onCloseCustomerDlg = useCallback(() => {
    setAddCustomerDlgOpen(false);
  }, []);
  const onSuccessAddCustomer = useCallback(() => {
    setSuccessText('Customer Edit Successfully');
    setSuccessDlgOpen(true);
  }, []);
  return (
    <>
    <TableRow hover sx={{ borderBottom: '1px solid #a7b1bc' }} selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={() => onSelectRow && onSelectRow()} />
      </TableCell>
      <CustomTableCell label={name} onClick={() => onEditRow && onEditRow()} />
      <CustomTableCell
        label={CustomerTypeOptions[customer_type_id - 1]}
        onClick={() => onEditRow && onEditRow()}
      />
      <CustomTableCell label={region} onClick={() => onEditRow && onEditRow()} />
      <CustomTableCell label={shipping_factor_percent} onClick={() => onEditRow && onEditRow()} />
      <CustomTableCell label={address} onClick={() => onEditRow && onEditRow()} />

      <TableCell align="right">
        <Stack direction="row">
          <StyledIconButton onClick={() => {
            setAddCustomerDlgOpen(true)
            } }>
            <Iconify icon="fa-solid:pen" />
          </StyledIconButton>
          <StyledIconButton onClick={() => onDeleteRow && onDeleteRow()}>
            <Iconify icon="eva:trash-2-outline" />
          </StyledIconButton>
        </Stack>
      </TableCell>
    </TableRow>
    <customerDialog
        name ='edit'
        row={row}
        open={addCustomerDlgOpen}
        onClose={onCloseCustomerDlg}
        onSuccess={onSuccessAddCustomer}
        onFail={() => setFailDlgOpen(true)}
        refetch={refetch}
      />
  </>
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
