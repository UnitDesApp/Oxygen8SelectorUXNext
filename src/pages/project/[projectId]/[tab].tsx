// react
import { useCallback, useEffect, useMemo, useState } from 'react';
// next
import Head from 'next/head';
import { Box, Container, Stack, Tab, Button, Tabs, Typography } from '@mui/material';
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
// import ProjectDetail from './components/detail/ProjectDetail';
import ProjectQuote from './components/quote/ProjectQuote';
import ProjectSubmittal from './components/submittal/ProjectSubmittal';
import ProjectStatus from './components/status/ProjectStatus';
import ProjectNote from './components/note/ProjectNote';
import ReportDialog from './components/dialog/ReportDialog';
import ProjectDetail from '../components/newProjectDialog/ProjectInfo';
import { useGetSavedJobsByUserAndCustomer } from 'src/hooks/useApi';

// ----------------------------------------------------------------------

Project.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

// define Types
type ProjectItem = {
  Created_User_Full_Name: string;
  Customer_Name: string;
  Revised_User_Full_Name: string;
  company_contact_name: string;
  company_name: string;
  created_date: string;
  id: number;
  job_name: string;
  reference_no: string;
  revised_date: string;
  revision_no: number;
};

export default function Project() {
  const { themeStretch } = useSettingsContext();
  const { push, query } = useRouter();
  const { projectId, tab } = query;
  const projectIdNumber = Number(projectId);
  const { data: projects } = useGetSavedJobsByUserAndCustomer(
    {
      intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
      intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
    },
    {
      enabled: typeof window !== 'undefined',
    }
  );
  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    if (projects && projects.dbtJobList) {
      const filteredProject = projects.dbtJobList.find(
        (item: ProjectItem) => item.id === projectIdNumber
      );

      if (filteredProject) {
        setProjectName(filteredProject.job_name);
      } else {
        setProjectName(null);
      }
      console.log(filteredProject, 'jjab');
    }
  }, [projects, projectId]);

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
        component: (
          <ProjectDetail
            projectId={projectId?.toString()}
            onClose={() => setCurrentTab(PROJECT_DASHBOARD_TABS.UNITLIST)}
          />
        ),
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
    [projectId, setCurrentTab]
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
        <Typography sx={{ textAlign: 'center', fontSize: '28px', mt: '4px' }}>
          {projectName && projectName}
        </Typography>
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
