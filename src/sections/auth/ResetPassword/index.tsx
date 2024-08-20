// @mui
import { Alert, Tooltip, Stack, Typography, Link, Box } from '@mui/material';
// auth
import Logo from 'src/components/logo';
import { useAuthContext } from '../../../auth/useAuthContext';
// layouts
import LoginLayout from '../../../layouts/login';
import ResetPasswordForm from './ResetPasswordForm';
//

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const { method } = useAuthContext();

  return (
    <LoginLayout>
      <Box sx={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px' }}>
        <Stack
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 5, position: 'relative' }}
        >
          <Logo sx={{ height: 'auto', width: '350px' }} />
        </Stack>
        <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
          <Box alignItems="center" sx={{ flexGrow: 1 }}>
            <Typography variant="h3" textAlign="center">
              Forgot Password?
            </Typography>
          </Box>
        </Stack>
        <ResetPasswordForm />
      </Box>
    </LoginLayout>
  );
}
