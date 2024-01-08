import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
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
          opacity: [1, 0.48, 0.48, 1, 1],
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
          repeatDelay: 2,
          repeat: Infinity,
        }}
      >
        <Image src="/assets/illustrations/Splash.png" sx={{ width: '100vw' }} />
      </m.div>
    </StyledRoot>
  );
}
