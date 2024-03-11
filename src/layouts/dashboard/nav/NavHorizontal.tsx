import { memo } from 'react';
// @mui
import { Box } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
// config
import navConfig, { manageNavConfig } from './config-navigation';
// components
import { NavSectionHorizontal } from '../../../components/nav-section';
import * as ClsID from '../../../utils/ids';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const { user } = useAuthContext();

  const intUAL = Number(user?.UAL);

  const isAdmin =
    intUAL === ClsID.intUAL_Admin ||
    intUAL === ClsID.intUAL_IntAdmin ||
    intUAL === ClsID.intUAL_IntLvl_1 ||
    intUAL === ClsID.intUAL_IntLvl_2;

  return (
    <Box component="nav">
      <NavSectionHorizontal data={[...navConfig, ...(isAdmin ? manageNavConfig : [])]} />
    </Box>
  );
}

export default memo(NavHorizontal);
