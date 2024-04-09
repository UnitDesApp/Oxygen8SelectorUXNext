/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  // Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
  // colors,
  // Collapse,
} from '@mui/material';
// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { unitEditFormSchema, useGetDefaultValue } from 'src/hooks/useUnit';
import * as IDs from 'src/utils/ids';
import { useAuthContext } from 'src/auth/useAuthContext';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify';
import { RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useApiContext } from 'src/contexts/ApiContext';
import { any, number } from 'prop-types';
import {
  getBypass,
  getComponentInfo,
  getCustomInputsInfo,
  getDXCoilRefrigDesignCondInfo,
  getDamperAndActuatorInfo,
  getDehumidificationInfo,
  getDrainPanInfo,
  getElecHeaterVoltageInfo,
  getExhaustAirESP,
  getHandingInfo,
  getHeatElecHeaterInstallationInfo,
  getHeatPumpInfo,
  getHeatingFluidTypeInfo,
  getHeatingFluidConcenInfo,
  getCoolingFluidTypeInfo,
  getCoolingFluidConcenInfo,
  getItemsAddedOnIDDataTable,
  getLocation,
  getOrientation,
  getPreheatElecHeaterInstallationInfo,
  getReheatInfo,
  getRemainingOpeningsInfo,
  getSummerReturnAirCFM,
  getSummerSupplyAirCFM,
  getSupplyAirESPInfo,
  getSupplyAirOpeningInfo,
  getUALInfo,
  getUnitModel,
  getUnitVoltage,
  getValveAndActuatorInfo,
} from './handleUnitModel';
import { getUnitModelCodes } from './getUnitNoteCodes';


//------------------------------------------------
type UnitInfoFormProps = {
  projectId: number;
  unitId?: number;
  intProductTypeID: number;
  intUnitTypeID: number;
  setIsSavedUnit?: Function;
  isSavedUnit?: boolean;
  setFunction?: Function;
  edit?: boolean;
  unitInfo?: any;
  baseData?: any;
  onSuccess?: Function;
  onError?: Function;
  txbProductType?: string;
  txbUnitType?: string;
};



export default function UnitInfoForm({
  projectId,
  unitId,
  setIsSavedUnit,
  isSavedUnit,
  setFunction,
  edit = false,
  unitInfo,
  baseData,
  onSuccess,
  onError,
  intProductTypeID,
  intUnitTypeID,
  txbProductType,
  txbUnitType,
}: UnitInfoFormProps) {
  const api = useApiContext();
  const [isLoading, setIsLoading] = useState(true);
  const [remainingOpeningsInfo, setRemainingOpeningsInfo] = useState<any>({});
  const isResetCalled = useRef(false);
  const user = useAuthContext();

  // ------------------------------- Checkbox State -----------------------------------
  const [ckbBypass, setCkbBypassVal] = useState(false);
  // const [ckbDrainPanVal, setCkbDrainPanVal] = useState(false);
  // const [ckbVoltageSPPVal, setCkbVoltageSPPVal] = useState(false);
  // const [ckbDehumidificationVal, setCkbDehumidificationVal] = useState(false);
  // const [ckbValveAndActuatorVal, setCkbValveAndActuatorVal] = useState(false);
  // const [ckbHeatPumpVal, setCkbHeatPumpVal] = useState(false);
  // const [ckbDownshotVal, setCkbDownshotVal] = useState(false);
  // const [ckbCoolingCWCUseCap, setckbCoolingCWCUseCap = useState({
  //   ckbPreheatHWC_UseCap: false,
  //   ckbPreheatHWC_UseFlowRate: false,
  //   ckbCoolingCWC_UseCap: false,
  //   ckbCoolingCWC_UseFlowRate: false,
  //   ckbHeatingHWC_UseCap: false,
  //   ckbHeatingHWC_UseFlowRate: false,
  //   ckbReheatHWC_UseCap: false,
  //   ckbReheatHWC_UseFlowRate: false,
  // });
  // const [ckbCoolingCWCUseCap, setCkbCoolingCWCUseCap] = useState(false);


  // ------------------------- Initialize Checkbox Values -----------------------------
  useEffect(() => {
    if (edit) {
      // setCkbBypassVal(!!unitInfo?.ckbBypassVal);
      // setCkbDrainPanVal(!!unitInfo?.ckbDrainPanVal);
      // setCkbVoltageSPPVal(!!unitInfo?.ckbVoltageSPPVal);
      // setCkbDehumidificationVal(!!unitInfo?.ckbDehumidificationVal);
      // setCkbValveAndActuatorVal(!!unitInfo?.ckbValveAndActuatorVal);
      // setCkbHeatPumpVal(!!unitInfo?.ckbHeatPumpVal);
      // setCkbDownshotVal(!!unitInfo?.ckbDownshot?.isDownshot);
      // setCkbFlowRateAndCap({
      //   ckbPreheatHWC_UseCap: false,
      //   ckbPreheatHWC_UseFlowRate: false,
      //   ckbCoolingCWC_UseCap: false,
      //   ckbCoolingCWC_UseFlowRate: false,
      //   ckbHeatingHWC_UseCap: false,
      //   ckbHeatingHWC_UseFlowRate: false,
      //   ckbReheatHWC_UseCap: false,
      //   ckbReheatHWC_UseFlowRate: false,
      // });
    }
  }, [
    edit,
    unitInfo?.ckbBypassVal,
    unitInfo?.ckbDehumidificationChecked,
    unitInfo?.ckbDehumidificationVal,
    unitInfo?.ckbDownshot?.isDownshot,
    unitInfo?.ckbDrainPanVal,
    unitInfo?.ckbHeatPumpVal,
    unitInfo?.ckbValveAndActuatorVal,
    unitInfo?.ckbVoltageSPPVal,
  ]);

  // -------------------------  Accordion Pannel State -----------------------------
  const [expanded, setExpanded] = useState({
    panel1: true,
    panel2: true,
    panel3: true,
    panel4: true,
    panel5: true,
    panel6: true,
    panel7: true,
    panel8: true,
  });

  // ---------------------- Initalize Default Values ---------------------
  const defaultValues = useGetDefaultValue(edit, unitInfo, baseData);
  

  // ---------------- Initalize Form with default values -----------------
  const methods = useForm({
    resolver: yupResolver(unitEditFormSchema),
    defaultValues,
  });

  // -------------------------- Form Methods -----------------------------
  const {
    setValue,
    getValues,
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  console.log(errors);

  useEffect(() => {
    if (!isLoading && !isResetCalled.current) {
      reset(defaultValues);
      isResetCalled.current = true;
    }
  }, [isLoading, reset, defaultValues]);

  // ------------------------- Form State Values --------------------------
  const values = watch();

 

  /*
   * Style functions that check if the compoment should be displayed or not
   */
  const getDisplay = useCallback((key: boolean) => ({ display: key ? 'block' : 'none' }), []);
  const getInlineDisplay = useCallback(
    (key: boolean) => ({ display: key ? 'inline-flex' : 'none' }),
    []
  );

  // -------------------- Get All Unit Information --------------------------
  const getAllFormData = useCallback(
    () => ({
      ...getValues(),
      intProjectID: projectId,
      intUnitNo: edit ? unitId : 0,
      intProductTypeID,
      intUnitTypeID,
      ddlUnitTypeId: intUnitTypeID,
      intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
      intUserID: typeof window !== 'undefined' && localStorage.getItem('userId'),
      // ckbBypassVal,
      // ckbDrainPanVal,
      // ckbVoltageSPPVal,
      // ckbDehumidificationVal,
      // ckbValveAndActuatorVal,
      // ckbHeatPumpVal,
      // ckbDownshotVal,
      // ...ckbFlowRateAndCap,
    }),
    [
      getValues,
      projectId,
      edit,
      unitId,
      intProductTypeID,
      intUnitTypeID,
      // ckbBypassVal,
      // ckbDrainPanVal,
      // ckbVoltageSPPVal,
      // ckbDehumidificationVal,
      // ckbValveAndActuatorVal,
      // ckbHeatPumpVal,
      // ckbDownshotVal,
      // ckbFlowRateAndCap,
    ]
  );


  // const oUC = {
  //  }

  // const formValues = getValues();



   const getUnitInputs = () => {
    // const jsonData = '{"name":"John", "age":30, "city":"London"}';
    // let oUnitInputs;
    const formValues = getValues();
    
    const oUnitInputs = {
        oUser: {
          "intUserId" : typeof window !== 'undefined' && localStorage.getItem('userId'),
          "intUAL": typeof window !== 'undefined' && localStorage.getItem('UAL')
        },
        oUnit: {
          "intJobId" : projectId,
          "intUnitNo" : edit ? unitId : 0,
          "intProdTypeId" : intProductTypeID,
          "intUnitTypeId" : intUnitTypeID,
          "strTag" :  formValues.txtTag ,
          "intQty" : formValues.txbQty,
          "intUnitVoltageId" : formValues.ddlUnitVoltageId,
          "intIsPHI" : 0,
          "intIsBypass" : 0,
          "intUnitModelId" : formValues.ddlUnitModelId,
          "intSelectionTypeId" : 0,
          "intLocationId" : formValues.ddlLocationId,
          "intIsDownshot" : 0,
          "intOrientationId" : formValues.ddlOrientationId,
          "intControlsPreferenceId" : formValues.ddlControlsPreferenceId,
          "intControlViaId" : 0,
        },
        oUnitAirflow : {
          "intJobId" : projectId,
          "intUnitNo" : edit ? unitId : 0,
          "intProdTypeId" : intProductTypeID,
          "intUnitTypeId" : intUnitTypeID,
          "intAltitude" : formValues.ddlUnitVoltageId,
          "intSummerSupplyAirCFM" : formValues.txbSummerSupplyAirCFM,
          "intSummerReturnAirCFM" : formValues.txbSummerReturnAirCFM,
          "intWinterSupplyAirCFM" : formValues.txbSummerSupplyAirCFM,
          "intWinterReturnAirCFM" : formValues.txbSummerReturnAirCFM,
          "dblSummerOutdoorAirDB" : formValues.txbSummerOutdoorAirDB,
          "dblSummerOutdoorAirWB" : formValues.txbSummerOutdoorAirWB,
          "dblSummerOutdoorAirRH" : formValues.txbSummerOutdoorAirRH,
          "dblWinterOutdoorAirDB" : formValues.txbWinterOutdoorAirDB,
          "dblWinterOutdoorAirWB" : formValues.txbWinterOutdoorAirWB,
          "dblWinterOutdoorAirRH" : formValues.txbWinterOutdoorAirRH,
          "dblSummerReturnAirDB" : formValues.txbSummerReturnAirDB,
          "dblSummerReturnAirWB" : formValues.txbSummerReturnAirWB,
          "dblSummerReturnAirRH" : formValues.txbSummerReturnAirRH,
          "dblWinterReturnAirDB" : formValues.txbWinterReturnAirDB,
          "dblWinterReturnAirWB" : formValues.txbWinterReturnAirWB,
          "dblWinterReturnAirRH" : formValues.txbWinterReturnAirRH,
          "dblSupplyAirESP" : formValues.txbSupplyAirESP,
          "dblExhaustAirESP" : formValues.txbExhaustAirESP,
        },
        oUnitCompOpt : {
          "intJobId" : projectId,
          "intUnitNo" : edit ? unitId : 0,
          "intProdTypeId" : intProductTypeID,
          "intUnitTypeId" : intUnitTypeID,
          "intOAFilterModelId" : formValues.ddlOA_FilterModelId,
          "intSAFinalFilterModelId" : 0,
          "intRAFilterModelId" : formValues.ddlRA_FilterModelId,
          "intHeatExchCompId" : formValues.ddlHeatExchCompId,
          "intPreheatCompId" : formValues.ddlPreheatCompId,
          "intIsBackupHeating" : 0,
          "intCoolingCompId" : formValues.ddlCoolingCompId,
          "intHeatingCompId" : formValues.ddlHeatingCompId,
          "intReheatCompId" : formValues.ddlReheatCompId,
          "intIsHeatPump" : Number(formValues.ckbHeatPump) === 1 ? 1 : 0,  // Do not use formValues.ckbHeatPumpVal === true 
          "intIsDehumidification" : Number(formValues.ckbDehumidification) === 1 ? 1 : 0,  // Do not use formValues.ckbDehumidificationVal === true 
          "intElecHeaterVoltageId" : formValues.ddlElecHeaterVoltageId,
          "intPreheatElecHeaterInstallationId" : formValues.ddlPreheatElecHeaterInstallationId,
          "intHeatingElecHeaterInstallationId" : formValues.ddlHeatElecHeaterInstallationId,
          "intPreheatElecHeaterStdCoilNo" : 0,
          "intCoolingDX_VRVKitQty" : 0,
          "dblCoolingDX_VRVKitTonnage" : 0,
          "intHeatingElecHeaterStdCoilNo" : 0,
          "intReheatElecHeaterStdCoilNo" : 0,
          
          "intReheatHGRC_VRVKitQty" : 0,
          "dblReheatHGRC_VRVKitTonnage" : 0,
          "intDamperAndActuatorId" : formValues.ddlDamperAndActuatorId,
          "intisValveAndActuatorIncluded" : Number(formValues.ckbValveAndActuator) === 1 ? 1 : 0,
          "intPreheatHWCValveAndActuatorId" : 0,
          "intCoolingCWCValveAndActuatorId" : 0,
          "intHeatingHWCValveAndActuatorId" : 0,
          "intReheatHWCValveAndActuatorId" : 0,
          "intValveTypeId" : formValues.ddlValveTypeId,
          "intIsDrainPan" : Number(formValues.ckbDrainPan) === 1 ? 1 : 0,
          "dblOAFilterPD" : formValues.txbOA_FilterPD,
          "dblRAFilterPD" : formValues.txbRA_FilterPD,
          "dblPreheatSetpointDB" : formValues.txbWinterPreheatSetpointDB,
          "dblCoolingSetpointDB" : formValues.txbSummerCoolingSetpointDB,
          "dblCoolingSetpointWB" : formValues.txbSummerCoolingSetpointWB,
          "dblHeatingSetpointDB" : formValues.txbWinterHeatingSetpointDB,
          "dblReheatSetpointDB" : formValues.txbSummerReheatSetpointDB,
          "dblBackupHeatingSetpontDB" : 0,
          "intCoolingFluidTypeId" : formValues.ddlCoolingFluidTypeId,
          "intCoolingFluidConcentId" : formValues.ddlCoolingFluidConcentrationId,
          "dblCoolingFluidEntTemp" : formValues.txbCoolingFluidEntTemp,
          "dblCoolingFluidLvgTemp" : formValues.txbCoolingFluidLvgTemp,
          "intHeatingFluidTypeId" : formValues.ddlHeatingFluidTypeId,
          "intHeatingFluidConcentId" : formValues.ddlHeatingFluidConcentrationId,
          "dblHeatingFluidEntTemp" : formValues.txbHeatingFluidEntTemp,
          "dblHeatingFluidLvgTemp" : formValues.txbHeatingFluidLvgTemp,
          "dblRefrigSuctionTemp" : formValues.txbRefrigSuctionTemp,
          "dblRefrigLiquidTemp" : formValues.txbRefrigLiquidTemp,
          "dblRefrigSuperheatTemp" : formValues.txbRefrigSuperheatTemp,
          "dblRefrigCondensingTemp" : formValues.txbRefrigCondensingTemp,
          "dblRefrigVaporTemp" : formValues.txbRefrigVaporTemp,
          "dblRefrigSubcoolingTemp" : formValues.txbRefrigSubcoolingTemp,
          "intIsHeatExchEA_Warning" : 0,
        },
        oUnitCompOptCust : {
          "intJobId" : projectId,
          "intUnitNo" : edit ? unitId : 0,
          "intProdTypeId" : intProductTypeID,
          "intUnitTypeId" : intUnitTypeID,
          "intIsPreheatHWCUseCap" : Number(formValues.ckbPreheatHWCUseCap) === 1 ? 1 : 0,
          "dblPreheatHWCCap" : formValues.txbPreheatHWCCap,
          "intIsPreheatHWCUseFlowRate" : Number(formValues.ckbPreheatHWCUseFlowRate) === 1 ? 1 : 0,
          "dblPreheatHWCFlowRate" : formValues.txbPreheatHWCFlowRate,
          "intIsCoolingCWCUseCap" : Number(formValues.ckbCoolingCWCUseCap) === 1 ? 1 : 0,
          "dblCoolingCWCCap" : formValues.txbCoolingCWCCap,
          "intIsCoolingCWCUseFlowRate" : Number(formValues.ckbCoolingCWCUseFlowRate) === 1 ? 1 : 0,
          "dblCoolingCWCFlowRate" : formValues.txbCoolingCWCFlowRate,
          "intIsHeatingHWCUseCap" : Number(formValues.ckbHeatingHWCUseCap) === 1 ? 1 : 0,
          "dblHeatingHWCCap" : formValues.txbHeatingHWCCap,
          "intIsHeatingHWCUseFlowRate" : Number(formValues.ckbHeatingHWCUseFlowRate) === 1 ? 1 : 0,
          "dblHeatingHWCFlowRate" : formValues.txbHeatingHWCFlowRate,
          "intIsReheatHWCUseCap" : Number(formValues.ckbReheatHWCUseCap) === 1 ? 1 : 0,
          "dblReheatHWCCap" : formValues.txbReheatHWCCap,
          "intIsReheatHWCUseFlowRate" : Number(formValues.ckbReheatHWCUseFlowRate) === 1 ? 1 : 0,
          "dblReheatHWCFlowRate" : formValues.txbReheatHWCFlowRate,
        },
        oUnitLayout : {
          "intJobId" : projectId,
          "intUnitNo" : edit ? unitId : 0,
          "intProdTypeId" : intProductTypeID,
          "intUnitTypeId" : intUnitTypeID,
          "intHandingId" : formValues.ddlHandingId,
          "intPreheatCoilHandingId" : formValues.ddlPreheatCoilHandingId,
          "intCoolingCoilHandingId" : formValues.ddlCoolingCoilHandingId,
          "intHeatingCoilHandingId" : formValues.ddlHeatingCoilHandingId,
          "intSAOpeningId" : formValues.ddlSupplyAirOpeningId,
          "strSAOpening" : formValues.ddlSupplyAirOpeningText,
          "intEAOpeningId" : formValues.ddlExhaustAirOpeningId,
          "strEAOpening" : formValues.ddlExhaustAirOpeningText,
          "intOAOpeningId" : formValues.ddlOutdoorAirOpeningId,
          "strOAOpening" : formValues.ddlOutdoorAirOpeningText,
          "intRAOpeningId" : formValues.ddlReturnAirOpeningId,
          "strRAOpening" : formValues.ddlReturnAirOpeningText,
        },
       }
  
    return oUnitInputs;
  };



  // --------------------------- Submit (Save) -----------------------------
  const onSubmit = useCallback(async () => {
    try {
      // const data = await api.project.saveUnitInfo(getAllFormData1());
      // formValues = getValues();
      // const oUC = getAllFormData1(formValues);
      const oUC: any = getUnitInputs();
      const data = await api.project.saveUnitInfo(oUC);
      if (onSuccess) onSuccess(true);
      if (setIsSavedUnit) setIsSavedUnit(data?.intUnitNo || 0);
    } catch (e) {
      console.log(e);
      if (onError) onError(true);
    }
  }, [edit, onSuccess, onError, getAllFormData, setIsSavedUnit]);

  // -------------------- Get String Unit Model Codes ----------------------
  const { strUnitModelValue } = useMemo(() => {
    if (!values.ddlUnitModelId || values.ddlUnitModelId === '') return { strUnitModelValue: '' };
    let unitModel = [];

    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeNovaID:
        unitModel = baseData.novaUnitModel;
        break;
      case IDs.intProdTypeVentumID:
        unitModel = baseData.ventumHUnitModel;
        break;
      case IDs.intProdTypeVentumLiteID:
        unitModel = baseData.ventumLiteUnitModel;
        break;
      case IDs.intProdTypeVentumPlusID:
        unitModel = baseData.ventumPlusUnitModel;
        break;
      case IDs.intProdTypeTerraID:
        unitModel = baseData.terraUnitModel;
        break;
      default:
        break;
    }

    const unitModelValue = unitModel?.filter((item: any) => item.id === values.ddlUnitModelId)?.[0]?.value;

    return getUnitModelCodes(
      unitModelValue,
      intProductTypeID,
      intUnitTypeID,
      values.ddlLocationId,
      values.ddlOrientationId,
      Number(values.ckbBypass),
      baseData
    );
  }, [
    values.ckbBypass,
    baseData,
    intProductTypeID,
    intUnitTypeID,
    values.ddlLocationId,
    values.ddlOrientationId,
    values.ddlUnitModelId,
  ]);

  /* ---------------------------- Start OnChange functions ---------------------------- */
  const ddlLocationChanged = useCallback(
    (e: any) => setValue('ddlLocationId', Number(e.target.value)),
    [setValue]
  );

  const ddlOrientationChanged = useCallback(
    (e: any) => setValue('ddlOrientationId', Number(e.target.value)),
    [setValue]
  );

  const ddlUnitModelChanged = useCallback(
    (e: any) => setValue('ddlUnitModelId', Number(e.target.value)),
    [setValue]
  );

  const ddlUnitVoltageChanged = useCallback(
    (e: any) => setValue('ddlUnitVoltageId', Number(e.target.value)),
    [setValue]
  );

  const ddlPreheatCompChanged = useCallback(
    (e: any) => setValue('ddlPreheatCompId', Number(e.target.value)),
    [setValue]
  );



  const ddlCoolingCompChanged = useCallback(
    (e: any) => setValue('ddlCoolingCompId', Number(e.target.value)),
    [setValue]
  );

  const ddlHeatingCompChanged = useCallback(
    (e: any) => setValue('ddlHeatingCompId', Number(e.target.value)),
    [setValue]
  );

  const ddlReheatCompChanged = useCallback(
    (e: any) => setValue('ddlReheatCompId', Number(e.target.value)),
    [setValue]
  );

  const ddlElecHeaterVoltageChanged = useCallback(
    (e: any) => setValue('ddlElecHeaterVoltageId', Number(e.target.value)),
    [setValue]
  );

  // const ckbHeatPumpChanged = useCallback(
  //   () => setCkbHeatPumpVal(!values.ckbHeatPumpVal),
  //   [values.ckbHeatPumpVal]
  // );

  // const ckbDehumidificationChanged = useCallback(() => {
  //   setCkbDehumidificationVal(!values.ckbDehumidificationVal);
  //   console.log('ckbDehumidificationVal:', values.ckbDehumidificationVal);
  // }, [values.ckbDehumidificationVal]);


  const ddlHandingChanged = useCallback(
    (e: any) => {
      setValue('ddlHandingId', Number(e.target.value));
      setValue('ddlPreheatCoilHandingId', Number(e.target.value));
      setValue('ddlCoolingCoilHandingId', Number(e.target.value));
      setValue('ddlHeatingCoilHandingId', Number(e.target.value));
   },
    [setValue]
  );

  const ddlSupplyAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlSupplyAirOpeningId', Number(e.target.value));
      setValue('ddlSupplyAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );

  const ddlExhaustAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlExhaustAirOpeningId', Number(e.target.value));
      setValue('ddlExhaustAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );

  const ddlOutdoorAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlOutdoorAirOpeningId', Number(e.target.value));
      setValue('ddlOutdoorAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );

  const ddlReturnAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlReturnAirOpeningId', Number(e.target.value));
      setValue('ddlReturnAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );


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



  /* ---------------------------- End OnChange functions ---------------------------- */

  // ---------------------------- Check if UnitType is AHU ----------------------------
  const isUnitTypeAHU = useCallback(() => intUnitTypeID === IDs.intUnitTypeAHU_ID, [intUnitTypeID]);

  // ------------------------------- Drop Files Option --------------------------------
  const handleDrop = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'layoutImage',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  // ----------------------- Get UnitModel Dropdown List ---------------------------
  const unitModel = useMemo(() => {
    const { unitModelList, summerSupplyAirCFM } = getUnitModel(
      baseData,
      Number(intUnitTypeID),
      Number(intProductTypeID),
      Number(values.ddlUnitModelId),
      Number(values.ddlLocationId),
      Number(values.ddlOrientationId),
      values.txbSummerSupplyAirCFM,
      Number(values.ckbBypass),
      Number(user?.UAL || 0)
    );

    const filteredUnitModel = unitModelList?.filter((item: any) => item.id) || [];

    if (filteredUnitModel.length > 0) {
      setValue('ddlUnitModelId', filteredUnitModel?.[0]?.id);
    }

    if (edit){
      setValue('ddlUnitModelId', defaultValues?.ddlUnitModelId);
    }

    if (summerSupplyAirCFM && values.txbSummerSupplyAirCFM === summerSupplyAirCFM.toString()) {
      setValue('txbSummerSupplyAirCFM', summerSupplyAirCFM.toString());
    }

    return unitModelList;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    baseData,
    intUnitTypeID,
    intProductTypeID,
    values.ddlLocationId,
    values.ddlOrientationId,
    values.txbSummerSupplyAirCFM,
    values.ckbBypass,
    user?.UAL,
    setValue,
  ]);

  // ------------------------------ Get Bypass State -------------------------------
  const ckbBypassInfo = useMemo(() => {
    const result = getBypass(
      baseData,
      intProductTypeID,
      values.ddlUnitModelId,
      values.ddlOrientationId,
      Number(values.ckbBypass)
    );
    setCkbBypassVal(!!result.checked);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseData, intProductTypeID, values.ddlOrientationId, values.ddlUnitModelId]);

  // ---------------------------- Get Orientation Info -----------------------------
  const orientationInfo = useMemo(() => {
    const orientationData = getOrientation(
      baseData,
      intProductTypeID,
      intUnitTypeID,
      values.ddlLocationId,
      Number(values.txbSummerSupplyAirCFM)
    );

    if (
      orientationData?.filter((item: any) => item.id && item.id === values.ddlOrientationId)
        .length === 0
    ) {
      setValue('ddlOrientationId', orientationData?.[0]?.id || 0);
    }

    return orientationData;
  }, [
    baseData,
    intProductTypeID,
    intUnitTypeID,
    setValue,
    values.ddlLocationId,
    values.ddlOrientationId,
    values.txbSummerSupplyAirCFM,
  ]);

  // ---------------------------- Get Orientation Info -----------------------------
  const locationInfo = useMemo(() => {
    const locations = getLocation(baseData, intProductTypeID, intUnitTypeID);

    if (locations?.filter((item: any) => item.id === values.ddlLocationId)?.length === 0) {
      setValue('ddlLocationId', locations[0]?.id);
    }

    return locations;
  }, [baseData, intProductTypeID, intUnitTypeID, setValue, values.ddlLocationId]);

  // ---------------------------- Get Unit Voltage Info -----------------------------
  const unitVoltage = useMemo(() => {
    const { unitVoltageList, ddlUnitVoltageId } = getUnitVoltage(
      baseData,
      intProductTypeID,
      strUnitModelValue
    );
    if (unitVoltageList?.filter((item: any) => item.id === values.ddlUnitVoltageId)?.length === 0) {
      setValue('ddlUnitVoltageId', ddlUnitVoltageId);
    }
    return unitVoltageList;
  }, [baseData, intProductTypeID, strUnitModelValue, values.ddlUnitVoltageId, setValue]);

  // ---------------------------- Get QAFilter Model DDL -----------------------------
  const OAFilterModel = useMemo(
    () => baseData?.filterModel?.filter((item: any) => item.outdoor_air === 1),
    [baseData]
  );

  // ---------------------------- Get RAFilter Model DDL -----------------------------
  const RAFilterModel = useMemo(() => {
    const info: { 
      dataTable: any; 
    } = { 
      dataTable: any, 
    };
     
    info.dataTable =  baseData?.filterModel?.filter((item: any) => item.return_air === 1);

    return info; 
  },[baseData]);

  // ---------------------------- Initialize QAFilter Model --------------------------
  useEffect(() => {
    if ( OAFilterModel?.filter((item: any) => item?.id === values.ddlOA_FilterModelId).length === 0) {
      setValue('ddlOA_FilterModelId', OAFilterModel[0].id);
    }


  }, [setValue, OAFilterModel, values.ddlOA_FilterModelId]);

  // ---------------------------- Initialize RAFilter Model --------------------------
  useEffect(() => {
    if (RAFilterModel?.dataTable?.filter((item: any) => item?.id === values.ddlRA_FilterModelId).length === 0) {
      setValue('ddlRA_FilterModelId', RAFilterModel?.dataTable[0]?.id);
    
      if (edit){
        setValue('ddlRA_FilterModelId', defaultValues?.ddlRA_FilterModelId);
      }
    }
  }, [setValue, RAFilterModel, values.ddlOA_FilterModelId]);

  // ------------------------- Get each complete informaiton --------------------------
  const { dtPreheatComp, dtCoolingComp, dtHeatingComp } = useMemo(
    () => getComponentInfo(baseData, Number(intProductTypeID), Number(intUnitTypeID)),
    [baseData, intProductTypeID, intUnitTypeID]
  );

  const { dtReheatComp } = useMemo(
    () =>
      getReheatInfo(
        baseData,
        values.ckbDehumidification,
        Number(values.ddlCoolingCompId),
        Number(user?.UAL || 0),
        Number(intUnitTypeID),
        Number(intProductTypeID),
        Number(values.ddlUnitModelId)
      ),
    [
      values.ckbDehumidification,
      baseData,
      intProductTypeID,
      intUnitTypeID,
      user?.UAL,
      values.ddlCoolingCompId,
      values.ddlUnitModelId,
    ]
  );

  // ---------------- Get Preheat Elec Heater Installation Info --------------------
  const preheatElecHeaterInstallationInfo = useMemo(() => {
    const result = getPreheatElecHeaterInstallationInfo(
      baseData,
      Number(values.ddlPreheatCompId),
      Number(values.ddlLocationId),
      intProductTypeID
    );

    if (!edit) {
      setValue('ddlPreheatElecHeaterInstallationId',result?.ddlPreheatElecHeaterInstallationId || 1 );
    }

    return result.ddlPreheatElecHeaterInstallationDataTbl;
  }, [edit, baseData, setValue, intProductTypeID, values.ddlLocationId, values.ddlPreheatCompId]);



  const preheatHWCCapInfo = useMemo(() => {
    const info: { 
      resetCapacity: number; 
      isDisabled: boolean;
    } = { 
      resetCapacity: 0, 
      isDisabled: true,
    };
     
    if (Number(values.ckbPreheatHWCUseCap) === 0) { 
      setValue('txbPreheatHWCCap', "0"); 
      info.isDisabled=true;
    }
    else {
      info.isDisabled = false;
    }

    return info;
  }, [
    // edit,
    // baseData,
    // setValue,
    values.ckbPreheatHWCUseCap,
  ]);


  const preheatHWCFlowRateInfo = useMemo(() => {
    const info: { 
      resetCapacity: number; 
      isDisabled: boolean;
    } = { 
      resetCapacity: 0, 
      isDisabled: true,
    };
     
    if (Number(values.ckbPreheatHWCUseFlowRate) === 0) { 
      setValue('txbPreheatHWCFlowRate', "0"); 
      info.isDisabled=true;
    }
    else {
      info.isDisabled = false;
    }

    return info;
  }, [
    values.ckbPreheatHWCUseFlowRate,
  ]);


  const coolingCWCCapInfo = useMemo(() => {
    const info: { 
      resetCapacity: number; 
      isDisabled: boolean;
    } = { 
      resetCapacity: 0, 
      isDisabled: true,
    };
     
    if (Number(values.ckbCoolingCWCUseCap) === 0) { 
      setValue('txbCoolingCWCCap', "0"); 
      info.isDisabled=true;
    }
    else {
      info.isDisabled = false;
    }

    return info;
  }, [
    // edit,
    // baseData,
    // setValue,
    values.ckbCoolingCWCUseCap,
  ]);


  const coolingCWCFlowRateInfo = useMemo(() => {
    const info: { 
      resetCapacity: number; 
      isDisabled: boolean;
    } = { 
      resetCapacity: 0, 
      isDisabled: true,
    };
     
    if (Number(values.ckbCoolingCWCUseFlowRate) === 0) { 
      setValue('txbCoolingCWCFlowRate', "0"); 
      info.isDisabled=true;
    }
    else {
      info.isDisabled = false;
    }

    return info;
  }, [
    values.ckbCoolingCWCUseFlowRate,
  ]);


  const heatingHWCCapInfo = useMemo(() => {
    const info: { 
      resetCapacity: number; 
      isDisabled: boolean;
    } = { 
      resetCapacity: 0, 
      isDisabled: true,
    };
     
    if (Number(values.ckbHeatingHWCUseCap) === 0) { 
      setValue('txbHeatingHWCCap', "0"); 
      info.isDisabled=true;
    }
    else {
      info.isDisabled = false;
    }

    return info;
  }, [
    values.ckbHeatingHWCUseCap,
  ]);


  const heatingHWCFlowRateInfo = useMemo(() => {
    const info: { 
      resetCapacity: number; 
      isDisabled: boolean;
    } = { 
      resetCapacity: 0, 
      isDisabled: true,
    };
     
    if (Number(values.ckbHeatingHWCUseFlowRate) === 0) { 
      setValue('txbHeatingHWCFlowRate', "0"); 
      info.isDisabled=true;
    }
    else {
      info.isDisabled = false;
    }

    return info;
  }, [
    values.ckbHeatingHWCUseFlowRate,
  ]);


  const reheatHWCCapInfo = useMemo(() => {
    const info: { 
      resetCapacity: number; 
      isDisabled: boolean;
    } = { 
      resetCapacity: 0, 
      isDisabled: true,
    };
     
    if (Number(values.ckbReheatHWCUseCap) === 0) { 
      setValue('txbReheatHWCCap', "0"); 
      info.isDisabled=true;
    }
    else {
      info.isDisabled = false;
    }

    return info;
  }, [
    values.ckbReheatHWCUseCap,
  ]);


  const reheatHWCFlowRateInfo = useMemo(() => {
    const info: { 
      resetCapacity: number; 
      isDisabled: boolean;
    } = { 
      resetCapacity: 0, 
      isDisabled: true,
    };
     
    if (Number(values.ckbReheatHWCUseFlowRate) === 0) { 
      setValue('txbReheatHWCFlowRate', "0"); 
      info.isDisabled=true;
    }
    else {
      info.isDisabled = false;
    }

    return info;
  }, [
    values.ckbReheatHWCUseFlowRate,
  ]);




  const customInputs = useMemo(
    () =>
      getCustomInputsInfo(
        Number(values.ddlPreheatCompId),
        Number(values.ddlCoolingCompId),
        Number(values.ddlHeatingCompId),
        Number(values.ddlReheatCompId),
        Number(intUnitTypeID)
      ),
    [
      intUnitTypeID,
      values.ddlCoolingCompId,
      values.ddlHeatingCompId,
      values.ddlPreheatCompId,
      values.ddlReheatCompId,
    ]
  );


  // -------------- Get User Authentication Level from LocalStorage ----------------
  const ualInfo = useMemo(
    () => getUALInfo(Number(typeof window !== 'undefined' && localStorage.getItem('UAL'))),
    []
  );


  // -------------- Get Heating Pump Information ----------------
  const heatPumpInfo = useMemo(() => {
    const result = getHeatPumpInfo(Number(values.ddlCoolingCompId));
    // ckbHeatPumpChanged();
    return result;
  }, [values.ddlCoolingCompId]);


  // -------------- Get Dehumidification Information ----------------
  const dehumidificationInfo = useMemo(
    () => getDehumidificationInfo(Number(values.ddlCoolingCompId)),
    [values.ddlCoolingCompId]
  );


  // -------------- Get Coil Refrigerate Design Condition Information ----------------
  const dxCoilRefrigDesignCondInfo = useMemo(
    () =>
      getDXCoilRefrigDesignCondInfo(
        Number(typeof window !== 'undefined' && localStorage.getItem('UAL')),
        Number(values.ddlCoolingCompId)
      ),
    [values.ddlCoolingCompId]
  );


  const heatElecHeaterInstallationInfo = useMemo(
    () =>
      getHeatElecHeaterInstallationInfo(
        baseData,
        Number(values.ddlHeatingCompId),
        Number(values.ddlReheatCompId)
      ),
    [baseData, intProductTypeID, values.ddlHeatingCompId, values.ddlReheatCompId]
  );


  const heatingFluidTypeInfo = useMemo(() => {
    const result = getHeatingFluidTypeInfo(
      baseData,
      Number(values.ddlPreheatCompId),
      Number(values.ddlHeatingCompId),
      Number(values.ddlReheatCompId)
    ); 
    
    // if (!edit) {
      setValue('ddlHeatingFluidTypeId', result?.defaultId);
      // setValue('ddlHeatingFluidConcentrationId', result?.FluidConcenId);
    // }
    if (edit){
      setValue('ddlHeatingFluidTypeId', defaultValues?.ddlHeatingFluidTypeId);
    }


    return result;
  }, [
    edit,
    baseData,
    setValue,
    values.ddlHeatingCompId,
    values.ddlPreheatCompId,
    values.ddlReheatCompId,
  ]);


  const heatingFluidConcenInfo = useMemo(() => {
    const result = getHeatingFluidConcenInfo(
      baseData,
      Number(values.ddlHeatingFluidTypeId),
    ); 
    
    // if (!edit) {
      setValue('ddlHeatingFluidConcentrationId', result?.defaultId);
    // }
    if (edit){
      setValue('ddlHeatingFluidConcentrationId', defaultValues?.ddlHeatingFluidConcentrationId);
    }

    return result;
  }, [
    edit,
    baseData,
    setValue,
    values.ddlHeatingFluidTypeId,
  ]);


  const coolingFluidTypeInfo = useMemo(() => {
    const result = getCoolingFluidTypeInfo(
      baseData,
      Number(values.ddlCoolingCompId)
    );
    
    // if (!edit) {
      setValue('ddlCoolingFluidTypeId', result?.defaultId);
      // setValue('ddlCoolingFluidConcentrationId', result?.defaultId);
    // }

    return result;
  }, [
    edit,
    baseData,
    setValue,
    values.ddlCoolingCompId,
  ]);


  const coolingFluidConcenInfo = useMemo(() => {
    const result = getCoolingFluidConcenInfo(
      baseData,
      Number(values.ddlCoolingFluidTypeId),
    ); 
    
    // if (!edit) {
      setValue('ddlCoolingFluidConcentrationId', result?.defaultId);
    // }

    return result;
  }, [
    edit,
    baseData,
    setValue,
    values.ddlCoolingFluidTypeId,
  ]);



  const damperAndActuatorInfo = useMemo(() => {
    const result = getDamperAndActuatorInfo(
      baseData,
      Number(intProductTypeID),
      Number(values.ddlLocationId)
    );
    if (!edit) setValue('ddlDamperAndActuatorId', result?.ddlDamperAndActuatorId);
    return result;
  }, [edit, baseData, setValue, intProductTypeID, values.ddlLocationId]);

  const elecHeaterVoltageInfo = useMemo(() => {
    const result = getElecHeaterVoltageInfo(
      baseData,
      Number(values.ddlPreheatCompId),
      Number(values.ddlHeatingCompId),
      Number(values.ddlReheatCompId),
      Number(intProductTypeID),
      Number(intUnitTypeID),
      Number(values.ddlElecHeaterVoltageId),
      Number(values.ddlUnitVoltageId),
      Number(values.ckbVoltageSPP),
      strUnitModelValue
    );

    if (!edit && result?.ddlElecHeaterVoltageDataTbl) {
      const selectedId = result?.ddlElecHeaterVoltageDataTbl.find(
        (item) => item.id === values.ddlElecHeaterVoltageId
      );

      if (!selectedId) {
        setValue('ddlElecHeaterVoltageId', result?.ddlElecHeaterVoltageId);
      }
    }

    return result;
  }, [
    edit,
    values.ckbVoltageSPP,
    baseData,
    setValue,
    intProductTypeID,
    intUnitTypeID,
    values.ddlElecHeaterVoltageId,
    values.ddlHeatingCompId,
    values.ddlPreheatCompId,
    values.ddlReheatCompId,
    values.ddlUnitVoltageId,
    strUnitModelValue,
  ]);

  const valveAndActuatorInfo = useMemo(
    () =>
      getValveAndActuatorInfo(
        Number(values.ddlCoolingCompId),
        Number(values.ddlPreheatCompId),
        Number(values.ddlHeatingCompId),
        Number(values.ddlReheatCompId)
      ),
    [
      values.ddlCoolingCompId,
      values.ddlHeatingCompId,
      values.ddlPreheatCompId,
      values.ddlReheatCompId,
    ]
  );

  const drainPanInfo = useMemo(
    () => getDrainPanInfo(Number(intProductTypeID), Number(intUnitTypeID)),
    [intProductTypeID, intUnitTypeID]
  );

  // const handingInfo = useMemo(() => {
  //   const result = getHandingInfo(baseData);
  //   if (!edit) setValue('ddlHandingId', result.ddlHandingId);
  //   return result;
  // }, [edit, baseData, setValue]);


  const handingInfo = useMemo(() => {
    const result = baseData?.handing;
    // if (!edit) setValue('ddlHandingId', defaultValues?.ddlHandingId);
    setValue('ddlHandingId', (!edit)? baseData?.handing[0].id : defaultValues.ddlHandingId);
    setValue('ddlPreheatCoilHandingId', (!edit)? baseData?.handing[0].id : defaultValues.ddlPreheatCoilHandingId);
    setValue('ddlCoolingCoilHandingId', (!edit)? baseData?.handing[0].id : defaultValues.ddlCoolingCoilHandingId);
    setValue('ddlHeatingCoilHandingId', (!edit)? baseData?.handing[0].id : defaultValues.ddlHeatingCoilHandingId);
    return result;
  }, [edit, baseData, setValue]);


  const supplyAirOpeningInfo = useMemo(() => {
    const result = getSupplyAirOpeningInfo(
      baseData,
      Number(intUnitTypeID),
      Number(intProductTypeID),
      Number(values.ddlLocationId),
      Number(values.ddlOrientationId),
      values.ddlSupplyAirOpeningId,
      values.ddlSupplyAirOpeningText,
      Number(values.ddlCoolingCompId),
      Number(values.ddlHeatingCompId),
      Number(values.ddlReheatCompId)
    );

    setValue('ddlSupplyAirOpeningId', (!edit)? result?.ddlSupplyAirOpeningId : defaultValues.ddlSupplyAirOpeningId);
    setValue('ddlSupplyAirOpeningText', result?.ddlSupplyAirOpeningText);
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    edit,
    baseData,
    setValue,
    intProductTypeID,
    intUnitTypeID,
    values.ddlCoolingCompId,
    values.ddlHeatingCompId,
    values.ddlLocationId,
    values.ddlOrientationId,
    values.ddlReheatCompId,
  ]);

  useEffect(() => {
    if (!values.ddlOrientationId || !values.ddlSupplyAirOpeningText || !intProductTypeID) return;

    const result = getRemainingOpeningsInfo(
      baseData,
      Number(intUnitTypeID),
      Number(intProductTypeID),
      values.ddlSupplyAirOpeningText,
      Number(values.ddlOrientationId)
    );

    // if (!edit) setValue('ddlExhaustAirOpeningId', result?.ddlExhaustAirOpeningId);
    // if (!edit) setValue('ddlExhaustAirOpeningText', result?.ddlExhaustAirOpeningText);
    // if (!edit) setValue('ddlOutdoorAirOpeningId', result?.ddlOutdoorAirOpeningId);
    // if (!edit) setValue('ddlOutdoorAirOpeningText', result?.ddlOutdoorAirOpeningText);
    // if (!edit) setValue('ddlReturnAirOpeningId', result?.ddlReturnAirOpeningId);
    // if (!edit) setValue('ddlReturnAirOpeningText', result?.ddlReturnAirOpeningText);

    setValue('ddlExhaustAirOpeningId', (!edit)? result?.ddlExhaustAirOpeningId : defaultValues.ddlExhaustAirOpeningId);
    setValue('ddlExhaustAirOpeningText', result?.ddlExhaustAirOpeningText);
    setValue('ddlOutdoorAirOpeningId',  (!edit)? result?.ddlOutdoorAirOpeningId : defaultValues.ddlOutdoorAirOpeningId);
    setValue('ddlOutdoorAirOpeningText', result?.ddlOutdoorAirOpeningText);
    setValue('ddlReturnAirOpeningId', (!edit)? result?.ddlReturnAirOpeningId : defaultValues.ddlReturnAirOpeningId);
    setValue('ddlReturnAirOpeningText', result?.ddlReturnAirOpeningText);

    setRemainingOpeningsInfo(result);
  }, [
    edit,
    baseData,
    setValue,
    intProductTypeID,
    intUnitTypeID,
    values.ddlOrientationId,
    values.ddlSupplyAirOpeningText,
  ]);

  // onChange functions
  const handleBlurSummerSupplyAirCFM = useCallback(
    (e: any) => {
      const value = getSummerSupplyAirCFM(
        e.target.value,
        intProductTypeID,
        Number(user?.UAL || 0),
        Number(values.ckbBypass)
      );
      setValue('txbSummerSupplyAirCFM', value);
      setValue('txbSummerReturnAirCFM', value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.ckbBypass, getAllFormData, setValue, user?.UAL || 0]
  );

  const handleBlurSummerReturnAirCFM = useCallback(
    (e: any) => {
      const value = getSummerReturnAirCFM(
        e.target.value,
        getAllFormData(),
        Number(user?.UAL || 0),
        baseData
      );
      setValue('txbSummerReturnAirCFM', value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseData, getAllFormData, setValue, user?.UAL || 0]
  );

  const handleBlurSupplyAirESP = useCallback(
    (e: any) => {
      const value = getSupplyAirESPInfo(e.target.value, intProductTypeID, values.ddlUnitModelId);
      setValue('txbSupplyAirESP', value);
    },
    [setValue, intProductTypeID, values.ddlUnitModelId]
  );

  const handleBlurExhaustAirESP = useCallback(
    (e: any) => {
      const value = getExhaustAirESP(
        e.target.value,
        intProductTypeID,
        intUnitTypeID,
        values.ddlUnitModelId
      );
      setValue('txbExhaustAirESP', value);
    },
    [setValue, intProductTypeID, intUnitTypeID, values.ddlUnitModelId]
  );

  const isAvailable = useCallback((value: any[]) => !!value && value.length > 0, []);
  if (edit && setFunction) setFunction(handleSubmit(onSubmit));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ marginBottom: '150px' }}>
        {edit ? (
          <Stack direction="row" alignContent="center" justifyContent="center">
            <Typography variant="h3" color="primary.main">
              {getValues('txtTag')}
            </Typography>
          </Stack>
        ) : (
          <Stack direction="row" alignContent="center" justifyContent="center">
            <Typography variant="h3" color="primary.main">
              {txbProductType || ''}/{txbUnitType || ''}
            </Typography>
          </Stack>
        )}
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
              UNIT DETAILS
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={5}>
              <Grid item xs={4} md={4}>
                <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                  <RHFTextField size="small" name="txtTag" label="Tag" />
                  <RHFTextField
                    size="small"
                    name="txbQty"
                    label="Quantity"
                    // onChange={(e: any) => {
                    //   setValueWithCheck(e, 'txbQty');
                    // }}
                  />
                  {isAvailable(baseData?.unitType) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlUnitTypeId"
                      label="Unit Type"
                      placeholder=""
                      disabled
                    >
                      {baseData?.unitType.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isAvailable(locationInfo) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlLocationId"
                      label="Location"
                      placeholder=""
                      onChange={ddlLocationChanged}
                    >
                      {locationInfo?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                   {/* <FormControlLabel
                    control={ */}
                      <RHFCheckbox
                      sx={getInlineDisplay(values.ckbDownshot)}
                      label="Downshot"
                      name="ckbDownshot"
                        checked={values.ckbDownshot}
                        // onChange={() => setCkbDownshotVal(!values.ckbDownshotVal)}
                        onChange={(e: any) => setValue('ckbDownshot', Number(e.target.checked))}
                      />
                     {/* }
                     label="Downshot"
                   /> */}
                  {isAvailable(orientationInfo) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlOrientationId"
                      label="Orientation"
                      placeholder=""
                      onChange={ddlOrientationChanged}
                    >
                      {orientationInfo?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isAvailable(baseData?.controlsPreference) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlControlsPreferenceId"
                      label="Control Preference"
                      placeholder=""
                      onChange={(e: any) => {setValue('ddlControlsPreferenceId', Number(e.target.value));}}
                    >
                      {baseData?.controlsPreference?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                </Box>
              </Grid>
              <Grid item xs={4} md={4}>
                <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                  <RHFTextField
                    size="small"
                    name="txbSummerSupplyAirCFM"
                    label="Supply Air (CFM)"
                    onChange={(e: any) => {
                      setValueWithCheck(e, 'txbSummerSupplyAirCFM');
                    }}
                    onBlur={handleBlurSummerSupplyAirCFM}
                  />
                  <RHFTextField
                    size="small"
                    name="txbSummerReturnAirCFM"
                    label="Exhaust Air (CFM)"
                    sx={getDisplay(!isUnitTypeAHU())}
                    onChange={(e: any) => {
                      setValueWithCheck(e, 'txbSummerReturnAirCFM');
                    }}
                    onBlur={handleBlurSummerReturnAirCFM}
                  />
                  <RHFTextField
                    size="small"
                    name="txbSupplyAirESP"
                    label="Supply Air ESP (inH2O)"
                    onChange={(e: any) => {
                      setValueWithCheck1(e, 'txbSupplyAirESP');
                    }}
                    onBlur={handleBlurSupplyAirESP}
                  />
                  <RHFTextField
                    size="small"
                    name="txbExhaustAirESP"
                    label="Exhaust Air ESP (inH2O)"
                    sx={getDisplay(!isUnitTypeAHU())}
                    onChange={(e: any) => {
                      setValueWithCheck1(e, 'txbExhaustAirESP');
                    }}
                    onBlur={handleBlurExhaustAirESP}
                  />
                </Box>
              </Grid>
              <Grid item xs={4} md={4}>
                <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                  {/* <FormControlLabel
                    sx={getDisplay(intProductTypeID === IDs.intProdTypeVentumLiteID || isUnitTypeAHU())}
                    control={ */}
                      <RHFCheckbox
                        label={`Bypass for Economizer: ${ckbBypassInfo.text}`}
                        name="ckbBypass"
                        sx={getDisplay(intProductTypeID === IDs.intProdTypeVentumLiteID || isUnitTypeAHU())}
                        // sx={{color: ckbBypassInfo.text !== '' ? colors.red[500] : 'text.primary', size: 'small', }}
                        checked={values.ckbBypass}
                        // onChange={() => setCkbBypassVal(!values.ckbBypassVal)}
                        onChange={(e: any) => {setValue('ckbBypass', Number(e.target.checked));}}
                        disabled={!ckbBypassInfo.enabled}
                      />
                    {/* }
                    label={`Bypass for Economizer: ${ckbBypassInfo.text}`}
                  /> */}
                  {isAvailable(unitModel) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlUnitModelId"
                      label="Unit Model"
                      onChange={ddlUnitModelChanged}
                    >
                      {unitModel?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isAvailable(unitVoltage) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlUnitVoltageId"
                      label="Unit Voltage"
                      onChange={ddlUnitVoltageChanged}
                    >
                      {unitVoltage?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  <FormControlLabel
                    sx={getDisplay(intProductTypeID === IDs.intProdTypeVentumLiteID)}
                    control={
                      <RHFCheckbox
                        label="Single Point Power Connection"
                        name="ckbVoltageSPPVal"
                        checked={values.ckbVoltageSPP}
                        onChange={(e: any) => setValue('ckbVoltageSPP', Number(e.target.checked))}
                      />
                    }
                    label="Single Point Power Connection"
                  />
                  {isAvailable(OAFilterModel) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlOA_FilterModelId"
                      label="OA Filter"
                      onChange={(e: any) => setValue('ddlOA_FilterModelId', Number(e.target.value))}
                    >
                      {OAFilterModel?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isAvailable(RAFilterModel?.dataTable) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlRA_FilterModelId"
                      label="RA Filter"
                      onChange={(e: any) => setValue('ddlRA_FilterModelId', Number(e.target.value))}
                    >
                      {RAFilterModel?.dataTable?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel2}
          sx={getDisplay(intProductTypeID !== IDs.intProdTypeVentumLiteID)}
          onChange={() => setExpanded({ ...expanded, panel2: !expanded.panel2 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              PRE-HEAT
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                },
              }}
            >
              <Stack spacing={1}>
                {isAvailable(dtPreheatComp) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlPreheatCompId"
                    label="Preheat"
                    sx={getDisplay(intProductTypeID !== IDs.intProdTypeVentumLiteID)}
                    onChange={ddlPreheatCompChanged}
                  >
                    {dtPreheatComp?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbWinterPreheatSetpointDB"
                  label="Preheat LAT Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(values.ddlPreheatCompId === IDs.intCompElecHeaterID || values.ddlCoolingCompId === IDs.intCompHWC_ID)}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbWinterPreheatSetpointDB');}}
                />
                {isAvailable(baseData?.handing) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlPreheatCoilHandingId"
                    label="Preheat Coil Handing"
                    sx={getDisplay(values.ddlPreheatCompId > 0)}
                  >
                    {baseData?.handing?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlPreheatCompId === IDs.intCompElecHeaterID) }}
              >
                {isAvailable(preheatElecHeaterInstallationInfo) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlPreheatElecHeaterInstallationId"
                    label="Preheat Elec. Heater Installation"
                    onChange={(e: any) =>setValue('ddlPreheatElecHeaterInstallationId', Number(e.target.value))}
                    placeholder=""
                  >
                    {preheatElecHeaterInstallationInfo?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlPreheatCompId === IDs.intCompHWC_ID) }}
              >
                {isAvailable(baseData?.fluidType) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidTypeId"
                    label="Heating Fluid Type"
                  >
                    {heatingFluidTypeInfo?.dataTable?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                {isAvailable(baseData?.fluidConcentration) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidConcentrationId"
                    label="Heating Fluid %"
                  >
                    {heatingFluidConcenInfo?.dataTable?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidEntTemp"
                  label="Heating Fluid Ent Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbHeatingFluidEntTemp');}}
                />
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidLvgTemp"
                  label="Heating Fluid Lvg Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbHeatingFluidLvgTemp');}}
                />
              </Stack>
              <Stack spacing={1} sx={{ mb: 3, display: getInlineDisplay(values.ddlPreheatCompId === IDs.intCompHWC_ID)}}>
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divPreheatHWC_UseCapVisible)}
                  control={ */}
                    <RHFCheckbox
                      // sx={getInlineDisplay(values.ddlPreheatCompId === IDs.intCompHWC_ID)}
                      label="Preheat HWC Use Capacity"
                      name="ckbPreheatHWCUseCap"
                      checked={values.ckbPreheatHWCUseCap}
                      onChange={(e: any) => setValue('ckbPreheatHWCUseCap', Number(e.target.checked))}
                      // onChange={() => {
                      //   setCkbFlowRateAndCap({
                      //     ...values.ckbPreheatHWCUseCapVal,
                      //     ckbPreheatHWC_UseCap: !values.ckbPreheatHWCUseCapVal,
                      //   });
                      // }}
                    />
                  {/* }
                  label="Preheat HWC Use Capacity"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbPreheatHWCCap"
                  label="Preheat HWC Capacity (MBH)"
                  // sx={getDisplay(values.ddlPreheatCompId === IDs.intCompHWC_ID)}
                  disabled= {preheatHWCCapInfo.isDisabled}
                  // value={preheatHWCUseCapInfo.resetCapacity}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbPreheatHWCCap');}}
                />
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divPreheatHWC_UseFlowRateVisible)}
                  control={ */}
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divPreheatHWC_UseFlowRateVisible)}
                      label="Preheat HWC Use Flow Rate"
                      name="ckbPreheatHWCUseFlowRate"
                      checked={values.ckbPreheatHWCUseFlowRate}
                      onChange={(e: any) => setValue('ckbPreheatHWCUseFlowRate', Number(e.target.checked))}
                      // onChange={() => {
                      //   setCkbFlowRateAndCap({
                      //     ...values.ckbPreheatHWCUseCapVal,
                      //     ckbPreheatHWC_UseFlowRate: !values.ckbPreheatHWCUseFlowRateVal,
                      //   });
                      // }}
                    />
                  {/* }
                  label="Preheat HWC Use Flow Rate"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbPreheatHWCFlowRate"
                  label="Preheat HWC Flow Rate (GPM)"
                  // sx={getDisplay(customInputs.divPreheatHWC_UseFlowRateVisible)}
                  disabled= {preheatHWCFlowRateInfo.isDisabled}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbPreheatHWCFlowRate');}}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel3}
          sx={getDisplay(intProductTypeID !== IDs.intProdTypeVentumLiteID)}
          onChange={() => setExpanded({ ...expanded, panel3: !expanded.panel3 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              COOLING
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                },
              }}
            >
              <Stack spacing={1}>
                {isAvailable(dtCoolingComp) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCoolingCompId"
                    label="Cooling"
                    onChange={ddlCoolingCompChanged}
                  >
                    {dtCoolingComp?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbSummerCoolingSetpointDB"
                  label="Cooling LAT Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    values.ddlCoolingCompId === IDs.intCompCWC_ID ||
                      values.ddlCoolingCompId === IDs.intCompDX_ID
                  )}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbSummerCoolingSetpointDB');}}
                />
                <RHFTextField
                  size="small"
                  name="txbSummerCoolingSetpointWB"
                  label="Cooling LAT Setpoint WB (F):"
                  autoComplete="off"
                  sx={getDisplay(Number(values.ddlCoolingCompId) === IDs.intCompCWC_ID || Number(values.ddlCoolingCompId) === IDs.intCompDX_ID)}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbSummerCoolingSetpointWB');}}
                />
                {/* <FormControlLabel
                  sx={getInlineDisplay(values.ddlCoolingCompId === IDs.intCompDX_ID)}
                  control={ */}
                    <RHFCheckbox
                    sx={getInlineDisplay(values.ddlCoolingCompId === IDs.intCompDX_ID)}
                    label="Heat Pump"
                    name="ckbHeatPump"
                      checked={values.ckbHeatPump}
                      // onChange={ckbHeatPumpChanged}
                      onChange={(e: any) => setValue('ckbHeatPump', Number(e.target.checked))}
                    />
                  {/* }
                  label="Heat Pump"
                /> */}
                {/* <FormControlLabel
                  sx={getInlineDisplay(values.ddlCoolingCompId === IDs.intCompCWC_ID || values.ddlCoolingCompId === IDs.intCompDX_ID)}
                  control={ */}
                    <RHFCheckbox
                      sx={getInlineDisplay(values.ddlCoolingCompId === IDs.intCompCWC_ID || values.ddlCoolingCompId === IDs.intCompDX_ID)}
                      label="Dehumidification"
                      name="ckbDehumidification"
                      checked={values.ckbDehumidification}
                      // onChange={(e: any) => setCkbDehumidificationVal(e.target.checked)}
                      onChange={(e: any) => setValue('ckbDehumidification', Number(e.target.checked))}
                    />
                  {/* }
                  label="Dehumidification"
                /> */}
                {isAvailable(baseData?.handing) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCoolingCoilHandingId"
                    label="Cooling Coil Handing"
                    sx={getDisplay(Number(values.ddlCoolingCompId) > 1)}
                    onChange={(e: any) => setValue('ddlCoolingCoilHandingId', Number(e.target.value))}
                  >
                    {baseData?.handing?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack spacing={1} sx={{ mb: 3, display: getInlineDisplay(values.ddlCoolingCompId === IDs.intCompDX_ID)}}>
                <RHFTextField
                  size="small"
                  name="txbRefrigSuctionTemp"
                  label="Suction Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbRefrigSuctionTemp');}}
                />

                <RHFTextField
                  size="small"
                  name="txbRefrigLiquidTemp"
                  label="Liquid Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbRefrigLiquidTemp');
                  }}
                />

                <RHFTextField
                  size="small"
                  name="txbRefrigSuperheatTemp"
                  label="Superheat Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbRefrigSuperheatTemp');
                  }}
                />
              </Stack>
              <Stack spacing={1} sx={{ ...getDisplay(Number(values.ddlCoolingCompId) === IDs.intCompCWC_ID) }}>
                {isAvailable(baseData?.fluidType) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCoolingFluidTypeId"
                    label="Cooling Fluid Type"
                  >
                    {coolingFluidTypeInfo?.dataTable?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                {isAvailable(baseData?.fluidConcentration) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCoolingFluidConcentrationId"
                    label="Cooling Fluid %"
                  >
                    {coolingFluidConcenInfo?.dataTable?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbCoolingFluidEntTemp"
                  label="Cooling Fluid Ent Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbCoolingFluidEntTemp'); }}
                />

                <RHFTextField
                  size="small"
                  name="txbCoolingFluidLvgTemp"
                  label="Cooling Fluid Lvg Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbCoolingFluidLvgTemp');}}
                />
              </Stack>

              <Stack spacing={1} sx={{ mb: 3, display: getInlineDisplay(values.ddlCoolingCompId === IDs.intCompCWC_ID)}}>
                {/* <FormControlLabel
                  sx={{...getInlineDisplay(customInputs.divCoolingCWC_UseCapVisible),margin: 0,}}
                  control={ */}
                    <RHFCheckbox
                      // sx={{...getInlineDisplay(customInputs.divCoolingCWC_UseCapVisible),margin: 0,}}
                      label="Cooling CWC Use Capacity"
                      name="ckbCoolingCWCUseCap"
                      checked={values.ckbCoolingCWCUseCap}
                      // onChange={() => {
                      //   setCkbFlowRateAndCap({
                      //     ...values.ckbCoolingCWCUseCapVal,
                      //     ckbCoolingCWC_UseCap: !values.ckbCoolingCWCUseCapVal,
                      //   });
                      // }}
                      onChange={(e: any) => setValue('ckbCoolingCWCUseCap', Number(e.target.checked))}
                    />
                  {/* }
                  label="Cooling CWC Use Capacity"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbCoolingCWCCap"
                  label="Cooling CWC Capacity (MBH)"
                  disabled= {coolingCWCCapInfo.isDisabled}
                  // sx={getDisplay(customInputs.divCoolingCWC_UseCapVisible)}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbCoolingCWCCap');}}
                />
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  control={ */}
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      label="Cooling CWC Use Flow Rate"
                      name="ckbCoolingCWCUseFlowRate"
                      checked={values.ckbCoolingCWCUseFlowRate}
                      // onChange={() => {
                      //   setCkbFlowRateAndCap({
                      //     values,
                      //     ckbCoolingCWC_UseFlowRate: !values.ckbCoolingCWCUseFlowRateVal,
                      //   });
                      // }}
                      onChange={(e: any) => setValue('ckbCoolingCWCUseFlowRate', Number(e.target.checked))}
                    />
                  {/* }
                  label="Cooling CWC Use Flow Rate"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbCoolingCWCFlowRate"
                  label="Cooling CWC Flow Rate (GPM)"
                  // sx={getDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  disabled= {coolingCWCFlowRateInfo.isDisabled}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbCoolingCWCFlowRate');}}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel4}
          sx={getDisplay(intProductTypeID !== IDs.intProdTypeVentumLiteID)}
          onChange={() => setExpanded({ ...expanded, panel4: !expanded.panel4 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              HEATING
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                },
              }}
            >
              <Stack spacing={1}>
                {isAvailable(dtHeatingComp) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingCompId"
                    label="Heating"
                    sx={getDisplay(intProductTypeID !== IDs.intProdTypeVentumLiteID)}
                    onChange={ddlHeatingCompChanged}
                  >
                    {dtHeatingComp?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbWinterHeatingSetpointDB"
                  label="Heating LAT Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    Number(values.ddlHeatingCompId) === IDs.intCompElecHeaterID ||
                      Number(values.ddlHeatingCompId) === IDs.intCompHWC_ID ||
                      values.ckbHeatPump
                  )}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbWinterHeatingSetpointDB');
                  }}
                />
                {isAvailable(baseData?.handing) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingCoilHandingId"
                    label="Heating Coil Handing"
                    sx={getDisplay(Number(values.ddlHeatingCompId) > 1)}
                    onChange={(e: any) =>
                      setValue('ddlHeatingCoilHandingId', Number(e.target.value))
                    }
                  >
                    {baseData?.handing?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack spacing={1} sx={{ ...getDisplay(values.ddlHeatingCompId === IDs.intCompElecHeaterID) }} >
                {isAvailable(
                  heatElecHeaterInstallationInfo.ddlHeatElecHeaterInstallationDataTbl
                ) && (
                  <RHFSelect
                    native
                    label="Heating Elec. Heater Installation"
                    name="ddlHeatElecHeaterInstallationId"
                    size="small"
                    placeholder=""
                    onChange={(e: any) => setValue('ddlHeatElecHeaterInstallationId', Number(e.target.value)) }
                  >
                    {heatElecHeaterInstallationInfo.ddlHeatElecHeaterInstallationDataTbl?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                )}              
              </Stack>
              <Stack spacing={1} sx={{ ...getDisplay(values.ddlHeatingCompId === IDs.intCompHWC_ID)}}>
                {isAvailable(baseData?.fluidType) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidTypeId"
                    label="Heating Fluid Type"
                  >
                    {heatingFluidTypeInfo?.dataTable?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                {isAvailable(baseData?.fluidType && baseData?.fluidConcentration) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidConcentrationId"
                    label="Heating Fluid %"
                  >
                    {heatingFluidConcenInfo?.dataTable?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidEntTemp"
                  label="Heating Fluid Ent Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbHeatingFluidEntTemp');}}
                />
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidLvgTemp"
                  label="Heating Fluid Lvg Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbHeatingFluidLvgTemp');}}
                />
              </Stack>
              <Stack spacing={1} sx={{ mb: 3, display: getInlineDisplay(values.ddlHeatingCompId === IDs.intCompHWC_ID)}}>
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  control={ */}
                    <RHFCheckbox
                    // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                    label="Heating HWC Use Capacity"
                    name="ckbHeatingHWCUseCap"
                    checked={values.ckbHeatingHWCUseCap}
                      // onChange={() => {
                      //   setCkbFlowRateAndCap({
                      //     ...values,
                      //     ckbCoolingCWC_UseFlowRate: !values.ckbCoolingCWCUseFlowRateVal,
                      //   });
                      // }}
                      onChange={(e: any) => setValue('ckbHeatingHWCUseCap', Number(e.target.checked))}
                    />
                  {/* }
                  label="Heating HWC Use Capacity"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbHeatingHWCCap"
                  label="Heating HWC Capacity (MBH)"
                  // sx={getDisplay(customInputs.divHeatingHWC_UseCapVisible)}
                  disabled= {heatingHWCCapInfo.isDisabled}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbHeatingHWCCap');}}
                />
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  control={ */}
                    <RHFCheckbox
                    // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                    label="Heating HWC Use Flow Rate"
                    name="ckbHeatingHWCUseFlowRate"
                      checked={values.ckbHeatingHWCUseFlowRate}
                      // onChange={() => {
                      //   setCkbFlowRateAndCap({
                      //     ...values,
                      //     ckbCoolingCWC_UseFlowRate: !values.ckbCoolingCWCUseFlowRateVal,
                      //   });
                      // }}
                      onChange={(e: any) => setValue('ckbHeatingHWCUseFlowRate', Number(e.target.checked))}
                    />
                  {/* }
                  label="Heating HWC Use Flow Rate"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbHeatingHWCFlowRate"
                  label="Heating HWC Flow Rate (GPM)"
                  disabled= {heatingHWCFlowRateInfo.isDisabled}
                  // sx={getDisplay(customInputs.divHeatingHWC_UseFlowRateVisible)}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbHeatingHWCFlowRate');}}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={getDisplay(values.ckbDehumidification)}
          expanded={expanded.panel5}
          onChange={() => setExpanded({ ...expanded, panel5: !expanded.panel5 })}>
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              REHEAT
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{display: 'grid',rowGap: 3,columnGap: 3, gridTemplateColumns: {xs: 'repeat(3, 1fr)',}, }}
            >
              <Stack spacing={1}>
                {isAvailable(dtReheatComp) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlReheatCompId"
                    label="Reheat"
                    placeholder=""
                    sx={getDisplay(values.ckbDehumidification)}
                    onChange={ddlReheatCompChanged}
                  >
                    {dtReheatComp?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbSummerReheatSetpointDB"
                  label="Dehum. Reheat Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    values.ddlReheatCompId === IDs.intCompElecHeaterID ||
                      values.ddlReheatCompId === IDs.intCompHWC_ID ||
                      values.ddlReheatCompId === IDs.intCompHGRH_ID
                  )}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbSummerReheatSetpointDB');}}
                />
                {isAvailable(baseData?.handing) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingCoilHandingId"
                    label="Reheat Coil Handing"
                    sx={getDisplay(Number(values.ddlReheatCompId) > 1)}
                    onChange={(e: any) =>
                      setValue('ddlHeatingCoilHandingId', Number(e.target.value))
                    }
                  >
                    {baseData?.handing?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlReheatCompId === IDs.intCompElecHeaterID) }}
              >
                {isAvailable(
                  heatElecHeaterInstallationInfo.ddlHeatElecHeaterInstallationDataTbl
                ) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatElecHeaterInstallationId"
                    label="Reheat Elec. Heater Installation"
                    onChange={(e: any) => setValue('ddlHeatElecHeaterInstallationId', Number(e.target.value))}
                    placeholder=""
                  >
                    {heatElecHeaterInstallationInfo.ddlHeatElecHeaterInstallationDataTbl?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                )}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(values.ddlReheatCompId === IDs.intCompHWC_ID) }}
              >
                {isAvailable(baseData?.fluidType) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidTypeId"
                    label="Reheat Fluid Type"
                  >
                    {heatingFluidTypeInfo?.dataTable?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                {isAvailable(baseData?.fluidType && baseData?.fluidConcentration) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingFluidConcentrationId"
                    label="Reheat Fluid %"
                  >
                    {heatingFluidConcenInfo?.dataTable?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                )}
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidEntTemp"
                  label="Reheat Fluid Ent Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbHeatingFluidEntTemp');}}
                />
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidLvgTemp"
                  label="Reheat Fluid Lvg Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbHeatingFluidLvgTemp');}}
                />
              </Stack>
              <Stack spacing={1} sx={{...getDisplay(values.ddlReheatCompId === IDs.intCompHWC_ID && ualInfo.divCustomVisible),}}>
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divReheatHWC_UseCapVisible)}
                  control={ */}
                    <RHFCheckbox
                    // sx={getInlineDisplay(customInputs.divReheatHWC_UseCapVisible)}
                    label="Reheat HWC Use Capacity"
                    name="ckbReheatHWCUseCap"
                      checked={values.ckbReheatHWCUseCap}
                      // onChange={() => {
                      //   setCkbFlowRateAndCap({
                      //     ...values,
                      //     ckbReheatHWC_UseCap: !values.ckbReheatHWCUseCapVal,
                      //   });
                      // }}
                      onChange={(e: any) => setValue('ckbReheatHWCUseCap', Number(e.target.checked))}
                    />
                  {/* }
                  label="Reheat HWC Use Capacity"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbReheatHWCCap"
                  label="Reheat HWC Capacity (MBH)"
                  // sx={getDisplay(customInputs.divReheatHWC_UseCapVisible)}
                  disabled= {reheatHWCCapInfo.isDisabled}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbReheatHWCCap');}}
                />
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                  control={ */}
                    <RHFCheckbox
                    // sx={getInlineDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                    label="Reheat HWC Use Flow Rate"
                    name="ckbReheatHWCUseFlowRate"
                    checked={values.ckbReheatHWCUseFlowRate}
                      // onChange={() => {
                      //   setCkbFlowRateAndCap({
                      //     ...values,
                      //     ckbReheatHWC_UseFlowRate: !values.ckbReheatHWCUseFlowRateVal,
                      //   });
                      // }}
                    onChange={(e: any) => setValue('ckbReheatHWCUseFlowRate', Number(e.target.checked))}

                    />
                  {/* }
                  label="Reheat HWC Use Flow Rate"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbReheatHWCFlowRate"
                  label="Reheat HWC Flow Rate (GPM)"
                  // sx={getDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                  disabled= {reheatHWCFlowRateInfo.isDisabled}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbReheatHWCFlowRate');}}
                />
              </Stack>
              <Stack spacing={1} sx={{ ...getDisplay(values.ddlReheatCompId === IDs.intCompHGRH_ID)}}>
                <RHFTextField
                  size="small"
                  name="txbRefrigCondensingTemp"
                  label="Condensing Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbRefrigCondensingTemp');}}
                />
                <RHFTextField
                  size="small"
                  name="txbRefrigVaporTemp"
                  label="Condensing Temp (F)"
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbRefrigVaporTemp');}}
                />
                <RHFTextField
                  size="small"
                  name="txbRefrigSubcoolingTemp"
                  label="Subcooling Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbRefrigSubcoolingTemp');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbPercentCondensingLoad"
                  label="% Condensing Load"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbPercentCondensingLoad');
                  }}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel6}
          onChange={() => setExpanded({ ...expanded, panel6: !expanded.panel6 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              ACCESSORIES
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 3,
                gridTemplateColumns: {
                  xs: 'repeat(3, 1fr)',
                },
              }}
            >
              <Stack spacing={1}>
                {isAvailable(damperAndActuatorInfo.ddlDamperAndActuatorDataTbl) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlDamperAndActuatorId"
                    label="Dampers & Actuator"
                    sx={getDisplay(!!damperAndActuatorInfo.divDamperAndActuatorVisible)}
                    onChange={(e: any) => {
                      setValue('ddlDamperAndActuatorId', Number(e.target.value));
                    }}
                    placeholder=""
                  >
                    {damperAndActuatorInfo.ddlDamperAndActuatorDataTbl?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                )}
                {isAvailable(elecHeaterVoltageInfo.ddlElecHeaterVoltageDataTbl) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlElecHeaterVoltageId"
                    label="Elec. Heater Voltage"
                    placeholder=""
                    sx={getDisplay(elecHeaterVoltageInfo.divElecHeaterVoltageVisible)}
                    onChange={ddlElecHeaterVoltageChanged}
                  >
                    {elecHeaterVoltageInfo.ddlElecHeaterVoltageDataTbl?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                )}
                {/* <FormControlLabel
                  sx={getDisplay(valveAndActuatorInfo.divValveAndActuatorVisible)}
                  control={ */}
                    <RHFCheckbox
                      sx={getDisplay(valveAndActuatorInfo.divValveAndActuatorVisible)}
                      label="Include Valves & Actuator"
                      name="ckbValveAndActuator"
                      defaultChecked={values.ckbValveAndActuator}
                      // onChange={() => setCkbValveAndActuatorVal(!values.ckbValveAndActuatorVal)}
                      onChange={(e: any) => setValue('ckbValveAndActuator', Number(e.target.checked))}
                    />
                  {/* }
                  label="Include Valves & Actuator"
                /> */}
                {/* <FormControlLabel
                  sx={getInlineDisplay(drainPanInfo.divDrainPanVisible)}
                  control={ */}
                    <RHFCheckbox
                    sx={getInlineDisplay(drainPanInfo.divDrainPanVisible)}
                    label="Drain Pan Required"
                    name="ckbDrainPanVal"
                    checked={values.ckbDrainPan}
                      // onChange={() => setCkbDrainPanVal(!values.ckbDrainPanVal)}
                    onChange={(e: any) => setValue('ckbDrainPan', Number(e.target.checked))}
                    />
                  {/* }
                  label="Drain Pan Required"
                /> */}
              </Stack>
              <Stack spacing={1}>
                <RHFSelect
                  native
                  size="small"
                  name="ddlValveTypeId"
                  sx={getDisplay(
                    values.ddlPreheatCompId === IDs.intCompHWC_ID ||
                      values.ddlCoolingCompId === IDs.intCompHWC_ID ||
                      values.ddlHeatingCompId === IDs.intCompHWC_ID ||
                      values.ddlReheatCompId === IDs.intCompHWC_ID
                  )}
                  label="Valve Type"
                >
                  {baseData?.valveType
                    ?.filter((item: any) => item.items !== '""')
                    ?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                </RHFSelect>
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel7}
          onChange={() => setExpanded({ ...expanded, panel7: !expanded.panel7 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              LAYOUT
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={5}>
              <Grid item xs={4} md={4}>
                <Stack spacing={3}>
                  {isAvailable(handingInfo) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlHandingId"
                      label="Handing"
                      placeholder=""
                      value={getValues('ddlHandingId')}
                      onChange={ddlHandingChanged}
                    >
                      {handingInfo.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  )}
                  {isAvailable(supplyAirOpeningInfo.ddlSupplyAirOpeningDataTbl) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlSupplyAirOpeningId"
                      label="Supply Air Opening"
                      placeholder=""
                      onChange={ddlSupplyAirOpeningChanged}
                    >
                      {supplyAirOpeningInfo.ddlSupplyAirOpeningDataTbl.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  )}
                  {isAvailable(remainingOpeningsInfo.ddlExhaustAirOpeningDataTbl) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlExhaustAirOpeningId"
                      label="Exhaust Air Opening"
                      sx={getDisplay(!!remainingOpeningsInfo.ddlExhaustAirOpeningVisible)}
                      placeholder=""
                      onChange={ddlExhaustAirOpeningChanged}
                    >
                      {remainingOpeningsInfo.ddlExhaustAirOpeningDataTbl.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  )}
                  {isAvailable(remainingOpeningsInfo.ddlOutdoorAirOpeningDataTbl) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlOutdoorAirOpeningId"
                      label="Outdoor Air Opening"
                      placeholder=""
                      onChange={ddlOutdoorAirOpeningChanged}
                    >
                      {remainingOpeningsInfo.ddlOutdoorAirOpeningDataTbl.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  )}
                  {isAvailable(remainingOpeningsInfo.ddlReturnAirOpeningDataTbl) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlReturnAirOpeningId"
                      label="Return Air Opening"
                      sx={getDisplay(remainingOpeningsInfo.ddlReturnAirOpeningVisible)}
                      placeholder=""
                      onChange={ddlReturnAirOpeningChanged}
                    >
                      {remainingOpeningsInfo.ddlReturnAirOpeningDataTbl.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  )}
                </Stack>{' '}
              </Grid>
              {/* <Grid item xs={8} md={8}>
                  <RHFUpload
                    name="layoutImage"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                  />
                </Grid> */}
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel8}
          onChange={() => setExpanded({ ...expanded, panel8: !expanded.panel8 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              CONFIGURATION NOTES
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              <TextField label="Take a note..." variant="standard" fullWidth />
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Stack direction="row" justifyContent="flex-end">
          <Box sx={{ width: '150px' }}>
            <LoadingButton
              type="submit"
              variant="contained"
              onClick={() => console.log(getValues())}
              loading={isSubmitting}
              disabled={isSavedUnit && !edit}
            >
              {edit ? 'Update Unit' : 'Add New Unit'}
            </LoadingButton>
          </Box>
        </Stack>
      </Stack>
    </FormProvider>
  );
}