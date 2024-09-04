import { saveAs } from 'file-saver';
import { useApiContext } from 'src/contexts/ApiContext';

export const useExport = () => {
  const api = useApiContext();

  const unitListArray = localStorage?.getItem('unitlist');
  const selectedUnits = unitListArray ? JSON.parse(unitListArray) : [];
  const selectedUnitList = selectedUnits.map((item:string|Number) => Number(item));

  const ExportUnitSelectionPdf = async (jobId: string, unitInfo: any) => {
    const data = {
      intJobId: jobId,
      intUnitNo: unitInfo,
      intUAL: localStorage.getItem('UAL'),
      intUserId: localStorage.getItem('userId'),
    };

    // Do not delete - Working code to receive byteArray by HttpResponseMessage
    // await api.project.downloadUnitSelectionPdf(data).then((response) => {
    //   console.log(response);
    //   // Get File Name
    //   let filename = '';
    //   const disposition = response.headers['content-disposition'];
    //   if (disposition && disposition.indexOf('attachment') !== -1) {
    //     const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //     const matches = filenameRegex.exec(disposition);
    //     if (matches != null && matches[1]) {
    //       filename = matches[1].replace(/['"]/g, '');
    //     }
    //   }

    //   // Save File
    //   saveAs(response.data, `${filename}.pdf`);
    // });
    // Do not delete - Working code to receive byteArray by HttpResponseMessage

    await api.project.downloadUnitSelectionPdf(data).then((response) => {
      // Extract the filename from the response headers
      const disposition = response.headers['content-disposition'];
      const regex = /filename="(.+)"/;
      const matches = regex.exec(disposition);
      const fileName = matches && matches[1] ? matches[1] : 'selection.pdf';

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


  const ExportUnitSelectionExcel = async (jobId: number, unitInfo: any) => {
    const data = {
      intJobId: jobId,
      intUnitNo: unitInfo,
      intUAL: localStorage.getItem('UAL'),
      intUserId: localStorage.getItem('userId'),
    };

    await api.project.downloadUnitSelectionExcel(data).then((response) => {
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


  const ExportUnitSelectionRevit = async (jobId: number, unitInfo: any) => {
    const data = {
      intJobId: jobId,
      intUnitNo: unitInfo,
      intUAL: localStorage.getItem('UAL'),
      intUserId: localStorage.getItem('userId'),
    };

    await api.project.downloadUnitSelectionRevit(data).then((response) => {
      // Extract the filename from the response headers
      const disposition = response.headers['content-disposition'];
      const regex = /filename="(.+)"/;
      const matches = regex.exec(disposition);
      const fileName = matches && matches[1] ? matches[1] : 'selection_revit.zip';

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


  const ExportAllUnitsSelectionPdf = async (jobId: number) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitList,
    };


    // Do not delete - Working code to receive byteArray by HttpResponseMessage
    // await api.project.downloadAllUnitsSelectionPdf(data).then((response) => {
    //   if (!response?.data?.size || response?.data?.size === 0) {
    //     return;
    //   }
    //   // Get File Name
    //   let filename = '';
    //   const disposition = response.headers['content-disposition'];
    //   if (disposition && disposition.indexOf('attachment') !== -1) {
    //     const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //     const matches = filenameRegex.exec(disposition);
    //     if (matches != null && matches[1]) {
    //       filename = matches[1].replace(/['"]/g, '');
    //     }
    //   }

    //   // Save File
    //   saveAs(response.data, `${filename}.pdf`);
    // });
    // Do not delete - Working code to receive byteArray by HttpResponseMessage



    await api.project.downloadAllUnitsSelectionPdf(data).then((response) => {
      // Extract the filename from the response headers
      const disposition = response.headers['content-disposition'];
      const regex = /filename="(.+)"/;
      const matches = regex.exec(disposition);
      const fileName = matches && matches[1] ? matches[1] : 'selection_all.pdf';

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


  const ExportSubmittalPdf = async (jobId: number) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitList,
    };

    // Do not delete - Working code to receive byteArray by HttpResponseMessage
    // const response = await api.project.downloadSubmittalPdf(data);
    // if (response.data.type === 'application/json') {
    //   return false;
    // }

    // // Get File Name
    // let filename = '';
    // const disposition = response.headers['content-disposition'];
    // if (disposition && disposition.indexOf('attachment') !== -1) {
    //   const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //   const matches = filenameRegex.exec(disposition);
    //   if (matches != null && matches[1]) {
    //     filename = matches[1].replace(/['"]/g, '');
    //   }
    // }

    // // Save File
    // saveAs(response.data, `${filename}`);
    // return true;
    // Do not delete - Working code to receive byteArray by HttpResponseMessage


    await api.project.downloadSubmittalPdf(data).then((response) => {
      // Extract the filename from the response headers
      const disposition = response.headers['content-disposition'];
      const regex = /filename="(.+)"/;
      const matches = regex.exec(disposition);
      const fileName = matches && matches[1] ? matches[1] : 'submittal.pdf';

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


  // export pdf of form data
  const ExportSubmittalEpicorExcel = async (jobId: number) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitList,
    };

    // const response = await api.project.downloadSubmittalEpicorExcel(data);
    // if (response.data.type === 'application/json') {
    //   return false;
    // }

    // // Get File Name
    // let filename = '';
    // const disposition = response.headers['content-disposition'];
    // if (disposition && disposition.indexOf('attachment') !== -1) {
    //   const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //   const matches = filenameRegex.exec(disposition);
    //   if (matches != null && matches[1]) {
    //     filename = matches[1].replace(/['"]/g, '');
    //   }
    // }

    // // Save File
    // saveAs(response.data, `${filename}`);
    // return true;

    await api.project.downloadSubmittalEpicorExcel(data).then((response) => {
      // Extract the filename from the response headers
      const disposition = response.headers['content-disposition'];
      const regex = /filename="(.+)"/;
      const matches = regex.exec(disposition);
      const fileName = matches && matches[1] ? matches[1] : 'submittal_epicor.xlsx';

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


  const ExportMechanicalScheduleExcel = async (jobId: number) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitList,
    };

    await api.project.downloadMechanicalScheduleExcel(data).then((response) => {
      // Extract the filename from the response headers
      const disposition = response.headers['content-disposition'];
      const regex = /filename="(.+)"/;
      const matches = regex.exec(disposition);
      const fileName = matches && matches[1] ? matches[1] : 'schedule.xlsx';

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


  const ExportAllUnitsSelectionRevit = async (jobId: number) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitList,
    };

    await api.project.downloadAllUnitsSelectionRevit(data).then((response) => {
      // Extract the filename from the response headers
      const disposition = response.headers['content-disposition'];
      const regex = /filename="(.+)"/;
      const matches = regex.exec(disposition);
      const fileName = matches && matches[1] ? matches[1] : 'selection_all_revit.zip';

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


  const ExportQuotePdf = async (jobId: number) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitList,
    };

    // const response = await api.project.downloadQuotePdf(data);
    // if (response.data.type === 'application/json') {
    //   if (!response.data.success) return 'fail';
    //   return 'server_error';
    // }

    // // Get File Name
    // let filename = '';
    // const disposition = response.headers['content-disposition'];
    // if (disposition && disposition.indexOf('attachment') !== -1) {
    //   const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //   const matches = filenameRegex.exec(disposition);
    //   if (matches != null && matches[1]) {
    //     filename = matches[1].replace(/['"]/g, '');
    //   }
    // }

    // // Save File
    // saveAs(response.data, `${filename}.pdf`);
    // return true;


    await api.project.downloadQuotePdf(data).then((response) => {
      // Extract the filename from the response headers
      const disposition = response.headers['content-disposition'];
      const regex = /filename="(.+)"/;
      const matches = regex.exec(disposition);
      const fileName = matches && matches[1] ? matches[1] : 'quote.pdf';

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

  
  return {
    ExportUnitSelectionPdf,
    ExportAllUnitsSelectionPdf,
    ExportUnitSelectionExcel,
    ExportUnitSelectionRevit,
    ExportAllUnitsSelectionRevit,
    ExportSubmittalPdf,
    ExportSubmittalEpicorExcel,
    ExportMechanicalScheduleExcel,
    ExportQuotePdf,
  };
};
