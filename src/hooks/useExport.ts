import { saveAs } from 'file-saver';
import axios from '../utils/axios';
import { useApiContext } from 'src/contexts/ApiContext';

export const useExport = () => {
  const api = useApiContext();
  const ExportAllSelectionPDF = async (projectId: number) => {
    const data = {
      intProjectID: projectId,
      intUAL: localStorage.getItem('UAL'),
      intUserID: localStorage.getItem('userId'),
    };

    await api.project.downloadAllSelection(data).then((response) => {
      if (!response?.data?.size || response?.data?.size === 0) {
        return;
      }
      // Get File Name
      let filename = '';
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Save File
      saveAs(response.data, `${filename}.pdf`);
    });
  };

  const ExportSelectionPDF = async (projectId: string, unitInfo: any) => {
    const data = {
      intProjectID: projectId,
      intUnitNo: unitInfo,
      intUAL: localStorage.getItem('UAL'),
      intUserID: localStorage.getItem('userId'),
    };

    await api.project.downloadSelection(data).then((response) => {
      console.log(response);
      // Get File Name
      let filename = '';
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Save File
      saveAs(response.data, `${filename}.pdf`);
    });
  };

  const ExportSelectionExcel = async (projectId: number, unitInfo: any) => {
    const data = {
      intProjectID: projectId,
      intUnitNo: unitInfo,
      intUAL: localStorage.getItem('UAL'),
      intUserID: localStorage.getItem('userId'),
    };

    await api.project.downloadSelectionWithExcel(data).then((response) => {
      // Extract the filename from the response headers
      const disposition = response.headers['content-disposition'];
      const regex = /filename="(.+)"/;
      const matches = regex.exec(disposition);
      const fileName = matches && matches[1] ? matches[1] : 'selection.xlsx';

      // Create a temporary URL for the downloaded file
      const url = URL.createObjectURL(new Blob([response.data]));
      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove the temporary URL and link element
      link?.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };

  const ExportSubmittal = async (intProjectID: number) => {
    const data = {
      intJobID: intProjectID,
      intUAL: localStorage.getItem('UAL'),
      intUserID: localStorage.getItem('userId'),
    };

    const response = await api.project.submittalExportPDF(data);
    if (response.data.type === 'application/json') {
      return false;
    }

    // Get File Name
    let filename = '';
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Save File
    saveAs(response.data, `${filename}`);
    return true;
  };
  // export pdf of form data
  const ExportSubmittalEpicor = async (intProjectId: number) => {
    const data = {
      intJobID: intProjectId,
      intUAL: localStorage.getItem('UAL'),
      intUserID: localStorage.getItem('userId'),
    };

    const response = await api.project.exportEpicor(data);
    if (response.data.type === 'application/json') {
      return false;
    }

    // Get File Name
    let filename = '';
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Save File
    saveAs(response.data, `${filename}`);
    return true;
  };

  const ExportSchedule = (projectInfo: any) => {};
  const ExportRevit = (projectInfo: any) => {};
  const ExportQuote = async (intProjectID: number) => {
    const data = {
      intJobID: intProjectID,
      intUAL: localStorage.getItem('UAL'),
      intUserID: localStorage.getItem('userId'),
    };

    const response = await api.project.quoteExportPDF(data);
    if (response.data.type === 'application/json') {
      if (!response.data.success) return 'fail';
      return 'server_error';
    }

    // Get File Name
    let filename = '';
    const disposition = response.headers['content-disposition'];
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Save File
    saveAs(response.data, `${filename}.pdf`);
    return true;
  };

  return {
    ExportAllSelectionPDF,
    ExportSelectionPDF,
    ExportSelectionExcel,
    ExportSubmittal,
    ExportSubmittalEpicor,
    ExportSchedule,
    ExportRevit,
    ExportQuote,
  };
};
