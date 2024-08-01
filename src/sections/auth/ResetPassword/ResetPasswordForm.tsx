import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, Typography, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import sign from 'jwt-encode';
import axios from 'src/utils/axios';
import { useAuthContext } from 'src/auth/useAuthContext';
// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { BACKEND_ENDPOINT } from 'src/config-global';
// jwt

// ----------------------------------------------------------------------
const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));
// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};

export default function ResetPasswordForm() {
  const { login } = useAuthContext();
  const [isSent, setIsSent] = useState<boolean>(false);

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
    // email: 'sumith.michaelpillai@unitdes.com',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
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
      const response = await axios.post(`${BACKEND_ENDPOINT}/api/user/SaveResetpassword`, data);

      if (response.data) {
        const now = new Date();
        const jwt = sign({ email: data.email, expireTime: now.getTime() + 900000 }, 'secret');
        const hostName = window.location.host;
        const method = hostName.includes('localhost') ? 'http' : 'https';
        const emailBody = `${method}://${hostName}/reset-password/${jwt}`;
        axios.post(`${BACKEND_ENDPOINT}/api/auth/sendrequest`, {
          email: data.email,
          subject: 'Oxygent8Selctor Reset Password',
          emailBody,
        });

        setIsSent(true);
      } else {
        setError('afterSubmit', { ...errors, message: 'Your email does not exist!' });
      }
    } catch (error) {
      setError('afterSubmit', { ...error, message: "Can't connect server!" });
    }
  };

  return !isSent ? (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email Address" />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          mt: 2,
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Reset Password
      </LoadingButton>
    </FormProvider>
  ) : (
    <ContentStyle sx={{ textAlign: 'center', py: 1 }}>
      <Typography variant="h5" paragraph>
        We send password-reset link to your email. Please check your email!
      </Typography>
    </ContentStyle>
  );
}
