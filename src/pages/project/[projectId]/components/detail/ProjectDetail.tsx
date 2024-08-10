import React, { useState } from 'react';

// @mui
import { Box, Snackbar, Alert } from '@mui/material';
// hooks
// import { useGetJobById, useGetProjectInitInfo } from 'src/hooks/useApi';
import { useGetSavedJob } from 'src/hooks/useApi';

import { useRouter } from 'next/router';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import ProjectDetailsForm from './ProjectDetailsForm';
// paths

//------------------------------------------------

export default function ProjectDetail() {
  const { projectId } = useRouter().query;

  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  // const { data: projectInitInfo, isLoading: isLoadingProjectInitInfo } = useGetProjectInitInfo();
  const { data: project, isLoading: isLoadingProject } = useGetSavedJob({
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
      {/* {isLoadingProjectInitInfo || isLoadingProject ? (
        <CircularProgressLoading />
      ) : (
        <ProjectDetailsForm
          project={project}
          projectInitInfo={projectInitInfo}
          onSuccess={() => setOpenSuccess(true)}
          onFail={() => setOpenError(true)}
        />
      )} */}
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
