// @mui
import { Alert, Tooltip, Stack, Typography, Link, Box, styled, Button } from '@mui/material';
// auth
import Logo from 'src/components/logo';
import { PATH_AUTH } from 'src/routes/paths';
import { useRouter } from 'next/router';
import { useAuthContext } from '../../../auth/useAuthContext';
// layouts
import LoginLayout from '../../../layouts/login';
import NewPasswordForm from './NewPasswordForm';

// ----------------------------------------------------------------------
const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));
// ----------------------------------------------------------------------

export default function NewPassword({ email, tokenError }: { email: string; tokenError: string }) {
  const { method } = useAuthContext();
  const { push } = useRouter();

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
              Forgot password?
            </Typography>
          </Box>
        </Stack>
        {tokenError ? (
          <ContentStyle sx={{ textAlign: 'center', py: 1 }}>
            <Typography variant="h5" paragraph>
              {tokenError}
            </Typography>
            <Button fullWidth variant="contained" onClick={() => push(PATH_AUTH.login)}>
              Back to login
            </Button>
          </ContentStyle>
        ) : (
          <NewPasswordForm email={email} />
        )}
      </Box>
    </LoginLayout>
  );
}
