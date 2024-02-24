import { memo } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, BoxProps, Toolbar } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
// config
import { HEADER } from '../../../config-global';
import navConfig, { manageNavConfig } from './config-navigation';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import { NavSectionHorizontal } from '../../../components/nav-section';
import * as ClsID from '../../../utils/ids';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();
  const { user } = useAuthContext();

  const intUAL = Number(user?.UAL);

  const isAdmin =
    intUAL === ClsID.intUAL_Admin ||
    intUAL === ClsID.intUAL_IntAdmin ||
    intUAL === ClsID.intUAL_IntLvl_1 ||
    intUAL === ClsID.intUAL_IntLvl_2;

  return (
    <AppBar
      component="nav"
      color="transparent"
      sx={{
        boxShadow: 0,
        top: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        <NavSectionHorizontal data={[...navConfig, ...(isAdmin ? manageNavConfig : [])]} />
      </Toolbar>

      <Shadow />
    </AppBar>
  );
}

export default memo(NavHorizontal);

// ----------------------------------------------------------------------

function Shadow({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={{
        left: 0,
        right: 0,
        bottom: 0,
        height: 24,
        zIndex: -1,
        width: 1,
        m: 'auto',
        borderRadius: '50%',
        position: 'absolute',
        boxShadow: (theme) => theme.customShadows.z8,
        ...sx,
      }}
      {...other}
    />
  );
}
