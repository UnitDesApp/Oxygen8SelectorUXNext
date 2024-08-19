import React, { useCallback, useRef, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Grid,
  Card,
  Divider,
  Container,
  Paper,
  Button,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import { useRouter } from 'next/router';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { PATH_APP } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import Head from 'next/head';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import SelectionReportDialog from '../../components/dialog/SelectionReportDialog';
import Selection from '../components/Selection/Selection';
import NewUnit from '../new';

// ----------------------------------------------------------------------

const FooterStepStyle = styled(Card)(() => ({
  borderRadius: 0,
  background: '#fff',
  paddingTop: '20px',
  padding: '30px',
  zIndex: 1250,
  width: '100%',
  bottom: 0,
  position: 'fixed',
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const STEP_PAGE_NAME = ['Select product type', 'Info', 'Selection'];

EditSelection.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function EditSelection() {
  const theme = useTheme();
  const { push, query } = useRouter();
  const { projectId, unitId } = query;
  const [currentStep, setCurrentStep] = useState(2);
  const [openRPDialog, setOpenRPDialog] = useState(false);
  const [isProcessingData, setIsProcessingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isNewUnitSelected = localStorage?.getItem('isNewUnitSelected') || 0;

  const openDialog = useCallback(() => {
    setOpenRPDialog(true);
  }, []);


  return (
    <>
      <Head>
        <title> New Unit | Oxygen8 </title>
      </Head>
      {Number(isNewUnitSelected) === 0 && Number(unitId) === 0 ? (
        <NewUnit />
      ) : (
        <>
          {isProcessingData ? (
            <CircularProgressLoading />
          ) : (
            <Container maxWidth="xl">
              <CustomBreadcrumbs
                heading={`Edit: ${STEP_PAGE_NAME[currentStep]}`}
                links={[
                  { name: 'My projects', href: PATH_APP.project },
                  {
                    name: 'Dashboard',
                    href: PATH_APP.projectDashboard(projectId?.toString() || '', 'unitlist'),
                  },
                  { name: 'Edit Unit' },
                ]}
                sx={{ paddingLeft: '24px', paddingTop: '24px' }}
                action={
                  currentStep === 2 && (
                    <Button
                      variant="text"
                      startIcon={<Iconify icon="bxs:download" />}
                      onClick={openDialog}
                    >
                      Export report
                    </Button>
                  )
                }
              />
              <Box sx={{ my: 3 }}>

                {projectId && unitId && Number(unitId) > 0 && (
                  <Selection
                    setCurrentStep={setCurrentStep}
                    intJobId={Number(projectId)}
                    intUnitNo={Number(unitId)}
                    intProdTypeId={0}
                  />
                )}
              </Box>
            </Container>
          )}
        </>
      )}
      <FooterStepStyle>
        <Grid container>
          <Grid item xs={9}>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
            >
              <Item
                sx={{
                  color: (currentStep === 0 && theme.palette.primary.main) || '',
                  cursor: 'pointer',
                }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Iconify icon="ph:number-circle-one-fill" width="25px" height="25px" />
                  <Typography variant="body1">Select product type</Typography>
                </Stack>
              </Item>
              <Item
                sx={{
                  color: (currentStep === 1 && theme.palette.primary.main) || '',
                  cursor: 'pointer',
                }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Iconify icon="ph:number-circle-two-fill" width="25px" height="25px" />
                  <Typography variant="body1">Add unit info</Typography>
                </Stack>
              </Item>
              <Item
                sx={{
                  color: (currentStep === 2 && theme.palette.primary.main) || '',
                  cursor: 'pointer',
                }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <Iconify icon="ph:number-circle-three-fill" width="25px" height="25px" />
                  <Typography variant="body1">Make a selection</Typography>
                </Stack>
              </Item>
            </Stack>
          </Grid>
          <Grid item xs={1} textAlign="center" alignContent="right">
            {null}
          </Grid>
          <Grid item xs={2} textAlign="center" alignContent="right">
          {null}
          </Grid>
        </Grid>
      </FooterStepStyle>
      <SelectionReportDialog
        isOpen={openRPDialog}
        onClose={() => setOpenRPDialog(false)}
        intProjectID={projectId?.toString() || ''}
        intUnitNo={unitId?.toString() || ''}
      />
    </>
  );
}
