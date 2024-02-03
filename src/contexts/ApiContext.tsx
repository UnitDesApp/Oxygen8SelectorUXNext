import { createContext, useContext } from 'react';
import AccountApi from 'src/api/AccountApi';

import ProjectApi from 'src/api/ProjectApi';
import UserApi from 'src/api/UserApi';

export interface ApiContext {
  project: ProjectApi;
  account: AccountApi;
  user: UserApi;
}

const ApiContext = createContext<ApiContext | undefined>(undefined);

export const ApiProvider = ({ children }: any) => {
  const context = {
    project: new ProjectApi(),
    account: new AccountApi(),
    user: new UserApi(),
  };

  return <ApiContext.Provider value={context}>{children}</ApiContext.Provider>;
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('no api context provided');
  }
  return context;
};
