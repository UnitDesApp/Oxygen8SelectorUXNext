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
import QuoteMiscDataTable from './QuoteMiscDataTable';
import QuoteNoteDataTable from './QuoteNoteDataTable';


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

export default function ProjectQuoteForm({
    projectId,
    quoteInfo,
    refetch,
  }: ProjectQuoteFormProps) {
    const api = useApiContext();

  // status
  const [success, setSuccess] = useState<boolean>(false);
  const [fail, setFail] = useState<boolean>(false);
  const [currQuoteInfo, setCurrQuoteInfo] = useState <any>([]);
  const [isLoadingQuoteInfo, setIsLoadingQuoteInfo] = useState(true)
  const [miscInfo, setMiscInfo] = useState('');
  const [miscListInfo, setMiscListInfo] = useState <any>([]); 
  const [noteInfo, setNoteInfo] = useState('');
  const [notesListInfo, setNotesListInfo] = useState <any>([]);
  const theme = useTheme();

  const { data: db } = useGetQuoteSelTables();  // useGetQuoteSelTables api call returns data and stores in db
  



  // Form Schemar
  const QuoteFormSchema = Yup.object().shape({
    txbRevisionNo: Yup.string().required('This field is required!'),
    ddlQuoteStage: Yup.number().required('This field is required!'),
    txbProjectName: Yup.string().required('This field is required!'),
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
    txbPriceAllUnits: Yup.string(),
    txbPriceMisc: Yup.string(),
    txbPriceShipping: Yup.string(),
    txbPriceSubtotal: Yup.string(),
    txbPriceDiscount: Yup.string(),
    txbPriceFinalTotal: Yup.string(),
    txbMisc: Yup.string(),
    txbMiscQty: Yup.string(),
    txbMiscPrice: Yup.string(),
    txbNote: Yup.string(),
  });


  const defaultValues = useMemo(
    () => ({
      txbRevisionNo: '0',
      ddlQuoteStage: -1,
      txbProjectName: '',
      txbQuoteNo: '0',
      ddlFOBPoint: 0,
      txbTerms: 'Net 30',
      // txbCreatedDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
      // txbRevisedDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
      // txbValidDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate() + 60}`,
      txbCreatedDate: '',
      txbRevisedDate: '',
      txbValidDate: '',
      ddlCountry: 0,
      txbCurrencyRate: '1.00',
      txbShippingFactor: '9.8',
      ddlShippingType: 0,
      txbDiscountFactor: '0.0',
      ddlDiscountType: 0,
      txbPriceAllUnits: '0.00',
      txbPriceMisc: '0.00',
      txbPriceShipping: '0.00',
      txbPriceSubtotal: '0.00',
      txbPriceDiscount: '0.00',
      txbPriceFinalTotal: '0.00',
      txbMisc: '',
      txbMiscQty: '1',
      txbMiscPrice: '0.00',
      txbNote: '',
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

  const getQuoteInputs = () => {
  //   // const jsonData = '{"name":"John", "age":30, "city":"London"}';
  //   // let oUnitInputs;


    formCurrValues = getValues(); // Do not use watch, must use getValues with the function to get current values.
    let savedDate =  quoteInfo?.oQuote?.strCreatedDate;
    
    if (savedDate?.includes('/')) {
      const [month, day, year] =  savedDate.split('/');
      savedDate =`${year}-${month}-${day}`;
    }

    const today = new Date();
    const newValidDate = new Date();
    newValidDate.setDate(newValidDate.getMonth() + 1);
    newValidDate.setDate(newValidDate.getDate() + 60);


    const oQuoteInputs = {
      oQuote: {
        "intUserId" : typeof window !== 'undefined' && localStorage.getItem('userId'),
        "intUAL" : typeof window !== 'undefined' && localStorage.getItem('UAL'),  
        "intJobId" : Number(projectId),
        "intQuoteStageId" : formCurrValues.ddlQuoteStage,
        "intRevisionNo" : formCurrValues.txbRevisionNo,
        "intFOBPointId" :  Number(formCurrValues.ddlFOBPoint),
        "intCountryId" : Number(formCurrValues.ddlCountry),
        "dblCurrencyRate" : formCurrValues.txbCurrencyRate,
        "dblShippingFactor" : formCurrValues.txbShippingFactor,
        "intShippingTypeId" : Number(formCurrValues.ddlShippingType),
        "dblDiscountFactor" : formCurrValues.txbDiscountFactor,
        "intDiscountTypeId" : Number(formCurrValues.ddlDiscountType),
        "dblPriceAllUnits" : formCurrValues.txbPriceAllUnits,
        "dblPriceMisc" : formCurrValues.txbPriceMisc,
        "dblPriceShipping" : formCurrValues.txbPriceShipping,
        "dblPriceSubtotal" : formCurrValues.txbPriceSubtotal,
        "dblPriceDiscount" : formCurrValues.txbPriceDiscount,
        "dblPriceFinalTotal" : formCurrValues.txbPriceFinalTotal,
        "strCreatedDate" : quoteInfo?.oQuote?.strCreatedDate ? savedDate : formCurrValues.txbCreatedDate,
        "strRevisedDate" : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
        "strValidDate" : `${newValidDate.getFullYear()}-${newValidDate.getMonth()}-${newValidDate.getDate()}`,
      },
    }
  

  return oQuoteInputs;
  };

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


  // submmit function
  const onQuoteSubmit = async (data: any) => {
    try {
      // const requestData = {
      //   ...data,
      //   intUserID: localStorage.getItem('userId'),
      //   intUAL: localStorage.getItem('UAL'),
      //   intJobID: projectId,
      // };
      const oQuote: any = getQuoteInputs();

      const returnValue = await api.project.saveQuote(oQuote);
      if (returnValue) {
        setSuccess(true);
        if (refetch) refetch();
      } else {
        setFail(true);
      }
    } catch (error) {
      setFail(true);
    }
  };


  useEffect(() => {

    setCurrQuoteInfo(currQuoteInfo);
    
  }, [currQuoteInfo]) 


  useEffect(() => {
    const info: { fdtMisc: any;} = { fdtMisc: []};

    info.fdtMisc = currQuoteInfo?.dtMisc;
    setMiscListInfo(info);
  },
  [currQuoteInfo]);



  useEffect(() => {
    const info: { fdtNotes: any;} = { fdtNotes: []};

    info.fdtNotes = currQuoteInfo?.dtNotes;
    setNotesListInfo(info);
  },
  [currQuoteInfo]);


   const [dateInfo, setDateInfo] = useState<any>();
   useEffect(() => {
    const today = new Date();
    const newValidDate = new Date();
    newValidDate.setDate(newValidDate.getDate() + 60);

    setValue('txbCreatedDate', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
    setValue('txbRevisedDate', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
    setValue('txbValidDate', `${newValidDate.getFullYear()}-${newValidDate.getMonth() + 1}-${newValidDate.getDate()}`);

   }, [setValue]) 


    const [quoteStageInfo, setQuoteStageInfo] = useState<any>([])
    useEffect(() => {
      const info: { fdtQuoteStage: any; isVisible: boolean; defaultId: number} = { fdtQuoteStage: [],  isVisible: false, defaultId: 0};
  
      info.fdtQuoteStage = db?.dbtSelQuoteStage;
    
      setQuoteStageInfo(info);
      info.defaultId = info.fdtQuoteStage?.[0]?.id;
      // setValue('ddlQuoteStage', info.fdtQuoteStage?.[0]?.id);
     
    }, [db, setValue]);


    const [fobPointInfo, setFOBPointInfo] = useState<any>([])
    useEffect(() => {
      const info: { fdtFOBPoint: any; isVisible: boolean; defaultId: number} = { fdtFOBPoint: [],  isVisible: false, defaultId: 0};
  
      info.fdtFOBPoint = db?.dbtSelFOBPoint;
    
      setFOBPointInfo(info);
      info.defaultId = Ids.intFOB_PointVancouverID;
      // setValue('ddlFOBPoint', info.fdtFOBPoint?.[0]?.id);
      setValue('ddlFOBPoint', Ids.intFOB_PointVancouverID);

    }, [db, setValue]);


    const [countryInfo, setCountryInfo] = useState<any>([])
    useEffect(() => {
      const info: { fdtCountry: any; isVisible: boolean; defaultId: number} = { fdtCountry: [],  isVisible: false, defaultId: 0};
  
      info.fdtCountry = db?.dbtSelCountry;
    
      setCountryInfo(info);
      info.defaultId = Ids.intCountryUSA_ID
      // setValue('ddlCountry', info.fdtCountry?.[0]?.id);
      setValue('ddlCountry', Ids.intCountryUSA_ID);

    }, [db, setValue]);


  // // Event handler for addding misc
  // const addMisc = useCallback(
  //   async (objMisc: any) => {
  //     const data = {
  //       ...objMisc,
  //       intJobID: projectId,
  //     };
  //     await api.project.saveQuoteMisc(data);
  //     if (refetch) refetch();
  //   },
  //   [api.project, projectId, refetch]
  // );


  // const updateMisc = useCallback(
  //   async (objMisc: any, miscNo: number) => {
  //     const data = {
  //       ...objMisc,
  //       intJobID: projectId,
  //       miscNo,
  //     };
  //     await api.project.saveQuoteMisc(data);
  //     if (refetch) refetch();
  //   },
  //   [api.project, projectId, refetch]
  // );


  // const deleteMisc = useCallback(
  //   async (miscNo: number) => {
  //     const data = {
  //       intJobID: projectId,
  //       miscNo,
  //     };
  //     await api.project.deleteQuoteMisc(data);
  //     if (refetch) refetch();
  //   },
  //   [api.project, projectId, refetch]
  // );


  // // Event handler for adding notes
  // const addNotes = useCallback(
  //   async (txbNotes: any) => {
  //     const data = {
  //       intJobID: projectId,
  //       txbNotes,
  //     };
  //     await api.project.saveQuoteNote(data);
  //     if (refetch) refetch();
  //   },
  //   [api.project, projectId, refetch]
  // );


  // const updateNotes = useCallback(
  //   async (txbNotes: any, notesNo: number) => {
  //     const data = {
  //       intJobID: projectId,
  //       txbNotes,
  //       notesNo,
  //     };
  //     await api.project.saveQuoteNote(data);
  //     if (refetch) refetch();
  //   },
  //   [api.project, projectId, refetch]
  // );


  // const deleteNotes = useCallback(
  //   async (notesNo: number) => {
  //     const data = {
  //       intJobID: projectId,
  //       notesNo,
  //     };
  //     await api.project.deleteQuoteNote(data);
  //     if (refetch) refetch();
  //   },
  //   [api.project, projectId, refetch]
  // );


    // event handler for adding shipping note
    const addMiscClicked = useCallback(async () => {
      if (getValues('txbMisc') === '' || getValues('txbMiscQty') === '' || getValues('txbMiscPrice') === '') return;
      const data: any = {
        intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
        intUAL: localStorage.getItem('UAL'),
        intJobId: projectId,
        intQuoteMiscNo: 0,
        strMisc: getValues('txbMisc'),
        intMiscQty: Number(getValues('txbMiscQty')),
        dblMiscPrice: getValues('txbMiscPrice'),
      };
      const result = await api.project.saveQuoteMisc(data);
  
      const info: { fdtShippingNotes: any} = { fdtShippingNotes: []};
      info.fdtShippingNotes = result;
      setMiscListInfo(info);
  
    }, [api.project, getValues, projectId]);


    const updateMiscClicked = useCallback(async () => {
      if (getValues('txbMisc') === '' || getValues('txbMiscQty') === '' || getValues('txbMiscPrice') === '') return;
      const data: any = {
        intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
        intUAL: localStorage.getItem('UAL'),
        intJobId: projectId,
        intMiscNo: typeof window !== 'undefined' && localStorage.getItem('quoteMiscNo'),
        strMisc: getValues('txbMisc'),
        intMiscQty: Number(getValues('txbMiscQty')),
        dblMiscPrice: getValues('txbMiscPrice'),
      };
      const result = await api.project.saveQuoteMisc(data);
  

      const info: { fdtShippingNotes: any} = { fdtShippingNotes: []};
      info.fdtShippingNotes = result;
      setMiscListInfo(info);
  
    }, [api.project, getValues, projectId]);
  
  
    // event handler for addding note
    const addNoteClicked = useCallback(async () => {
      if (getValues('txbNote') === '') return;
      const data: any = {
        intUserId: localStorage.getItem('userId'),
        intUAL: localStorage.getItem('UAL'),
        intJobId: projectId,
        intNoteNo: 0,
        strNote: getValues('txbNote'),
      };
      const result = await api.project.saveQuoteNote(data);
  
      const info: { fdtNotes: any;} = { fdtNotes: []};
      info.fdtNotes = result;
      setNotesListInfo(info);
  
    }, [api.project, getValues, projectId]);


    const updateNoteClicked = useCallback(async () => {
      if (getValues('txbNote') === '') return;
      const data: any = {
        intUserId: localStorage.getItem('userId'),
        intUAL: localStorage.getItem('UAL'),
        intJobId: projectId,
        intQuoteNoteNo: typeof window !== 'undefined' && localStorage.getItem('quoteNoteNo'),
        strNote: getValues('txbNote'),
      };
      const result = await api.project.saveQuoteNote(data);
  
      const info: { fdtNotes: any;} = { fdtNotes: []};
      info.fdtNotes = result;
      setNotesListInfo(info);
  
    }, [api.project, getValues, projectId]);

  // Load saved Values
  useEffect(() => {
    if (quoteInfo?.oQuote !== null) {

      if (quoteInfo?.oQuote?.intRevisionNo > 0) {
        setValue('txbRevisionNo', quoteInfo?.oQuote?.intRevisionNo);
      }

      if (quoteInfo?.oQuote?.intQuoteStageId > 0) {
        setValue('ddlQuoteStage', quoteInfo?.oQuote?.intQuoteStageId);
      }

      if (quoteInfo?.oQuote?.intFOBPointId > 0) {
        setValue('ddlFOBPoint', quoteInfo?.oQuote?.intFOBPointId);
      }

      // setValue('txbTerms', quoteInfo?.oQuote?.strTerms);

      if (quoteInfo?.oQuote?.strCreatedDate !== null && quoteInfo?.oQuote?.strCreatedDate !== '') {
        setValue('txbCreatedDate', quoteInfo?.oQuote?.oQuote?.strCreatedDate);
      }

      if (quoteInfo?.oQuote?.strRevisedDate !== null && quoteInfo?.oQuote?.strRevisedDate !== '') {
        setValue('txbRevisedDate', quoteInfo?.oQuote?.strRevisedDate);
      }

      if (quoteInfo?.oQuote?.strValidDate !== null && quoteInfo?.oQuote?.strValidDate !== '') {
        setValue('txbValidDate', quoteInfo?.oQuote?.strValidDate);
      }

      if (quoteInfo?.oQuote?.intCountryId > 0) {
        setValue('ddlCountry', quoteInfo?.oQuote?.intCountryId);
      }

      if (quoteInfo?.oQuote?.dblCurrencyRate !== null && quoteInfo?.oQuote?.dblCurrencyRate > 0) {
        setValue('txbCurrencyRate', quoteInfo?.oQuote?.dblCurrencyRate?.toFixed(2));
      }

      if (quoteInfo?.oQuote?.dblShippingFactor !== null && quoteInfo?.oQuote?.dblShippingFactor > 0) {
        setValue('txbShippingFactor', quoteInfo?.oQuote?.dblShippingFactor?.toFixed(1));
      }


      if (quoteInfo?.oQuote?.intShippingTypeId > 0) {
        setValue('ddlShippingType', quoteInfo?.oQuote?.intShippingTypeId);
      }

      if (quoteInfo?.oQuote?.dblDiscountFactor !== null && quoteInfo?.oQuote?.dblDiscountFactor > 0) {
        setValue('txbDiscountFactor', quoteInfo?.oQuote?.dblDiscountFactor?.toFixed(1));
      }

      if (quoteInfo?.oQuote?.intDiscountTypeId > 0) {
        setValue('ddlDiscountType', quoteInfo?.oQuote?.intDiscountTypeId);
      }

      if (quoteInfo?.oQuote?.dblPriceAllUnits !== null && quoteInfo?.oQuote?.dblPriceAllUnits > 0) {
        setValue('txbPriceAllUnits', quoteInfo?.oQuote?.dblPriceAllUnits?.toFixed(2));
      }

      if (quoteInfo?.oQuote?.dblPriceMisc !== null && quoteInfo?.oQuote?.dblPriceMisc > 0) {
        setValue('txbPriceMisc', quoteInfo?.oQuote?.dblPriceMisc?.toFixed(2));
      }

      if (quoteInfo?.oQuote?.dblPriceShipping !== null && quoteInfo?.oQuote?.dblPriceShipping > 0) {
        setValue('txbPriceShipping', quoteInfo?.oQuote?.dblPriceShipping?.toFixed(2));
      }

      if (quoteInfo?.oQuote?.dblPriceSubtotal !== null && quoteInfo?.oQuote?.dblPriceSubtotal > 0) {
        setValue('txbPriceSubtotal', quoteInfo?.oQuote?.dblPriceSubtotal?.toFixed(2));
      }

      if (quoteInfo?.oQuote?.dblPriceDiscount !== null && quoteInfo?.oQuote?.dblPriceDiscount > 0) {
        setValue('txbPriceDiscount', quoteInfo?.oQuote?.dblPriceDiscount?.toFixed(2));
      }

      if (quoteInfo?.oQuote?.dblPriceFinalTotal !== null && quoteInfo?.oQuote?.dblPriceFinalTotal > 0) {
        setValue('txbPriceFinalTotal', quoteInfo?.oQuote?.dblPriceFinalTotal?.toFixed(2));
      }
    }
  }, [quoteInfo?.oQuote, setValue]); // <-- empty dependency array - This will only trigger when the component mounts and no-render


// Calculate pricing with default values when Quote not saved yet




useEffect(() => {
  async function fetchData() {
    
    const oQuoteInputs : any = {
      oQuote: {
        "intUserId" : typeof window !== 'undefined' && localStorage.getItem('userId'),
        "intUAL" : typeof window !== 'undefined' && localStorage.getItem('UAL'),  
        "intJobId" : Number(projectId),
        "intQuoteStageId" : getValues('ddlQuoteStage'),
        "intRevisionNo" : getValues('txbRevisionNo'),
        "intFOBPointId" :  Number(getValues('ddlFOBPoint')),
        "intCountryId" : Number(getValues('ddlCountry')),
        "dblCurrencyRate" : getValues('txbCurrencyRate'),
        "dblShippingFactor" : getValues('txbShippingFactor'),
        "intShippingTypeId" : Number(getValues('ddlShippingType')),
        "dblDiscountFactor" : getValues('txbDiscountFactor'),
        "intDiscountTypeId" : Number(getValues('ddlDiscountType')),
        "dblPriceAllUnits" : getValues('txbPriceAllUnits'),
        "dblPriceMisc" : getValues('txbPriceMisc'),
        "dblPriceShipping" : getValues('txbPriceShipping'),
        "dblPriceSubtotal" : getValues('txbPriceSubtotal'),
        "dblPriceDiscount" : getValues('txbPriceDiscount'),
        "dblPriceFinalTotal" : getValues('txbPriceFinalTotal'),
        "strCreatedDate" : '',
        "strRevisedDate" : '',
        "strValidDate" : '',
      },
    }

    if (oQuoteInputs !== undefined && oQuoteInputs !== null) {
        const returnValue = await api.project.getSavedQuote(oQuoteInputs);
        setCurrQuoteInfo(returnValue);

        setValue('txbPriceAllUnits', returnValue?.oQuote?.dblPriceAllUnits?.toFixed(2));
        setValue('txbPriceMisc', returnValue?.oQuote?.dblPriceMisc?.toFixed(2));
        setValue('txbPriceShipping', returnValue?.oQuote?.dblPriceShipping?.toFixed(2));
        setValue('txbPriceSubtotal', returnValue?.oQuote?.dblPriceSubtotal?.toFixed(2));
        setValue('txbPriceDiscount', returnValue?.oQuote?.dblPriceDiscount?.toFixed(2));
        setValue('txbPriceFinalTotal', returnValue?.oQuote?.dblPriceFinalTotal?.toFixed(2));
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





  if (isLoadingQuoteInfo) return <LinearProgress color="info" />;

  return (
    <Container maxWidth="xl" sx={{ mb: '50px' }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onQuoteSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <CustomGroupBox title="Project Info">
                  <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                    <RHFTextField size="small" name="txbRevisionNo" label="Revision No" />
                    <RHFSelect native size="small" name="ddlQuoteStage" label="Stage" placeholder="" >
                      <option value="" selected>Select a Stage</option>
                      {quoteStageInfo?.fdtQuoteStage?.map((e: any, index: number) => (
                        <option key={index} value={e.id}>
                          {e.items}
                        </option>
                      
                    ))}
                      {/* <option value="2">USA</option> */}
                    </RHFSelect>
                    <RHFTextField size="small" name="txbProjectName" label="Project Name" />
                    <RHFTextField size="small" name="txbQuoteNo" label="Quote No" disabled />
                    <RHFSelect native size="small" name="ddlFOBPoint" label="F.O.B. Point" placeholder="" >
                      {fobPointInfo?.fdtFOBPoint?.map((e: any, index: number) => (
                        <option key={index} value={e.id}>
                          {e.items}
                        </option>
                      ))}
                    </RHFSelect>
                    <RHFTextField size="small" name="txbTerms" label="Terms" disabled />
                    <RHFTextField size="small" name="txbCreatedDate" label="Created Date" disabled />
                    <RHFTextField size="small" name="txbRevisedDate" label="Revised Date" disabled />
                    <RHFTextField size="small" name="txbValidDate" label="Valid Date" disabled />
                  </Box>
                </CustomGroupBox>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CustomGroupBox title="Price Setting">
                  <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                    <RHFSelect native size="small" name="ddlCountry" label="Country" placeholder="" >
                      {countryInfo?.fdtCountry?.map((e: any, index: number) => (
                        <option key={index} value={e.id}>
                        {e.items}
                      </option>
                    ))}
                    </RHFSelect>
                    <RHFTextField size="small" name="txbCurrencyRate" label="Currency Rate" />
                    <Stack direction="row">
                      <RHFTextField size="small" name="txbShippingFactor" label="Shipping" />
                      <RHFSelect native size="small" name="ddlShippingTypeVal" label="Unit" placeholder="" >
                        <option value="1" selected>%</option>
                        <option value="2">$</option>
                      </RHFSelect>
                    </Stack>
                    <Stack direction="row">
                      <RHFTextField size="small" name="txbDiscountFactor" label="Discount" />
                      <RHFSelect native size="small" name="ddlDiscountTypeVal" label="Unit" placeholder="" >
                        <option value="1">%</option>
                        <option value="2" selected>$</option>
                      </RHFSelect>
                    </Stack>
                  </Box>
                </CustomGroupBox>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <CustomGroupBox title="Final Pricing">
                  <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                    <RHFTextField size="small" name="txbPriceAllUnits" label="Price All Units ($)" />
                    <RHFTextField size="small" name="txbPriceMisc" label="Price Misc ($)" />
                    <RHFTextField size="small" name="txbPriceShipping" label="Shipping ($)" />
                    <RHFTextField size="small" name="txbPriceSubtotal" label="Sub Total ($)" />
                    <RHFTextField size="small" name="txbPriceDiscount" label="Discount ($)" />
                    <RHFTextField size="small" name="txbPriceFinalTotal" label="Final Total ($)" />
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
                        <TableCell component="th" scope="row" align="left">
                          UNIT PRICE
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
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
                            component="th" scope="row" align="left"
                          />
                          <TableCell component="th" scope="row" align="left">
                            {item.unit_price}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
                            {item.unit_price}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>

                    <TableBody>
                      {quoteInfo?.dbtPricingShipping?.map((item: any, i: number) => (
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
                            component="th" scope="row" align="left"
                          />
                          <TableCell component="th" scope="row" align="left">
                            {item.unit_price}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left">
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
          <Grid item xs={12}>
            <CustomGroupBox>
              {quoteInfo?.dtPricingTotal?.map((item: any, i: number) => (
                <Typography key={i} sx={{ fontWeight: item.is_add_info_bold ? 600 : 300 }}>
                  {item.add_info}
                </Typography>
              ))}
            </CustomGroupBox>
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
                  <RHFTextField size="small" name="txbMisc" label="Enter MIscellaneous" sx={{ width: '50%' }}/>
                  <RHFTextField size="small" name="txbMiscQty" label="Enter Qty" sx={{ width: '10%' }}/>
                  <RHFTextField size="small" name="txbMiscPrice" label="Enter Price" sx={{ width: '10%' }}/>
                  <Button
                    sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                    variant="contained"
                    onClick={addMiscClicked}
                  >
                    Add Misc
                  </Button>
                  <Button
                    sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                    variant="contained"
                    onClick={updateMiscClicked}
                  >
                    Update Misc
                  </Button>
                </Stack>
                <Box sx={{ pt: '10px' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>No</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" scope="row" align="left" sx={{ width: '50%' }}>Miscellaneous</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>Qty</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>Price</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>Edit</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>Delete</TableHeaderCellStyled>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {miscListInfo?.fdtMisc?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }}>
                            {index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{ width: '50%' }}>
                            {row.misc}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }}>
                            {row.qty}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }}>
                            {row.price}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }}>                    
                            <IconButton
                              sx={{ color: theme.palette.success.main }}
                              // onClick={() => selectRowClicked(row)}
                                >
                                <Iconify icon="material-symbols:edit-square-outline" />
                            </IconButton>
                          </TableCell>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }} >
                            <IconButton sx={{ color: theme.palette.warning.main }}
                            // onClick={() => deleteRow(row.misc_no)}
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
                  <RHFTextField size="small" name="txbNote" label="Enter Notes"  sx={{ width: '70%' }}
                    // value={noteInfo}
                    // onChange={(e) => setNote(e.target.value)}
                  />
                  <Button
                    sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                    variant="contained"
                    onClick={addNoteClicked}
                  >
                    Add Note
                  </Button>
                  <Button
                    sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                    variant="contained"
                    onClick={updateNoteClicked}
                  >
                    Update Note
                  </Button>
                </Stack>
                <Box sx={{ pt: '10px' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>No</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" scope="row" align="left" sx={{ width: '70%' }}>Note</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>Edit</TableHeaderCellStyled>
                        <TableHeaderCellStyled component="th" scope="row" align="center" sx={{ width: '10%' }}>Delete</TableHeaderCellStyled>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {notesListInfo?.fdtNotes?.map((row: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }}>
                            {index + 1}
                          </TableCell>
                          <TableCell component="th" scope="row" align="left" sx={{ width: '70%' }}>
                            {row.notes}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }}>                    
                            <IconButton
                              sx={{ color: theme.palette.success.main }}
                              // onClick={() => selectRowClicked(row)}
                                >
                                <Iconify icon="material-symbols:edit-square-outline" />
                            </IconButton>
                          </TableCell>
                          <TableCell component="th" scope="row" align="center" sx={{ width: '10%' }} >
                            <IconButton sx={{ color: theme.palette.warning.main }}
                            // onClick={() => deleteRow(row.misc_no)}
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
        </Grid>
      </FormProvider>
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
