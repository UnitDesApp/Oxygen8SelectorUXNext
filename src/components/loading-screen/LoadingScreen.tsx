import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
//
import Image from '../image/Image';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 9998,
  width: '100%',
  height: '100%',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <StyledRoot>
      <m.div
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
        }}
      >
        <Image src="/assets/illustrations/Splash.png" sx={{ width: '100vw' }} />
      </m.div>
    </StyledRoot>
  );
}
