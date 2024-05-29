import { AxiosResponse } from 'axios';
import AbstractApi from './AbstractApi';

export default class ProjectApi extends AbstractApi {
  // PsyCalc ==================================================================================
  getRH_By_DB_WB = (params: JSON): Promise<any> =>
    this.client.post(`/api/PsyCalc/GetRH_By_DB_WB`, params).then((res: any) => res.data);

  getWB_By_DB_RH = (params: JSON): Promise<any> =>
    this.client.post(`/api/PsyCalc/GetWB_By_DB_RH`, params).then((res: any) => res.data);
  

  // Job ==================================================================================
  addNewProject = (params: JSON): Promise<any> =>
    this.client.post(`/api/job/add`, params).then((res: any) => res.data);

  getProjects = async (): Promise<any> =>
    this.client.post(`/api/job/GetSavedJobs`).then((res: any) => JSON.parse(res.data));

  getProjectInitInfo = async (): Promise<any> =>
    this.client.get(`/api/job/initinfo`).then((res: any) => JSON.parse(res.data));

  getJobSelTables = async (): Promise<any> =>
    this.client.get(`/api/job/GetJobSelTables`).then((res: any) => JSON.parse(res.data));


  getJobById = async (params: JSON): Promise<any> =>
    this.client.post(`/api/job/GetSavedJob`, params).then((res: any) => JSON.parse(res.data));

  getOutdoorInfo = async (params: any): Promise<any> =>
    this.client.post(`/api/job/getoutdoorinfo`, params).then((res: any) => res.data);

  updateProject = async (data: any) => this.client.post(`/api/job/update`, data);

  deleteProject = async (data: any) => this.client.post(`/api/job/delete`, data);

  duplicateProject = async (data: any) => this.client.post(`/api/job/duplicate`, data);

  getUnits = async (params: { jobId: number }): Promise<any> =>
    this.client.post(`/api/job/getwithunit`, params).then((res: any) => res.data);

  
  // Unit ==================================================================================
  saveUnitInfo = (params: JSON): Promise<any> =>
    this.client.post(`/api/units/Save`, params).then((res: any) => res.data);
  
  saveNotes = (params: any): Promise<any> =>
    this.client.post(`/api/units/saveNotes`, params).then((res: any) => res.data);

  getUnitInfo = (prarms: any): Promise<any> =>
    this.client.post(`/api/units/GetUnitInfo`, prarms).then((res: any) => JSON.parse(res.data));
  
  getProjectNote = (params: any): Promise<any> =>
    this.client.post(`/api/units/getNotes`, params).then((res: any) => res.data);

  getSelectionInfo = (params: any): Promise<any> =>
    this.client.post(`/api/units/ViewSelection`, params).then((res: any) => res.data);
  
  // getAllBaseData = (): Promise<any> =>
  //   this.client.get(`/api/Selection/GetAll`).then((res: any) => JSON.parse(res.data));

  getAllBaseData = (): Promise<any> =>
    this.client.get(`/api/Selection/GetAllNew`).then((res: any) => JSON.parse(res.data));


  downloadAllSelection = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/units/DownloadAllSelection', params, {
      responseType: 'blob',
      ...(config || []),
    });

  downloadSelection = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/units/DownloadSelection', params, {
      responseType: 'blob',
      ...(config || []),
    });

  downloadSelectionWithExcel = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/units/downloadselectionwithexcel', params, {
      responseType: 'blob',
      ...(config || []),
    });

  // Submittal =============================================================================
  // saveSubmittalInfo = (params: any): Promise<any> =>
  //   this.client.post(`/api/Submittals/save`, params).then((res: any) => res.data);
  
  saveSubmittalInfo = (params: JSON): Promise<any> =>
    this.client.post(`/api/Submittals/save`, params).then((res: any) => res.data);

  addNewNote = (params: any): Promise<any> =>
    this.client.post(`/api/Submittals/noteadd`, params).then((res: any) => res.data);

  addNewShippingNote = (params: any): Promise<any> =>
    this.client.post(`/api/Submittals/shippingnoteadd`, params).then((res: any) => res.data);

  getSubmittalInfo = (params: any): Promise<any> =>
    this.client.post(`/api/Submittals/getAllData`, params).then((res: any) => JSON.parse(res.data));
  // this.client.post(`/api/Submittals/getAllData`, params).then((res: any) => res.data);

  submittalExportPDF = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/submittals/exportpdf', params, {
      responseType: 'blob',
      ...(config || []),
    });

  exportEpicor = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/submittals/exportepicor', params, {
      responseType: 'blob',
      ...(config || []),
    });

  // Quote =================================================================================
  getQuoteSelTables = (): Promise<any> =>
    this.client.get(`/api/Quote/GetQuoteSelTables`).then((res: any) => JSON.parse(res.data));

  saveQuoteInfo = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Quote/save`, params).then((res: any) => res.data);

  addNewMisc = async (params: any): Promise<any> =>
    this.client.post(`/api/Quote/addMisc`, params).then((res: any) => res.data);

  updateMisc = async (params: any): Promise<any> =>
    this.client.post(`/api/Quote/updateMisc`, params).then((res: any) => res.data);

  deleteMisc = async (params: any): Promise<any> =>
    this.client.post(`/api/Quote/deleteMisc`, params).then((res: any) => res.data);

  addNewNotes = async (params: any): Promise<any> =>
    this.client.post(`/api/Quote/addNotes`, params).then((res: any) => res.data);

  updateNotes = async (params: any): Promise<any> =>
    this.client.post(`/api/Quote/updateNotes`, params).then((res: any) => res.data);

  deleteNotes = async (params: any): Promise<any> =>
    this.client.post(`/api/Quote/deleteNotes`, params).then((res: any) => res.data);

  // getProjectQuoteInfo = async (params: {
  //   intUserId: number;
  //   intUAL: number;
  //   intJobId: number;
  //   intUnitNo: number;
  // }): Promise<any> => this.client.post(`/api/quote/get`, params).then((res: any) => JSON.parse(res.data));
  // // Promise<any> => this.client.post(`/api/quote/get`, params).then((res: any) => res.data);

  getProjectQuoteInfo = async (params: JSON): Promise<any> =>
    this.client.post(`/api/quote/get`, params).then((res: any) => JSON.parse(res.data));

  
  quoteExportPDF = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/quote/exportPdf', params, {
      responseType: 'blob',
      ...(config || []),
    });

  // Resource =================================================================================
  getFileList = (): Promise<any> =>
    this.client.post('/api/resource/getFiles').then((res: any) => res.data);

  downloadResource = (params: any, config: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/resource/getFiles', params, config);
}