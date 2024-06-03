import { useState, useRef } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, LinearProgress } from '@mui/material';
import TableCell from '@mui/material/TableCell';
// hooks
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
    intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
    intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
    intJobId: projectId,
  });

  if (isLoadingSubmittalInfo) return <LinearProgress color="info" />;
  if (!submittalInfo)
    return (
      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ pt: '30px' }}>
        <Box sx={{ fontSize: '30px' }}>Unable to lead submittal data due to NO UNIT!</Box>{' '}
      </Stack>
    );
  return <ProjectSubmittalForm projectId={Number(projectId)} submittalInfo={submittalInfo} />;
}
