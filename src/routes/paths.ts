// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_APP = '/';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
  resetPassowrd: '/reset-password',
};

export const PATH_APP = {
  root: ROOTS_APP,
  project: path(ROOTS_APP, 'project'),
  projectDashboard: (id: string, tab: string) => path(ROOTS_APP, `project/${id}/${tab}`),
  newUnit: (id: string) => path(ROOTS_APP, `project/${id}/unit/new`),
  editUnit: (jobId: string, unitId: string) =>
    path(ROOTS_APP, `project/${jobId}/unit/edit/${unitId}`),
  account: path(ROOTS_APP, 'account'),
  resource: path(ROOTS_APP, 'resource'),
  adminPanel: {
    root: path(ROOTS_APP, 'admin-panel'),
    customer: path(ROOTS_APP, 'admin-panel/customer'),
    memeber: path(ROOTS_APP, 'admin-panel/member'),
  },
};
