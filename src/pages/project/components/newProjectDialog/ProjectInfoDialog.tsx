import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { any, number, object, string } from 'prop-types';
import * as Ids from 'src/utils/ids';

// const ClsID = ids;
// import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import {
  Box,
  Card,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Container,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useApiContext } from 'src/contexts/ApiContext';

import {} from 'src/hooks/useApi';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { getRandomNumber } from 'src/utils/referenceNumber';
import { isInCurrentMonth } from 'src/utils/date';
import { userInfo } from 'os';
import { celsiusToFarenheit } from 'src/utils/convert';

type ProjectInfoDialogProps = {
  loadProjectStep: string;
  open: boolean;
  onClose: Function;
  setOpenSuccess: Function;
  setOpenFail: Function;
  initialInfo: any;
  refetch: Function;
  // projectList: any[];
  savedJob: any;
};

export default function ProjectInfoDialog({
  loadProjectStep,
  open,
  onClose,
  setOpenSuccess,
  setOpenFail,
  initialInfo,
  refetch,
  // projectList,
  savedJob,
}: ProjectInfoDialogProps) {
  const api = useApiContext();
  const [step, setStep] = useState('');
  const [submit, setSubmit] = useState(0);
  // const [edit, setdit] = useState(false);
  // const [savedJobVals, setSavedJobVals] = useState<any[]>([])
  // const [savedJobVals, setSavedJobVals] = useState<any>([])

  const {
    dbtBasisOfDesign,
    dbtUoM,
    dbtApplication,
    dbtWeatherData,
    dbtWeatherDesignConditions,
    dbtCustomer,
    dbtUsers,
    // createdDate,
    // revisedDate,
  } = initialInfo || {};

  // let { oSavedjob } = null || {};

  const NewUserSchema = Yup.object().shape({
    txbJobName: Yup.string().required('Please enter a Project Name'),
    // ddlBasisOfDesign: Yup.string().required('Please enter a Basis Of Design'),
    ddlBasisOfDesign: Yup.number(),
    txbReferenceNo: Yup.string().required('Please enter a Reference No'),
    txbRevisionNo: Yup.number().required('Please enter a Revision No'),
    txbCompanyName: Yup.string(),
    // ddlCompanyName: Yup.string().required('Please enter a Company Name'),
    ddlCompanyName: Yup.number(),
    txbCompanyContactName: Yup.string(),
    ddlCompanyContactName: Yup.number(),
    ddlApplication: Yup.string().required('Please enter a Application'),
    ddlUoM: Yup.string().required('Please select a UoM'),
    // ddlCountry: Yup.string().required('Please select a County'),
    // ddlProvState: Yup.string().required('Please select a Province / State'),
    // ddlCity: Yup.number().required('Please select a City'),
    ddlCountry: Yup.string(),
    ddlProvState: Yup.string(),
    ddlCity: Yup.number(),
    ddlAshareDesignConditions: Yup.string().required('Please enter a ASHARE Design Conditions'),
    // txbAltitude: Yup.number().required('Please enter a Altitude'),
    txbAltitude: Yup.number(),
    txbSummerOA_DB: Yup.number(),
    txbSummerOA_WB: Yup.number(),
    txbSummerOA_RH: Yup.number(),
    txbWinterOA_DB: Yup.number(),
    txbWinterOA_WB: Yup.number(),
    txbWinterOA_RH: Yup.number(),
    txbSummerRA_DB: Yup.number(),
    txbSummerRA_WB: Yup.number(),
    txbSummerRA_RH: Yup.number(),
    txbWinterRA_DB: Yup.number(),
    txbWinterRA_WB: Yup.number(),
    txbWinterRA_RH: Yup.number(),
    testNewPrice: Yup.number(),
    createdDate: Yup.string(),
    revisedDate: Yup.string(),
  });

  // ---------------- Initalize Form with default values -----------------
  const defaultValues = useMemo(
    () => ({
      txbJobName: savedJob ? savedJob?.strJobName : '',
      ddlBasisOfDesign: savedJob ? savedJob?.intBasisOfDesignId : 0,
      txbReferenceNo: savedJob ? savedJob?.strReferenceNo : '0',
      txbRevisionNo: savedJob ? String(savedJob?.intRevisionNo) : '0',
      ddlCompanyName: savedJob ? savedJob?.intCompanyNameId : 0,
      txbCompanyName: savedJob ? savedJob?.strCompanyName : '',
      ddlCompanyContactName: savedJob ? savedJob?.intCompanyContactNameId : 0,
      txbCompanyContactName: savedJob ? savedJob?.strCompanyContactName : '',
      ddlApplication: savedJob ? savedJob?.intApplicationId : 0,
      ddlUoM: savedJob ? savedJob?.intUoMId : 0,
      ddlCountry: savedJob ? savedJob?.strCountry : '',
      ddlProvState: savedJob ? savedJob?.strProvState : '',
      ddlCity: savedJob ? savedJob?.intCityId : 0,
      ddlAshareDesignConditions: savedJob ? savedJob?.intDesignConditionsId : 0,
      txbAltitude: savedJob ? savedJob?.intAltitude : '0',
      txbSummerOA_DB: savedJob ? savedJob?.dblSummerOA_DB : '95.0',
      txbSummerOA_WB: savedJob ? savedJob?.dblSummerOA_WB : '78.0',
      txbSummerOA_RH: savedJob ? savedJob?.dblSummerOA_RH : '47.3',
      txbWinterOA_DB: savedJob ? savedJob?.dblWinterOA_DB : '35.0',
      txbWinterOA_WB: savedJob ? savedJob?.dblWinterOA_WB : '33.0',
      txbWinterOA_RH: savedJob ? savedJob?.dblWinterOA_RH : '81.9',
      txbSummerRA_DB: savedJob ? savedJob?.dblSummerRA_DB : '75.0',
      txbSummerRA_WB: savedJob ? savedJob?.dblSummerRA_WB : '63.0',
      txbSummerRA_RH: savedJob ? savedJob?.dblSummerRA_RH : '51.17',
      txbWinterRA_DB: savedJob ? savedJob?.dblWinterRA_DB : '70.0',
      txbWinterRA_WB: savedJob ? savedJob?.dblWinterRA_WB : '52.9',
      txbWinterRA_RH: savedJob ? savedJob?.dblWinterRA_RH : '30.0',
      ckbTestNewPrice: savedJob ? savedJob?.intIsTestNewPrice : 0,
    }),
    [savedJob]
  );

  const methods = useForm({ resolver: yupResolver(NewUserSchema), defaultValues });

  // const {
  //   setValue,
  //   watch,
  //   getValues,
  //   handleSubmit,
  //   reset,
  //   formState: { isSubmitting },
  // } = methods;

  const {
    setValue,
    getValues,
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  // ------------------------- Form Current Selected Values --------------------------
  const formValues = watch(); // watch()
  let formCurrValues = getValues();
  const today = new Date();

  const getJobInputs = () => {
    // const jsonData = '{"name":"John", "age":30, "city":"London"}';
    // let oUnitInputs;
    formCurrValues = getValues(); // Do not use watch, must use getValues with the function to get current values.
    let savedDate =  savedJob?.strCreatedDate;
    
    if (savedDate?.includes('/')) {
      const [month, day, year] =  savedDate.split('/');
      savedDate =`${year}-${month}-${day}`;
    }
  const oJobInputs = {
        
    oJob: {
      "intJobId" : savedJob ? savedJob?.intJobId : -1,
      "intCreatedUserId" : typeof window !== "undefined"? localStorage.getItem('userId') : 0,
      "intRevisedUserId" : typeof window !== "undefined"? localStorage.getItem('userId') : 0,
      "strJobName" : formCurrValues.txbJobName,
      "intBasisOfDesignId" : Number(formCurrValues.ddlBasisOfDesign),
      "strReferenceNo" :  formCurrValues.txbReferenceNo ,
      "intRevisionNo" : formCurrValues.txbRevisionNo,
      "intCompanyNameId" : Number(formCurrValues.ddlCompanyName),
      "strCompanyName" : '',
      "intCompanyContactNameId" : Number(formCurrValues.ddlCompanyContactName),
      "strCompanyContactName" : '',
      "intApplicationId" : Number(formCurrValues.ddlApplication),
      "strApplicationOther" : '',
      "intUoMId" : Number(formCurrValues.ddlUoM),
      "intDesignConditionsId" : Number(formCurrValues.ddlAshareDesignConditions),
      "strCountry" : formCurrValues.ddlCountry,
      "strProvState" : formCurrValues.ddlProvState,
      "intCityId" : Number(formCurrValues.ddlCity),
      "intAltitude" : formCurrValues.txbAltitude,
      "dblSummerOA_DB" : formCurrValues.txbSummerOA_DB,
      "dblSummerOA_WB" : formCurrValues.txbSummerOA_WB,
      "dblSummerOA_RH" : formCurrValues.txbSummerOA_RH,
      "dblWinterOA_DB" : formCurrValues.txbWinterOA_DB,
      "dblWinterOA_WB" : formCurrValues.txbWinterOA_WB,
      "dblWinterOA_RH" : formCurrValues.txbWinterOA_RH,
      "dblSummerRA_DB" : formCurrValues.txbSummerRA_DB,
      "dblSummerRA_WB" : formCurrValues.txbSummerRA_WB,
      "dblSummerRA_RH" : formCurrValues.txbSummerRA_RH,
      "dblWinterRA_DB" : formCurrValues.txbWinterRA_DB,
      "dblWinterRA_WB" : formCurrValues.txbWinterRA_WB,
      "dblWinterRA_RH" : formCurrValues.txbWinterRA_RH,
      // "strCreatedDate" : localStorage.getItem('createdDate'),
      "strCreatedDate" : savedJob ? savedDate : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
      "strRevisedDate" : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
      "intIsTestNewPrice" : Number(formCurrValues.ckbTestNewPrice) === 1 ? 1 : 0,  // Do not use formValues.ckbHeatPumpVal === true 
    },
  }
  
  return oJobInputs;
  };
  
  



  const UalInfo = useMemo(() => {
    const info: { isDisabled: boolean } = { isDisabled: true };

    switch(Number(typeof window !== "undefined"? localStorage.getItem('UAL') : 0)) {
      case Ids.intUAL_Admin:
      case Ids.intUAL_IntAdmin:
      case Ids.intUAL_IntLvl_2:
      case Ids.intUAL_IntLvl_1:
        info.isDisabled = false;
        break;
      case Ids.intUAL_External:
      case Ids.intUAL_ExternalSpecial:
        info.isDisabled = true;
        break;
      default:
        break;
    }

    return info;
  }, []);


  // onChange handle for company Name
  const handleChangeCompanyName = (e: any) => {
    setValue('ddlCompanyName', e.target.value);
    // setValue('txbCompanyName', e.nativeEvent.target[e.target.selectedIndex].text);
    // setValue('ddlContactName', 0);
    // setValue('txbContactName', '');
  };


  const handleChangeContactName = (e: any) => {
    setValue('ddlCompanyContactName', e.target.value);
    setValue('txbCompanyContactName', e.nativeEvent.target[e.target.selectedIndex].text);
  };


  const onSubmit = async (data: any) => {
    // try {
    //   await api.project.addNewProject({
    //     ...data,
    //     jobId: -1,
    //     createdUserId: localStorage.getItem('userId'),
    //     revisedUserId: localStorage.getItem('userId'),
    //     createdDate: localStorage.getItem('createdDate'),
    //     revisedDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
    //     applicationOther: '',
    //     referenceNo: data?.referenceNo ? data.referenceNo : '',
    //     testNewPrice: data.testNewPrice ? 1 : 0,
    //   });

    if (submit === 1) {
      try {
        const oJC: any = getJobInputs(); // JC: Job Container
        await api.project.addNewProject(oJC);
        setOpenSuccess();
        refetch();
        reset(defaultValues);
        // setStep('CLOSE_DIALOG');
        setSubmit(0);
        onClose();
      } catch (error) {
        setOpenFail();
      }
    }
  };


  const onClickedBackBtn = () => {
    if (step === 'SHOW_FIRST_DIALOG' || step === 'SHOW_ALL_DIALOG' || step === 'CLOSE_DIALOG') {
      onClose();

      // if (step === 'SHOW_ALL_DIALOG'){

      // }
    }

    if (step === 'SHOW_SECOND_DIALOG') {
      setStep('SHOW_FIRST_DIALOG');
    }
  };


  const onClickedContinueBtn = () => {
    // handleSubmit(() => {});
    if (formValues.txbJobName === '') return;
    if (formValues.txbReferenceNo === '') return;
    // if (formValues.txbCompanyName === '') return;
    if (formValues.txbRevisionNo === '') return;
    // if (step === 0)
    // {
    setStep('SHOW_SECOND_DIALOG');
    // }
  };


  const onClickedSubmitBtn = () => {
    setSubmit(1);

    handleSubmit(() => {});
  };

  
  const handleClose = () => onClose && onClose();

  const [isLoading, setIsLoading] = useState(0);


  const [projectDialogArrangement, setProjectDialogArrangement] = useState<any>();
  useMemo(() => {
    const returnInfo: {
      firstGridxs: number;
      firstBoxDisplay: string;
      secondGridxs: number;
      secondBoxDisplay: string;
      closeBtnLabel: string;
      continuBtnDisplay: string;
      submitBtnDisplay: string;
      submitBtnLabel: string;
    } = {
      firstGridxs: 0,
      firstBoxDisplay: '',
      secondGridxs: 0,
      secondBoxDisplay: '',
      closeBtnLabel: '',
      continuBtnDisplay: '',
      submitBtnDisplay: '',
      submitBtnLabel: '',
    };
    if (step === 'SHOW_FIRST_DIALOG') {
      returnInfo.firstGridxs = 12;
      returnInfo.firstBoxDisplay = 'grid';
      returnInfo.secondGridxs = 0;
      returnInfo.secondBoxDisplay = 'none';
      returnInfo.closeBtnLabel = 'Close';
      returnInfo.continuBtnDisplay = 'block';
      returnInfo.submitBtnDisplay = 'none';
    } else if (step === 'SHOW_SECOND_DIALOG') {
      returnInfo.firstGridxs = 0;
      returnInfo.firstBoxDisplay = 'none';
      returnInfo.secondGridxs = 12;
      returnInfo.secondBoxDisplay = 'grid';
      returnInfo.closeBtnLabel = 'Back';
      returnInfo.continuBtnDisplay = 'none';
      returnInfo.submitBtnDisplay = 'block';
      returnInfo.submitBtnLabel = 'Create Project';
    } else if (step === 'SHOW_ALL_DIALOG') {
      returnInfo.firstGridxs = 6;
      returnInfo.firstBoxDisplay = 'grid';
      returnInfo.secondGridxs = 6;
      returnInfo.secondBoxDisplay = 'grid';
      returnInfo.closeBtnLabel = 'Close';
      returnInfo.continuBtnDisplay = 'none';
      returnInfo.submitBtnDisplay = 'block';
      returnInfo.submitBtnLabel = 'Save Project';
    }

    setProjectDialogArrangement(returnInfo);
  }, [step]);


  // Do not delete - keep for reference
  // In form dialog this method is not working where the dependencies are directly set with getValues('').
  // In normal forms getValues('') form dependencies works. See UnitInfoForm.tsx
  // useEffect(() =>{
  //   const inputs : any = {
  //    "dblAlt" : getValues('txbAltitude') || any,
  //     "dblDB" : getValues('txbSummerOA_DB') || any,
  //     "dblWB" : getValues('txbSummerOA_WB') || any,
  //   }
  //   api.project.getRH_By_DB_WB(inputs).then((data: any) => { setValue('txbSummerOA_RH', data)});;

  //  },[getValues('txbAltitude'), getValues('txbSummerOA_DB'), getValues('txbSummerOA_WB'), setValue, api.project]);

  // Use this method since getValues('') for dependencies don't work. Extract all fieled from getValues into a constant first.
  const oSummerOA_RH = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbSummerOA_DB || any,
      dblWB: formCurrValues.txbSummerOA_WB || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbSummerOA_DB, formCurrValues.txbSummerOA_WB]);


  const oSummerOA_WB = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbSummerOA_DB || any,
      dblRH: formCurrValues.txbSummerOA_RH || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbSummerOA_DB, formCurrValues.txbSummerOA_RH]);


  const oWinterOA_RH = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbWinterOA_DB || any,
      dblWB: formCurrValues.txbWinterOA_WB || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbWinterOA_DB, formCurrValues.txbWinterOA_WB]);


  const oWinterOA_WB = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbWinterOA_DB || any,
      dblRH: formCurrValues.txbWinterOA_RH || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbWinterOA_DB, formCurrValues.txbWinterOA_RH]);


  const oSummerRA_RH = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbSummerRA_DB || any,
      dblWB: formCurrValues.txbSummerRA_WB || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbSummerRA_DB, formCurrValues.txbSummerRA_WB]);


  const oSummerRA_WB = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbSummerRA_DB || any,
      dblRH: formCurrValues.txbSummerRA_RH || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbSummerRA_DB, formCurrValues.txbSummerRA_RH]);


  const oWinterRA_RH = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbWinterRA_DB || any,
      dblWB: formCurrValues.txbWinterRA_WB || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbWinterRA_DB, formCurrValues.txbWinterRA_WB]);


  const oWinterRA_WB = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbWinterRA_DB || any,
      dblRH: formCurrValues.txbWinterRA_RH || any,
    };

    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbWinterRA_DB, formCurrValues.txbWinterRA_RH]);


  const [basisOfDesignInfo, setBasisOfDesignInfo] = useState([]);
  useMemo(() => {
    const dtSelBasisOfDesign = dbtBasisOfDesign;
    setBasisOfDesignInfo(dtSelBasisOfDesign);

    if (dtSelBasisOfDesign?.length > 0) {
      setValue('ddlBasisOfDesign', dtSelBasisOfDesign?.[0]?.id);
    } else {
      setValue('ddlBasisOfDesign', 0);
    }
  }, [dbtBasisOfDesign, setValue]);


  const [applicationInfo, setApplicationInfo] = useState([]);
  useMemo(() => {
    const dtSelApplication = dbtApplication;
    setApplicationInfo(dtSelApplication);

    if (dtSelApplication?.length > 0) {
      setValue('ddlApplication', dtSelApplication?.[0]?.id);
    } else {
      setValue('ddlApplication', 0);
    }
  }, [dbtApplication, setValue]);


  const [uomInfo, setUoM] = useState([]);
  useMemo(() => {
    const dtSelUoM = dbtUoM;
    setUoM(dtSelUoM);

    if (dtSelUoM?.length > 0) {
      setValue('ddlUoM', dtSelUoM?.[0]?.id);
    } else {
      setValue('ddlUoM', 0);
    }
  }, [dbtUoM, setValue]);


  const [companyInfo, setCompanyInfo] = useState([]);
  useMemo(() => {
    const dtSelUser = dbtUsers?.filter((e: any) => e.id === Number(typeof window !== "undefined"? localStorage.getItem('userId') : 0));
    let dtSelCompany;

    switch(typeof window !== "undefined"? Number(localStorage.getItem('UAL')) : 0) {
      case Ids?.intUAL_Admin:
      case Ids.intUAL_IntAdmin:
      case Ids.intUAL_IntLvl_2:
      case Ids.intUAL_IntLvl_1:
        dtSelCompany = dbtCustomer;
        break;
      case Ids.intUAL_External:
      case Ids.intUAL_ExternalSpecial:
        dtSelCompany = dbtCustomer?.filter(
          (e: any) => e.id === Number(dtSelUser?.[0]?.customer_id)
        );
        break;
      default:
        break;
    }

    setCompanyInfo(dtSelCompany);

    if (dtSelCompany?.length > 0) {
      setValue('ddlCompanyName', dtSelCompany?.[0]?.id);
    } else {
      setValue('txbCompanyName', '');
      setValue('ddlCompanyName', 0);
    }
  }, [dbtCustomer, dbtUsers, setValue]);


  const [companyContactInfo, setCompanyContactInfo] = useState([]);
  useMemo(() => {
    const dtSelCompanyContacts = dbtUsers?.filter(
      (item: any) => Number(item.customer_id) === Number(formValues.ddlCompanyName)
    );
    setCompanyContactInfo(dtSelCompanyContacts);

    if (dtSelCompanyContacts?.length > 0) {
      setValue('ddlCompanyContactName', dtSelCompanyContacts?.[0]?.id);
    } else {
      setValue('txbCompanyContactName', '');
      setValue('ddlCompanyContactName', 0);
    }
  }, [dbtUsers, formValues.ddlCompanyName, setValue]);


  const [designCondInfo, setDesignCondInfo] = useState([]);
  useMemo(() => {
    const dtSelDesignCond = dbtWeatherDesignConditions;

    setDesignCondInfo(dtSelDesignCond);

    if (dtSelDesignCond?.length > 0) {
      setValue('ddlAshareDesignConditions', dtSelDesignCond?.[0]?.id); //
    } else {
      setValue('ddlAshareDesignConditions', 0); //
    }
  }, [dbtWeatherDesignConditions, setValue]);


  const [weatherDataCountryInfo, setWeatherDataCountryInfo] = useState([]);
  useMemo(() => {
    const dtSelCountry = dbtWeatherData?.map((e: any) => e.country,)?.filter((v:any, i:any, e: any) => e.indexOf(v) === i);
    

    setWeatherDataCountryInfo(dtSelCountry);  
 
    if (dtSelCountry?.length > 0) {
      setValue('ddlCountry', String(dtSelCountry?.[0]));
    } else {
      setValue('ddlCountry', '');
    }
  }, [dbtWeatherData, setValue]);


  const [weatherDataProvStateInfo, setWeatherDataProvStateInfo] = useState([]);
  useMemo(() => {
    let dtSelProvState = dbtWeatherData?.filter((e: any) => e.country === formValues.ddlCountry);
    dtSelProvState = dtSelProvState?.map((e: any) => e.prov_state)?.filter((v:any, i:any, e: any) => e.indexOf(v) === i);
   

    setWeatherDataProvStateInfo(dtSelProvState);

    if (dtSelProvState?.length > 0) {
      setValue('ddlProvState', dtSelProvState?.[0]); // Set this to trigger the event for next dropdown - ddlCity
    } else {
      setValue('ddlProvState', '');
    }
  }, [dbtWeatherData, formValues.ddlCountry, setValue]);


  const [weatherDataCityInfo, setWeatherDataCityInfo] = useState([]);
  useMemo(() => {
    let dtSelCity = dbtWeatherData?.filter((e: any) => e.country === formCurrValues.ddlCountry);
    dtSelCity = dtSelCity?.filter((e: any) => e.prov_state === formCurrValues.ddlProvState);
    // const provname = getValues('ddlProvState');


    setWeatherDataCityInfo(dtSelCity);

    if (dtSelCity?.length > 0) {
      setValue('ddlCity', dtSelCity?.[0]?.id); //
    } else {
      setValue('ddlCity', 0); //
    }
  }, [dbtWeatherData, formCurrValues.ddlCountry, formCurrValues.ddlProvState, setValue]);


  // useState<any>([])
  const [stationInfo, setStationInfo] = useState<any>();
  const [summerOaRhInfo, setSummerOaRhInfo] = useState(0);
  const [winterOaRhInfo, setWinterOaRhInfo] = useState(0);
   useMemo(() => {
    const info: {altitude: number; summerOA_DB: Number;  summerOA_WB: Number; summerOA_RH: Number; winterOA_DB: Number;  winterOA_WB: Number; winterOA_RH: Number;} = 
                {altitude: 0, summerOA_DB: 0,  summerOA_WB: 0, summerOA_RH: 0, winterOA_DB: 0,  winterOA_WB: 0, winterOA_RH: 0};

    let dtSelStation;


    if (formCurrValues.ddlCity > 0) {
     dtSelStation = dbtWeatherData?.filter((e: { id: number }) => e.id === Number(formCurrValues.ddlCity));
    // let dtSelStation = dbtWeatherData?.filter((e: any) => e.country === formValues.ddlCountry);
    // dtSelStation = dtSelStation.filter((e: any) => e.prov_state === formValues.ddlProvState);
    // dtSelStation = dtSelStation.filter((e: { id: number }) => e.id === Number(formValues.ddlCity));
    } else {
      dtSelStation = dbtWeatherData?.filter((e: { id: number }) => e.id === 1);
    }

    // setValue('txbAltitude', dtSelStation?.[0]?.elevation_foot);
    info.altitude = Number(dtSelStation?.[0]?.elevation_foot);

    // switch(Number(formCurrValues.ddlAshareDesignConditions)){
    //   case 1:
    //     setValue('txbSummerOA_DB', (Math.round(celsiusToFarenheit(dtSelStation?.[0]?.cooling_db010) * 10) / 10).toFixed(1));
    //     setValue('txbSummerOA_WB', (Math.round(celsiusToFarenheit(dtSelStation?.[0]?.cooling_wb_db010) * 10) / 10).toFixed(1));
    //     setValue('txbWinterOA_DB', (Math.round(celsiusToFarenheit(dtSelStation?.[0]?.heating_db990) * 10) / 10).toFixed(1));
    //     break;
    //   case 2:
    //     setValue('txbSummerOA_DB', (Math.round(celsiusToFarenheit(dtSelStation?.[0]?.cooling_db004) * 10) / 10).toFixed(1));
    //     setValue('txbSummerOA_WB', (Math.round(celsiusToFarenheit(dtSelStation?.[0]?.cooling_wb_db004) * 10) / 10).toFixed(1));
    //     setValue('txbWinterOA_DB', (Math.round(celsiusToFarenheit(dtSelStation?.[0]?.heating_db996) * 10) / 10).toFixed(1));
    //     break;
    //     default:
    //       break;
    // }

    switch (Number(formCurrValues.ddlAshareDesignConditions)) {
      case 1:
        info.summerOA_DB = Math.round(celsiusToFarenheit(dtSelStation?.[0]?.cooling_db010) * 10) / 10;
        info.summerOA_WB = Math.round(celsiusToFarenheit(dtSelStation?.[0]?.cooling_wb_db010) * 10) / 10;
        info.winterOA_DB = Math.round(celsiusToFarenheit(dtSelStation?.[0]?.heating_db990) * 10) / 10;
        break;
      case 2:
        info.summerOA_DB = Math.round(celsiusToFarenheit(dtSelStation?.[0]?.cooling_db004) * 10) / 10;
        info.summerOA_WB = Math.round(celsiusToFarenheit(dtSelStation?.[0]?.cooling_wb_db004) * 10) / 10;
        info.winterOA_DB = Math.round(celsiusToFarenheit(dtSelStation?.[0]?.heating_db996) * 10) / 10;
        break;
      default:
        break;
    }

    // switch(getValues('ddlCountry')){
    //   case 'CAN':
    //   case 'USA':
    //     setValue('txbWinterOA_WB', (Number.parseFloat(formCurrValues.txbWinterOA_DB) - 0.1).toFixed(1));
    //     break;
    //     default:
    //     setValue('txbWinterOA_WB', (Number.parseFloat(formCurrValues.txbWinterOA_DB) - 2.0).toFixed(1));
    //     break;
    // }

    switch (formCurrValues.ddlCountry) {
      case 'CAN':
      case 'USA':
        info.winterOA_WB = Number(info.winterOA_DB) - Number(0.1);
        break;
      default:
        info.winterOA_WB = Number(info.winterOA_DB) - Number(2.0);
        break;
    }

    const inputsSummerOA_RH: any = {
      dblAlt: info.altitude || any,
      dblDB: info.summerOA_DB || any,
      dblWB: info.summerOA_WB || any,
    };

    const inputsWinterOA_RH: any = {
      dblAlt: info.altitude || any,
      dblDB: info.winterOA_DB || any,
      dblWB: info.winterOA_WB || any,
    };

    // api.project.getRH_By_DB_WB(inputsSummerOA_RH).then((data: any) => { setValue('txbSummerOA_RH', data)});
    // api.project.getRH_By_DB_WB(inputsWinterOA_RH).then((data: any) => { setValue('txbWinterOA_RH', data)});

    api.project.getRH_By_DB_WB(inputsSummerOA_RH).then((data: any) => { setSummerOaRhInfo(data); });
    api.project.getRH_By_DB_WB(inputsWinterOA_RH).then((data: any) => { setWinterOaRhInfo(data); });

    setStationInfo(info);

    if (isLoading === 0) {
      setValue('txbAltitude', String(info.altitude));
      setValue('txbSummerOA_DB', info.summerOA_DB.toFixed(1));
      setValue('txbSummerOA_WB', info.summerOA_WB.toFixed(1));
      setValue('txbSummerOA_RH', summerOaRhInfo.toFixed(1));

      setValue('txbWinterOA_DB', info.winterOA_DB.toFixed(1));
      setValue('txbWinterOA_WB', info.winterOA_WB.toFixed(1));
      setValue('txbWinterOA_RH', winterOaRhInfo.toFixed(1));
    }


    // return dtSelStation;
  }, [api.project, dbtWeatherData, formCurrValues.ddlAshareDesignConditions, formCurrValues.ddlCity, formCurrValues.ddlCountry, isLoading, setValue, summerOaRhInfo, winterOaRhInfo]);


  const handleChangeSummerOutdoorAirDBChanged = useCallback(
    (e: any) => {
      setValue('txbSummerOA_DB', e.target.value);
      api.project.getRH_By_DB_WB(oSummerOA_RH).then((data: any) => {
        setValue('txbSummerOA_RH', data.toFixed(1));
      });
    },
    [api.project, oSummerOA_RH, setValue]
  );


  // Summer Outdoor Air WB
  const handleChangeSummerOutdoorAirWBChanged = useCallback(
    (e: any) => {
      setValue('txbSummerOA_WB', e.target.value);
      api.project.getRH_By_DB_WB(oSummerOA_RH).then((data: any) => {
        setValue('txbSummerOA_RH', data.toFixed(1));
      });
    },
    [api.project, oSummerOA_RH, setValue]
  );


  // Summer Outdoor Air RH
  const handleChangeSummerOutdoorAirRHChanged = useCallback(
    (e: any) => {
      setValue('txbSummerOA_RH', e.target.value);
      api.project.getWB_By_DB_RH(oSummerOA_WB).then((data: any) => {
        setValue('txbSummerOA_WB', data.toFixed(1));
      });
    },
    [api.project, oSummerOA_WB, setValue]
  );


  // Winter Outdoor Air DB
  const handleChangeWinterOutdoorAirDBChanged = useCallback(
    (e: any) => {
      setValue('txbWinterOA_DB', e.target.value);
      api.project.getRH_By_DB_WB(oWinterOA_RH).then((data: any) => {
        setValue('txbWinterOA_RH', data.toFixed(1));
      });
    },
    [api.project, oWinterOA_RH, setValue]
  );


  // Winter Outdoor Air WB
  const handleChangeWinterOutdoorAirWBChanged = useCallback(
    (e: any) => {
      setValue('txbWinterOA_WB', e.target.value);
      api.project.getRH_By_DB_WB(oWinterOA_RH).then((data: any) => {
        setValue('txbWinterOA_RH', data.toFixed(1));
      });
    },
    [api.project, oWinterOA_RH, setValue]
  );


  // Winter Outdoor Air RH
  const handleChangeWinterOutdoorAirRHChanged = useCallback(
    (e: any) => {
      setValue('txbWinterOA_RH', e.target.value);
      api.project.getWB_By_DB_RH(oWinterOA_WB).then((data: any) => {
        setValue('txbWinterOA_WB', data.toFixed(1));
      });
    },
    [api.project, oWinterOA_WB, setValue]
  );


  // Summer Return Air DB
  const handleChangeSummerReturnAirDBChanged = useCallback(
    (e: any) => {
      setValue('txbSummerRA_DB', e.target.value);
      api.project.getRH_By_DB_WB(oSummerRA_RH).then((data: any) => {
        setValue('txbSummerRA_RH', data.toFixed(1));
      });
    },
    [api.project, oSummerRA_RH, setValue]
  );


  // Summer Return Air WB
  const handleChangeSummerReturnAirWBChanged = useCallback(
    (e: any) => {
      setValue('txbSummerRA_WB', e.target.value);
      api.project.getRH_By_DB_WB(oSummerRA_RH).then((data: any) => {
        setValue('txbSummerRA_RH', data.toFixed(1));
      });
    },
    [api.project, oSummerRA_RH, setValue]
  );


  // Summer Return Air RH
  const handleChangeSummerReturnAirRHChanged = useCallback(
    (e: any) => {
      setValue('txbSummerRA_RH', e.target.value);
      api.project.getWB_By_DB_RH(oSummerRA_WB).then((data: any) => {
        setValue('txbSummerRA_WB', data.toFixed(1));
      });
    },
    [api.project, oSummerRA_WB, setValue]
  );


  // Winter Return Air DB
  const handleChangeWinterReturnAirDBChanged = useCallback(
    (e: any) => {
      setValue('txbWinterRA_DB', e.target.value);
      api.project.getRH_By_DB_WB(oWinterRA_RH).then((data: any) => {
        setValue('txbWinterRA_RH', data.toFixed(1));
      });
    },
    [api.project, oWinterRA_RH, setValue]
  );


  // Winter Return Air WB
  const handleChangeWinterReturnAirWBChanged = useCallback(
    (e: any) => {
      setValue('txbWinterRA_WB', e.target.value);
      api.project.getRH_By_DB_WB(oWinterRA_RH).then((data: any) => {
        setValue('txbWinterRA_RH', data.toFixed(1));
      });
    },
    [api.project, oWinterRA_RH, setValue]
  );


  // Winter Return Air RH
  const handleChangeWinterReturnAirRHChanged = useCallback(
    (e: any) => {
      setValue('txbWinterRA_RH', e.target.value);
      api.project.getWB_By_DB_RH(oWinterRA_WB).then((data: any) => {
        setValue('txbWinterRA_WB', data.toFixed(1));
      });
    },
    [api.project, oWinterRA_WB, setValue]
  );


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

  // ------------------------- Set default Form Values --------------------------

  useEffect(() => {
    if (loadProjectStep !== '') {
      setStep(loadProjectStep);
    }
  }, [loadProjectStep]); // <-- empty dependency array - This will only trigger when the component mounts and no-render

  // useEffect(()=>{

  //   setValue('ddlBasisOfDesign',  dbtBasisOfDesign?.[0]?.Id);

  // / }, [dbtBasisOfDesign, setValue]) // <-- empty dependency array - This will only trigger when the component mounts and no-render


  // Load saved Values
  useEffect(() => {
    if (savedJob !== null) {
      if (savedJob?.intBasisOfDesignId > 0) {
        setValue('ddlBasisOfDesign', savedJob?.intBasisOfDesignId);
      }

      if (savedJob?.intCompanyNameId > 0) {
        setValue('ddlCompanyName', savedJob?.intCompanyNameId);
      }

      if (savedJob?.intCompanyContactNameId > 0) {
        setValue('ddlCompanyContactName', savedJob?.intCompanyContactNameId);
      }

      if (savedJob?.intApplicationId > 0) {
        setValue('ddlApplication', savedJob?.intApplicationId);
      }

      if (savedJob?.intUoMId > 0) {
        setValue('ddlUoM', savedJob?.intUoMId);
      }

      if (savedJob?.strCountry !== '') {
        setValue('ddlCountry', savedJob?.strCountry);
      }

      if (savedJob?.strProvState !== '') {
        setValue('ddlProvState', savedJob?.strProvState);
      }

      if (savedJob?.intCityId > 0) {
        setValue('ddlCity', savedJob?.intCityId);
      }

      if (savedJob?.intDesignConditionsId > 0) {
        setValue('ddlAshareDesignConditions', savedJob?.intDesignConditionsId);
      }
      
      setValue('txbJobName', savedJob?.strJobName);
      setValue('txbReferenceNo', savedJob?.strReferenceNo);
      setValue('txbRevisionNo', String(savedJob?.intRevisionNo));
      setValue('txbCompanyName', savedJob?.strCompanyName);
      setValue('txbCompanyContactName', savedJob?.strCompanyContactName);
      setValue('txbAltitude', String(savedJob?.intAltitude));
      setValue('txbSummerOA_DB', savedJob?.dblSummerOA_DB?.toFixed(1));
      setValue('txbSummerOA_WB', savedJob?.dblSummerOA_WB?.toFixed(1));
      setValue('txbSummerOA_RH', savedJob?.dblSummerOA_RH?.toFixed(1));

      setValue('txbWinterOA_DB', savedJob?.dblWinterOA_DB?.toFixed(1));
      setValue('txbWinterOA_WB', savedJob?.dblWinterOA_WB?.toFixed(1));
      setValue('txbWinterOA_RH', savedJob?.dblWinterOA_RH?.toFixed(1));

      setValue('txbSummerRA_DB', savedJob?.dblSummerRA_DB?.toFixed(1));
      setValue('txbSummerRA_WB', savedJob?.dblSummerRA_WB?.toFixed(1));
      setValue('txbSummerRA_RH', savedJob?.dblSummerRA_RH?.toFixed(1));

      setValue('txbWinterRA_DB', savedJob?.dblWinterRA_DB?.toFixed(1));
      setValue('txbWinterRA_WB', savedJob?.dblWinterRA_WB.toFixed(1));
      setValue('txbWinterRA_RH', savedJob?.dblWinterRA_RH?.toFixed(1));
      setIsLoading(1);

    } else {
      // Keep these values in else statement rather than inline if statment
      setValue('txbAltitude', '0');
      setValue('txbSummerOA_DB', '95.0');
      setValue('txbSummerOA_WB', '78.0');
      setValue('txbSummerOA_RH', '47.3');

      setValue('txbWinterOA_DB', '35.0');
      setValue('txbWinterOA_WB', '33.0');
      setValue('txbWinterOA_RH', '81.9');

      setValue('txbSummerRA_DB', '75.0');
      setValue('txbSummerRA_WB', '63.0');
      setValue('txbSummerRA_RH', '51.2');

      setValue('txbWinterRA_DB', '70.0');
      setValue('txbWinterRA_WB', '52.9');
      setValue('txbWinterRA_RH', '30.0');
    }
  }, [savedJob, setValue]); // <-- empty dependency array - This will only trigger when the component mounts and no-render


  useMemo(() => {

    if (formCurrValues?.ddlCountry !== null || formCurrValues?.ddlProvState !== null || formCurrValues?.ddlCity !== null || formCurrValues?.ddlAshareDesignConditions !== null) {
      setIsLoading(0);
    }

  },[formCurrValues?.ddlAshareDesignConditions, formCurrValues?.ddlCity, formCurrValues?.ddlCountry, formCurrValues?.ddlProvState])




  // useMemo(() => {
  //   if (newJobInfo !== null) {

  //   if (newJobInfo?.intBasisOfDesignId > 0) {
  //     setValue('ddlBasisOfDesign', newJobInfo?.intBasisOfDesignId);
  //   }

  //   if (newJobInfo?.intCompanyNameId > 0) {
  //   setValue('ddlCompanyName', newJobInfo?.intCompanyNameId);
  //   }

  //   if (newJobInfo?.intCompanyContactNameId > 0) {
  //   setValue('ddlCompanyContactName', newJobInfo?.intCompanyContactNameId);
  //   }


  //   if (newJobInfo?.intApplicationId > 0) {
  //   setValue('ddlApplication', newJobInfo?.intApplicationId);
  //   }

  //   if (newJobInfo?.intUoMId > 0) {
  //   setValue('ddlUoM', newJobInfo?.intUoMId);
  //   }

  //   if (newJobInfo?.strCountry !== '') {
  //     setValue('ddlCountry', newJobInfo?.strCountry);
  //   }

  //   if (newJobInfo?.strProvState !== '') {
  //     setValue('ddlProvState', newJobInfo?.strProvState);
  //   }

  //   if (newJobInfo?.intCityId > 0) {
  //     setValue('ddlCity', newJobInfo?.intCityId);
  //   }

  //   if (newJobInfo?.intDesignConditionsId > 0) {
  //     setValue('ddlAshareDesignConditions', newJobInfo?.intDesignConditionsId);
  //   }

  //   setValue('txbAltitude', Number(newJobInfo?.intAltitude) > 0 ? newJobInfo?.intAltitude : '0');
  //   setValue('txbSummerOA_DB', newJobInfo?.dblSummerOA_DB?.toFixed(1));
  //   setValue('txbSummerOA_WB', newJobInfo?.dblSummerOA_WB?.toFixed(1));
  //   setValue('txbSummerOA_RH', newJobInfo?.dblSummerOA_RH?.toFixed(1));

  //   setValue('txbWinterOA_DB', newJobInfo?.dblWinterOA_DB?.toFixed(1));
  //   setValue('txbWinterOA_WB', newJobInfo?.dblWinterOA_WB?.toFixed(1));
  //   setValue('txbWinterOA_RH', newJobInfo?.dblWinterOA_RH?.toFixed(1));

  //   setValue('txbSummerRA_DB', newJobInfo?.dblSummerRA_DB?.toFixed(1));
  //   setValue('txbSummerRA_WB', newJobInfo?.dblSummerRA_WB?.toFixed(1));
  //   setValue('txbSummerRA_RH', newJobInfo?.dblSummerRA_RH?.toFixed(1));

  //   setValue('txbWinterRA_DB', newJobInfo?.dblWinterRA_DB?.toFixed(1));
  //   setValue('txbWinterRA_WB', newJobInfo?.dblWinterRA_WB?.toFixed(1));
  //   setValue('txbWinterRA_RH', newJobInfo?.dblWinterRA_RH?.toFixed(1));
  //   }
  //   },[newJobInfo, setValue]);


  // useEffect(() => {
  //   setNewJobInfo(savedJob);
  // },[savedJob]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg">
      <DialogTitle>{!step ? 'Create New Project' : 'Design conditions'}</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container>
            {/* <Grid item xs={6} sx={{ p: 1}}> */}
            <Grid
              item
              xs={projectDialogArrangement?.firstGridxs}
              sx={{ p: 1, display: projectDialogArrangement?.firstBoxDisplay }}
            >
              <Card sx={{ p: 3 }}>
                {/* <Box sx={{ minWidth: '500px', display: 'grid', rowGap: 3, columnGap: 2 }}> */}
                <Box
                  sx={{
                    minWidth: '500px',
                    display: projectDialogArrangement?.firstBoxDisplay,
                    rowGap: 3,
                    columnGap: 2,
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Typography variant="subtitle1">PROJECT INFO</Typography>
                  </Stack>
                  <RHFTextField size="small" name="txbJobName" label="Project Name" />
                  <RHFSelect
                    native
                    size="small"
                    name="ddlBasisOfDesign"
                    label="Basis of Design"
                    placeholder="Basis of Design"
                    // onChange={ddlBasisOfDesignChanged}
                  >
                    {/* <option value="" /> */}
                    {/* {['Budget', 'Basic of Design', 'Non-Basic of Design']?.map(
                      (option: string, index: number) => (
                        <option key={`${index}basisOfDesign`} value={index + 2}>
                          {option}
                        </option>
                      )
                    )} */}
                    {basisOfDesignInfo?.map((option: any, index: number) => (
                      <option key={index} value={option.id}>
                        {option.items}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFTextField size="small" name="txbReferenceNo" label="Reference #" />
                  <RHFTextField size="small"
                    // type="number"
                    name="txbRevisionNo"
                    label="Revision #"
                    onChange={(e: any) => { setValueWithCheck(e, 'txbRevisionNo');}}
                  />
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCompanyName"
                    label="Company Name"
                    placeholder=""
                    // onChange={handleChangeCompanyName}
                  >
                    {/* <option value="" /> */}
                    {companyInfo?.map((option: any, index: number) => (
                      <option key={index} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCompanyContactName"
                    label="Contact Name"
                    placeholder=""
                    disabled={UalInfo.isDisabled}
                    onChange={handleChangeContactName}
                  >
                    {/* <option value="" /> */}
                    {companyContactInfo && companyContactInfo?.length > 0 ? (
                      companyContactInfo?.map((option: any, index: number) => (
                        <option key={index} value={option.id}>
                          {`${option.first_name} ${option.last_name}`}
                        </option>
                      ))
                    ) : (
                      <option value={0}>No contact available</option>
                    )}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlApplication"
                    label="Application"
                    placeholder="Application"
                    onChange={(e: any) => setValue('ddlApplication', Number(e.target.value))}
                  >
                    {/* <option value="" /> */}
                    {applicationInfo?.map((option: any, index: number) => (
                      <option key={index} value={option.id}>
                        {option.items}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlUoM"
                    label="UoM"
                    placeholder=""
                    // onChange={(e: any) => setValue('ddlUoM', Number(e.target.value))}
                  >
                    {/* <option value="" /> */}
                    {uomInfo?.map((option: any, index: number) => (
                      <option key={index} value={option.id}>
                        {option.items}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>
              </Card>
            </Grid>
            {/* <Grid item xs={6} sx={{ p: 1}}> */}
            <Grid
              item
              xs={projectDialogArrangement?.secondGridxs}
              sx={{ p: 1, display: projectDialogArrangement?.secondBoxDisplay }}
            >
              <Card sx={{ p: 3 }}>
                {/* <Box sx={{ minWidth: '500px', display: 'grid', rowGap: 3, columnGap: 2 }}> */}
                <Box
                  sx={{
                    minWidth: '500px',
                    display: projectDialogArrangement?.secondBoxDisplay,
                    rowGap: 3,
                    columnGap: 2,
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Typography variant="subtitle1">LOCATION</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlCountry"
                      label="Country"
                      placeholder="Please select country"
                      // onChange={(e: any) => {setValue('ddlCountry', e.target.value);}}
                    >
                      {/* <option value="0" id='Select' /> */}
                      {/* {weatherData?.map((option: any) => ( */}
                      {weatherDataCountryInfo?.map((option: any, idx: any) => (
                        <option key={`${idx}`} value={option}>
                          {option}
                        </option>
                      ))}
                    </RHFSelect>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlProvState"
                      label="Province/state"
                      placeholder="Please select province/state"
                      // onChange={(e: any) => {setValue('ddlProvState', e.target.value);}}
                    >
                      {/* <option value="" /> */}
                      {/* {weatherDataProvStateInfo?.map((option: any) => (
                        <option key={`${option}`} value={option}>
                          {option}
                        </option>
                      ))} */}
                      {weatherDataProvStateInfo?.map((option: any, idx: any) => (
                        <option key={`${idx}`} value={option}>
                          {option}
                        </option>
                      ))}
                    </RHFSelect>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlCity"
                      label="City"
                      placeholder="Please select city"
                      // onChange={(e: any) => {setValue('ddlCity', Number(e.target.value));}}
                    >
                      {/* <option value="" /> */}
                      {weatherDataCityInfo?.map((option: any, index: number) => (
                        <option key={`${index}`} value={option.id}>
                          {option.station}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlAshareDesignConditions"
                      label="ASHRAE Design Conditions"
                      placeholder="Please select an share design conditions"
                    >
                      {/* <option value="" /> */}
                      {designCondInfo?.map((option: any, index: number) => (
                        <option key={`${index}`} value={option.id}>
                          {option.items}
                        </option>
                      ))}
                    </RHFSelect>
                    <RHFTextField
                      // type="number"
                      size="small"
                      name="txbAltitude"
                      label="Altitude(ft)"
                      // value={stationInfo?.altitude}
                      onChange={(e: any) => {
                        setValueWithCheck(e, 'txbAltitude');
                      }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="subtitle1">OUTDOOR AIR DESIGN CONDITIONS</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbSummerOA_DB"
                      label="Summer Outdoor Air DB (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbSummerOA_DB');
                      }}
                      onBlur={handleChangeSummerOutdoorAirDBChanged}
                    />
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbWinterOA_DB"
                      label="Winter Outdoor Air DB (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbWinterOA_DB');
                      }}
                      onBlur={handleChangeWinterOutdoorAirDBChanged}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbSummerOA_WB"
                      label="Summer Outdoor Air WB (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbSummerOA_WB');
                      }}
                      onBlur={handleChangeSummerOutdoorAirWBChanged}
                    />
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbWinterOA_WB"
                      label="Winter Outdoor Air WB (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbWinterOA_WB');
                      }}
                      onBlur={handleChangeWinterOutdoorAirWBChanged}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbSummerOA_RH"
                      label="Summer Outdoor Air RH (%)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbSummerOA_RH');
                      }}
                      onBlur={handleChangeSummerOutdoorAirRHChanged}
                    />
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbWinterOA_RH"
                      label="Winter Outdoor Air RH (%)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbWinterOA_RH');
                      }}
                      onBlur={handleChangeWinterOutdoorAirRHChanged}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="subtitle1">RETURN AIR DESIGN CONDITIONS</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbSummerRA_DB"
                      label="Summer Return Air DB (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbSummerRA_DB');
                      }}
                      onBlur={handleChangeSummerReturnAirDBChanged}
                    />
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbWinterRA_DB"
                      label="Winter Return Air DB (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbWinterRA_DB');
                      }}
                      onBlur={handleChangeWinterReturnAirDBChanged}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbSummerRA_WB"
                      label="Summer Return Air WB (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbSummerRA_WB');
                      }}
                      onBlur={handleChangeSummerReturnAirWBChanged}
                    />
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbWinterRA_WB"
                      label="Winter Return Air WB (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbWinterRA_WB');
                      }}
                      onBlur={handleChangeWinterReturnAirWBChanged}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbSummerRA_RH"
                      label="Summer Return Air RH (%)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbSummerRA_RH');
                      }}
                      onBlur={handleChangeSummerReturnAirRHChanged}
                    />
                    <RHFTextField
                      type="number"
                      size="small"
                      name="txbWinterRA_RH"
                      label="Winter Return Air RH (%)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbWinterRA_RH');
                      }}
                      onBlur={handleChangeWinterReturnAirRHChanged}
                    />
                  </Stack>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={onClickedBackBtn}>{!step ? 'Cancel' : 'Back'}</Button> */}
          <Button onClick={onClickedBackBtn}>{projectDialogArrangement?.closeBtnLabel}</Button>
          <LoadingButton
            // type={!step ? 'button' : 'submit'}
            type={!step ? 'button' : 'submit'}
            variant="contained"
            sx={{ display: projectDialogArrangement?.continuBtnDisplay }}
            // onClick={step === 0? onClickedContinueBtn: () => {console.log(getValues());}}
            onClick={onClickedContinueBtn}
            loading={isSubmitting}
          >
            {/* {!step ? 'Continue' : 'Create project'} */}
            Continue
          </LoadingButton>
          <LoadingButton
            // type={!step ? 'button' : 'submit'}
            type={!step ? 'button' : 'submit'}
            variant="contained"
            sx={{ display: projectDialogArrangement?.submitBtnDisplay }}
            // onClick={step === 0? onClickedSubmitBtn: () => {console.log(getValues());}}
            onClick={onClickedSubmitBtn}
            loading={isSubmitting}
          >
            {/* Create project */}
            {projectDialogArrangement?.submitBtnLabel}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
