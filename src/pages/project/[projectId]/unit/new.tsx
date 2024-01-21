import React, { useCallback, useEffect, useState } from 'react';
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
import { useGetAllBaseData } from 'src/hooks/useApi';
import { useRouter } from 'next/router';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { PATH_APP } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import SelectProductInfo from './components/SelectProductInfo/SelectProductInfo';
import UnitInfo from './components/UnitInfo/UnitInfo';
import Selection from './components/Selection/Selection';
import Head from 'next/head';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

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

const DEFAULT_UNIT_DATA = {
  intProductTypeID: -1,
  txbProductType: '',
  intUnitTypeID: -1,
  txbUnitType: '',
  intApplicationTypeID: -1,
  txbApplicationType: '',
};

const STEP_PAGE_NAME = ['Select product type', 'Info', 'Selection'];

AddNewUnit.prototype = {};

export default function AddNewUnit() {
  // eslint-disable-next-line no-unused-vars
  const theme = useTheme();
  const { push, query } = useRouter();
  const { projectId } = query;
  const [currentStep, setCurrentStep] = useState(0);
  const [isAddedNewUnit, setIsAddedNewUnit] = useState(false);
  const [unitTypeData, setUnitTypeData] = useState<{
    intProductTypeID: number;
    txbProductType: string;
    intApplicationTypeID: number;
    txbApplicationType: string;
    intUnitTypeID: number;
    txbUnitType: string;
  }>(DEFAULT_UNIT_DATA);
  const [intUnitNo, setIntUnitNo] = useState(0);
  const [openRPDialog, setOpenRPDialog] = useState(false);

  const { data, isLoading: isLoadingBaseData } = useGetAllBaseData();

  const closeDialog = useCallback(() => {
    setOpenRPDialog(false);
  }, []);

  const onSelectAppliaionItem = (value: number, txb: string) => {
    setUnitTypeData({ ...unitTypeData, intApplicationTypeID: value, txbApplicationType: txb });
  };

  const openDialog = useCallback(() => {
    setOpenRPDialog(true);
  }, []);

  const onSelectProductTypeItem = (value: number, txb: string) => {
    setUnitTypeData({ ...unitTypeData, intProductTypeID: value, txbProductType: txb });
  };

  const onSelectUnitTypeItem = (value: number, txb: string) => {
    setUnitTypeData({ ...unitTypeData, intUnitTypeID: value, txbUnitType: txb });
  };

  const onClickNextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
    else if (currentStep === 2) push(`prject/${projectId?.toString}/unitlist`);
  };

  const validateContinue = () => {
    if (currentStep === 0) {
      if (
        unitTypeData.intProductTypeID === -1 ||
        unitTypeData.intUnitTypeID === -1 ||
        unitTypeData.intApplicationTypeID === -1
      )
        return true;
      return false;
    }

    if (currentStep === 1 && isAddedNewUnit) return false;
    if (currentStep === 2 && intUnitNo !== 0) return false;

    return true;
  };

  return (
    <>
      <Head>
        <title> New Unit | Oxygen8 </title>
      </Head>
      <RootStyle>
        <Container>
          <CustomBreadcrumbs
            heading={`New: ${STEP_PAGE_NAME[currentStep]}`}
            links={[
              { name: 'My projects', href: PATH_APP.project },
              {
                name: 'Dashboard',
                href: PATH_APP.projectDashboard(projectId?.toString() || '', 'unitlist'),
              },
              { name: 'New Unit' },
            ]}
            sx={{ paddingLeft: '24px', paddingTop: '24px' }}
            action={
              currentStep === 2 && (
                <Button
                  variant="text"
                  startIcon={<Iconify icon={'bxs:download'} />}
                  onClick={openDialog}
                >
                  Export report
                </Button>
              )
            }
          />
          <Box sx={{ my: 3 }}>
            {currentStep === 0 && (
              <SelectProductInfo
                onSelectAppliaionItem={onSelectAppliaionItem}
                onSelectProductTypeItem={onSelectProductTypeItem}
                onSelectUnitTypeItem={onSelectUnitTypeItem}
              />
            )}
            {currentStep === 1 && (
              <UnitInfo
                projectId={Number(projectId)}
                unitTypeData={unitTypeData}
                isAddedNewUnit={isAddedNewUnit}
                setIsAddedNewUnit={(no: number) => {
                  setIntUnitNo(no);
                  setIsAddedNewUnit(true);
                }}
              />
            )}
            {currentStep === 2 && (
              <Selection unitTypeData={unitTypeData} intUnitNo={Number(intUnitNo)} />
            )}
          </Box>
        </Container>
        <FooterStepStyle>
          <Grid container>
            <Grid item xs={8}>
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
            <Grid item xs={4} textAlign="center" alignContent="right">
              <Button
                variant="contained"
                color="primary"
                onClick={onClickNextStep}
                disabled={validateContinue()}
              >
                {currentStep !== 2 ? 'Continue' : 'Done'}
                <Iconify icon={currentStep !== 2 ? 'akar-icons:arrow-right' : 'icons8:cancel-2'} />
              </Button>
            </Grid>
          </Grid>
        </FooterStepStyle>
        {/* <ExportSelectionDialog
        isOpen={openRPDialog}
        onClose={closeDialog}
        intProjectID={projectId.toString()}
        intUnitNo={intUnitNo.toString()}
      /> */}
      </RootStyle>
    </>
  );
}
