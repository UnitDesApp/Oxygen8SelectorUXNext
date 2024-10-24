import React from 'react';

// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

//------------------------------------------------

const CustomGroupBoxBorder = styled(Box)(() => ({
  display: 'inline-flex',
  flexDirection: 'column',
  position: 'relative',
  minWidth: '0',
  padding: '10px',
  margin: '0',
  verticalAlign: 'top',
  width: '100%',
  border: '1px solid gray',
  borderRadius: '8px',
}));

const CustomGroupBoxTitle = styled(Typography)(() => ({
  lineHeight: '1.4375em',
  fontSize: '25px',
  fontFamily: '"Public Sans", sans-serif',
  fontWeight: 600,
  display: 'block',
  transformOrigin: 'left top',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 'calc(133% - 24px)',
  position: 'absolute',
  left: '0px',
  top: '0px',
  transform: 'translate(40px, -12px) scale(0.75)',
  transition: 'color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms',
  zIndex: 100,
  background: 'white',
  paddingLeft: '10px',
  paddingRight: '10px',
}));

// ----------------------------------------------------------------------
interface GroupBoxProps {
  title?: string;
  children?: any;
  bordersx?: any;
  titlesx?: any;
}

export default function GroupBox({ title, children, bordersx, titlesx }: GroupBoxProps) {
  return (
    <CustomGroupBoxBorder sx={{ ...bordersx }}>
      <CustomGroupBoxTitle sx={{ ...titlesx, }}>{title}</CustomGroupBoxTitle>
      {children}
    </CustomGroupBoxBorder>
  );
}
