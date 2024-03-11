import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, IconButton, InputAdornment, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { PATH_AUTH } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/useAuthContext';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useRouter } from 'next/router';
import axios from 'src/utils/axios';
import { BACKEND_ENDPOINT } from 'src/config-global';

// ----------------------------------------------------------------------

type FormValuesProps = {
  newPassword: string;
  confirmPassword?: string;
};

export default function NewPasswordForm({ email }: { email: string }) {
  const { login } = useAuthContext();
  const { push } = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    newPassword: Yup.string().required('New sPassword is required'),
    confirmPassword: Yup.string().required('Confirm Password is required'),
  });

  const defaultValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const methods = useForm<any>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        setError('afterSubmit', { ...errors, message: 'Passwords do not match!' });
      } else {
        await axios.post(`${BACKEND_ENDPOINT}/api/user/newpassword`, {
          ...data,
          email,
        });
        push(PATH_AUTH.login);
      }
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', { ...error, message: "Can't connect Server!" });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={1}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors?.afterSubmit?.message as string}</Alert>
        )}

        <RHFTextField
          name="newPassword"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack spacing={1} direction="row" sx={{ mt: 2 }}>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitSuccessful || isSubmitting}
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          Set New Password
        </LoadingButton>
        <Button fullWidth variant="outlined" size="large" onClick={() => push(PATH_AUTH.login)}>
          Back
        </Button>
      </Stack>
    </FormProvider>
  );
}
