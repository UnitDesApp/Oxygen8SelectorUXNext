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
  return useQuery<any>(`get-project-by-id`, () => api.project.getProjectById(params), config);
};

export const useGetOutdoorInfo = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-outdoor-info`, () => api.project.getOutdoorInfo(params), config);
};

export const useGetAllUnits = (
  params: { jobId: number },
  config?: UseQueryOptions<any, any, any, any>
) => {
  const api = useApiContext();
  return useQuery<any>(`get-all-units`, () => api.project.getUnits(params), config);
};
