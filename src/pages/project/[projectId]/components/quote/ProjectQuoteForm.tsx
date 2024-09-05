import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  IconButton,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApiContext } from 'src/contexts/ApiContext';
import { LoadingButton } from '@mui/lab';
import { useGetQuoteSelTables, useGetSavedQuote } from 'src/hooks/useApi';
import * as Ids from 'src/utils/ids';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';

// import QuoteMiscDataTable from './QuoteMiscDataTable';
// import QuoteNoteDataTable from './QuoteNoteDataTable';

// --------------------------------------------------------------
const CustomGroupBoxBorder = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  position: 'relative',
  minWidth: '0',
  padding: '10px',
  margin: '0',
  verticalAlign: 'top',
  width: '100%',
  border: `1px solid ${theme.palette.grey[500]}`,
  borderRadius: '8px',
}));

const CustomGroupBoxTitle = styled(Typography)(() => ({
  lineHeight: '1.4375em',
  fontSize: '25px',
  fontFamily: '"Public Sans", sans-serif',
  fontWeight: 400,
  display: 'block',
  transformOrigin: 'left top',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 'calc(133% - 24px)',
  position: 'absolute',
  left: '0px',
  top: '0px',
  transform: 'translate(40px, -12px) scale(0.75)',
  transition: 'color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms',
  zIndex: 100,
  background: 'white',
  paddingLeft: '10px',
  paddingRight: '10px',
}));

const TableHeaderCellStyled = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  boxShadow: 'none!important',
}));

// -------------------------------------------------------------------------------

type CustomGroupBoxProps = {
  title?: string;
  children?: any;
  bordersx?: object;
  titlesx?: object;
};

function CustomGroupBox({ title, children, bordersx, titlesx }: CustomGroupBoxProps) {
  return (
    <CustomGroupBoxBorder sx={{ ...bordersx }}>
      <CustomGroupBoxTitle sx={{ ...titlesx }}>{title}</CustomGroupBoxTitle>
      <Box sx={{ padding: '20px' }}>{children}</Box>
    </CustomGroupBoxBorder>
  );
}
// -------------------------------------------------
// type ProjectQuoteFormProps = {
//   projectId?: number;
//   quoteControlInfo?: any;
//   quoteFormInfo?: any;
//   gvPricingGeneral?: any;
//   gvPricingUnits?: any;
//   gvPricingTotal?: any;
//   gvMisc?: any;
//   gvNotes?: any;
//   refetch?: Function;
// };

// export default function ProjectQuoteForm({
//   projectId,
//   quoteControlInfo,
//   quoteFormInfo,
//   gvPricingGeneral,
//   gvPricingUnits,
//   gvPricingTotal,
//   gvMisc,
//   gvNotes,
//   refetch,
// }: ProjectQuoteFormProps) {
//   const api = useApiContext();

type ProjectQuoteFormProps = {
  projectId?: number;
  quoteInfo?: any;
  refetch?: Function;
};

export default function ProjectQuoteForm({ projectId, quoteInfo, refetch }: ProjectQuoteFormProps) {
  const api = useApiContext();

  // status
  const [success, setSuccess] = useState<boolean>(false);
  const [fail, setFail] = useState<boolean>(false);
  const [currQuoteInfo, setCurrQuoteInfo] = useState<any>([]);
  const [isLoadingQuoteInfo, setIsLoadingQuoteInfo] = useState(true);
  const [isProcessingData, setIsProcessingData] = useState(false);
  const [miscNo, setMiscNo] = useState('');
  const [miscListInfo, setMiscListInfo] = useState<any>([]);
  const [notesNo, setNotesNo] = useState('');
  const [notesListInfo, setNotesListInfo] = useState<any>([]);
  const theme = useTheme();



  const { data: db } = useGetQuoteSelTables({intJobId: projectId}); // useGetQuoteSelTables api call returns data and stores in db

  // Form Schemar
  const QuoteFormSchema = Yup.object().shape({
    txbRevisionNo: Yup.string().required('This field is required!'),
    ddlQuoteStage: Yup.number().required('This field is required!'),
    txbProjectName: Yup.string(),
    txbQuoteNo: Yup.string().required('This field is required!'),
    ddlFOBPoint: Yup.number(),
    txbTerms: Yup.string(),
    txbCreatedDate: Yup.string(),
    txbRevisedDate: Yup.string(),
    txbValidDate: Yup.string(),
    ddlCountry: Yup.number(),
    txbCurrencyRate: Yup.number().required('This field is required!'),
    txbShippingFactor: Yup.number().required('This field is required!'),
    ddlShippingType: Yup.number(),
    txbDiscountFactor: Yup.number().required('This field is required!'),
    ddlDiscountType: Yup.number(),
    txbPriceAllUnits: Yup.number().required('This field is required!'),
    txbPriceMisc: Yup.number().required('This field is required!'),
    txbPriceShipping: Yup.number().required('This field is required!'),
    txbPriceSubtotal: Yup.number().required('This field is required!'),
    txbPriceDiscount: Yup.number().required('This field is required!'),
    txbPriceFinalTotal: Yup.number().required('This field is required!'),
  });

  // // default values for form depend on redux
  // const defaultValues = useMemo(
  //   () => ({
  //     txbRevisionNo: quoteInfo?.oQuote ? quoteInfo?.oQuote?.intRevisionNo : '0',
  //     ddlQuoteStage: quoteInfo?.oQuote ? quoteInfo?.oQuote?.intQuoteStageId : 0,
  //     txbProjectName: quoteInfo?.oQuote ? quoteInfo?.oQuote?.strProjectName : '',
  //     txbQuoteNo: quoteInfo?.oQuote ? quoteInfo?.oQuote?.intQuoteId : '0',
  //     ddlFOBPoint: quoteInfo?.oQuote ? quoteInfo?.oQuote?.intFOBPointId : 0,
  //     txbTerms: quoteInfo?.oQuote ? quoteInfo?.oQuote?.strTerms : 'Net 30',
  //     // txbCreatedDate: quoteInfo?.oQuote ? quoteInfo?.oQuote?.oQuote?.strCreatedDate : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
  //     // txbRevisedDate: quoteInfo?.oQuote ? quoteInfo?.oQuote?.strRevisedDate : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
  //     // txbValidDate: quoteInfo?.oQuote ? quoteInfo?.oQuote?.strValidDate : `${today.getFullYear()}-${today.getMonth()}-${today.getDate() + 60}`,
  //     txbCreatedDate: quoteInfo?.oQuote?.strCreatedDate ? quoteInfo?.oQuote?.oQuote?.strCreatedDate : '',
  //     txbRevisedDate: quoteInfo?.oQuote?.strRevisedDate ? quoteInfo?.oQuote?.strRevisedDate : '',
  //     txbValidDate: quoteInfo?.oQuote?.strValidDate ? quoteInfo?.oQuote?.strValidDate : '',
  //     ddlCountry: quoteInfo?.oQuote ? quoteInfo?.oQuote?.intCountryId : 0,
  //     txbCurrencyRate: quoteInfo?.oQuote ? quoteInfo?.oQuote?.dblCurrencyRate : '0.00',
  //     txbShippingFactor: quoteInfo?.oQuote ? quoteInfo?.oQuote?.dblShippingFactor : '0.00',
  //     ddlShippingType: quoteInfo?.oQuote ? quoteInfo?.oQuote?.intShippingTypeId : 0,
  //     txbDiscountFactor: quoteInfo?.oQuote ? quoteInfo?.oQuote?.dblDiscountFactor : '0.00',
  //     ddlDiscountType: quoteInfo?.oQuote ? quoteInfo?.oQuote?.intDiscountTypeId : 0,
  //     txbPriceAllUnits: quoteInfo?.oQuote ? quoteInfo?.oQuote?.dblPriceAllUnits : '0.00',
  //     txbPriceMisc: quoteInfo?.oQuote ? quoteInfo?.oQuote?.dblPriceMisc : '0.00',
  //     txbPriceShipping: quoteInfo?.oQuote ? quoteInfo?.oQuote?.dblPriceShipping : '0.00',
  //     txbPriceSubtotal: quoteInfo?.oQuote ? quoteInfo?.oQuote?.dblPriceSubtotal : '0.00',
  //     txbPriceDiscount: quoteInfo?.oQuote ? quoteInfo?.oQuote?.dblPriceDiscount : '0.00',
  //     txbPriceFinalTotal: quoteInfo?.oQuote ? quoteInfo?.oQuote?.dblPriceFinalTotal : '0.00',
  //   }),
  //   [quoteInfo?.oQuote]
  // );

  const defaultValues = useMemo(
    () => ({
      txbRevisionNo: '0',
      ddlQuoteStage: 1,
      txbProjectName: '',
      txbQuoteNo: '0',
      ddlFOBPoint: 1,
      txbTerms: 'Net 30',
      // txbCreatedDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
      // txbRevisedDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
      // txbValidDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate() + 60}`,
      txbCreatedDate: '',
      txbRevisedDate: '',
      txbValidDate: '',
      ddlCountry: 1,
      txbCurrencyRate: '1.00',
      txbShippingFactor: '9.8',
      ddlShippingType: 1,
      txbDiscountFactor: '0.0',
      ddlDiscountType: 2,
      txbPriceAllUnits: '0.00',
      txbPriceMisc: '0.00',
      txbPriceShipping: '0.00',
      txbPriceSubtotal: '0.00',
      txbPriceDiscount: '0.00',
      txbPriceFinalTotal: '0.00',
      txbMisc: '',
      txbMiscQty: '1',
      txbMiscPrice: '0.00',
      txbNotes: '',
    }),
    []
  );

  // form setting using useForm
  const methods = useForm({
    resolver: yupResolver(QuoteFormSchema),
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

  // const [quoteInputs, setQuoteInputs] = useState<any>();
  // const setQV = useCallback(() => {

  // const [quoteInputs, setQuoteInputs] = useState<any>();
  // const setQV = useCallback(() => {


  useMemo(() => {
    setValue('txbProjectName', db?.dbtSavJob?.[0]?.job_name);
  }, [db?.dbtSavJob, setValue]);


  function getQuoteInputs() {
    //   // const jsonData = '{"name":"John", "age":30, "city":"London"}';
    //   // let oUnitInputs;
    formCurrValues = getValues(); // Do not use watch, must use getValues with the function to get current values.
    let savedDate = quoteInfo?.oQuoteInputs?.strCreatedDate;

    if (savedDate?.includes('/')) {
      const [month, day, year] = savedDate.split('/');
      savedDate = `${year}-${month}-${day}`;
    }

    const today = new Date();
    const newValidDate = new Date();
    newValidDate.setDate(newValidDate.getMonth() + 1);
    newValidDate.setDate(newValidDate.getDate() + 60);

    const oQuoteInputs = {
      oQuoteSaveInputs: {
        intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
        intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
        intJobId: Number(projectId),
        intQuoteId: Number(formCurrValues.txbQuoteNo),
        intQuoteStageId: formCurrValues.ddlQuoteStage,
        intRevisionNo: formCurrValues.txbRevisionNo,
        intFOBPointId: Number(formCurrValues.ddlFOBPoint),
        intCountryId: Number(formCurrValues.ddlCountry),
        dblCurrencyRate: formCurrValues.txbCurrencyRate,
        dblShippingFactor: formCurrValues.txbShippingFactor,
        intShippingTypeId: Number(formCurrValues.ddlShippingType),
        dblDiscountFactor: formCurrValues.txbDiscountFactor,
        intDiscountTypeId: Number(formCurrValues.ddlDiscountType),
        dblPriceAllUnits: formCurrValues.txbPriceAllUnits,
        dblPriceMisc: formCurrValues.txbPriceMisc,
        dblPriceShipping: formCurrValues.txbPriceShipping,
        dblPriceSubtotal: formCurrValues.txbPriceSubtotal,
        dblPriceDiscount: formCurrValues.txbPriceDiscount,
        dblPriceFinalTotal: formCurrValues.txbPriceFinalTotal,
        strCreatedDate: currQuoteInfo?.oQuoteSaveInputs?.strCreatedDate
          ? savedDate
          : formCurrValues.txbCreatedDate,
        strRevisedDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
        strValidDate: `${newValidDate.getFullYear()}-${newValidDate.getMonth()}-${newValidDate.getDate()}`,
      },
    };

    return oQuoteInputs;
  }

  // setQuoteInputs(oQuoteInputs);
  // }, [projectId, quoteInfo?.oQuote?.strCreatedDate])

  // useEffect(() => {
  //   const today = new Date();
  //   const newValidDate = new Date();
  //   newValidDate.setDate(newValidDate.getDate() + 60);

  //   setValue('txbCreatedDate', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
  //   setValue('txbRevisedDate', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
  //   setValue('txbValidDate', `${newValidDate.getFullYear()}-${newValidDate.getMonth() + 1}-${newValidDate.getDate()}`);

  //  }, [setValue])

  // // submmit function
  // const onQuoteSubmit = useCallback(
  //   async (data: any) => {
  //     try {
  //       const quoteData = {
  //         ...data,
  //         intUserID: localStorage.getItem('userId'),
  //         intUAL: localStorage.getItem('UAL'),
  //         intJobID: projectId,
  //       };
  //       const result = await api.project.saveQuoteInfo(quoteData);
  //       if (result.status === 'success') {
  //         setSuccess(true);
  //         if (refetch) refetch();
  //       } else {
  //         setFail(true);
  //       }
  //     } catch (error) {
  //       setFail(true);
  //     }
  //   },
  //   [api.project, projectId, refetch]
  // );


  useEffect(() => {
    setCurrQuoteInfo(currQuoteInfo);
  }, [currQuoteInfo]);


  useEffect(() => {
    const info: { fdtMisc: any } = { fdtMisc: [] };

    info.fdtMisc = currQuoteInfo?.dtMisc;
    setMiscListInfo(info);
  }, [currQuoteInfo]);

  // useEffect(() => {
  //   const info: { fdtNotes: any;} = { fdtNotes: []};

  //   info.fdtNotes = notesListInfo?.dtNotes;
  //   setNotesListInfo(info);
  // },
  // [notesListInfo]);


  const [dateInfo, setDateInfo] = useState<any>();
  useEffect(() => {
    const today = new Date();
    const newValidDate = new Date();
    newValidDate.setDate(newValidDate.getDate() + 60);

    setValue('txbCreatedDate', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
    setValue('txbRevisedDate', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
    setValue(
      'txbValidDate',
      `${newValidDate.getFullYear()}-${newValidDate.getMonth() + 1}-${newValidDate.getDate()}`
    );
    setValue('ddlShippingType', 1);
    setValue('ddlDiscountType', 2);
  }, [setValue]);


  const [quoteStageInfo, setQuoteStageInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtQuoteStage: any; isVisible: boolean; defaultId: number } = {
      fdtQuoteStage: [],
      isVisible: false,
      defaultId: 0,
    };

    info.fdtQuoteStage = db?.dbtSelQuoteStage;

    setQuoteStageInfo(info);
    info.defaultId = info.fdtQuoteStage?.[0]?.id;
    // setValue('ddlQuoteStage', info.fdtQuoteStage?.[0]?.id);
  }, [db, setValue]);


  const [fobPointInfo, setFOBPointInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtFOBPoint: any; isVisible: boolean; defaultId: number } = {
      fdtFOBPoint: [],
      isVisible: false,
      defaultId: 0,
    };

    info.fdtFOBPoint = db?.dbtSelFOBPoint;

    setFOBPointInfo(info);
    info.defaultId = Ids.intFOB_PointIdVancouver;
    // setValue('ddlFOBPoint', info.fdtFOBPoint?.[0]?.id);
    setValue('ddlFOBPoint', Ids.intFOB_PointIdVancouver);
  }, [db, setValue]);


  const [countryInfo, setCountryInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtCountry: any; isVisible: boolean; defaultId: number } = {
      fdtCountry: [],
      isVisible: false,
      defaultId: 0,
    };

    info.fdtCountry = db?.dbtSelCountry;

    setCountryInfo(info);
    info.defaultId = Ids.intCountryIdUSA;
    // setValue('ddlCountry', info.fdtCountry?.[0]?.id);
    setValue('ddlCountry', Ids.intCountryIdUSA);
  }, [db, setValue]);

  // // Event handler for addding misc


  // submmit function
  const onQuoteSubmit = async (data: any) => {
    try {
      setIsProcessingData(true);

      // const requestData = {
      //   ...data,
      //   intUserID: localStorage.getItem('userId'),
      //   intUAL: localStorage.getItem('UAL'),
      //   intJobID: projectId,
      // };
      const oQuoteInputs: any = getQuoteInputs();

      const returnValue = await api.project.saveQuote(oQuoteInputs);
      if (returnValue) {
        setCurrQuoteInfo(returnValue);

        setSuccess(true);

        if (refetch) refetch();
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
  const addMiscClicked = useCallback(async () => {
    if (
      getValues('txbMisc') === '' ||
      getValues('txbMiscQty') === '' ||
      getValues('txbMiscPrice') === ''
    )
      return;

    setIsProcessingData(true);

    const data: any = {
      // intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intMiscNo: 0,
      strMisc: getValues('txbMisc'),
      intMiscQty: Number(getValues('txbMiscQty')),
      dblMiscPrice: getValues('txbMiscPrice'),
    };
    const result = await api.project.saveQuoteMisc(data);
    setCurrQuoteInfo(result);

    setValue('txbMisc', '');
    setValue('txbMiscQty', '1');
    setValue('txbMiscPrice', '0.00');

    setIsProcessingData(false);
  }, [api.project, getValues, projectId, setValue]);


  const updateMiscClicked = useCallback(async () => {
    if (
      getValues('txbMisc') === '' ||
      getValues('txbMiscQty') === '' ||
      getValues('txbMiscPrice') === ''
    )
      return;

    setIsProcessingData(true);

    const data: any = {
      // intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intMiscNo: miscNo,
      strMisc: getValues('txbMisc'),
      intMiscQty: Number(getValues('txbMiscQty')),
      dblMiscPrice: getValues('txbMiscPrice'),
    };
    const result = await api.project.saveQuoteMisc(data);
    setCurrQuoteInfo(result);

    setValue('txbMisc', '');
    setValue('txbMiscQty', '1');
    setValue('txbMiscPrice', '0.00');

    setIsProcessingData(false);
  }, [api.project, getValues, miscNo, projectId, setValue]);


  const deleteMiscClicked = useCallback(
    async (row: any) => {
      setIsProcessingData(true);

      const data: any = {
        // intUAL: localStorage.getItem('UAL'),
        intJobId: projectId,
        intMiscNo: row?.misc_no,
      };
      const result = await api.project.deleteQuoteMisc(data);
      setCurrQuoteInfo(result);

      setValue('txbMisc', '');
      setValue('txbMiscQty', '1');
      setValue('txbMiscPrice', '0.00');

      setIsProcessingData(false);
    },
    [api.project, projectId, setValue]
  );


  const editMiscClicked = useCallback(
    (row: any) => {
      setMiscNo(row?.misc_no);
      setValue('txbMisc', row?.misc);
      setValue('txbMiscQty', row?.qty);
      setValue('txbMiscPrice', row?.price);
    },
    [setValue]
  );


  // event handler for addding note
  const addNotesClicked = useCallback(async () => {
    if (getValues('txbNotes') === '') return;

    setIsProcessingData(true);

    const data: any = {
      // intUserId: localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intNotesNo: 0,
      strNotes: getValues('txbNotes'),
    };
    const result = await api.project.saveQuoteNotes(data);

    const info: { fdtNotes: any } = { fdtNotes: [] };
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
    const result = await api.project.saveQuoteNotes(data);

    const info: { fdtNotes: any } = { fdtNotes: [] };
    info.fdtNotes = result;
    setNotesListInfo(info);

    setValue('txbNotes', '');

    setIsProcessingData(false);
  }, [api.project, getValues, notesNo, projectId, setValue]);


  const editNotesClicked = useCallback(
    (row: any) => {
      setNotesNo(row?.notes_no);
      setValue('txbNotes', row?.notes);
    },
    [setValue]
  );


  const deleteNotesClicked = useCallback(
    async (row: any) => {
      setIsProcessingData(true);

      const data: any = {
        // intUAL: localStorage.getItem('UAL'),
        intJobId: projectId,
        intNotesNo: row?.notes_no,
      };
      const result = await api.project.deleteQuoteNotes(data);

      const info: { fdtNotes: any } = { fdtNotes: [] };
      info.fdtNotes = result;
      setNotesListInfo(info);

      setValue('txbNotes', '');

      setIsProcessingData(false);
    },
    [api.project, projectId, setValue]
  );


  // Load saved Values
  useEffect(() => {
    if (currQuoteInfo !== undefined && currQuoteInfo !== null) {
      if (
        currQuoteInfo?.oQuoteSaveInputs !== undefined &&
        currQuoteInfo?.oQuoteSaveInputs !== null &&
        currQuoteInfo?.oQuoteSaveInputs?.intQuoteId > 0
      ) {

        if (currQuoteInfo?.oQuoteSaveInputs?.intQuoteId > 0) {
          setValue('txbQuoteNo', currQuoteInfo?.oQuoteSaveInputs?.intQuoteId);
        }

        if (currQuoteInfo?.oQuoteSaveInputs?.intRevisionNo > 0) {
          setValue('txbRevisionNo', currQuoteInfo?.oQuoteSaveInputs?.intRevisionNo);
        }

        if (currQuoteInfo?.oQuoteSaveInputs?.intQuoteStageId > 0) {
          setValue('ddlQuoteStage', currQuoteInfo?.oQuoteSaveInputs?.intQuoteStageId);
        }

        if (currQuoteInfo?.oQuoteSaveInputs?.intFOBPointId > 0) {
          setValue('ddlFOBPoint', currQuoteInfo?.oQuoteSaveInputs?.intFOBPointId);
        }

        if (
          currQuoteInfo?.oQuoteSaveInputs?.strTerms !== null &&
          currQuoteInfo?.oQuoteSaveInputs?.strTerms !== ''
        ) {
          setValue('txbTerms', currQuoteInfo?.oQuoteSaveInputs?.strTerms);
        }

        if (
          currQuoteInfo?.oQuoteSaveInputs?.strCreatedDate !== null &&
          currQuoteInfo?.oQuoteSaveInputs?.strCreatedDate !== ''
        ) {
          setValue('txbCreatedDate', currQuoteInfo?.oQuoteSaveInputs?.strCreatedDate);
        }

        if (
          currQuoteInfo?.oQuoteSaveInputs?.strRevisedDate !== null &&
          currQuoteInfo?.oQuoteSaveInputs?.strRevisedDate !== ''
        ) {
          setValue('txbRevisedDate', currQuoteInfo?.oQuoteSaveInputs?.strRevisedDate);
        }

        if (
          currQuoteInfo?.oQuoteSaveInputs?.strValidDate !== null &&
          currQuoteInfo?.oQuoteSaveInputs?.strValidDate !== ''
        ) {
          setValue('txbValidDate', currQuoteInfo?.oQuoteSaveInputs?.strValidDate);
        }

        if (currQuoteInfo?.oQuoteSaveInputs?.intCountryId > 0) {
          setValue('ddlCountry', currQuoteInfo?.oQuoteSaveInputs?.intCountryId);
        }

        if (
          currQuoteInfo?.oQuoteSaveInputs?.dblCurrencyRate !== null &&
          currQuoteInfo?.oQuoteSaveInputs?.dblCurrencyRate > 0
        ) {
          setValue('txbCurrencyRate', currQuoteInfo?.oQuoteSaveInputs?.dblCurrencyRate?.toFixed(2));
        }

        if (currQuoteInfo?.oQuoteSaveInputs?.intShippingTypeId > 0) {
          setValue('ddlShippingType', currQuoteInfo?.oQuoteSaveInputs?.intShippingTypeId);
        }

        if (
          currQuoteInfo?.oQuoteSaveInputs?.dblShippingFactor !== null &&
          currQuoteInfo?.oQuoteSaveInputs?.dblShippingFactor > 0
        ) {
          setValue('txbShippingFactor', currQuoteInfo?.oQuoteSaveInputs?.dblShippingFactor?.toFixed(1));
        }

        if (currQuoteInfo?.oQuoteSaveInputs?.intDiscountTypeId > 0) {
          setValue('ddlDiscountType', currQuoteInfo?.oQuoteSaveInputs?.intDiscountTypeId);
        }

        if (
          currQuoteInfo?.oQuoteSaveInputs?.dblDiscountFactor !== null &&
          currQuoteInfo?.oQuoteSaveInputs?.dblDiscountFactor > 0
        ) {
          setValue('txbDiscountFactor', currQuoteInfo?.oQuoteSaveInputs?.dblDiscountFactor?.toFixed(1));
        }
      }

      if (
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceAllUnits !== null &&
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceAllUnits > 0
      ) {
        setValue('txbPriceAllUnits', currQuoteInfo?.oQuoteSaveInputs?.dblPriceAllUnits?.toFixed(2));
      }

      if (
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceMisc !== null &&
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceMisc > 0
      ) {
        setValue('txbPriceMisc', currQuoteInfo?.oQuoteSaveInputs?.dblPriceMisc?.toFixed(2));
      }

      if (
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceShipping !== null &&
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceShipping > 0
      ) {
        setValue('txbPriceShipping', currQuoteInfo?.oQuoteSaveInputs?.dblPriceShipping?.toFixed(2));
      }

      if (
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceSubtotal !== null &&
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceSubtotal > 0
      ) {
        setValue('txbPriceSubtotal', currQuoteInfo?.oQuoteSaveInputs?.dblPriceSubtotal?.toFixed(2));
      }

      if (
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceDiscount !== null &&
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceDiscount > 0
      ) {
        setValue('txbPriceDiscount', currQuoteInfo?.oQuoteSaveInputs?.dblPriceDiscount?.toFixed(2));
      }

      if (
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceFinalTotal !== null &&
        currQuoteInfo?.oQuoteSaveInputs?.dblPriceFinalTotal > 0
      ) {
        setValue('txbPriceFinalTotal', currQuoteInfo?.oQuoteSaveInputs?.dblPriceFinalTotal?.toFixed(2));
      }
    }
  }, [currQuoteInfo, currQuoteInfo?.oQuoteSaveInputs, setValue]); // <-- empty dependency array - This will only trigger when the component mounts and no-render

  // Calculate pricing with default values when Quote not saved yet


  useEffect(() => {
    async function fetchData() {
      const oQuoteInputs: any = {
        oQuoteSaveInputs: {
          intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
          intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
          intJobId: Number(projectId),
          intQuoteStageId: getValues('ddlQuoteStage'),
          intRevisionNo: getValues('txbRevisionNo'),
          intFOBPointId: Number(getValues('ddlFOBPoint')),
          intCountryId: Number(getValues('ddlCountry')),
          dblCurrencyRate: getValues('txbCurrencyRate'),
          dblShippingFactor: getValues('txbShippingFactor'),
          intShippingTypeId: Number(getValues('ddlShippingType')),
          dblDiscountFactor: getValues('txbDiscountFactor'),
          intDiscountTypeId: Number(getValues('ddlDiscountType')),
          dblPriceAllUnits: getValues('txbPriceAllUnits'),
          dblPriceMisc: getValues('txbPriceMisc'),
          dblPriceShipping: getValues('txbPriceShipping'),
          dblPriceSubtotal: getValues('txbPriceSubtotal'),
          dblPriceDiscount: getValues('txbPriceDiscount'),
          dblPriceFinalTotal: getValues('txbPriceFinalTotal'),
          strCreatedDate: '',
          strRevisedDate: '',
          strValidDate: '',
          intIsCalcFinalPrice: 0, // not used now
        },
      };

      if (oQuoteInputs !== undefined && oQuoteInputs !== null) {
        const returnValue = await api.project.getSavedQuote(oQuoteInputs);
        setCurrQuoteInfo(returnValue);

        //   if (returnValue?.oQuote?.intQuoteId > 0) {
        //   setValue('txbQuoteNo', returnValue?.oQuote?.intQuoteId);
        //   setValue('txbRevisionNo', returnValue?.oQuote?.intRevisionNo);
        //   if (returnValue?.oQuote?.intQuoteStageId > 0) { setValue('ddlQuoteStage', returnValue?.oQuote?.intQuoteStageId);}
        //   setValue('txbProjectName', returnValue?.oQuote?.strProjectName);
        //   if (returnValue?.oQuote?.intFOBPoint > 0) { setValue('ddlFOBPoint', returnValue?.oQuote?.intFOBPointId);}
        //   setValue('txbTerms', returnValue?.oQuote?.strTerms);
        //   setValue('txbCreatedDate', returnValue?.oQuote?.strCreatedDate);
        //   setValue('txbRevisedDate', returnValue?.oQuote?.strRevisedDate);
        //   setValue('txbValidDate', returnValue?.oQuote?.strValidDate);
        //   if (returnValue?.oQuote?.intCountryId > 0) { setValue('ddlCountry', returnValue?.oQuote?.intCountryId);}
        //   setValue('txbCurrencyRate', returnValue?.oQuote?.dblCurrencyRate?.toFixed(2));
        //   if (returnValue?.oQuote?.intShippingTypeId > 0) { setValue('ddlShippingType', returnValue?.oQuote?.intShippingTypeId);}
        //   setValue('txbShippingFactor', returnValue?.oQuote?.dblShippingFactor?.toFixed(2));
        //   if (returnValue?.oQuote?.intDiscountTypeId > 0) { setValue('ddlDiscountType', returnValue?.oQuote?.intDiscountTypeId);}
        //   setValue('txbDiscountFactor', returnValue?.oQuote?.dblDiscountFactor?.toFixed(2));
        // }

        //   setValue('txbPriceAllUnits', returnValue?.oQuote?.dblPriceAllUnits?.toFixed(2));
        //   setValue('txbPriceMisc', returnValue?.oQuote?.dblPriceMisc?.toFixed(2));
        //   setValue('txbPriceShipping', returnValue?.oQuote?.dblPriceShipping?.toFixed(2));
        //   setValue('txbPriceSubtotal', returnValue?.oQuote?.dblPriceSubtotal?.toFixed(2));
        //   setValue('txbPriceDiscount', returnValue?.oQuote?.dblPriceDiscount?.toFixed(2));
        //   setValue('txbPriceFinalTotal', returnValue?.oQuote?.dblPriceFinalTotal?.toFixed(2));

        setIsLoadingQuoteInfo(false);
      }
      // if (returnValue) {
      //   setSuccess(true);
      //   if (refetch) refetch();
      // } else {
      //   setFail(true);
      // }

      //   if (refetch) refetch();
    }

    fetchData();
  }, [api.project, getValues, projectId, setValue]);


  useEffect(() => {
    async function fetchData() {
      const data: any = {
        intJobId: projectId,
      };

      if (data !== undefined && data !== null) {
        const returnValue = await api.project.getSavedQuoteNotes(data);

        const info: { fdtNotes: any } = { fdtNotes: [] };
        info.fdtNotes = returnValue;

        setNotesListInfo(info);
      }
    }

    fetchData();
  }, [api.project, projectId]);

  if (isLoadingQuoteInfo) return <LinearProgress color="info" />;

  return (
    <Container maxWidth="xl" sx={{ mb: '50px' }}>
      {isProcessingData ? (
        <CircularProgressLoading />
      ) : (
        <FormProvider methods={methods} onSubmit={handleSubmit(onQuoteSubmit)}>
          <Grid container spacing={3}>
          <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end">
                <LoadingButton
                  type="submit"
                  startIcon={<Iconify icon="fluent:save-24-regular" />}
                  loading={isSubmitting}
                  sx={{ width: '150px' }}
                >
                  Save Changes
                </LoadingButton>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <CustomGroupBox title="Project Info">
                    <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                      <RHFTextField size="small" name="txbRevisionNo" label="Revision No" />
                      <RHFSelect
                        native
                        size="small"
                        name="ddlQuoteStage"
                        label="Stage"
                        placeholder=""
                      >
                        <option value="" selected>
                          Select a Stage
                        </option>
                        {quoteStageInfo?.fdtQuoteStage?.map((e: any, index: number) => (
                          <option key={index} value={e.id}>
                            {e.items}
                          </option>
                        ))}
                        {/* <option value="2">USA</option> */}
                      </RHFSelect>
                      <RHFTextField size="small" name="txbProjectName" label="Project Name" />
                      <RHFTextField size="small" name="txbQuoteNo" label="Quote No" disabled />
                      <RHFSelect
                        native
                        size="small"
                        name="ddlFOBPoint"
                        label="F.O.B. Point"
                        placeholder=""
                      >
                        {fobPointInfo?.fdtFOBPoint?.map((e: any, index: number) => (
                          <option key={index} value={e.id}>
                            {e.items}
                          </option>
                        ))}
                      </RHFSelect>
                      <RHFTextField size="small" name="txbTerms" label="Terms" disabled />
                      <RHFTextField
                        size="small"
                        name="txbCreatedDate"
                        label="Created Date"
                        disabled
                      />
                      <RHFTextField
                        size="small"
                        name="txbRevisedDate"
                        label="Revised Date"
                        disabled
                      />
                      <RHFTextField size="small" name="txbValidDate" label="Valid Date" disabled />
                    </Box>
                  </CustomGroupBox>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <CustomGroupBox title="Price Setting">
                    <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                      <RHFSelect
                        native
                        size="small"
                        name="ddlCountry"
                        label="Country"
                        placeholder=""
                      >
                        {countryInfo?.fdtCountry?.map((e: any, index: number) => (
                          <option key={index} value={e.id}>
                            {e.items}
                          </option>
                        ))}
                      </RHFSelect>
                      <RHFTextField size="small" name="txbCurrencyRate" label="Currency Rate" />
                      <Stack direction="row">
                        <RHFTextField size="small" name="txbShippingFactor" label="Shipping" />
                        <RHFSelect
                          native
                          size="small"
                          name="ddlShippingType"
                          label="Unit"
                          placeholder=""
                          onChange={(e: any) => {
                            setValue('ddlShippingType', Number(e.target.value));
                          }}
                        >
                          <option value="1" selected>
                            %
                          </option>
                          <option value="2">$</option>
                        </RHFSelect>
                      </Stack>
                      <Stack direction="row">
                        <RHFTextField size="small" name="txbDiscountFactor" label="Discount" />
                        <RHFSelect
                          native
                          size="small"
                          name="ddlDiscountType"
                          label="Unit"
                          placeholder=""
                          onChange={(e: any) => {
                            setValue('ddlDiscountType', Number(e.target.value));
                          }}
                        >
                          <option value="1">%</option>
                          <option value="2" selected>
                            $
                          </option>
                        </RHFSelect>
                      </Stack>
                    </Box>
                  </CustomGroupBox>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <CustomGroupBox title="Final Pricing">
                    <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                      <RHFTextField
                        size="small"
                        name="txbPriceAllUnits"
                        label="Price All Units ($)"
                      />
                      <RHFTextField size="small" name="txbPriceMisc" label="Price Misc ($)" />
                      <RHFTextField size="small" name="txbPriceShipping" label="Shipping ($)" />
                      <RHFTextField size="small" name="txbPriceSubtotal" label="Sub Total ($)" />
                      <RHFTextField size="small" name="txbPriceDiscount" label="Discount ($)" />
                      <RHFTextField
                        size="small"
                        name="txbPriceFinalTotal"
                        label="Final Total ($)"
                      />
                    </Box>
                  </CustomGroupBox>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <CustomGroupBox title="">
                <TableContainer component={Paper}>
                  <Scrollbar>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row" align="left">
                            NOTES
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            F.O.B. POINT
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            TERMS
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {/* {gvPricingGeneral?.gvPricingGeneralDataSource?.map((item: any, i: number) => ( */}

                        {currQuoteInfo?.dtPricingGeneral?.map((item: any, i: number) => (
                          <TableRow
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell
                              dangerouslySetInnerHTML={{ __html: item.notes }}
                              component="th"
                              scope="row"
                              align="left"
                            />
                            <TableCell
                              dangerouslySetInnerHTML={{ __html: item.fob_point }}
                              component="th"
                              scope="row"
                              align="left"
                            />
                            <TableCell
                              dangerouslySetInnerHTML={{ __html: item.terms }}
                              component="th"
                              scope="row"
                              align="left"
                            />
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </TableContainer>
              </CustomGroupBox>
            </Grid>
            <Grid item xs={12}>
              {quoteInfo?.dtPricingErrMsg?.map((msg: any) => (
                <Typography sx={{ color: 'red' }} key={msg.price_error_msg_no}>
                  {msg.price_error_msg}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={12}>
              <CustomGroupBox>
                <TableContainer component={Paper}>
                  <Scrollbar>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row" align="left">
                            No.
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            TAG
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            QTY
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            PRODUCT CODE
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            MODEL NUMBER
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            DESCRIPTION
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            UNIT PRICE
                          </TableCell>
                          <TableCell component="th" scope="row" align="right">
                            AMOUNT
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currQuoteInfo?.dtPricingUnits?.map((item: any, i: number) => (
                          <TableRow
                            key={i}
                            sx={{
                              '&:last-child td, &:last-child th': {
                                border: 0,
                                color: parseInt(item.price_error_msg, 10) === 2 ? 'red' : 'black',
                              },
                            }}
                          >
                            <TableCell component="th" scope="row" align="left">
                              {i + 1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.tag}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.qty}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.unit_type}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.unit_model}
                            </TableCell>
                            <TableCell
                              dangerouslySetInnerHTML={{ __html: item.description }}
                              component="th"
                              scope="row"
                              align="left"
                            />
                            <TableCell component="th" scope="row" align="right">
                              {item.unit_price}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                              {item.unit_price}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableBody>
                        {currQuoteInfo?.dtPricingMisc?.map((item: any, i: number) => (
                          <TableRow>
                            <TableCell component="th" scope="row" align="left">
                              {i + 1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.tag}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.qty}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.unit_type}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.unit_model}
                            </TableCell>
                            <TableCell
                              dangerouslySetInnerHTML={{ __html: item.description }}
                              component="th"
                              scope="row"
                              align="left"
                            />
                            <TableCell component="th" scope="row" align="right">
                              {item.unit_price}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                              {item.unit_price}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableBody>
                        {currQuoteInfo?.dtPricingShipping?.map((item: any, i: number) => (
                          <TableRow
                            key={i}
                            sx={{
                              '&:last-child td, &:last-child th': {
                                border: 0,
                                color: parseInt(item.price_error_msg, 10) === 2 ? 'red' : 'black',
                              },
                            }}
                          >
                            <TableCell component="th" scope="row" align="left">
                              {i + 1}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.tag}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.qty}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.unit_type}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                              {item.unit_model}
                            </TableCell>
                            <TableCell
                              dangerouslySetInnerHTML={{ __html: item.description }}
                              component="th"
                              scope="row"
                              align="left"
                            />
                            <TableCell component="th" scope="row" align="right">
                              {item.unit_price}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                              {item.unit_price}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                </TableContainer>
              </CustomGroupBox>
            </Grid>
            <Grid item xs={9}>
              {/* <CustomGroupBox> */}
              {currQuoteInfo?.dtPricingAddInfo?.map((item: any, i: number) => (
                <Typography key={i} sx={{ fontWeight: item.is_add_info_bold ? 600 : 300 }}>
                  {item.add_info}
                </Typography>
              ))}
              {/* </CustomGroupBox> */}
            </Grid>
            <Grid item xs={3}>
              {/* <CustomGroupBox> */}
              {/* {currQuoteInfo?.dtPricingTotal?.map((item: any, i: number) => (
                <Typography key={i} sx={{ fontWeight: 600 }}>
                  {item.price_label} {item.price} {item.currency} 
                </Typography>
              ))} */}
              {/* </CustomGroupBox> */}
              <TableContainer component={Paper}>
                <Scrollbar>
                  <Table size="small">
                    <TableBody>
                      {currQuoteInfo?.dtPricingTotal?.map((item: any, i: number) => (
                        <TableRow
                          key={i}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            fontWeight: 600,
                            fontStyle: 'bold',
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            sx={{ fontWeight: 600, fontStyle: 'bold' }}
                          >
                            {item.price_label}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            sx={{ fontWeight: 600, fontStyle: 'bold' }}
                          >
                            {item.price}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            sx={{ fontWeight: 600, fontStyle: 'bold' }}
                          >
                            {item.currency}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              {/* <CustomGroupBox title="Added Miscellaneous">
              <QuoteMiscDataTable
                // tableData={gvMisc?.gvMiscDataSource}
                tableData={quoteInfo?.dtMisc}
                addRow={addMisc}
                updateRow={updateMisc}
                deleteRow={deleteMisc}
              />
            </CustomGroupBox> */}
              {/* <Accordion
              expanded={expanded.panel5}
              onChange={() => setExpanded({ ...expanded, panel5: !expanded.panel5 })}
            > */}
              <AccordionSummary
              // expandIcon={<Iconify icon="il:arrow-down" />}
              // aria-controls="panel1a-content"
              // id="panel1a-header"
              >
                <Typography color="primary.main" variant="h6">
                  Added Miscellaneous
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                  <RHFTextField
                    size="small"
                    name="txbMisc"
                    label="Enter MIscellaneous"
                    sx={{ width: '50%' }}
                  />
                  <RHFTextField
                    size="small"
                    name="txbMiscQty"
                    label="Enter Qty"
                    sx={{ width: '10%' }}
                  />
                  <RHFTextField
                    size="small"
                    name="txbMiscPrice"
                    label="Enter Price"
                    sx={{ width: '10%' }}
                  />
                  <Button
                    sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                    // variant="contained"
                    startIcon={<Iconify icon="fluent:save-24-regular" />}
                    onClick={addMiscClicked}
                  >
                    Add Misc
                  </Button>
                  <Button
                    sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                    // variant="contained"
                    startIcon={<Iconify icon="fluent:save-24-regular" />}
                    onClick={updateMiscClicked}
                  >
                    Update Misc
                  </Button>
                </Stack>
                <Box sx={{ pt: '10px' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableHeaderCellStyled
                          component="th"
                          scope="row"
                          align="center"
                          sx={{ width: '10%' }}
                        >
                          No
                        </TableHeaderCellStyled>
                        <TableHeaderCellStyled
                          component="th"
                          scope="row"
                          align="left"
                          sx={{ width: '50%' }}
                        >
                          Miscellaneous
                        </TableHeaderCellStyled>
                        <TableHeaderCellStyled
                          component="th"
                          scope="row"
                          align="center"
                          sx={{ width: '10%' }}
                        >
                          Qty
                        </TableHeaderCellStyled>
                        <TableHeaderCellStyled
                          component="th"
                          scope="row"
                          align="center"
                          sx={{ width: '10%' }}
                        >
                          Price
                        </TableHeaderCellStyled>
                        <TableHeaderCellStyled
                          component="th"
                          scope="row"
                          align="center"
                          sx={{ width: '10%' }}
                        >
                          Edit
                        </TableHeaderCellStyled>
                        <TableHeaderCellStyled
                          component="th"
                          scope="row"
                          align="center"
                          sx={{ width: '10%' }}
                        >
                          Delete
                        </TableHeaderCellStyled>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {miscListInfo?.fdtMisc?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            sx={{ width: '10%' }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{ width: '50%' }}>
                            {row.misc}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            sx={{ width: '10%' }}
                          >
                            {row.qty}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            sx={{ width: '10%' }}
                          >
                            {row.price}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            sx={{ width: '10%' }}
                          >
                            <IconButton
                              sx={{ color: theme.palette.success.main }}
                              onClick={() => editMiscClicked(row)}
                            >
                              <Iconify icon="material-symbols:edit-square-outline" />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            sx={{ width: '10%' }}
                          >
                            <IconButton
                              sx={{ color: theme.palette.warning.main }}
                              onClick={() => deleteMiscClicked(row)}
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
              {/* </Accordion> */}
            </Grid>
            <Grid item xs={12}>
              {/* <CustomGroupBox title="Added Note">
              <QuoteNoteDataTable
                // tableData={gvNotes?.gvNotesDataSource}
                tableData={quoteInfo?.dtNotes}
                addRow={addNotes}
                updateRow={updateNotes}
                deleteRow={deleteNotes}
              />
            </CustomGroupBox> */}
              {/* <Accordion
              expanded={expanded.panel5}
              onChange={() => setExpanded({ ...expanded, panel5: !expanded.panel5 })}
            > */}
              <AccordionSummary
              // expandIcon={<Iconify icon="il:arrow-down" />}
              // aria-controls="panel1a-content"
              // id="panel1a-header"
              >
                <Typography color="primary.main" variant="h6">
                  Added Notes
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                  <RHFTextField
                    size="small"
                    name="txbNotes"
                    label="Enter Notes"
                    sx={{ width: '70%' }}
                    // value={noteInfo}
                    // onChange={(e) => setNote(e.target.value)}
                  />
                  <Button
                    sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                    // variant="contained"
                    startIcon={<Iconify icon="fluent:save-24-regular" />}
                    onClick={addNotesClicked}
                  >
                    Add Note
                  </Button>
                  <Button
                    sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                    // variant="contained"
                    startIcon={<Iconify icon="fluent:save-24-regular" />}
                    onClick={updateNotesClicked}
                  >
                    Update Note
                  </Button>
                </Stack>
                <Box sx={{ pt: '10px' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableHeaderCellStyled
                          component="th"
                          scope="row"
                          align="center"
                          sx={{ width: '10%' }}
                        >
                          No
                        </TableHeaderCellStyled>
                        <TableHeaderCellStyled
                          component="th"
                          scope="row"
                          align="left"
                          sx={{ width: '70%' }}
                        >
                          Note
                        </TableHeaderCellStyled>
                        <TableHeaderCellStyled
                          component="th"
                          scope="row"
                          align="center"
                          sx={{ width: '10%' }}
                        >
                          Edit
                        </TableHeaderCellStyled>
                        <TableHeaderCellStyled
                          component="th"
                          scope="row"
                          align="center"
                          sx={{ width: '10%' }}
                        >
                          Delete
                        </TableHeaderCellStyled>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {notesListInfo?.fdtNotes?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            sx={{ width: '10%' }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{ width: '70%' }}>
                            {row.notes}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            sx={{ width: '10%' }}
                          >
                            <IconButton
                              sx={{ color: theme.palette.success.main }}
                              onClick={() => editNotesClicked(row)}
                            >
                              <Iconify icon="material-symbols:edit-square-outline" />
                            </IconButton>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            sx={{ width: '10%' }}
                          >
                            <IconButton
                              sx={{ color: theme.palette.warning.main }}
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
              {/* </Accordion> */}
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
