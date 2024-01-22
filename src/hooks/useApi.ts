import { UseQueryOptions, useQuery } from 'react-query';
import { useApiContext } from 'src/contexts/ApiContext';

export const useGetAllProjects = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-all-projects`, () => api.project.getProjects(), config);
};

export const useGetProjectInitInfo = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-project-init-info`, () => api.project.getProjectInitInfo(), config);
};

export const useGetProjectById = (
  params: { id: number },
  config?: UseQueryOptions<any, any, any, any>
) => {
  const api = useApiContext();
  return useQuery<any>(
    [`get-project-by-id`, params],
    () => api.project.getProjectById(params),
    config
  );
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
    `get-project-quote-info`,
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
  return useQuery<any>([`get-units-info`, params], () => api.project.getUnitInfo(params), config);
};

export const useGetSelectionInfo = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(
    [`get-selection-info`, params],
    () => api.project.getSelectionInfo(params),
    config
  );
};
