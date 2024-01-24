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
  unitTypeData: {
    txbProductType: string;
    txbUnitType: string;
    intProductTypeID: number;
    intUnitTypeID: number;
  };
  setIsAddedNewUnit: Function;
  isAddedNewUnit: boolean;
  setFunction?: Function;
  edit?: boolean;
};

export default function UnitInfo({
  projectId,
  unitId,
  unitTypeData,
  setIsAddedNewUnit,
  isAddedNewUnit,
  setFunction,
  edit = false,
}: UnitInfoProps) {
  const { data: baseData, isLoading: isLoadingBaseData } = useGetAllBaseData();

  const { data: unitInfo, isLoading: isLoadingUnitInfo } = useGetUnitInfo({
    intUserID: localStorage.getItem('userId'),
    intUAL: localStorage.getItem('UAL'),
    intProjectID: projectId,
    intProductTypeID: unitTypeData.intProductTypeID,
    intUnitTypeID: unitTypeData.intUnitTypeID,
    intUnitNo: edit ? unitId : Number(-1),
  });

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

  return (
    <RootStyle>
      <Container>
        <Box sx={{ paddingBottom: '40px' }}>
          <UnitInfoForm
            projectId={projectId}
            unitTypeData={unitTypeData}
            baseData={baseData}
            unitInfo={unitInfo}
            setIsAddedNewUnit={setIsAddedNewUnit}
            isAddedNewUnit={isAddedNewUnit}
            onSuccess={() => setOpenSuccess(true)}
            onError={() => setOpenError(true)}
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
