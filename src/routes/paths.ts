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
  projectDashboard: (id: string, tab: string) => path(ROOTS_APP, `project/${id || 0}/${tab || 0}`),
  newUnit: (id: string) => path(ROOTS_APP, `project/${id || 0}/unit/new`),
  editUnit: (jobId: string, unitId: string) => path(ROOTS_APP, `project/${jobId || 0}/unit/edit/${unitId || 0}`),
  selectionUnit: (jobId: string, unitId: string) => path(ROOTS_APP, `project/${jobId || 0}/unit/selection/${unitId || 0}`),
  account: path(ROOTS_APP, 'account'),
  resource: path(ROOTS_APP, 'resource'),
  adminPanel: {
    root: path(ROOTS_APP, 'admin-panel'),
    customer: path(ROOTS_APP, 'admin-panel/customers'),
    user: path(ROOTS_APP, 'admin-panel/users'),
  },
};
