import { useCallback, useEffect, useMemo, useState } from 'react';

// @mui
import { Box, Snackbar, Alert } from '@mui/material';
// hooks
// import { useGetJobById, useGetProjectInitInfo, useGetJobSelTables } from 'src/hooks/useApi';
import { useGetSavedJob, useGetJobSelTables } from 'src/hooks/useApi';

import { useRouter } from 'next/router';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import ProjectInfoDialog from './ProjectInfoDialog';
// import ProjectInfoDialog from 'src/pages/project/components/newProjectDialog/ProjectInfoDialog';

// paths

//------------------------------------------------

interface NewProjectProps {
  projectId?: string;
  onClose: Function;
}

export default function NewProject({ projectId, onClose }: NewProjectProps) {
  //   const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  const { data: jobSelTables, isLoading: isLoadingProjectInitInfo, refetch } = useGetJobSelTables();
  // const { data: project, isLoading: isLoadingProject } = useGetJobById({id: Number(projectId),});
  const {
    data: savedJob,
    isLoading: isLoadingProject,
    refetch: refetchProject,
    isRefetching: isRefetchingProject,
  } = useGetSavedJob(
    { intJobId: projectId },
    { enabled: !!projectId,}
  );
  const [newProjectDialogOpen, setNewProjectDialog] = useState<boolean>(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openFail, setOpenFail] = useState<boolean>(false);
  // const { data: projects, isLoading: isLoadingProjects, refetch } = useGetProjectInitInfo();

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  const handleCloseError = () => {
    setOpenSuccess(false);
  };

  //   const openDialogBox = () => {
  //     handleDisplay(true);
  //  };

  //  const handleClose = () => onClose();

  useEffect(() => {
    // reset(defaultValues);

    setNewProjectDialog(true);
  }, []);

  return (
    <Box>
      {isLoadingProjectInitInfo ||
      isLoadingProject ||
      !projectId ||
      !savedJob ||
      isRefetchingProject ? (
        <CircularProgressLoading />
      ) : (
        <ProjectInfoDialog
          // initialInfo={projectInitInfo}
          // open
          // onClose={handleClose}
          // setOpenSuccess={Function}
          // setOpenFail={Function}
          // refetch={Function}
          // projectList={[]}
          loadProjectStep="SHOW_ALL_DIALOG"
          open={newProjectDialogOpen}
          onClose={() => {
            onClose();
            setNewProjectDialog(false);
          }}
          setOpenSuccess={() => setOpenSuccess(true)}
          setOpenFail={() => setOpenFail(true)}
          // initialInfo={projects?.jobInitInfo}
          initialInfo={jobSelTables}
          // projectList={[]}
          refetch={() => {
            refetch();
            refetchProject();
          }}
          savedJob={savedJob}
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
