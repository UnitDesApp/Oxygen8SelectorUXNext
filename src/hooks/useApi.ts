import { UseQueryOptions, useQuery } from 'react-query';
import { useApiContext } from 'src/contexts/ApiContext';

// export const useGetRH_By_DB_WB = (params: any,config?: UseQueryOptions<any, any, any, any>) => {
//   const api = useApiContext();
//   return useQuery<any>(`get-rh-by-db-wb`, () => api.project.getRH_By_DB_WB(params), config);
// };

// export const useGetWB_By_DB_RH = (params: any,config?: UseQueryOptions<any, any, any, any>) => {
//   const api = useApiContext();
//   return useQuery<any>(`get-wb-by-db-rh`, () => api.project.getWB_By_DB_RH(params), config);
// };

export const useGetAllProjects = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-all-projects`, () => api.project.getProjects(), config);
};

export const useGetProjectInitInfo = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-project-init-info`, () => api.project.getProjectInitInfo(), config);
};

export const useGetJobSelTables = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-job-sel-tables`, () => api.project.getJobSelTables(), config);
};

// export const useGetJobById = (params: { id: number }, config?: UseQueryOptions<any, any, any, any>) => {
//   const api = useApiContext();
//   return useQuery<any>([`get-job-by-id`, params], () => api.project.getJobById(params), config);
// };

export const useGetJobById = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-job-by-id`, params], () => api.project.getJobById(params), config);
};

export const useGetOutdoorInfo = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(
    [`get-outdoor-info`, params],
    () => api.project.getOutdoorInfo(params),
    config
  );
};

export const useGetAllUnits = (
  params: { jobId: number },
  config?: UseQueryOptions<any, any, any, any>
) => {
  const api = useApiContext();
  return useQuery<any>([`get-all-units`, params], () => api.project.getUnits(params), config);
};

export const useGetQuoteInfo = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(
    [`get-project-quote-info`, params],
    () => api.project.getProjectQuoteInfo(params),
    config
  );
};

export const useGetSubmittalInfo = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(
    [`get-project-submittal-info`, params],
    () => api.project.getSubmittalInfo(params),
    config
  );
};

export const useGetProjectNote = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(
    [`get-project-note-info`, params],
    () => api.project.getProjectNote(params),
    config
  );
};

export const useGetAllBaseData = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-project-all-base-data`], () => api.project.getAllBaseData(), config);
};

export const useGetUnitInfo = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<JSON>([`get-units-info`, params], () => api.project.getUnitInfo(params), config);
};

export const useGetSelectionInfo = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(
    [`get-selection-info`, params],
    () => api.project.getSelectionInfo(params),
    config
  );
};

export const useGetFileList = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-file-list`], () => api.project.getFileList(), config);
};

export const useGetAccountInfo = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-account-info`], () => api.account.getAccountInfo(), config);
};

export const useGetQuoteSelTables = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-quote-sel-tables`, () => api.project.getQuoteSelTables(), config);
};
