// react
import { useCallback, useMemo, useState } from 'react';
// next
import Head from 'next/head';
import {
  Alert,
  Box,
  Container,
  Stack,
  Tab,
  Table,
  TableBody,
  TablePagination,
  Button,
  Tabs,
  Typography,
} from '@mui/material';
import TableHeadCustom from '../components/table/TableHeadCustom';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableLoadingData,
} from 'src/components/table';
import { PROJECT_DASHBOARD_TABS, ROLE_OPTIONS } from 'src/utils/constants';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from '../../../components/settings';
import ProjectTableRow from '../components/table/ProjectTableRow';
import ProjectTableToolbar from '../components/table/ProjectTableToolbar';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import { useGetAllProjects } from 'src/hooks/useApi';
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';
import useTabs from 'src/hooks/useTabs';
import { capitalCase } from 'change-case';
import UnitList from './components/unitlist/UnitList';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import ProjectDetail from './components/detail/ProjectDetail';

// ----------------------------------------------------------------------

Project.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Project() {
  const { themeStretch } = useSettingsContext();
  // router
  const { push, query } = useRouter();
  const { projectId, tab } = query;

  // useTab
  const { currentTab, onChangeTab } = useTabs(tab?.toString());

  const TABS = useMemo(
    () => [
      {
        value: PROJECT_DASHBOARD_TABS.UNITLIST,
        title: 'Unit list',
        component: <UnitList />,
      },
      {
        value: PROJECT_DASHBOARD_TABS.PROJECT_DETAILS,
        title: 'Project Detail',
        component: <ProjectDetail />,
      },

      {
        value: PROJECT_DASHBOARD_TABS.QUOTE,
        title: 'Quote',
        component: 'Comming Soon...',
      },
      {
        value: PROJECT_DASHBOARD_TABS.SUBMITTAL,
        title: 'Submittal(internal)',
        component: 'Comming Soon...',
      },

      {
        value: PROJECT_DASHBOARD_TABS.STATUS,
        title: 'Status',
        component: 'Comming Soon...',
      },
      {
        value: PROJECT_DASHBOARD_TABS.NOTES,
        title: 'Notes',
        component: 'Comming Soon...',
      },
    ],
    []
  );

  const onChangeTabHandle = useCallback(
    (e: any, id: string) => {
      push(PATH_APP.projectDashboard(projectId?.toString() || '', id));
      onChangeTab(e, id);
    },
    [push, onChangeTab, projectId]
  );

  const tabData = useMemo(() => {
    return TABS.filter((item) => item.value === currentTab)?.[0];
  }, [TABS, currentTab]);

  return (
    <>
      <Head>
        <title> Project | Oxygen8 </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={tabData.title}
          links={[{ name: 'Projects', href: PATH_APP.project }, { name: tabData.title }]}
          action={
            <Stack spacing={2} direction="row" alignItems="flex-end" sx={{ mt: 3 }}>
              <Button variant="text" startIcon={<Iconify icon={'bxs:download'} />}>
                Export report
              </Button>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                Add new unit
              </Button>
            </Stack>
          }
        />
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTabHandle}
        >
          {TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.title)} value={tab.value} />
          ))}
        </Tabs>
        <Box sx={{ my: 3 }}>{tabData.component}</Box>
      </Container>
    </>
  );
}
