import { useState, useMemo, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import {
  Container,
  Box,
  Grid,
  Typography,
  Stack,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TextField,
  Button,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import TableCell from '@mui/material/TableCell';
import { LoadingButton } from '@mui/lab';
// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify';
import { useApiContext } from 'src/contexts/ApiContext';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import { useGetSavedJob } from 'src/hooks/useApi';

// components

// ----------------------------------------------------------------------
const PROJECT_INFO_TABLE_HEADER = [
  'QTY',
  'TAG',
  'ITEM',
  'MODEL',
  'VOLTAGE',
  'CONTROLS PREFERENCE',
  'INSTALLATION',
  'DUCT CONNECTION',
  'HANDING',
  'PART DESC',
  'PART NUMBER',
  'PRICING',
];

const BoxStyles = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 2fr)',
  rowGap: 10,
  columnGap: 10,
  margin: 10,
  marginTop: 20,
}));

const TableHeaderCellStyled = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  boxShadow: 'none!important',
  fontSize:'0.65rem'
}));
const TableBodyCellStyled = styled(TableCell)(({ theme }) => ({
  fontSize:'0.70rem'
}));

// -------------------------------------------------------------------
type ProjectSubmittalFormProps = {
  projectId: number;
  submittalInfo: any;
};

export default function ProjectSubmittalForm({
  projectId,
  submittalInfo,
}: ProjectSubmittalFormProps) {
  // api
  const api = useApiContext();

  // State
  const [isProcessingData, setIsProcessingData] = useState(false)
  const [scheduleInfo, setScheduleInfo] = useState <any>([]);
  const [notesNo, setNotesNo] = useState('');
  const [notesListInfo, setNotesListInfo] = useState <any>([]);
  const [shippingNotesNo, setShippingNotesNo] = useState('');
  const [shippingNotesListInfo, setShippingNotesListInfo] = useState <any>([]); 
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [expanded, setExpanded] = useState({panel1: true, panel2: true, panel3: true, panel4: true, panel5: true, });
  const theme = useTheme();


  // Form Schema
  const SubmittalFormSchema = Yup.object().shape({
    txbJobName: Yup.string(),
    txbRepName: Yup.string(),
    txbSalesEngineer: Yup.string(),
    // txbLeadTime: Yup.string().required('Please enter a Lead Time'),
    // txbRevisionNo: Yup.number().required('Please enter a Revision No'),
    // txbPONumber: Yup.number().required('Please enter a PO Number'),
    // txbShipName: Yup.string().required('Please enter a Ship Name'),
    // txbShippingStreetAddress: Yup.string().required('Please enter a Street Address'),
    // txbShippingCity: Yup.string().required('Please enter a City'),
    // txbShippingProvince: Yup.string().required('Please enter a State'),
    // txbShippingPostalCode: Yup.string().required('Please enter a Zip'),
    // ddlCountry: Yup.string().required('Please Select a Country'),
    // ddlDockType: Yup.string().required('Please Select a Dock type'),
    txbLeadTime: Yup.string(),
    txbRevisionNo: Yup.number().required('Please enter a Revision No'),
    txbPONumber: Yup.string(),
    txbShipName: Yup.string(),
    txbShippingStreetAddress: Yup.string(),
    txbShippingCity: Yup.string(),
    txbShippingProvince: Yup.string(),
    txbShippingPostalCode: Yup.string(),
    ddlCountry: Yup.number(),
    ddlDockType: Yup.number(),
    ckbBACNetPointList: Yup.boolean(),
    ckbBackdraftDamper: Yup.boolean(),
    ckbBypassDefrost: Yup.boolean(),
    ckbConstantVolume: Yup.boolean(),
    ckbFireAlarm: Yup.boolean(),
    ckbHumidification: Yup.boolean(),
    ckbHydronicPreheat: Yup.boolean(),
    ckbOJHMISpec: Yup.boolean(),
    ckbTemControl: Yup.boolean(),
    ckbTerminalWiring: Yup.boolean(),
    ckbVoltageTable: Yup.boolean(),
    txbNotes: Yup.string(),
    txbShippingNotes: Yup.string(),
  });

  // default values for form depend on redux
  const defaultValues = useMemo(
    () => ({
      txbJobName: submittalInfo?.strProjectName ? submittalInfo?.strProjectName : '',
      txbRepName: submittalInfo?.strRepName ? submittalInfo?.strRepName : '',
      txbSalesEngineer: submittalInfo?.strSalesEngineer ? submittalInfo?.strSalesEngineer : '',
      txbLeadTime: submittalInfo?.strLeadTime ? submittalInfo?.strLeadTime : '8-10 Weeks',
      txbRevisionNo: submittalInfo?.intRevisionNo ? submittalInfo?.intRevisionNo : '0',
      txbPONumber: submittalInfo?.strPO_Number ? submittalInfo?.strPO_Number : '0',
      txbShippingName: submittalInfo?.strShippingName ? submittalInfo?.strShippingName : '',
      txbShippingStreetAddress: submittalInfo?.strShippingStreetAddress ? submittalInfo?.strShippingStreetAddress : '',
      txbShippingCity: submittalInfo?.strShippingCity ? submittalInfo?.strShippingCity : '',
      txbShippingProvince: submittalInfo?.strShippingProvince ? submittalInfo?.strShippingProvince : '',
      txbShippingPostalCode: submittalInfo?.strShippingPostalCode ? submittalInfo?.strShippingPostalCode : '',
      ddlShippingCountry: submittalInfo?.intShippingCountryId ? submittalInfo?.intShippingCountryId : 0,
      ddlDockType: submittalInfo?.intDockTypeId ? submittalInfo?.intDockTypeId : 0,
      ckbVoltageTable: submittalInfo?.intIsVoltageTable ? submittalInfo?.intIsVoltageTable: 0,
      ckbBACNetPointList: submittalInfo?.intIsBACNetPoints ? submittalInfo?.intIsBACNetPoints : 0,
      ckbOJHMISpec: submittalInfo?.intIsOJ_HMI_Spec ? submittalInfo?.intIsOJ_HMI_Spec : 0,
      ckbTerminalWiring: submittalInfo?.intIsTerminalWiringDiagram ? submittalInfo?.intIsTerminalWiringDiagram : 0,
      ckbFireAlarm: submittalInfo?.intIsFireAlarm ? submittalInfo?.intIsFireAlarm : 0,
      ckbBackdraftDamper: submittalInfo?.intIsBackdraftDampers ? submittalInfo?.intIsBackdraftDampers : 0,
      ckbBypassDefrost: submittalInfo?.intIsBypassDefrost ? submittalInfo?.intIsBypassDefrost : 0,
      ckbConstantVolume: submittalInfo?.intIsConstantVolume  ? submittalInfo?.intIsConstantVolume : 0,
      ckbHydronicPreheat: submittalInfo?.intIsHydronicPreheat ? submittalInfo?.intIsHydronicPreheat : 0,
      ckbHumidification: submittalInfo?.intIsHumidification  ? submittalInfo?.intIsHumidification : 0,
      ckbTemControl: submittalInfo?.intIsTempControl ? submittalInfo?.intIsTempControl : 0,
      txbNotes: '',
      txbShippingNotes: '',
      }),
    [submittalInfo]
  );


  // form setting using useForm
  const methods = useForm({
    resolver: yupResolver(SubmittalFormSchema),
    defaultValues,
  });

  const {
    setValue,
    getValues,
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;



  let formCurrValues = getValues();
  const today = new Date();

  const getSubmittalInputs = () => {
    // const jsonData = '{"name":"John", "age":30, "city":"London"}';
    // let oUnitInputs;
    formCurrValues = getValues(); // Do not use watch, must use getValues with the function to get current values.
    // let savedDate =  savedJob?.strCreatedDate;
    
    // if (savedDate?.includes('/')) {
    //   const [month, day, year] =  savedDate.split('/');
    //   savedDate =`${year}-${month}-${day}`;
    // }


  const oSubmittalInputs = {
        
    oSubm: {
      "intUserId": localStorage.getItem('userId'),
      "intUAL": localStorage.getItem('UAL'),
      "intJobId" : projectId,
      "strLeadTime" : formCurrValues.txbLeadTime,
      "intRevisionNo" : formCurrValues.txbRevisionNo,
      "strPO_Number" :  formCurrValues.txbPONumber,
      "strShippingName" : formCurrValues.txbShippingName,
      "strShippingStreetAddress" : formCurrValues.txbShippingStreetAddress,
      "strShippingCity" : formCurrValues.txbShippingCity,
      "strShippingProvince" : formCurrValues.txbShippingProvince,
      "intShippingCountryId" : Number(formCurrValues.ddlShippingCountry),
      "strShippingPostalCode" : formCurrValues.txbShippingPostalCode,
      "intDockTypeId" : Number(formCurrValues.ddlDockType),
      "intIsVoltageTable" : Number(formCurrValues.ckbVoltageTable) === 1 ? 1 : 0,
      "intIsBACNetPoints" : Number(formCurrValues.ckbBACNetPointList) === 1 ? 1 : 0,
      "intIsOJ_HMI_Spec" : Number(formCurrValues.ckbOJHMISpec) === 1 ? 1 : 0,
      "intIsTerminalWiringDiagram" : Number(formCurrValues.ckbTerminalWiring) === 1 ? 1 : 0,
      "intIsFireAlarm" : Number(formCurrValues.ckbFireAlarm) === 1 ? 1 : 0,
      "intIsBackdraftDampers" : Number(formCurrValues.ckbBackdraftDamper) === 1 ? 1 : 0,
      "intIsBypassDefrost" : Number(formCurrValues.ckbBypassDefrost) === 1 ? 1 : 0,
      "intIsConstantVolume" : Number(formCurrValues.ckbConstantVolume) === 1 ? 1 : 0,
      "IsHydronicPreheat" : Number(formCurrValues.ckbHydronicPreheat) === 1 ? 1 : 0,
      "IsHumidification" : Number(formCurrValues.ckbHumidification) === 1 ? 1 : 0,
      "IsTempControl" : Number(formCurrValues.ckbTemControl) === 1 ? 1 : 0,
    },
  }
  
  return oSubmittalInputs;
  };


  
  // // submmit function
  // const onProjectInfoSubmit = useCallback(
  //   async (data: any) => {
  //     try {
  //       const requestData = {
  //         ...data,
  //         intUserID: localStorage.getItem('userId'),
  //         intUAL: localStorage.getItem('UAL'),
  //         intJobID: projectId,
  //       };
  //       const returnValue = await api.project.saveSubmittalInfo(requestData);
  //       if (returnValue) {
  //         setSuccess(true);
  //       } else {
  //         setFail(true);
  //       }
  //     } catch (error) {
  //       setFail(true);
  //     }
  //   },
  //   [api.project, projectId]
  // );


  const { data: dbtSavedJob } = useGetSavedJob({intJobId: projectId}); // useGetSavedJob api call returns data and stores in dbtSavedJob

  useEffect(() => {
      if (dbtSavedJob) {
        setValue('txbJobName', dbtSavedJob?.job_name);
        setValue('txbRepName', dbtSavedJob?.CompanyCustomerName);
        setValue('txbSalesEngineer', dbtSavedJob?.CompanyCustomerContactName);
      } else {
        setValue('txbJobName', null);
        setValue('txbRepName', null);
        setValue('txbSalesEngineer', null);
      }
  }, [dbtSavedJob, setValue]);



  useEffect(() => {
    const info: { fdtSchedule: any} = { fdtSchedule: []};

    info.fdtSchedule = submittalInfo?.dtSchedule;
    setScheduleInfo(info);
  },
  [submittalInfo]);


  useEffect(() => {
    const info: { fdtNotes: any;} = { fdtNotes: []};

    info.fdtNotes = submittalInfo?.dtNotes;
    setNotesListInfo(info);
  },
  [submittalInfo]);


  useEffect(() => {
    const info: { fdtShippingNotes: any} = { fdtShippingNotes: []};

    info.fdtShippingNotes = submittalInfo?.dtShippingNotes;
    setShippingNotesListInfo(info);
  },
  [submittalInfo]);


    // submmit function
    const onProjectInfoSubmit = async (data: any) => {
        try {
          setIsProcessingData(true);
          // const requestData = {
          //   ...data,
          //   intUserID: localStorage.getItem('userId'),
          //   intUAL: localStorage.getItem('UAL'),
          //   intJobID: projectId,
          // };
          const oSubm: any = getSubmittalInputs(); // JC: Job Container

          const returnValue = await api.project.saveSubmittal(oSubm);
          if (returnValue) {
            setSuccess(true);
            // if (refetch) refetch();

          } else {
            setFail(true);
          }
        } catch (error) {
          setFail(true);
        } finally {
      
          setIsProcessingData(false);
        }
    };

  // event handler for adding shipping note
  const addShippingNotesClicked = useCallback(async () => {
    if (getValues('txbShippingNotes') === '') return;

    setIsProcessingData(true);

    const data: any = {
      // intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intShippingNotesNo: 0,
      strShippingNotes: getValues('txbShippingNotes'),
    };
    const result = await api.project.saveSubmittalShippingNotes(data);

    const info: { fdtShippingNotes: any} = { fdtShippingNotes: []};
    info.fdtShippingNotes = result;
    setShippingNotesListInfo(info);

    setValue('txbShippingNotes', '');

    setIsProcessingData(false);

  }, [api.project, getValues, projectId, setValue]);


  const updateShippingNotesClicked = useCallback(async () => {
    if (getValues('txbShippingNotes') === '') return;

    setIsProcessingData(true);

    const data: any = {
      // intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intShippingNotesNo: shippingNotesNo,
      strShippingNotes: getValues('txbShippingNotes'),
    };
    const result = await api.project.saveSubmittalShippingNotes(data);

    const info: { fdtShippingNotes: any} = { fdtShippingNotes: []};
    info.fdtShippingNotes = result;
    setShippingNotesListInfo(info);

    setValue('txbShippingNotes', '');

    setIsProcessingData(false);

  }, [api.project, getValues, projectId, setValue, shippingNotesNo]);



  const editShippingNotesClicked = useCallback((row: any) => {
    setShippingNotesNo(row?.shipping_notes_no);
    setValue('txbShippingNotes', row?.notes);

  }, [setValue]);


  const deleteShippingNotesClicked = useCallback(async (row: any) => {

    setIsProcessingData(true);

    const data: any = {
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intShippingNotesNo: row?.shipping_notes_no,
    };
    const result = await api.project.deleteSubmittalShippingNotes(data);

    const info: { fdtShippingNotes: any;} = { fdtShippingNotes: []};
    info.fdtShippingNotes = result;
    setShippingNotesListInfo(info);

    setValue('txbShippingNotes', '');

    setIsProcessingData(false);

  }, [api.project, projectId, setValue]);


  // event handler for addding note
  const addNotesClicked = useCallback(async () => {
    if (getValues('txbNotes') === '') return;

    setIsProcessingData(true);

    const data: any = {
      // intUserId: localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      strNotes: getValues('txbNotes'),
    };
    const result = await api.project.saveSubmittalNotes(data);

    const info: { fdtNotes: any;} = { fdtNotes: []};
    info.fdtNotes = result;
    setNotesListInfo(info);

    setValue('txbNotes', '');

    setIsProcessingData(false);

  }, [api.project, getValues, projectId, setValue]);
  

  const updateNotesClicked = useCallback(async () => {
    if (getValues('txbNotes') === '') return;

    setIsProcessingData(true);

    const data: any = {
      // intUserId: localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intNotesNo: notesNo,
      strNotes: getValues('txbNotes'),
    };
    const result = await api.project.saveSubmittalNotes(data);

    const info: { fdtNotes: any;} = { fdtNotes: []};
    info.fdtNotes = result;
    setNotesListInfo(info);

    setValue('txbNotes', '');

    setIsProcessingData(false);

  }, [api.project, getValues, notesNo, projectId, setValue]);


  const editNotesClicked = useCallback((row: any) => {
    setNotesNo(row?.notes_no);
    setValue('txbNotes', row?.notes);

  }, [setValue]);


  const deleteNotesClicked = useCallback(async (row: any) => {

    setIsProcessingData(true);

    const data: any = {
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intNotesNo: row?.notes_no,
    };
    const result = await api.project.deleteSubmittalNotes(data);

    const info: { fdtNotes: any;} = { fdtNotes: []};
    info.fdtNotes = result;
    setNotesListInfo(info);

    setValue('txbNotes', '');

    setIsProcessingData(false);

  }, [api.project, projectId, setValue]);



  const setValueWithCheck = useCallback(
    (e: any, key: any) => {
      if (e.target.value === '') {
        setValue(key, '');
      } else if (e.target.value[0] === '0') {
        setValue(key, '0');
        return true;
      } else if (!Number.isNaN(+e.target.value)) {
        setValue(key, parseFloat(e.target.value));
        return true;
      }
      return false;
    },
    [setValue]
  );

  const setValueWithCheck1 = useCallback(
    (e: any, key: any) => {
      if (e.target.value === '') {
        setValue(key, '');
      } else if (!Number.isNaN(Number(+e.target.value))) {
        setValue(key, e.target.value);
        return true;
      }
      return false;
    },
    [setValue]
  );


  return (
    <Container maxWidth={false} disableGutters sx={{ mt: '20px' }}>
    {isProcessingData ? ( 
      <CircularProgressLoading /> 
    ) : (
      <FormProvider methods={methods}  onSubmit={handleSubmit(onProjectInfoSubmit)}>
        <Grid container  spacing={3} sx={{ mb: 5}}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={3} justifyContent="flex-end" alignItems="flex-end">
              <LoadingButton
                type="submit"
                startIcon={<Iconify icon="fluent:save-24-regular" />}
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Accordion
              expanded={expanded.panel1}
              onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
            >
              <AccordionSummary
                expandIcon={<Iconify icon="il:arrow-down" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography color="primary.main" variant="h6">
                  Summary
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <BoxStyles>
                  <RHFTextField size="small" name="txbJobName" label="Project Name" disabled />
                  <RHFTextField size="small" name="txbRepName" label="Rep Name" disabled />
                  <RHFTextField size="small" name="txbSalesEngineer" label="Sales Engineer" disabled />
                  <RHFTextField size="small" name="txbLeadTime" label="Lead Time" />
                  <RHFTextField size="small" name="txbRevisionNo" label="revisionNo" value={0} />
                  <RHFTextField size="small" name="txbPONumber" label="PO Number" />
                </BoxStyles>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Accordion
              expanded={expanded.panel2}
              onChange={() => setExpanded({ ...expanded, panel2: !expanded.panel2 })}
            >
              <AccordionSummary
                expandIcon={<Iconify icon="il:arrow-down" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography color="primary.main" variant="h6">
                  Ship To Address
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <BoxStyles>
                  <RHFTextField size="small" name="txbShippingName" label="Name" />
                  <RHFTextField size="small" name="txbShippingStreetAddress" label="Street Address"/>
                  <RHFTextField size="small" name="txbShippingCity" label="City" />
                  <RHFTextField size="small" name="txbShippingProvince" label="State / Province" />
                  <RHFTextField size="small" name="txbShippingPostalCode" label="Zip / Postal Code" />
                  <RHFSelect native size="small" name="ddlShippingCountry" label="Country" placeholder="">
                    <option value="1" selected>Canada</option>
                    <option value="2">USA</option>
                  </RHFSelect>
                  <RHFSelect native size="small" name="ddlDockType" label="Dock Type" placeholder="" >
                    <option value="1">Type1</option>
                    <option value="2">Type2</option>
                  </RHFSelect>
                </BoxStyles>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Accordion
              expanded={expanded.panel3}
              onChange={() => setExpanded({ ...expanded, panel3: !expanded.panel3 })}
            >
              <AccordionSummary
                expandIcon={<Iconify icon="il:arrow-down" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography color="primary.main" variant="h6">
                  Project Informations
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <TableContainer component={Paper} sx={{ mt: 1.5 }}>
                  <Scrollbar>
                    <Table  sx={{overflow:'hidden', tableLayout:'fixed', pt: '5px' }}>
                      <TableHead>
                        <TableRow>
                          {PROJECT_INFO_TABLE_HEADER.map((item, index) => (
                            <TableHeaderCellStyled
                              key={index}
                              component="th"
                              scope="row"
                              align="left"
                            >
                              {item}
                            </TableHeaderCellStyled>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody sx={{ pt: '10px' }}>
                        {scheduleInfo?.fdtSchedule?.map(
                          (row: any, index: number) => (
                            <Row row={row} key={index} />
                          )
                        )}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </TableContainer> */}
                    <TableContainer component={Paper}>
                      <Table size="small" sx={{ textsize: 'small', overflow: 'hidden', tableLayout: 'fixed', pt: '5px' }}>
                        <TableHead color="primary.main">
                          <TableRow>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '4%' }}>
                              {/* <TableCell component="th" scope="row" align="left" sx={{fontWeight: item?.is_unit_bold ? 700 : 300}}> */}
                              QTY
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '12.5%' }}>
                              TAG
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '15%' }}>
                              ITEM
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '15%' }}>
                              MODEL
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '12.5%' }}>
                              VOLTAGE
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '12.5%' }}>
                              CONTROLS
                              PREFERENCE
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '12.5%' }}>
                              INSTALLATION
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>
                              DUCT
                              CONNECTION
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '8%' }}>
                              HANDING
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '40%' }} >
                              PART DESC
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '12.5%' }} >
                              PART NUMBER
                            </TableHeaderCellStyled>
                            <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>
                              PRICING
                            </TableHeaderCellStyled>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {scheduleInfo?.fdtSchedule?.map((item: any, i: number) => (
                            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0, } }}>
                              {/* <TableRow key={i} sx={{border: 0, fontWeight: Number(item?.is_unit_bold) === 1 ? 700 : 300}}> */}
                              <TableBodyCellStyled component="th" scope="row" align="center">
                                {/* <TableCell component="th" scope="row" align="left" sx={{fontWeight: item?.is_unit_bold ? 700 : 300}}> */}
                                {item.qty}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.tag}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.item}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.model}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.voltage}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.controls_preference}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.installation}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.duct_connection}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.handing}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.part_desc}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.part_number}
                              </TableBodyCellStyled>
                              <TableBodyCellStyled component="th" scope="row" align="center" sx={{ fontWeight: item?.is_unit_bold ? 700 : 300 }}>
                                {item.pricing}
                              </TableBodyCellStyled>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Accordion
              expanded={expanded.panel4}
              onChange={() => setExpanded({ ...expanded, panel4: !expanded.panel4 })}
            >
              <AccordionSummary
                expandIcon={<Iconify icon="il:arrow-down" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography color="primary.main" variant="h6">
                  Added Shipping Instructions
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                <RHFTextField 
                    sx={{ width: '60%' }}
                    size="small"
                    name="txbShippingNotes"
                    label="Enter Shipping"
                    // value={shippingNoteInfo}
                    // onBlur={(e) => setShippingNote(e.target.value)}
                  />
                  <Button
                    sx={{ width: '20%', borderRadius: '5px', mt: '1px' }}
                    variant="contained"
                    onClick={addShippingNotesClicked}
                  >
                    Add Shipping Instruction
                  </Button>
                  <Button
                    sx={{ width: '20%', borderRadius: '5px', mt: '1px' }}
                    variant="contained"
                    onClick={updateShippingNotesClicked}
                  >
                    Update Shipping Instruction
                  </Button>
                </Stack>
                <Box sx={{ pt: '10px' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': {
                            border: 0,
                            boxShadow: 'none',
                          },
                        }}
                      >
                        <TableHeaderCellStyled component="th" sx={{ width: '20%' }} align="center">No</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" sx={{ width: '80%' }} align="left">Shipping Instruction</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>Edit</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>Delete</TableHeaderCellStyled>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shippingNotesListInfo?.fdtShippingNotes?.map(
                        (row: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row" align="center">
                              {index + 1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {row.shipping_notes}
                            </TableCell>
                            <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }}>                    
                            <IconButton
                              sx={{ color: theme.palette.success.main }}
                              onClick={() => editShippingNotesClicked(row)}
                                >
                                <Iconify icon="material-symbols:edit-square-outline" />
                            </IconButton>
                          </TableCell>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }} >
                            <IconButton sx={{ color: theme.palette.warning.main }}
                            onClick={() => deleteShippingNotesClicked(row)}
                            >
                              <Iconify icon="ion:trash-outline" />
                            </IconButton>
                          </TableCell>

                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Accordion
              expanded={expanded.panel5}
              onChange={() => setExpanded({ ...expanded, panel5: !expanded.panel5 })}
            >
              <AccordionSummary
                expandIcon={<Iconify icon="il:arrow-down" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography color="primary.main" variant="h6">
                  Added Notes
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                  <RHFTextField
                    sx={{ width: '60%' }}
                    size="small"
                    name="txbNotes"
                    label="Enter Notes"
                    // value={noteInfo}
                    // onChange={(e) => setNote(e.target.value)}
                  />
                  <Button
                    sx={{ width: '20%', borderRadius: '5px', mt: '1px' }}
                    variant="contained"
                    onClick={addNotesClicked}
                  >
                    Add Note
                  </Button>
                  <Button
                    sx={{ width: '20%', borderRadius: '5px', mt: '1px' }}
                    variant="contained"
                    onClick={updateNotesClicked}
                  >
                    Update Note
                  </Button>
                </Stack>
                <Box sx={{ pt: '10px' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableHeaderCellStyled component="th" sx={{ width: '20%' }} scope="row" align="center">No</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" sx={{ width: '80%' }} scope="row" align="left">Note</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" align="center" sx={{ width: '10%' }}>Edit</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" align="center" sx={{ width: '10%' }}>Delete</TableHeaderCellStyled>
                     </TableRow>
                    </TableHead>
                    <TableBody>
                      {notesListInfo?.fdtNotes?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row" align="center">
                            {index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            {row.notes}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }}>                    
                            <IconButton
                              sx={{ color: theme.palette.success.main }}
                              onClick={() => editNotesClicked(row)}
                                >
                                <Iconify icon="material-symbols:edit-square-outline" />
                            </IconButton>
                          </TableCell>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }} >
                            <IconButton sx={{ color: theme.palette.warning.main }}
                            onClick={() => deleteNotesClicked(row)}
                            >
                              <Iconify icon="ion:trash-outline" />
                            </IconButton>
                          </TableCell>

                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </FormProvider>
       )}   
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(false);
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
          }}
          severity="success"
          sx={{ width: '100%' }}
        >
          Submittal Information Saved!
        </Alert>
      </Snackbar>
      <Snackbar
        open={fail}
        autoHideDuration={6000}
        onClose={() => {
          setFail(false);
        }}
      >
        <Alert
          onClose={() => {
            setFail(false);
          }}
          severity="error"
          sx={{ width: '100%' }}
        >
          Server Error!
        </Alert>
      </Snackbar>
    </Container>
  );
}

type RowProps = {
  row: any;
};
function Row({ row }: RowProps) {
  function parseString(htmlString: string) {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  }

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.qty)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.tag)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.item)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.model)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.voltage)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.controls_preference)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.installation)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.duct_connection)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.handing)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.part_desc)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.part_number)}
      </TableCell>
      <TableCell component="th" scope="row" align="left">
        {parseString(row.pricing)}
      </TableCell>
    </TableRow>
  );
}
