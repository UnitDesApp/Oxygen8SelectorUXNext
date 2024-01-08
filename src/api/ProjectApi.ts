import AbstractApi from './AbstractApi';

export default class ProjectApi extends AbstractApi {
  constructor() {
    super();
  }

  getProjects = async (): Promise<any> => {
    return this.client.post(`/api/jobs/Get`).then((res) => JSON.parse(res.data));
  };

  getProjectInitInfo = async (): Promise<any> => {
    return this.client.get(`/api/jobs/initinfo`).then((res) => JSON.parse(res.data));
  };

  getProjectById = async (params: { id: number }): Promise<any> => {
    return this.client.post(`/api/job/get`, params).then((res) => res.data);
  };

  getOutdoorInfo = async (params: any): Promise<any> => {
    return this.client.post(`/api/job/getoutdoorinfo`, params).then((res) => res.data);
  };

  getUnits = async (params: { jobId: number }): Promise<any> => {
    return this.client.post(`/api/job/getwithunit`, params).then((res) => res.data);
  };
}
