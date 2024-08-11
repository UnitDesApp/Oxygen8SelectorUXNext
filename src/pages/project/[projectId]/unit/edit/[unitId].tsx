import React, { useCallback, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// @mui
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
import { LoadingButton } from '@mui/lab';
import UnitInfo from '../components/UnitInfo/UnitInfo';
import SelectionReportDialog from '../../components/dialog/SelectionReportDialog';
import SelectionWrapper from '../components/Selection/SelectionWrapper';
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

EditUnit.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function EditUnit() {
  const theme = useTheme();
  const { push, query } = useRouter();
  const { projectId, unitId } = query;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSavedUnit, setIsSavedUnit] = useState(false);
  const [openRPDialog, setOpenRPDialog] = useState(false);
  const [isProcessingData, setIsProcessingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // const submitButtonRef = useRef<HTMLButtonElement>(null);
  const isNewUnitSelected = localStorage?.getItem('isNewUnitSelected') || 0;

  const closeDialog = useCallback(() => {
    setOpenRPDialog(false);
  }, []);

  const openDialog = useCallback(() => {
    setOpenRPDialog(true);
  }, []);

  const onClickUnitInfo = () => {
    setCurrentStep(1);
    push(PATH_APP.editUnit(projectId?.toString() || '0', unitId?.toString() || '0'));
  };

  const onClickNextStep = () => {
    if (currentStep < 2) {
      // if (currentStep === 1 && submitButtonRef?.current) {
      //   submitButtonRef?.current.click();
      // } else {
        setCurrentStep(currentStep + 1);
      // }
    } else if (currentStep === 2 && projectId)
      push(`/project/${projectId?.toString() || '0'}/unitlist`);
    // push(PATH_APP.editUnit(projectId?.toString() || '0', unitId?.toString() || '0'));
  };

  // const handleEditRow = (row: any) => {
  //   setIntProductTypeID(Number(row.prod_type_id));
  //   setIntUnitTypeID(Number(row.unit_type_id));
  //   push(PATH_APP.editUnit(projectId?.toString() || '0', row.unit_no));
  // };

  const validateContinue = () => {
    if (currentStep === 1) return false;
    if (currentStep === 2) return false;

    return true;
  };

  return (
    <>
      <Head>
        <title> New Unit | Oxygen8 </title>
      </Head>
      {Number(isNewUnitSelected) === 0  && Number(unitId) === 0? (
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
                {currentStep === 1 && projectId && unitId && (
                    <UnitInfo
                      projectId={Number(projectId)}
                      unitId={Number(unitId)}
                      isSavedUnit={isSavedUnit}
                      setIsSavedUnit={(no: number) => {
                        setIsSavedUnit(true);
                      }}
                      edit
                      // submitButtonRef={submitButtonRef}
                      setIsSaving={setIsSaving}
                      moveNextStep={() => setCurrentStep(2)}
                    />
                )}
                {currentStep === 2 && projectId && unitId && (
                  // <SelectionWrapper projectId={Number(projectId)} unitId={Number(unitId)} />
                  <Selection
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
                          {/* {currentStep !== 2 ? 'Continue' : 'Done'} */}
              {/* <Iconify icon={currentStep !== 2 ? 'akar-icons:arrow-right' : 'icons8:cancel-2'} /> */}

            {/* <LoadingButton
              variant="contained"
              color="primary"
              onClick={onClickNextStep}
              disabled={validateContinue()}
              loading={isSaving}
            >
              {(Number(isNewUnitSelected) === 1 && Number(unitId) === 0) ? (
                'Add Unit' ) : (
                <>
                  {Number(unitId) > 0 && currentStep !== 2 ? 'Update Unit' : ''}
                  <Iconify icon={currentStep !== 2 ? '' : 'icons8:cancel-2'} />
                </>
              )}
            </LoadingButton> */}


              {/* {(Number(isNewUnitSelected) === 1 && Number(unitId) === 0) ? (
                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={onClickNextStep}
                  disabled={validateContinue()}
                  loading={isSaving}
                >
                  Add Unit
                </LoadingButton>
              ) : (
                <>
                {(Number(unitId) > 0 && currentStep !== 2 ) ? (
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={onClickNextStep}
                    disabled={validateContinue()}
                    loading={isSaving}
                  >
                    Update Unit
                  </LoadingButton>
                ) : (
                  <>
                  {(Number(unitId) > 0 && currentStep !== 2 && !isProcessingData ) ? (
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={onClickUnitInfo}
                    sx={{ display: currentStep === 2 && !isProcessingData ? 'inline-flex' : 'none' }}
                    startIcon={<Iconify icon="akar-icons:arrow-left" />}
                  >
                    Unit info
                  </Button>
                  ) : (
                    null
                  )}
                  </>
                )}
                </>
              )} */}
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
