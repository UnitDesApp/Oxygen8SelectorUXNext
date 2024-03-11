// react
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
// next
import Head from 'next/head';
import {
  Alert,
  Box,
  Container,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableLoadingData,
} from 'src/components/table';
import { ROLE_OPTIONS } from 'src/utils/constants';
import { useAuthContext } from 'src/auth/useAuthContext';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import { useGetAllProjects } from 'src/hooks/useApi';
import { PATH_APP } from 'src/routes/paths';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import { useApiContext } from 'src/contexts/ApiContext';
import ProjectTableToolbar from './components/table/ProjectTableToolbar';
import ProjectTableRow from './components/table/ProjectTableRow';
import { useSettingsContext } from '../../components/settings';
import DashboardLayout from '../../layouts/dashboard';
import TableHeadCustom from './components/table/TableHeadCustom';
import NewProjectDialog from './components/newProjectDialog/NewProjectDialog';

// ----------------------------------------------------------------------

Project.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Project() {
  const { themeStretch } = useSettingsContext();
  // router
  const { push } = useRouter();
  // project api
  const { project } = useApiContext();

  // Table State
  const [filterName, setFilterName] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [newProjectDialogOpen, setNewProjectDialog] = useState<boolean>(false);
  const [isOneConfirmDialog, setOneConfirmDialogState] = useState<boolean>(false);
  const [isOpenMultiConfirmDialog, setMultiConfirmDialogState] = useState<boolean>(false);
  const [deleteRowID, setDeleteRowID] = useState<number>(-1);

  // Notification State
  const [openDuplicateSuccess, setOpenDuplicateSuccess] = useState(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openFail, setOpenFail] = useState<boolean>(false);

  const { data: projects, isLoading: isLoadingProjects, refetch } = useGetAllProjects();

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

  const { user } = useAuthContext();

  const handleCloseSuccess = (e: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseFail = (e: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenFail(false);
  };

  const handleClickNewProjectDialogOpen = () => {
    setNewProjectDialog(true);
  };

  const handleNewProjectDialogClose = () => {
    setNewProjectDialog(false);
  };

  const handleOneConfirmDialogOpen = (id: number) => {
    setDeleteRowID(id);
    setOneConfirmDialogState(true);
  };

  const handleOneConfirmDialogClose = () => {
    setDeleteRowID(-1);
    setOneConfirmDialogState(false);
  };

  const handleDeleteRow = () => {
    project.deleteProject({ action: 'DELETE_ONE', projectId: deleteRowID }).then(() => {
      refetch();
    });
    setSelected([]);
    setDeleteRowID(-1);
    handleOneConfirmDialogClose();
  };

  const handleMultiConfirmDialogOpen = () => {
    setMultiConfirmDialogState(true);
  };

  const handleMultiConfirmDialogClose = () => {
    setMultiConfirmDialogState(false);
  };

  const handleFilterName = (name: string) => {
    setFilterName(name);
    setPage(0);
  };

  const handleFilterRole = (value: string) => {
    setFilterRole(value);
  };

  const handleDeleteRows = () => {
    project.deleteProject({ action: 'DELETE_MULTIPUL', projectIdData: selected }).then(() => {
      refetch();
    });
    setSelected([]);
    setMultiConfirmDialogState(false);
  };

  const handleDuplicate = (row: any) => {
    project.duplicateProject(row).then(() => refetch());
    setOpenDuplicateSuccess(true);
  };

  const handleEditRow = (projectid: number) => {
    push(PATH_APP.projectDashboard(projectid.toString(), 'unitlist'));
  };

  const dataFiltered = useMemo(
    () =>
      projects &&
      applySortFilter({
        tableData: projects.jobList,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
        filterStatus,
      }),
    [filterName, filterRole, order, orderBy, projects, filterStatus]
  );

  const isNotFound = useMemo(
    () =>
      (!dataFiltered?.length && !!filterName) ||
      (!dataFiltered?.length && !!filterRole) ||
      (!dataFiltered?.length && !!filterStatus),
    [dataFiltered?.length, filterName, filterRole, filterStatus]
  );

  return (
    <>
      <Head>
        <title> Project | Oxygen8 </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h3" component="h1" paragraph>
            Projects
          </Typography>
        </Stack>

        <Alert sx={{ width: '100%', mt: 3, mb: 3 }} severity="info">
          <b>Pricing module is now availble</b> - select Quote after making a selection to review
          and generate a PDF. All values shown are Net prices.
        </Alert>

        {!dataFiltered && isLoadingProjects ? (
          <Box>
            <CircularProgressLoading />
          </Box>
        ) : (
          <Box>
            <ProjectTableToolbar
              filterName={filterName}
              onFilterName={handleFilterName}
              onFilterRole={handleFilterRole}
              onOpneDialog={handleClickNewProjectDialogOpen}
              optionsRole={ROLE_OPTIONS}
            />
            <Scrollbar sx={{ overflow: 'hidden' }}>
              <TableContainer>
                <Table size="small">
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    rowCount={dataFiltered?.length || 0}
                    numSelected={selected?.length || 0}
                    onSort={onSort}
                    onSelectAllRows={(checked: boolean) =>
                      onSelectAllRows(
                        checked,
                        dataFiltered?.map((row: any) => row.id)
                      )
                    }
                  />
                  <TableBody>
                    {dataFiltered
                      ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      ?.map((row: any) => (
                        <ProjectTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleOneConfirmDialogOpen(row.id)}
                          onDuplicate={() => handleDuplicate(row)}
                          onEditRow={() => handleEditRow(row.id)}
                        />
                      ))}
                    <TableEmptyRows
                      height={52}
                      emptyRows={emptyRows(page, rowsPerPage, dataFiltered?.length || 0)}
                    />
                    <TableLoadingData isLoading={isLoadingProjects} />
                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            <Box sx={{ position: 'relative' }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={dataFiltered?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />
            </Box>
          </Box>
        )}
        {projects?.jobInitInfo && (
          <NewProjectDialog
            open={newProjectDialogOpen}
            onClose={() => setNewProjectDialog(false)}
            setOpenSuccess={() => setOpenSuccess(true)}
            setOpenFail={() => setOpenFail(true)}
            initialInfo={projects?.jobInitInfo}
            refetch={refetch}
          />
        )}
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
            Project duplicate successfully!
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

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
}) => {
  if (!tableData || tableData.length === 0) return [];
  const stabilizedThis = tableData.map((el: any, i: number) => [el, i]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el: any) => el[0]);

  tableData.sort((a: any, b: any) => b.id - a.id);

  if (filterName) {
    tableData = tableData.filter(
      (item: {
        job_name: string;
        reference_no: string;
        revision_no: string;
        Customer_Name: string;
        User_Full_Name: string;
        created_date: string;
        revised_date: string;
      }) =>
        item?.job_name?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.reference_no?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.revision_no?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.Customer_Name?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.User_Full_Name?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.created_date?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item?.revised_date?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
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
