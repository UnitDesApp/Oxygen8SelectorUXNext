import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes, { number } from 'prop-types';
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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useApiContext } from 'src/contexts/ApiContext';
import { useGetOutdoorInfo } from 'src/hooks/useApi';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { getRandomNumber } from 'src/utils/referenceNumber';
import { isInCurrentMonth } from 'src/utils/date';
import { userInfo } from 'os';

type NewProjectDialogProps = {
  open: boolean;
  onClose: Function;
  setOpenSuccess: Function;
  setOpenFail: Function;
  initialInfo: any;
  refetch: Function;
  projectList: any[];
};

export default function NewProjectDialog({
  open,
  onClose,
  setOpenSuccess,
  setOpenFail,
  initialInfo,
  refetch,
  projectList,
}: NewProjectDialogProps) {
  const api = useApiContext();
  const [step, setStep] = useState(0);

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
    ddlCountry: Yup.string().required('Please select a County'),
    ddlProvState: Yup.string().required('Please select a Province / State'),
    ddlCity: Yup.number().required('Please select a City'),
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
      txbJobName: '',
      ddlBasisOfDesign: 0,
      txbReferenceNo: '0',
      txbRevisionNo: '0',
      ddlCompanyName: 0,
      txbCompanyName: '',
      ddlCompanyContactName: 0,
      txbCompanyContactName: '',
      ddlApplication: 0,
      ddlUoM: 0,
      ddlCountry: '',
      ddlProvState: '',
      ddlCity: 0,
      ddlAshareDesignConditions: 0,
      txbAltitude: '0',
      txbSummerOA_DB: 95,
      txbSummerOA_WB: 78,
      txbSummerOA_RH: 47.3,
      txbWinterOA_DB: 35,
      txbWinterOA_WB: 33,
      txbWinterOA_RH: 81.9,
      txbSummerRA_DB: 75,
      txbSummerRA_WB: 63,
      txbSummerRA_RH: 51.17,
      txbWinterRA_DB: 70,
      txbWinterRA_WB: 52.9,
      txbWinterRA_RH: 30,
      ckbTestNewPrice: 0,
    }),
    []
  );

  const methods = useForm({ resolver: yupResolver(NewUserSchema), defaultValues,});

  const {
    setValue,
    watch,
    getValues,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;


  // ------------------------- Form Current Selected Values --------------------------
  const formValues = watch();  // watch()
  const today = new Date();

  // const companyNameInfo = useEffect(() => {
  //   const selUser = usersInfo?.filter((e: any) => e.id === Number(localStorage.getItem('userId')));
  //   let companyList;

  //   switch(Number(localStorage.getItem('UAL'))) {
  //     case Ids?.intUAL_Admin:
  //     case Ids.intUAL_IntAdmin:
  //     case Ids.intUAL_IntLvl_2:
  //     case Ids.intUAL_IntLvl_1:
  //        companyList = companyInfo?.filter((e: any) => e.id === Number(selUser?.[0]?.customer_id));
  //       break;
  //     case Ids.intUAL_External:
  //     case Ids.intUAL_ExternalSpecial:
  //       companyList = companyInfo;
  //        break;
  //     default:
  //       break;
  //   }

  //   setValue('ddlCompanyName', companyList?.[0]?.id || '');
  //   return companyList;
  // },[companyInfo, setValue, usersInfo]);


  const UalInfo = useMemo(() => {
    const info: { 
      isDisabled: boolean;
    } = { 
      isDisabled: true,
    };

    switch(Number(localStorage.getItem('UAL'))) {
      case Ids.intUAL_Admin:
      case Ids.intUAL_IntAdmin:
      case Ids.intUAL_IntLvl_2:
      case Ids.intUAL_IntLvl_1:
        info.isDisabled=false;
        break;
      case Ids.intUAL_External:
      case Ids.intUAL_ExternalSpecial:
        info.isDisabled=true;
         break;
      default:
        break;
    }
 
    return info;
  },[]);





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



  const getJobInputs = () => {
    // const jsonData = '{"name":"John", "age":30, "city":"London"}';
    // let oUnitInputs;
    const formCurrValues = getValues(); // Do not use watch, must use getValues with the function to get current values.
    
    const oJobInputs = {
        oJob: {
          "intJobId" : -1,
          "intCreatedUserId" : localStorage.getItem('userId'),
          "intRevisedUserId" : localStorage.getItem('userId'),
          "strJobName" : formCurrValues.txbJobName,
          "intBasisOfDesignId" : formCurrValues.ddlBasisOfDesign,
          "strReferenceNo" :  formCurrValues.txbReferenceNo ,
          "intRevisionNo" : formCurrValues.txbRevisionNo,
          "intCompanyNameId" : formCurrValues.ddlCompanyName,
          "strCompanyName" : '',
          "intCompanyContactNameId" : formCurrValues.ddlCompanyContactName,
          "strCompanyContactName" : '',
          "intApplicationId" : formCurrValues.ddlApplication,
          "strApplicationOther" : '',
          "intUoMId" : formCurrValues.ddlUoM,
          "intDesignConditionsId" : formCurrValues.ddlAshareDesignConditions,
          "strCountry" : formCurrValues.ddlCountry,
          "strProvState" : formCurrValues.ddlProvState,
          "intCityId" : formCurrValues.ddlCity,
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
          "strCreatedDate" : localStorage.getItem('createdDate'),
          "strRevisedDate" : `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
          "intIsTestNewPrice" : Number(formCurrValues.ckbTestNewPrice) === 1 ? 1 : 0,  // Do not use formValues.ckbHeatPumpVal === true 
        },
       }
  
    return oJobInputs;
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
      try {
        const oJC: any = getJobInputs();  // JC: Job Container       
        await api.project.addNewProject(oJC);
      setOpenSuccess();
      refetch();
      reset(defaultValues);
      setStep(0);
      onClose();
    } catch (error) {
      setOpenFail();
    }
  };

  const onClickedBackBtn = () => {
    if (step === 1) {
      setStep(0);
    }

    if (step === 0) {
      onClose();
    }
  };


  const onContinueBtnClicked = () => {
    handleSubmit(() => {});
    if (formValues.txbJobName === '') return;
    if (formValues.txbReferenceNo === '' || formValues.txbReferenceNo === '0') return;
    // if (formValues.txbCompanyName === '') return;
    if (formValues.txbRevisionNo === '' || formValues.txbRevisionNo === '0') return;
    setStep(1);
  };

  
  const handleClose = () => onClose && onClose();


  const { data: outdoorInfo } = useGetOutdoorInfo(
    {
      action: 'GET_ALL_DATA',
      country: formValues.ddlCountry,
      cityId: formValues.ddlCity,
      designCondition: formValues.ddlAshareDesignConditions,
    },
    {
      enabled: !!formValues.ddlCountry && !!formValues.ddlCity && !!formValues.ddlAshareDesignConditions,
    }
  );

  useEffect(() => {
    if (outdoorInfo) {
      setValue('txbAltitude', outdoorInfo.altitude);
      setValue('txbSummerOA_DB', outdoorInfo.summerOutdoorAirDB);
      setValue('txbSummerOA_WB', outdoorInfo.summerOutdoorAirWB);
      setValue('txbSummerOA_RH', outdoorInfo.summerOutdoorAirRH);
      setValue('txbWinterOA_DB', outdoorInfo.winterOutdoorAirDB);
      setValue('txbWinterOA_WB', outdoorInfo.winterOutdoorAirWB);
      setValue('txbWinterOA_RH', outdoorInfo.winterOutdoorAirRH);
    }
  }, [outdoorInfo, setValue]);


  const get_RH_By_DBWB = useCallback(
    (first: number, second: number, setValueId: any) => {
      if (!!first || !!second) return;
      api.project
        .getOutdoorInfo({
          action: 'GET_RH_BY_DB_WB',
          first,
          second,
          altitude: formValues.txbAltitude,
        })
        .then((data: any) => {
          setValue(setValueId, data as never);
        });
    },
    [api.project, setValue, formValues.txbAltitude]
  );



//   const get_RH_By_DBWB = useCallback((DB: number, WB: number) => {
//     if (!!DB || !!WB) return;
//     let RH = number;

//     RH = api.project.getOutdoorInfo({
//       action: 'GET_RH_BY_DB_WB',
//       DB,
//       WB,
//       altitude: formValues.txbAltitude,
//     })
  
//     return RH;

//   },[api.project, formValues.txbAltitude]
// );


  // get WB value from server
  const get_WB_By_DBRH = useCallback(
    (first: number, second: number, setValueId: any) => {
      if (!!first || !!second) return;
      api.project
        .getOutdoorInfo({
          action: 'GET_WB_BY_DB_HR',
          first,
          second,
          altitude: formValues.txbAltitude,
        })
        .then((data: any) => {
          setValue(setValueId, data as never);
        });
    },
    [setValue, formValues.txbAltitude, api.project]
  );



  const weatherDataCountryInfo = useMemo(() => {
    const dtSelCountry = dbtWeatherData.map((e: any) => 
      e.country,)?.filter((v:any, i:any, e: any) => e.indexOf(v) === i);
    // setValue('ddlCountry', dtSelCountry?.[0]?.country);
    setValue('ddlCountry', String(dtSelCountry?.[0]));

    return dtSelCountry;
  }, [dbtWeatherData, setValue]);


  const weatherDataProvStateInfo = useMemo(() => {
    let dtSelProvState = dbtWeatherData.filter((e: any) => e.country === getValues('ddlCountry'));
    dtSelProvState = dtSelProvState?.map((e: any) => e.prov_state)?.filter((v:any, i:any, e: any) => e.indexOf(v) === i);
    setValue('ddlProvState', dtSelProvState?.[0]); // Set this to trigger the event for next dropdown - ddlState
   
    return dtSelProvState;
  }, [dbtWeatherData, getValues, setValue]);


  const weatherDataCityInfo = useMemo(() => {
    let dtSelCity = dbtWeatherData.filter((e: any) => e.country === getValues('ddlCountry'));
    dtSelCity = dtSelCity.filter((e: any) => e.prov_state === getValues('ddlProvState'));
    setValue('ddlCity', dtSelCity?.[0]?.id); // Set this to trigger the next event

    return dtSelCity;
  }, [dbtWeatherData, getValues, setValue]);



  const weatherDataStationData = useMemo(() => {
    const dtSelStation = dbtWeatherData?.filter((e: { id: number }) => e.id === Number(getValues('ddlCity')));

    setValue('txbAltitude', dtSelStation?.[0]?.elevation_foot);

    switch(Number(getValues('ddlAshareDesignConditions'))){
      case 1:
        setValue('txbSummerOA_DB', dtSelStation?.[0]?.cooling_db010);
        setValue('txbSummerOA_WB', dtSelStation?.[0]?.cooling_wb_db010);
        setValue('txbWinterOA_DB', dtSelStation?.[0]?.heating_db990);
        break;
      case 2:
        setValue('txbSummerOA_DB', dtSelStation?.[0]?.cooling_db004);
        setValue('txbSummerOA_WB', dtSelStation?.[0]?.cooling_wb_db004);
        setValue('txbWinterOA_DB', dtSelStation?.[0]?.heating_db996);
        break;
        default:
          break;
    }

    switch(getValues('ddlCountry')){
      case 'CAN':
        setValue('txbWinterOA_WB', getValues('txbWinterOA_DB') - 2);
        break;
      case 'USA':
        setValue('txbWinterOA_WB', getValues('txbWinterOA_DB') - 0.1);
        break;
        default:
          break;
    }

    get_RH_By_DBWB(getValues('txbSummerOA_DB'), getValues('txbSummerOA_WB'), 'txbSummerOA_RH');
    // setValue('txbSummerOA_RH', Number(SummerOA_RH));
    get_RH_By_DBWB(getValues('txbSummerOA_DB'), getValues('txbSummerOA_WB'), 'txbWinterOA_RH');
    // setValue('txbWinterOA_RH', Number(WinterOA_RH));


    return dtSelStation;
  }, [dbtWeatherData, setValue, getValues, get_RH_By_DBWB]);


  // const ddlCountryOnChange = useCallback(
  //   (e: any) => setValue('ddlCountry', e.target.value),
  //   [setValue]
  // );


  const handleChangeSummerOutdoorAirDBChanged = useCallback(
    (e: any) => {
      setValue('txbSummerOA_DB', e.target.value);
      get_RH_By_DBWB(formValues.txbSummerOA_DB, formValues.txbSummerOA_WB, 'txbSummerOA_RH');
    },
    [get_RH_By_DBWB, setValue, formValues.txbSummerOA_DB, formValues.txbSummerOA_WB]
  );

  // Summer Outdoor Air WB
  const handleChangeSummerOutdoorAirWBChanged = useCallback(
    (e: any) => {
      setValue('txbSummerOA_WB', e.target.value);
      get_RH_By_DBWB(formValues.txbSummerOA_DB, formValues.txbSummerOA_WB, 'txbSummerOA_RH');
    },
    [get_RH_By_DBWB, formValues.txbSummerOA_DB, formValues.txbSummerOA_WB, setValue]
  );

  // Summer Outdoor Air RH
  const handleChangeSummerOutdoorAirRHChanged = useCallback(
    (e: any) => {
      setValue('txbSummerOA_RH', e.target.value);
      get_WB_By_DBRH(formValues.txbSummerOA_DB, formValues.txbSummerOA_RH, 'txbsummer_air_wb');
    },
    [get_WB_By_DBRH, setValue, formValues.txbSummerOA_DB, formValues.txbSummerOA_RH]
  );

  // Winter Outdoor Air DB
  const handleChangeWinterOutdoorAirDBChanged = useCallback(
    (e: any) => {
      setValue('txbWinterOA_DB', e.target.value);
      get_RH_By_DBWB(formValues.txbWinterOA_DB, formValues.txbWinterOA_WB, 'txbWinterOA_RH');
    },
    [get_RH_By_DBWB, setValue, formValues.txbWinterOA_DB, formValues.txbWinterOA_WB]
  );

  // Winter Outdoor Air WB
  const handleChangeWinterOutdoorAirWBChanged = useCallback(
    (e: any) => {
      setValue('txbWinterOA_WB', e.target.value);
      get_RH_By_DBWB(formValues.txbWinterOA_DB, formValues.txbWinterOA_WB, 'txbWinterOA_RH');
    },
    [get_RH_By_DBWB, setValue, formValues.txbWinterOA_DB, formValues.txbWinterOA_WB]
  );

  // Winter Outdoor Air RH
  const handleChangeWinterOutdoorAirRHChanged = useCallback(
    (e: any) => {
      setValue('txbWinterOA_RH', e.target.value);
      get_WB_By_DBRH(formValues.txbWinterOA_DB, formValues.txbWinterOA_RH, 'txbWinterOA_WB');
    },
    [get_WB_By_DBRH, setValue, formValues.txbWinterOA_DB, formValues.txbWinterOA_RH]
  );

  // Summer Return Air DB
  const handleChangeSummerReturnAirDBChanged = useCallback(
    (e: any) => {
      setValue('txbSummerRA_DB', e.target.value);
      get_RH_By_DBWB(formValues.txbSummerRA_DB, formValues.txbSummerRA_WB, 'txbSummerRA_RH');
    },
    [get_RH_By_DBWB, setValue, formValues.txbSummerRA_DB, formValues.txbSummerRA_WB]
  );

  // Summer Return Air WB
  const handleChangeSummerReturnAirWBChanged = useCallback(
    (e: any) => {
      setValue('txbSummerRA_WB', e.target.value);
      get_RH_By_DBWB(formValues.txbSummerRA_DB, formValues.txbSummerRA_WB, 'txbSummerRA_RH');
    },
    [get_RH_By_DBWB, setValue, formValues.txbSummerRA_DB, formValues.txbSummerRA_WB]
  );

  // Summer Return Air RH
  const handleChangeSummerReturnAirRHChanged = useCallback(
    (e: any) => {
      setValue('txbSummerRA_RH', e.target.value);
      get_WB_By_DBRH(formValues.txbSummerRA_DB, formValues.txbSummerRA_RH, 'txbSummerRA_WB');
    },
    [get_WB_By_DBRH, setValue, formValues.txbSummerRA_DB, formValues.txbSummerRA_RH]
  );

  // Winter Return Air DB
  const handleChangeWinterReturnAirDBChanged = useCallback(
    (e: any) => {
      setValue('txbWinterRA_DB', e.target.value);
      get_RH_By_DBWB(formValues.txbWinterRA_DB, formValues.txbWinterRA_WB, 'txbWinterRA_RH');
    },
    [get_RH_By_DBWB, setValue, formValues.txbWinterRA_DB, formValues.txbWinterRA_WB]
  );

  // Winter Return Air WB
  const handleChangeWinterReturnAirWBChanged = useCallback(
    (e: any) => {
      setValue('txbWinterRA_WB', e.target.value);
      get_RH_By_DBWB(formValues.txbWinterRA_DB, formValues.txbWinterRA_WB, 'txbWinterRA_RH');
    },
    [get_RH_By_DBWB, setValue, formValues.txbWinterRA_DB, formValues.txbWinterRA_WB]
  );

  // Winter Return Air RH
  const handleChangeWinterReturnAirRHChanged = useCallback(
    (e: any) => {
      setValue('txbWinterRA_RH', e.target.value);
      get_WB_By_DBRH(formValues.txbWinterRA_DB, formValues.txbWinterRA_RH, 'txbWinterRA_WB');
    },
    [get_WB_By_DBRH, setValue, formValues.txbWinterRA_DB, formValues.txbWinterRA_RH]
  );



  const contactInfo = useMemo(() => {
    const contacts = dbtUsers?.filter((item: any) => Number(item.customer_id) === Number(formValues.ddlCompanyName));

    if (contacts?.length > 0) {
          setValue('ddlCompanyContactName', contacts?.[0]?.id || '');
    }
    else{
      setValue('txbCompanyContactName', '');
      setValue('ddlCompanyContactName', 0);
    }

    // if (!contacts || contacts?.length === 0) {
    //   setValue('txbContactName', '');
    //   setValue('ddlContactName', 0);
    // }

    return contacts;
  }, [setValue, dbtUsers, formValues.ddlCompanyName]);


  const setValueWithCheck = useCallback(
    (e: any, key: any) => {
      if (e.target.value === '') {
        setValue(key, '');
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
    reset(defaultValues);

    setValue('ddlAshareDesignConditions', dbtWeatherDesignConditions?.[0].id);

    const dtSelUser = dbtUsers?.filter((e: any) => e.id === Number(localStorage.getItem('userId')));
    let companyList;

    switch(Number(localStorage.getItem('UAL'))) {
      case Ids?.intUAL_Admin:
      case Ids.intUAL_IntAdmin:
      case Ids.intUAL_IntLvl_2:
      case Ids.intUAL_IntLvl_1:
         companyList = dbtCustomer?.filter((e: any) => e.id === Number(dtSelUser?.[0]?.customer_id));
        break;
      case Ids.intUAL_External:
      case Ids.intUAL_ExternalSpecial:
        companyList = dbtCustomer;
         break;
      default:
        break;
    }

    setValue('ddlCompanyName', companyList?.[0]?.id || 0);

    
  }, [defaultValues, projectList, reset, dbtCustomer, setValue, dbtUsers, contactInfo, dbtWeatherDesignConditions, dbtWeatherData, formValues.ddlCountry, weatherDataCountryInfo]);
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{!step ? 'Create New Project' : 'Design conditions'}</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {!step ? (
            <Card sx={{ p: 3 }}>
              <Box sx={{ minWidth: '500px', display: 'grid', rowGap: 3, columnGap: 2 }}>
                <RHFTextField size="small" name="txbJobName" label="Project Name" />
                <RHFSelect
                  native
                  size="small"
                  name="ddlBasisOfDesign"
                  label="Basis of Design"
                  placeholder="Basis of Design"
                  onChange={(e: any) => setValue('ddlBasisOfDesign', Number(e.target.value))}
                >
                  {/* <option value="" /> */}
                  {/* {['Budget', 'Basic of Design', 'Non-Basic of Design'].map(
                    (option: string, index: number) => (
                      <option key={`${index}basisOfDesign`} value={index + 2}>
                        {option}
                      </option>
                    )
                  )} */}
                  {dbtBasisOfDesign?.map((option: any) => (
                    <option key={option.items} value={option.id}>
                      {option.items}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextField 
                  size="small" 
                  name="txbReferenceNo" 
                  label="Reference #" 
                  />
                <RHFTextField 
                  size="small" 
                  type="number" 
                  name="txbRevisionNo" 
                  label="Revision #"
                  onChange={(e: any) => {setValueWithCheck(e, 'txbRevisionNo');}}
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
                  {dbtCustomer?.map((info: any, index: number) => (
                    <option key={index} value={info.id}>
                      {info.name}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect
                  native
                  size="small"
                  name="ddlCompanyContactName"
                  label="Contact Name"
                  placeholder=""
                  disabled= {UalInfo.isDisabled}
                  onChange={handleChangeContactName}
                >
                  {/* <option value="" /> */}
                  {contactInfo && contactInfo?.length > 0 ? (
                    contactInfo?.map((info: any, index: number) => (
                      <option key={index} value={info.id}>
                        {`${info.first_name} ${info.last_name}`}
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
                  {dbtApplication?.map((option: any) => (
                    <option key={option.items} value={option.id}>
                      {option.items}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect 
                  native size="small" 
                  name="ddlUoM" 
                  label="UoM" 
                  placeholder=""
                  onChange={(e: any) => setValue('ddlUoM', Number(e.target.value))}
                  >
                  {/* <option value="" /> */}
                  {dbtUoM?.map((info: any, index: number) => (
                    <option key={index} value={info.id}>
                      {info.items}
                    </option>
                  ))}
                </RHFSelect>
              </Box>
            </Card>
          ) : (
            <Card sx={{ p: 3 }}>
              <Box sx={{ minWidth: '500px', display: 'grid', rowGap: 3, columnGap: 2 }}>
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
                    // onChange={ddlCountryOnChange}
                  >
                    {/* <option value="0" id='Select' /> */}
                    {/* {weatherData?.map((option: any) => ( */}
                    {weatherDataCountryInfo.dtSelCountry?.map((option: any) => (
                      <option key={`${option}`} value={option}>
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
                  >
                    {/* <option value="" /> */}
                    {weatherDataProvStateInfo?.map((option: any) => (
                      <option key={`${option}`} value={option}>
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
                  >
                    {/* <option value="" /> */}
                    {weatherDataCityInfo?.map((option: any) => (
                      <option key={`${option.id}`} value={option.id}>
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
                    {dbtWeatherDesignConditions?.map((option: any) => (
                      <option key={`${option.id}`} value={option.id}>
                        {option.items}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFTextField 
                    type="number" 
                    size="small" 
                    name="txbAltitude" 
                    label="Altitude(ft)"
                    onChange={(e: any) => {setValueWithCheck(e, 'txbAltitude');}}
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
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbSummerOA_DB');}}
                    onBlur={handleChangeSummerOutdoorAirDBChanged}
                  />
                  <RHFTextField
                    type="number"
                    size="small"
                    name="txbWinterOA_DB"
                    label="Winter Outdoor Air DB (F)"
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbWinterOA_DB');}}
                    onBlur={handleChangeWinterOutdoorAirDBChanged}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                <RHFTextField
                    type="number"
                    size="small"
                    name="txbSummerOA_WB"
                    label="Summer Outdoor Air WB (F)"
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbSummerOA_WB');}}
                    onBlur={handleChangeSummerOutdoorAirWBChanged}
                  />
                  <RHFTextField
                    type="number"
                    size="small"
                    name="txbWinterOA_WB"
                    label="Winter Outdoor Air WB (F)"
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbWinterOA_WB');}}
                    onBlur={handleChangeWinterOutdoorAirWBChanged}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                <RHFTextField
                    type="number"
                    size="small"
                    name="txbSummerOA_RH"
                    label="Summer Outdoor Air RH (%)"
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbSummerOA_RH');}}
                    onBlur={handleChangeSummerOutdoorAirRHChanged}
                  />
                  <RHFTextField
                    type="number"
                    size="small"
                    name="txbWinterOA_RH"
                    label="Winter Outdoor Air RH (%)"
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbWinterOA_RH');}}
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
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbSummerRA_DB');}}
                    onBlur={handleChangeSummerReturnAirDBChanged}
                  />
                  <RHFTextField
                    type="number"
                    size="small"
                    name="txbWinterRA_DB"
                    label="Winter Return Air DB (F)"
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbWinterRA_DB');}}
                    onBlur={handleChangeWinterReturnAirDBChanged}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                <RHFTextField
                    type="number"
                    size="small"
                    name="txbSummerRA_WB"
                    label="Summer Return Air WB (F)"
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbSummerRA_WB');}}
                    onBlur={handleChangeSummerReturnAirWBChanged}
                  />
                  <RHFTextField
                    type="number"
                    size="small"
                    name="txbWinterRA_WB"
                    label="Winter Return Air WB (F)"
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbWinterRA_WB');}}
                    onBlur={handleChangeWinterReturnAirWBChanged}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                <RHFTextField
                    type="number"
                    size="small"
                    name="txbSummerRA_RH"
                    label="Summer Return Air RH (%)"
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbSummerRA_RH');}}
                    onBlur={handleChangeSummerReturnAirRHChanged}
                  />
                  <RHFTextField
                    type="number"
                    size="small"
                    name="txbWinterRA_RH"
                    label="Winter Return Air RH (%)"
                    onChange={(e: any) => {setValueWithCheck1(e, 'txbWinterRA_RH');}}
                    onBlur={handleChangeWinterReturnAirRHChanged}
                  />
                </Stack>
              </Box>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickedBackBtn}>{!step ? 'Cancel' : 'Back'}</Button>
          <LoadingButton
            type={!step ? 'button' : 'submit'}
            variant="contained"
            onClick={
              step === 0
                ? onContinueBtnClicked
                : () => {
                    console.log(getValues());
                  }
            }
            loading={isSubmitting}
          >
            {!step ? 'Continue' : 'Create project'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
