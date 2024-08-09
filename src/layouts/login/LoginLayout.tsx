// @mui
import { Typography, Stack } from '@mui/material';
// components
import Logo from '../../components/logo';
import Image from '../../components/image';
//
import { StyledRoot, StyledContent } from './styles';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  illustration?: string;
  children: React.ReactNode;
};

export default function LoginLayout({ children, illustration, title }: Props) {
  return (
    <StyledRoot>
      <StyledContent>
        <Stack sx={{ width: 1 }}> {children} </Stack>
      </StyledContent>
      <img
        src="/assets/illustrations/mountain_login.png"
        alt="auth background"
        style={{
          width: '100vw',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -999,
        }}
      />
    </StyledRoot>
  );
}
