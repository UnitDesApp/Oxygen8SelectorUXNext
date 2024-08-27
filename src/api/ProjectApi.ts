import { AxiosResponse } from 'axios';
import AbstractApi from './AbstractApi';

export default class ProjectApi extends AbstractApi {
  // PsyCalc ==================================================================================
  getRH_By_DB_WB = (params: JSON): Promise<any> =>
    this.client.post(`/api/PsyCalc/GetRH_By_DB_WB`, params).then((res: any) => res.data);

  getWB_By_DB_RH = (params: JSON): Promise<any> =>
    this.client.post(`/api/PsyCalc/GetWB_By_DB_RH`, params).then((res: any) => res.data);
  

  // Job ==================================================================================
  getJobSelTables = async (): Promise<any> =>
    this.client.get(`/api/Job/GetJobSelTables`).then((res: any) => JSON.parse(res.data));

  saveJob = (params: JSON): Promise<any> =>
    this.client.post(`/api/Job/SaveJob`, params).then((res: any) => res.data);

  deleteJob = async (data: any) => 
    this.client.post(`/api/Job/DeleteJob`, data);

  duplicateJob = async (data: any) => 
    this.client.post(`/api/Job/DuplicateJob`, data);

  getSavedJobsByUserAndCustomer = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Job/GetSavedJobsByUserAndCustomer`, params).then((res: any) => JSON.parse(res.data));

  getSavedJobs = async (): Promise<any> =>
    this.client.post(`/api/Job/GetSavedJobs`).then((res: any) => JSON.parse(res.data));

  getSavedJob = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Job/GetSavedJob`, params).then((res: any) => JSON.parse(res.data));

  // getJobInitInfo = async (): Promise<any> =>
  //   this.client.get(`/api/Job/initinfo`).then((res: any) => JSON.parse(res.data));


  // getOutdoorInfo = async (params: any): Promise<any> =>
  //   this.client.post(`/api/Job/getoutdoorinfo`, params).then((res: any) => res.data);

  // updateProject = async (data: any) => this.client.post(`/api/job/update`, data);

  getUnits = async (params: { jobId: number }): Promise<any> =>
    this.client.post(`/api/job/getwithunit`, params).then((res: any) => res.data);

  
  // Unit ==================================================================================
  getUnitSelTables = (): Promise<any> =>
    this.client.get(`/api/Unit/GetUnitSelTables`).then((res: any) => JSON.parse(res.data));

  saveUnit = (params: JSON): Promise<any> =>
    this.client.post(`/api/Unit/SaveUnit`, params).then((res: any) => res.data);
  
  saveUnitNotes = (params: any): Promise<any> =>
    this.client.post(`/api/Unit/SaveUnitNotes`, params).then((res: any) => res.data);

  getSavedUnit = (prarms: any): Promise<any> =>
    this.client.post(`/api/Unit/GetSavedUnit`, prarms).then((res: any) => JSON.parse(res.data));
  
  getSavedUnitNotes = (params: any): Promise<any> =>
    this.client.post(`/api/Unit/GetSavedUnitNotes`, params).then((res: any) => res.data);

  // getUnitSelection = (params: any): Promise<any> =>
  //   this.client.post(`/api/Unit/GetUnitSelection`, params).then((res: any) => res.data);
  
  getUnitSelection = (params: any): Promise<any> =>
    this.client.post(`/api/Unit/GetUnitSelection`, params).then((
      res: any) => JSON.parse(res.data));


  deleteUnit = (params: JSON): Promise<any> =>
        this.client.post(`/api/Unit/DeleteUnit`, params).then((res: any) => res.data);
    
  duplicateUnit = (params: JSON): Promise<any> =>
    this.client.post(`/api/Unit/DuplicateUnit`, params).then((res: any) => res.data);


  // getAllBaseData = (): Promise<any> =>
  //   this.client.get(`/api/Selection/GetAll`).then((res: any) => JSON.parse(res.data));


  downloadUnitSelectionPdf = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/unit/DownloadUnitSelectionPdf', params, {
      responseType: 'blob',
      ...(config || []),
    });


  downloadAllUnitsSelectionPdf = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/unit/DownloadAllUnitsSelectionPdf', params, {
      responseType: 'blob',
      ...(config || []),
    });



  downloadUnitSelectionExcel = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/unit/DownloadUnitSelectionExcel', params, {
      responseType: 'blob',
      ...(config || []),
    });

  // Submittal =============================================================================
  // saveSubmittalInfo = (params: any): Promise<any> =>
  //   this.client.post(`/api/Submittals/save`, params).then((res: any) => res.data);
  
  saveSubmittal = (params: JSON): Promise<any> =>
    this.client.post(`/api/Submittal/SaveSubmittal`, params).then((res: any) => res.data);

  saveSubmittalNotes = (params: JSON): Promise<any> =>
    this.client.post(`/api/Submittal/SaveSubmittalNotes`, params).then((res: any) => JSON.parse(res.data));

  deleteSubmittalNotes = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Submittal/DeleteSubmittalNotes`, params).then((res: any) => JSON.parse(res.data));


  saveSubmittalShippingNotes = (params: JSON): Promise<any> =>
    this.client.post(`/api/Submittal/SaveSubmittalShippingNotes`, params).then((res: any) => JSON.parse(res.data));

  deleteSubmittalShippingNotes = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Submittal/DeleteSubmittalShippingNotes`, params).then((res: any) => JSON.parse(res.data));


  getSavedSubmittal = (params: any): Promise<any> =>
    this.client.post(`/api/Submittal/GetSavedSubmittal`, params).then((res: any) => JSON.parse(res.data));
  // this.client.post(`/api/Submittals/getAllData`, params).then((res: any) => res.data);

  downloadSubmittalPdf = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/Submittal/DownloadSubmittalPdf', params, {
      responseType: 'blob',
      ...(config || []),
    });

  downloadSubmittalEpicorExcel = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/Submittal/DownloadSubmittalEpicorExcel', params, {
      responseType: 'blob',
      ...(config || []),
    });

  // Quote =================================================================================
  getQuoteSelTables = (): Promise<any> =>
    this.client.get(`/api/Quote/GetQuoteSelTables`).then((res: any) => JSON.parse(res.data));

  saveQuote = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Quote/SaveQuote`, params).then((res: any) => JSON.parse(res.data));

  getSavedQuote = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Quote/GetSavedQuote`, params).then((res: any) => JSON.parse(res.data));

  saveQuoteMisc = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Quote/SaveQuoteMisc`, params).then((res: any) => JSON.parse(res.data));

    // updateMisc = async (params: any): Promise<any> =>
  //   this.client.post(`/api/Quote/updateMisc`, params).then((res: any) => res.data);

  deleteQuoteMisc = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Quote/DeleteQuoteMisc`, params).then((res: any) => JSON.parse(res.data));


  saveQuoteNotes = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Quote/SaveQuoteNotes`, params).then((res: any) => JSON.parse(res.data));

  // updateNotes = async (params: any): Promise<any> =>
  //   this.client.post(`/api/Quote/updateNotes`, params).then((res: any) => res.data);

  deleteQuoteNotes = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Quote/DeleteQuoteNotes`, params).then((res: any) => JSON.parse(res.data));

  
  getSavedQuoteNotes = async (params: JSON): Promise<any> =>
    this.client.post(`/api/Quote/GetSavedQuoteNotes`, params).then((res: any) => JSON.parse(res.data));

  
  downloadQuotePdf = (params: any, config?: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/Quote/DownloadQuotePdf', params, {
      responseType: 'blob',
      ...(config || []),
    });


      // getProjectQuoteInfo = async (params: {
  //   intUserId: number;
  //   intUAL: number;
  //   intJobId: number;
  //   intUnitNo: number;
  // }): Promise<any> => this.client.post(`/api/quote/get`, params).then((res: any) => JSON.parse(res.data));
  // // Promise<any> => this.client.post(`/api/quote/get`, params).then((res: any) => res.data);

  // Resources =================================================================================
  getResourceFiles = (): Promise<any> =>
    this.client.post('/api/Resources/GetResourceFiles').then((res: any) => res.data);

  downloadResourceFile = (params: any, config: any): Promise<AxiosResponse<any, any>> =>
    this.client.post('/api/Resources/DownloadResourceFile', params, config);
}