// react
import { useCallback, useEffect, useMemo } from 'react';
// next
import Head from 'next/head';
import { Box, Container, Stack, Tab, Button, Tabs } from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { PROJECT_DASHBOARD_TABS } from 'src/utils/constants';
import { useSettingsContext } from '../../../components/settings';
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';
import useTabs from 'src/hooks/useTabs';
import { capitalCase } from 'change-case';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
// import sub components
import UnitList from './components/unitlist/UnitList';
import ProjectDetail from './components/detail/ProjectDetail';
import ProjectQuote from './components/quote/ProjectQuote';
import ProjectSubmittal from './components/submittal/ProjectSubmittal';
import ProjectStatus from './components/status/ProjectStatus';
import ProjectNote from './components/note/ProjectNote';

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

  useEffect(() => {
    setCurrentTab(tab?.toString() || '');
  }, [tab]);

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
          heading={tabData?.title || ''}
          links={[{ name: 'Projects', href: PATH_APP.project }, { name: tabData?.title || '' }]}
          action={
            <Stack spacing={2} direction="row" alignItems="flex-end" sx={{ mt: 3 }}>
              <Button variant="text" startIcon={<Iconify icon={'bxs:download'} />}>
                Export report
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon={'eva:plus-fill'} />}
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
          {TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.title)} value={tab.value} />
          ))}
        </Tabs>
        <Box sx={{ my: 3 }}>{tabData?.component || null}</Box>
      </Container>
    </>
  );
}
