// @mui
import { Stack, Box } from '@mui/material';
// config
import { useAuthContext } from 'src/auth/useAuthContext';
import { NAV } from '../../../config-global';
// utils
import { hideScrollbarX } from '../../../utils/cssStyles';
// components
import Logo from '../../../components/logo';
import { NavSectionMini } from '../../../components/nav-section';
//
import navConfig, { manageNavConfig } from './config-navigation';
import NavToggleButton from './NavToggleButton';
import * as ClsID from '../../../utils/ids';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { user } = useAuthContext();

  const intUAL = Number(user?.UAL);

  const isAdmin =
    intUAL === ClsID.intUAL_Admin ||
    intUAL === ClsID.intUAL_IntAdmin ||
    intUAL === ClsID.intUAL_IntLvl_1 ||
    intUAL === ClsID.intUAL_IntLvl_2;

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_DASHBOARD_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_DASHBOARD_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScrollbarX,
        }}
      >
        <Logo sx={{ mx: 'auto', my: 2 }} />

        <NavSectionMini data={[...navConfig, ...(isAdmin ? manageNavConfig : [])]} />
      </Stack>
    </Box>
  );
}
