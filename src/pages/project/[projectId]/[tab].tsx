// react
import { useCallback, useEffect, useMemo, useState } from 'react';
// next
import Head from 'next/head';
import { Box, Container, Stack, Tab, Button, Tabs } from '@mui/material';
// layouts
// components
import { PROJECT_DASHBOARD_TABS } from 'src/utils/constants';
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';
import useTabs from 'src/hooks/useTabs';
import { capitalCase } from 'change-case';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from '../../../components/settings';
import DashboardLayout from '../../../layouts/dashboard';
// import sub components
import UnitList from './components/unitlist/UnitList';
import ProjectDetail from './components/detail/ProjectDetail';
import ProjectQuote from './components/quote/ProjectQuote';
import ProjectSubmittal from './components/submittal/ProjectSubmittal';
import ProjectStatus from './components/status/ProjectStatus';
import ProjectNote from './components/note/ProjectNote';
import ReportDialog from './components/dialog/ReportDialog';

// ----------------------------------------------------------------------

Project.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Project() {
  const { themeStretch } = useSettingsContext();
  // router
  const { push, query } = useRouter();
  const { projectId, tab } = query;

  // useTab
  const { currentTab, onChangeTab, setCurrentTab } = useTabs(tab?.toString());

  // useState
  const [openExportDialog, setOpenExportDialog] = useState<boolean>(false);

  const handleOpneExportDialog = () => {
    setOpenExportDialog(true);
  };

  useEffect(() => {
    setCurrentTab(tab?.toString() || '');
  }, [setCurrentTab, tab]);

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
        component: <ProjectQuote />,
      },
      {
        value: PROJECT_DASHBOARD_TABS.SUBMITTAL,
        title: 'Submittal(internal)',
        component: <ProjectSubmittal />,
      },
      {
        value: PROJECT_DASHBOARD_TABS.STATUS,
        title: 'Status',
        component: <ProjectStatus />,
      },
      {
        value: PROJECT_DASHBOARD_TABS.NOTES,
        title: 'Notes',
        component: <ProjectNote />,
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

  const tabData = useMemo(
    () => TABS.filter((item) => item.value === currentTab)?.[0],
    [TABS, currentTab]
  );

  return (
    <>
      <Head>
        <title> Project | Oxygen8 </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading={tabData?.title || ''}
          links={[{ name: 'Projects', href: PATH_APP.project }, { name: tabData?.title || '' }]}
          action={
            <Stack spacing={2} direction="row" alignItems="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="text"
                startIcon={<Iconify icon="bxs:download" />}
                onClick={() => setOpenExportDialog(true)}
              >
                Export report
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={() => projectId && push(PATH_APP.newUnit(projectId?.toString()))}
              >
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
          {TABS.map((tabItem) => (
            <Tab
              disableRipple
              key={tabItem.value}
              label={capitalCase(tabItem.title)}
              value={tabItem.value}
            />
          ))}
        </Tabs>
        <Box sx={{ my: 3 }}>{tabData?.component || null}</Box>
      </Container>
      <ReportDialog
        isOpen={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        intProjectID={projectId?.toString() || ''}
      />
    </>
  );
}
