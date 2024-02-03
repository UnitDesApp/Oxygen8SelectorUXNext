// routes
import { PATH_APP } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';
import Iconify from 'src/components/iconify/Iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => <Iconify icon={name} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: icon('mdi:user-outline'),
  dashboard: icon('mdi-light:view-dashboard'),
  download: icon('ic:outline-download'),
  adminPanel: icon('mdi:monitor-dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Main Menu',
    items: [
      { title: 'Project', path: PATH_APP.project, icon: ICONS.dashboard },
      { title: 'My Account', path: PATH_APP.account, icon: ICONS.user },
      { title: 'Resources', path: PATH_APP.resource, icon: ICONS.download },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Admin Panel',
    items: [
      {
        title: 'admin-panel',
        path: PATH_APP.adminPanel.root,
        icon: ICONS.user,
        children: [
          { title: 'Customers', path: PATH_APP.adminPanel.customer },
          { title: 'Users', path: PATH_APP.adminPanel.user },
        ],
      },
    ],
  },
];

export default navConfig;
