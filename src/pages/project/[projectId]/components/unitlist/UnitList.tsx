import React, { useState, useMemo, useEffect } from 'react';
// @mui
import {
  Box,
  Card,
  Table,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';
// hooks
import useTabs from 'src/hooks/useTabs';
// components
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  getComparator,
  useTable,
  TableSelectedAction,
  emptyRows,
} from 'src/components/table';
import { useRouter } from 'next/router';
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import { useGetAllUnits } from 'src/hooks/useApi';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import { PATH_APP } from 'src/routes/paths';
import { useUnitTypeInfo } from 'src/state/state';
import { useApiContext } from 'src/contexts/ApiContext';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import UnitTableRow from './UnitTableRow';

const ROLE_OPTIONS = ['All', 'My Jobs', 'By Others'];

const TABLE_HEAD = [
  { id: 'tag', label: 'Tag', align: 'left' },
  { id: 'qty', label: 'Qty', align: 'left' },
  { id: 'product', label: 'Product', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'model', label: 'Model', align: 'left' },
  { id: 'airflow', label: 'Airflow', align: 'left' },
  { id: 'sel_comp', label: 'Selection Complete', align: 'center' },
  { id: 'actions', label: 'ACTIONS', align: 'left' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UnitList() {
  const { query, push } = useRouter();
  const { projectId } = query;

  const {
    data: units,
    isLoading: isLoadingUnits,
    refetch,
    isRefetching,
  } = useGetAllUnits({
    jobId: Number(projectId),
  });

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const dense = true;

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('All');

  // Delete one row
   const [openDuplicateSuccess, setOpenDuplicateSuccess] = useState(false);
  const [isOneConfirmDialog, setOneConfirmDialogState] = React.useState(false);
  const [isOpenMultiConfirmDialog, setMultiConfirmDialogState] = React.useState(false);
  const [deleteRowID, setDeleteRowID] = React.useState(-1);
  const { setIntProductTypeID, setIntUnitTypeID } = useUnitTypeInfo((state) => ({
    setIntProductTypeID: state.setIntProductTypeID,
    setIntUnitTypeID: state.setIntUnitTypeID,
  }));
  const { project } = useApiContext();
  
  useEffect(() => {
    localStorage.setItem('unitlist', '');
    localStorage.setItem('isNewUnitSelected', '0');
  }, []);

  const handleOneConfirmDialogOpen = (id: number) => {
    setDeleteRowID(id);
    setOneConfirmDialogState(true);
  };

  const handleOneConfirmDialogClose = () => {
    setDeleteRowID(-1);
    setOneConfirmDialogState(false);
  };

  const handleDeleteRow = async () => {
    const data: any = {
      intJobId: projectId?.toString() || '0',
      intUnitNo: deleteRowID || '0',
      intUAL: localStorage.getItem('UAL') || '0',
      intUserId: localStorage.getItem('userId') || '0',
      action: 'DELETE_ONE'
    };

    // project.deleteUnit({ action: 'DELETE_ONE', unittId: deleteRowID } as any).then(() => {
    project.deleteUnit(data).then(() => {

    // project.deleteJob({ action: 'DELETE_MULTIPUL', projectIdData: selected }).then(() => {
      refetch();
    });
    setDeleteRowID(-1);
    handleOneConfirmDialogClose();
  };

  const handleMultiConfirmDialogOpen = () => {
    setMultiConfirmDialogState(true);
  };

  const handleMultiConfirmDialogClose = () => {
    setMultiConfirmDialogState(false);
  };

  // eslint-disable-next-line no-unused-vars
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('All');


  const handleFilterName = (name: string) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (value: string) => {
    setFilterRole(value);
  };

  const handleDeleteRows = async () => {
    // const data = await deleteUnits({ action: 'DELETE_MULTI', jobId, unitIds: selected });
    setSelected([]);
    setMultiConfirmDialogState(false);
  };

  const handleEditRow = (row: any) => {
    setIntProductTypeID(Number(row.prod_type_id));
    setIntUnitTypeID(Number(row.unit_type_id));
    push(PATH_APP.editUnit(projectId?.toString() || '0', row.unit_no));
  };

  const handleClickNewUnit = () => {
    // navigate(PATH_UNIT.add(jobId));
  };
  const handleDuplicate = (row: any) => {
    const data: any = {
      intJobId: projectId?.toString() || '0',
      intUnitNo: row?.unit_no || '0',
      intUAL: localStorage.getItem('UAL') || '0',
      intUserId: localStorage.getItem('userId') || '0',
    };
    // project.duplicateUnit(row).then(() => refetch());
    project.duplicateUnit(data).then(() => refetch());
    // setOpenDuplicateSuccess(true);
  };

  const dataFiltered = useMemo(
    () =>
      applySortFilter({
        tableData: units?.unitList,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
        filterStatus,
      }),
    [units?.unitList, order, orderBy, filterName, filterRole, filterStatus]
  );

  const denseHeight = dense ? 52 : 72;

  const isNotFound = useMemo(
    () =>
      (!dataFiltered.length && !!filterName) ||
      (!dataFiltered.length && !!filterRole) ||
      (!dataFiltered.length && !!filterStatus),
    [dataFiltered.length, filterName, filterRole, filterStatus]
  );

  return isLoadingUnits || isRefetching ? (
    <Box>
      <CircularProgressLoading />
    </Box>
  ) : (
    <>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={units?.unitList?.length || 0}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                checked, units?.unitList.map((row: any) => row.unit_no))
              }
              action={
                <> </>
                // <Tooltip title="Delete">
                //   <IconButton color="primary" onClick={() => handleMultiConfirmDialogOpen()}>
                //     <Iconify icon="eva:trash-2-outline" />
                //   </IconButton>
                // </Tooltip>
              }
            />
          )}
        <ConfirmDialog
          isOpen={isOneConfirmDialog}
          onClose={handleOneConfirmDialogClose}
          onConfirm={handleDeleteRow}
          isOneRow
        />
          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={units?.unitList?.length || 0}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  units?.unitList?.map((row: any) => row.unit_no)
                )
              }
            />

            <TableBody>
              {dataFiltered
                // ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => (
                  <UnitTableRow
                    key={index}
                    row={row}
                    selected={selected.includes(row.unit_no)}
                    onSelectRow={() => onSelectRow(row.unit_no)}
                    onDeleteRow={() => handleOneConfirmDialogOpen(row.unit_no)}
                    onEditRow={() => handleEditRow(row)}
                    onDuplicate={() => handleDuplicate(row)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, units?.unitList?.length || 0)}
              />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      {/* <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Box> */}
      <Snackbar
          open={openDuplicateSuccess}
          autoHideDuration={3000}
          onClose={() => setOpenDuplicateSuccess(false)}
        >
          <Alert
            onClose={() => setOpenDuplicateSuccess(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            Unit duplicate successfully!
          </Alert>
        </Snackbar>
    </>
  );
}

// ----------------------------------------------------------------------

const applySortFilter = ({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  tableData: any;
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterRole: string;
}): any[] => {
  if (!tableData || tableData.length === 0) return [];
  const stabilizedThis = tableData.map((el: any, i: number) => [el, i]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el: any) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item: { tag: string; qty: string; prod_type: string; unit_type: string; unit_model: string; cfm: string; sel_comp: string }) =>
        item.tag.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.qty.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.prod_type.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.unit_type.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.unit_model.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.cfm.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.sel_comp.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
  }

  if (filterStatus !== 'All') {
    tableData = tableData.filter((item: any) => item.status === filterStatus);
  }

  if (filterRole !== 'All') {
    if (filterRole === 'My Projects') {
    tableData = tableData.filter(
        (item: any) => item.created_user_id.toString() === localStorage.getItem('userId')
      );
    } else {
      tableData = tableData.filter(
        (item: any) => item.created_user_id.toString() !== localStorage.getItem('userId')
    );
    }
  }

  return tableData;
};
