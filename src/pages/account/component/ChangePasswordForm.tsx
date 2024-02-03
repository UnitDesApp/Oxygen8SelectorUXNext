import { useCallback, useState } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import GroupBox from 'src/components/GroupBox';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFTextField } from 'src/components/hook-form';
import { useApiContext } from 'src/contexts/ApiContext';

// ----------------------------------------------------------------------

export default function ChangePasswordForm() {
  const api = useApiContext();
  const [success, setSuccess] = useState<string>('');
  const [fail, setFail] = useState<string>('');

  const ChangePassWordSchema = Yup.object().shape({
    currentPassword: Yup.string().required(),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  const defaultValues = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        const response = await api.account.updatePassword({
          userId: localStorage.getItem('userId'),
          currentPassword: data.currentPassword,
          updatedPassword: data.newPassword,
        });
        if (response === 'success') {
          setFail('');
          setSuccess('Updated successfully!');
        }
        if (response === 'incorrect_current_password') {
          setFail('Incorrect current password!');
          setSuccess('');
        }
      } catch (e) {
        console.log(e);
      }
    },
    [setSuccess]
  );

  return (
    <GroupBox title="Change Password">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} alignItems="flex-end" sx={{ mt: 3, p: 2 }}>
          {!!success && (
            <Alert sx={{ width: '100%' }} severity="success">
              {success}
            </Alert>
          )}

          {!!fail && (
            <Alert sx={{ width: '100%' }} severity="error">
              {fail}
            </Alert>
          )}

          <RHFTextField
            size="small"
            name="currentPassword"
            type="password"
            label="Current Password"
          />

          <RHFTextField size="small" name="newPassword" type="password" label="New Password" />

          <RHFTextField
            size="small"
            name="confirmNewPassword"
            type="password"
            label="Confirm New Password"
          />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update Password
          </LoadingButton>
        </Stack>
      </FormProvider>
    </GroupBox>
  );
}
