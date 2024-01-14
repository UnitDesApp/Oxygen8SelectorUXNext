import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  Container,
  Box,
  Grid,
  Typography,
  Stack,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TextField,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import TableCell from '@mui/material/TableCell';
import { LoadingButton } from '@mui/lab';
// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useGetSubmittalInfo } from 'src/hooks/useApi';
import ProjectSubmittalForm from './ProjectSubmittalForm';
// components

// ----------------------------------------------------------------------
const PROJECT_INFO_TABLE_HEADER = [
  'QTY',
  'TAG',
  'ITEM',
  'MODEL',
  'VOLTAGE',
  'CONTROLS PREFERENCE',
  'INSTALLATION',
  'DUCT CONNECTION',
  'HANDING',
  'PART DESC',
  'PART NUMBER',
  'PRICING',
];

const BoxStyles = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 2fr)',
  rowGap: 10,
  columnGap: 10,
  margin: 10,
  marginTop: 20,
}));

const TableHeaderCellStyled = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  boxShadow: 'none!important',
}));

// ----------------------------------------------------------------------

export default function SubmittalInternal() {
  const [isLoading, setIsLoading] = useState(true);
  const { projectId } = useRouter().query;
  const isResetCalled = useRef(false);

  const { data: submittalInfo, isLoading: isLoadingSubmittalInfo } = useGetSubmittalInfo({
    intUserID: localStorage.getItem('userId'),
    intUAL: localStorage.getItem('UAL'),
    intJobID: projectId,
  });

  if (isLoadingSubmittalInfo) return <LinearProgress color="info" />;
  if (!submittalInfo)
    return (
      <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} sx={{ pt: '30px' }}>
        <Box sx={{ fontSize: '30px' }}>Unable to lead submittal data due to NO UNIT!</Box>{' '}
      </Stack>
    );
  return <ProjectSubmittalForm projectId={Number(projectId)} submittalInfo={submittalInfo} />;
}
