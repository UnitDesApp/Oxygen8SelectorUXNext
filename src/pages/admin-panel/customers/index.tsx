import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
// @mui
import { Box, TableContainer, Table, TableBody, TablePagination, Container } from '@mui/material';
// hooks
import { useGetAccountInfo } from 'src/hooks/useApi';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  emptyRows,
  getComparator,
  useTable,
} from 'src/components/table';
import { useApiContext } from 'src/contexts/ApiContext';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import Loading from 'src/components/loading';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import CustomerTableRow from './component/CustomerTableRow';
import TableSelectedActions from './component/TableSelectedActions';
import CustomerTableToolbar from './component/CustomerTableToolbar';
import useTabs from '../../../hooks/useTabs';
import AdminPanelWrapper from '../component/AdminPanelWrapper';
// components

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Customer Name', align: 'left' },
  { id: 'customer_type', label: 'Customer Type', align: 'left' },
  { id: 'add_text', label: 'Region', align: 'left' },
  { id: 'shipping_factor', label: 'Shipping Factor', align: 'left' },
  { id: 'address', label: 'Address', align: 'left' },
  { id: '' },
];

// ------------------------------------------------------------------------
Customers.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
// ------------------------------------------------------------------------

export default function Customers() {
  const api = useApiContext();
  const { data: accountInfo, isLoading, refetch } = useGetAccountInfo();
  const { dbtSavCustomer  } = accountInfo || { customers: [] };
  const { push } = useRouter();
  const dense = true;

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState(dbtSavCustomer);
  const [customerType, setCustomerType] = useState();
  const filterRole = useState('All');

  useEffect(() => {
    setTableData(dbtSavCustomer);
  }, [dbtSavCustomer]);

  // Delete one row
  const [isOneConfirmDialog, setOneConfirmDialogState] = useState(false);
  const [isOpenMultiConfirmDialog, setMultiConfirmDialogState] = useState(false);
  const [deleteRowID, setDeleteRowID] = useState(-1);

  const handleOneConfirmDialogOpen = useCallback((id: number) => {
    setDeleteRowID(id);
    setOneConfirmDialogState(true);
  }, []);

  const handleOneConfirmDialogClose = useCallback(() => {
    setDeleteRowID(-1);
    setOneConfirmDialogState(false);
  }, []);

  const handleDeleteRow = useCallback(async () => {
    try {
      const data = await api.account.removeCustomer({
        action: 'DELETE_ONE',
        customerId: deleteRowID,
      });
      setTableData(data);
      setDeleteRowID(-1);
      handleOneConfirmDialogClose();
    } catch (e) {
      console.log(e);
    }
  }, [deleteRowID, handleOneConfirmDialogClose, api.account]);

  const handleMultiConfirmDialogOpen = useCallback(() => {
    setMultiConfirmDialogState(true);
  }, []);

  const handleMultiConfirmDialogClose = useCallback(() => {
    setMultiConfirmDialogState(false);
  }, []);

  // eslint-disable-next-line no-unused-vars
  const { currentTab: filterStatus } = useTabs('All');

  const handleFilterName = useCallback(
    (name: string) => {
      setFilterName(name);
      setPage(0);
    },
    [setPage]
  );

  const handleDeleteRows = useCallback(async () => {
    if (selected.length > 0) {
      const data = await api.account.removeCustomer({
        action: 'DELETE_MULTI',
        customerIds: selected,
      });

      setTableData(data);
      setSelected([]);
      setMultiConfirmDialogState(false);
    }
  }, [selected, setSelected, api.account]);

  const handleEditRow = useCallback(
    (row: any) => {
      push(`/admin-panel/customers/${row?.id || '0'}`);
    },
    [push]
  );

  const filteredData = useMemo(
    () =>
      applySortFilter({
        tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
        filterStatus,
        customerType,
      }),
    [filterName, filterRole, filterStatus, order, orderBy, customerType, tableData]
  );

  const handleFilterByCustomerName = (type: any) => {
    setCustomerType(type);
  };

  const denseHeight = useMemo(() => (dense ? 52 : 72), [dense]);

  const isNotFound = useMemo(
    () =>
      (!filteredData?.length && !!filterName) ||
      (!filteredData?.length && !!filterRole) ||
      (!filteredData?.length && !!filterStatus),
    [filterName, filterRole, filterStatus, filteredData?.length]
  );

  if (isLoading) return <Loading />;

  return (
    <AdminPanelWrapper currentTab="customers" refetch={refetch}>
      <CustomerTableToolbar
        filterName={filterName}
        onFilterName={handleFilterName}
        userNum={filteredData?.length}
        onDeleteSelectedData={handleMultiConfirmDialogOpen}
        onFilterByCustomerName={handleFilterByCustomerName}
      />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedActions
              numSelected={selected.length}
              onSelectAllRows={onSelectAllRows}
              rowCount={selected.length}
            />
          )}

          <Table size="medium">
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData?.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row: any) => row.id)
                )
              }
            />

            <TableBody>
              {filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: number) => (
                  <CustomerTableRow
                    key={index}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => handleOneConfirmDialogOpen(row.id)}
                    onEditRow={() => handleEditRow(row)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, tableData?.length)}
              />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Box>

      <ConfirmDialog
        isOpen={isOneConfirmDialog}
        onClose={handleOneConfirmDialogClose}
        onConfirm={handleDeleteRow}
        isOneRow
      />
      <ConfirmDialog
        isOpen={isOpenMultiConfirmDialog}
        onClose={handleMultiConfirmDialogClose}
        onConfirm={handleDeleteRows}
        isOneRow={false}
      />
    </AdminPanelWrapper>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
  customerType,
}: any) {
  const stabilizedThis = tableData?.map((el: any, index: number) => [el, index]);

  stabilizedThis?.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis?.map((el: any) => el[0]);
  if (filterName) {
    tableData = tableData?.filter(
      (item: any) =>
        Object.values(item).filter((value) =>
          value?.toString().toLowerCase().includes(filterName.toLowerCase())
        ).length > 0
    );
  }

  if (filterStatus !== 'All') {
    tableData = tableData?.filter((item: any) => item.status === filterStatus);
  }

  if (customerType && customerType !== '1') {
    tableData = tableData?.filter(
      (item: any) => item.customer_type_id.toString() === customerType.toString()
    );
  }

  return tableData;
}
