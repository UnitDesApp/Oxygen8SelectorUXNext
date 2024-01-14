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

  getProjectQuoteInfo = async (params: {
    intUserID: string;
    intUAL: string;
    intJobID: number;
    intUnitNo: number;
  }): Promise<any> => {
    return this.client.post(`/api/quote/get`, params).then((res) => res.data);
  };

  saveQuoteInfo = async (params: any): Promise<any> => {
    return this.client.post(`/api/Quote/save`, params).then((res) => res.data);
  };

  addNewMisc = async (params: any): Promise<any> => {
    return this.client.post(`/api/Quote/addMisc`, params).then((res) => res.data);
  };

  updateMisc = async (params: any): Promise<any> => {
    return this.client.post(`/api/Quote/updateMisc`, params).then((res) => res.data);
  };

  deleteMisc = async (params: any): Promise<any> => {
    return this.client.post(`/api/Quote/deleteMisc`, params).then((res) => res.data);
  };

  addNewNotes = async (params: any): Promise<any> => {
    return this.client.post(`/api/Quote/addNotes`, params).then((res) => res.data);
  };

  updateNotes = async (params: any): Promise<any> => {
    return this.client.post(`/api/Quote/updateNotes`, params).then((res) => res.data);
  };

  deleteNotes = async (params: any): Promise<any> => {
    return this.client.post(`/api/Quote/deleteNotes`, params).then((res) => res.data);
  };

  getSubmittalInfo = (params: any): Promise<any> => {
    return this.client.post(`/api/Submittals/getAllData`, params).then((res) => res.data);
  };

  addNewNote = (params: any): Promise<any> => {
    return this.client.post(`/api/Submittals/noteadd`, params).then((res) => res.data);
  };

  addNewShippingNote = (params: any): Promise<any> => {
    return this.client.post(`/api/Submittals/shippingnoteadd`, params).then((res) => res.data);
  };

  saveSubmittalInfo = (params: any): Promise<any> => {
    return this.client.post(`/api/Submittals/save`, params).then((res) => res.data);
  };

  getProjectNote = (params: any): Promise<any> => {
    return this.client.post(`/api/units/getNotes`, params).then((res) => res.data);
  };

  saveNotes = (params: any): Promise<any> => {
    return this.client.post(`/api/units/saveNotes`, params).then((res) => res.data);
  };

  addNewProject = (params: any): Promise<any> => {
    return this.client.post(`/api/job/add`, params).then((res) => res.data);
  };
}
