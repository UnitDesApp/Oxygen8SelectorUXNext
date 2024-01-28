import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Container,
  Grid,
  LinearProgress,
  Snackbar,
  Stack,
  TextField,
  Typography,
  colors,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useGetAllBaseData, useGetUnitInfo } from 'src/hooks/useApi';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import UnitInfoForm from './UnitInfoForm';

//------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(3),
  mb: '100px',
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(3),
  },
}));

//------------------------------------------------
type UnitInfoProps = {
  projectId: number;
  unitId?: number;
  setIsAddedNewUnit: Function;
  isAddedNewUnit: boolean;
  setFunction?: Function;
  intProductTypeID?: number;
  intUnitTypeID?: number;
  edit?: boolean;
  txbProductType?: string;
  txbUnitType?: string;
};

export default function UnitInfo({
  projectId,
  unitId,
  setIsAddedNewUnit,
  isAddedNewUnit,
  intProductTypeID,
  intUnitTypeID,
  setFunction,
  edit = false,
  txbProductType,
  txbUnitType,
}: UnitInfoProps) {
  const { data: baseData, isLoading: isLoadingBaseData } = useGetAllBaseData();

  const { data: unitData, isLoading: isLoadingUnitInfo } = useGetUnitInfo(
    {
      intUserID: typeof window !== 'undefined' && localStorage.getItem('userId'),
      intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
      intProjectID: projectId,
      intUnitNo: edit ? unitId : Number(-1),
    },
    {
      enabled: edit && typeof window !== 'undefined',
    }
  );

  // ----------------------- Success State and Handle Close ---------------------------
  const [openSuccess, setOpenSuccess] = useState(false);
  const handleCloseSuccess = useCallback(() => {
    setOpenSuccess(false);
  }, []);

  // ----------------------- Error State and Handle Close -----------------------------
  const [openError, setOpenError] = useState(false);
  const handleCloseError = () => {
    setOpenError(false);
  };

  if (isLoadingBaseData || isLoadingUnitInfo) return <CircularProgressLoading />;

  const { unitInfo } = unitData || {};

  return (
    <RootStyle>
      <Container>
        <Box sx={{ paddingBottom: '40px' }}>
          <UnitInfoForm
            projectId={projectId}
            baseData={baseData}
            unitInfo={unitInfo}
            setIsAddedNewUnit={setIsAddedNewUnit}
            isAddedNewUnit={isAddedNewUnit}
            onSuccess={() => setOpenSuccess(true)}
            onError={() => setOpenError(true)}
            edit={edit}
            intProductTypeID={intUnitTypeID || unitInfo.productTypeID || 0}
            intUnitTypeID={intProductTypeID || unitInfo.unitTypeID || 0}
            setFunction={setFunction}
            txbProductType={txbProductType}
            txbUnitType={txbUnitType}
          />
        </Box>
      </Container>
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Unit was successfully added!
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          Server Error!
        </Alert>
      </Snackbar>
    </RootStyle>
  );
}
