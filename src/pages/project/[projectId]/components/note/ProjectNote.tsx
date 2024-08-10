import { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Snackbar, Stack } from '@mui/material';
// component
// hooks
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useGetSavedUnitNotes } from 'src/hooks/useApi';
import { useApiContext } from 'src/contexts/ApiContext';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
export default function ProjectNote() {
  const { projectId } = useRouter().query;
  const api = useApiContext();

  const { data: projectNote, isLoading: isLoadingProjectNote } = useGetSavedUnitNotes({
    projectId,
  });

  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openFail, setOpenFail] = useState<boolean>(false);

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  const handleCloseFail = () => {
    setOpenFail(false);
  };

  const projectInfoSchema = Yup.object().shape({
    notes: Yup.string().required('Please enter a Project Name'),
  });

  // hooks
  const defaultValues = {
    notes: projectNote,
  };

  const methods = useForm({
    resolver: yupResolver(projectInfoSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        // await api.project.saveNotes({ ...data, projectId });
        setOpenSuccess(true);
      } catch (error) {
        setOpenFail(true);
        console.error(error);
      }
    },
    []
  );

  useEffect(() => {
    setValue('notes', projectNote);
  }, [setValue, projectNote]);

  return (
    <Box sx={{ paddingTop: 1, width: '100%' }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <RHFTextField
          id="standard-multiline-flexible"
          name="notes"
          label="Notes"
          placeholder="Take a notes..."
          multiline
          maxRows={15}
          rows={15}
          sx={{ width: '100%' }}
        />
        <Stack direction="row" justifyContent="flex-end" sx={{ paddingTop: 2, paddingBottom: 10 }}>
          <LoadingButton
            type="submit"
            startIcon={<Iconify icon="fluent:save-24-regular" />}
            loading={isSubmitting}
            sx={{ width: '150px' }}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </FormProvider>
      <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          New project update success!
        </Alert>
      </Snackbar>
      <Snackbar open={openFail} autoHideDuration={3000} onClose={handleCloseFail}>
        <Alert onClose={handleCloseFail} severity="error" sx={{ width: '100%' }}>
          Server Error!
        </Alert>
      </Snackbar>
    </Box>
  );
}
