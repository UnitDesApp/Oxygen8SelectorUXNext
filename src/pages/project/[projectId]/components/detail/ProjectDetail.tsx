import * as Yup from 'yup';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// @mui
import { styled } from '@mui/material/styles';
import {
  Container,
  Box,
  Grid,
  Typography,
  LinearProgress,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useGetOutdoorInfo, useGetProjectById, useGetProjectInitInfo } from 'src/hooks/useApi';
import { useRouter } from 'next/router';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import ProjectDetailsForm from './ProjectDetailsForm';
// paths

//------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(3),
  },
}));

//------------------------------------------------

export default function ProjectDetail() {
  const { projectId } = useRouter().query;

  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  const { data: projectInitInfo, isLoading: isLoadingProjectInitInfo } = useGetProjectInitInfo();
  const { data: project, isLoading: isLoadingProject } = useGetProjectById({
    id: Number(projectId),
  });

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  const handleCloseError = () => {
    setOpenSuccess(false);
  };

  return (
    <Box>
      {isLoadingProjectInitInfo || isLoadingProject ? (
        <CircularProgressLoading />
      ) : (
        <ProjectDetailsForm
          project={project}
          projectInitInfo={projectInitInfo}
          onSuccess={() => setOpenSuccess(true)}
          onFail={() => setOpenError(true)}
        />
      )}
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Project was successfully updated!
        </Alert>
      </Snackbar>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          Server Error!
        </Alert>
      </Snackbar>
    </Box>
  );
}
