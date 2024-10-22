/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  Button,
  Snackbar,
  Alert,
  getTextFieldUtilityClass
} from '@mui/material';
// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';

import { useForm, useFormState } from 'react-hook-form';
import { unitEditFormSchema, useGetDefaultValue } from 'src/hooks/useUnit';
import { PATH_APP } from 'src/routes/paths';
import * as IDs from 'src/utils/ids';
import { useAuthContext } from 'src/auth/useAuthContext';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify';
import { RHFCheckbox, RHFSelect, RHFTextField,  } from 'src/components/hook-form';
import { useApiContext } from 'src/contexts/ApiContext';
import { any, number } from 'prop-types';
import { filter, flowRight, indexOf } from 'lodash';
// import { useGetAllUnits } from 'src/hooks/useApi';
// import Selection from '../Selection/Selection';
import Image from 'src/components/image';

import {
  // getBypass,
  // getComponentInfo,
  // getDXCoilRefrigDesignCondInfo,
  // getDamperAndActuatorInfo,
  // getDehumidificationInfo,
  // getDrainPanInfo,
  // getElecHeaterVoltageInfo,
  // getExhaustAirESP,
  // getHeatPumpInfo,
  // getLocation,
  // getOrientation,
  // getPreheatElecHeaterInstallationInfo,
  // getReheatInfo,
  // getRemainingOpeningsInfo,
  // getSummerReturnAirCFM,
  // getSummerSupplyAirCFM,
  // getSupplyAirESPInfo,
  // getSupplyAirOpeningInfo,
  // getUALInfo,
  // getUnitModel,
  // getUnitVoltage,
  // getValveAndActuatorInfo,
} from './handleUnitModel';
import ProjectInfoDialog from 'src/pages/project/components/newProjectDialog/ProjectInfoDialog';
import { useGetJobSelTables, useGetSavedJob } from 'src/hooks/useApi';
import CircularProgressLoading from 'src/components/loading';
// import { tr } from 'date-fns/locale';
// import { closestIndexTo } from 'date-fns';
import { getUnitModelCodes } from './getUnitNoteCodes';
import { UnitTypeContext } from './unitTypeDataContext';

//------------------------------------------------
type UnitInfoFormProps = {
  projectId: number;
  // projectName?:string;
  unitId?: number;
  intProductTypeID: number;
  intUnitTypeID: number;
  setIsSavedUnit?: Function;
  isSavedUnit?: boolean;
  setFunction?: Function;
  edit?: boolean;
  unitInfo?: any;
  db?: any;
  onSuccess?: Function;
  onError?: Function;
  txbProductType?: string;
  txbUnitType?: string;
  setCurrentStep?: Function;
  submitButtonRef?: any;
  setIsSaving: Function;
  moveNextStep: Function;
};


const intNOVA_MIN_CFM = 325;
const intNOVA_MAX_CFM = 9000;

const intNOVA_INT_USERS_MIN_CFM = 325;
const intNOVA_INT_USERS_MAX_CFM = 8100;
const intNOVA_HORIZONTAL_MAX_CFM = 3500;

const intVEN_MIN_CFM_NO_BYPASS = 325;
const intVEN_MAX_CFM_NO_BYPASS = 3000;
const intVEN_MIN_CFM_WITH_BYPASS = 325;
const intVEN_MAX_CFM_WITH_BYPASS = 3000;

const intVEN_INT_USERS_MIN_CFM_NO_BYPASS = 300;
const intVEN_INT_USERS_MAX_CFM_NO_BYPASS = 3048;
const intVEN_INT_USERS_MIN_CFM_WITH_BYPASS = 300;
const intVEN_INT_USERS_MAX_CFM_WITH_BYPASS = 3048;

const intVEN_MIN_CFM_PHI = 185;
const intVEN_MAX_CFM_PHI = 1480;

const intVENLITE_MIN_CFM_NO_BYPASS = 200;
const intVENLITE_MAX_CFM_NO_BYPASS = 500;
const intVENLITE_MIN_CFM_WITH_BYPASS = 200;
const intVENLITE_MAX_CFM_WITH_BYPASS = 500;

const intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS = 170;
const intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS = 500;
const intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS = 170;
const intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS = 500;

const intVENPLUS_MIN_CFM_NO_BYPASS = 1200;
const intVENPLUS_MAX_CFM_NO_BYPASS = 10000;
const intVENPLUS_MIN_CFM_WITH_BYPASS = 1200;
const intVENPLUS_MAX_CFM_WITH_BYPASS = 10000;

const intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS = 1080;
const intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS = 10500;
const intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS = 1080;
const intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS = 10500;

const intVENPLUS_MIN_CFM_PHI = 495;
const intVENPLUS_MAX_CFM_PHI = 7150;

const intTERA_MIN_CFM_NO_BYPASS = 450;
const intTERA_MAX_CFM_NO_BYPASS = 4800;
const intTERA_MIN_CFM_WITH_BYPASS = 450;
const intTERA_MAX_CFM_WITH_BYPASS = 4800;

const intTERA_INT_USERS_MIN_CFM_NO_BYPASS = 450;
const intTERA_INT_USERS_MAX_CFM_NO_BYPASS = 4800;
const intTERA_INT_USERS_MIN_CFM_WITH_BYPASS = 450;
const intTERA_INT_USERS_MAX_CFM_WITH_BYPASS = 4800;


export default function UnitInfoForm({
  projectId,
  // projectName,
  unitId,
  setIsSavedUnit,
  isSavedUnit,
  setFunction,
  edit = false,
  unitInfo,
  db,
  onSuccess,
  onError,
  intProductTypeID,
  intUnitTypeID,
  txbProductType,
  txbUnitType,
  setCurrentStep,
  submitButtonRef,
  setIsSaving,
  moveNextStep,
}: UnitInfoFormProps) {
  const api = useApiContext();
  const [isLoading, setIsLoading] = useState(true);
  const isResetCalled = useRef(false);
  const user = useAuthContext();
  const [isTagValue, setIsTagValue] = useState(false)
  const { unitTypeData, setUnitTypeData } = useContext(UnitTypeContext);
  // const isNewUnitSelected = localStorage?.getItem('isNewUnitSelected') || 0;

  // ------------------------------- Checkbox State -----------------------------------
  const [ckbBypass, setCkbBypassVal] = useState(false);

  // ------------------------- Initialize Checkbox Values -----------------------------
  // useEffect(() => {
  //   if (edit) {
  //     // setCkbBypassVal(!!unitInfo?.ckbBypassVal);

  //   }
  // }, [
  //   edit,
  //   unitInfo?.ckbBypassVal,
  //   unitInfo?.ckbDehumidificationChecked,
  //   unitInfo?.ckbDehumidificationVal,
  //   unitInfo?.ckbDownshot?.isDownshot,
  //   unitInfo?.ckbDrainPanVal,
  //   unitInfo?.ckbHeatPumpVal,
  //   unitInfo?.ckbValveAndActuatorVal,
  //   unitInfo?.ckbVoltageSPPVal,
  // ]);

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

  const { push } = useRouter();

//   // fetch data
//   const {
//     data: units,
//     refetch,
//   } = useGetAllUnits({
//     jobId: Number(projectId),
//   });

// const sortedUnits = units?.unitList.sort((a: any, b: any) => {
//   if ((a.unit_no) === String(unitId)) return -1;
//   if ((b.unit_no) === String(unitId)) return 1;  
//   return 0;                           
// });

  // useEffect(() => {
  //   refetch();
  // }, []);


  // ---------------------- Initalize Default Values ---------------------
  const defaultValues = useGetDefaultValue(edit, unitInfo, db);

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
  // const values = watch();
  const formValues = watch(); // watch()
  let formCurrValues = getValues();

  // if (Number(unitTypeData?.intUnitTypeID) > 0)
  if (Number(unitId) === 0)
  {
    intProductTypeID = unitTypeData?.intProductTypeID || 0;
    intUnitTypeID = unitTypeData?.intUnitTypeID || 0;
  }
  

  /*
   * Style functions that check if the compoment should be displayed or not
   */
  const getDisplay = useCallback((key: boolean) => ({ display: key ? 'block' : 'none' }), []);
  const getInlineDisplay = useCallback((key: boolean) => ({ display: key ? 'inline-flex' : 'none' }), []);

  // -------------------- Get All Unit Information --------------------------
  const getAllFormData = useCallback(
    () => ({
      ...getValues(),
      intProjectID: projectId,
      intUnitNo: edit ? unitId : 0,
      intProductTypeID,
      intUnitTypeID,
      ddlUnitType: intUnitTypeID,
      intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
      intUserID: typeof window !== 'undefined' && localStorage.getItem('userId'),
    }),
    [getValues, projectId, edit, unitId, intProductTypeID, intUnitTypeID]
  );

  // const oUC = {
  //  }

  // const formValues = getValues();

  const getUnitInputs = () => {
    // const jsonData = '{"name":"John", "age":30, "city":"London"}';
    // let oUnitInputs;
    formCurrValues = getValues();

    let heatingFluidTypeId;
    let heatingFluidConcenId;
    let heatingFluidEntTemp;
    let heatingFluidLvgTemp;
    let isVoltageSPP; // Temp used until switching to new ux

    if (Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC) {
      heatingFluidTypeId = formCurrValues.ddlReheatFluidType;
      heatingFluidConcenId = formCurrValues.ddlReheatFluidConcentration;
      // heatingFluidEntTemp = formCurrValues.txbReheatHWCFluidEntTemp;
      // heatingFluidLvgTemp = formCurrValues.txbReheatHWCFluidLvgTemp;
    } else if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC) {
      heatingFluidTypeId = formCurrValues.ddlHeatingFluidType;
      heatingFluidConcenId = formCurrValues.ddlHeatingFluidConcentration;
      // heatingFluidEntTemp = formCurrValues.txbHeatingHWCFluidEntTemp;
      // heatingFluidLvgTemp = formCurrValues.txbHeatingHWCFluidLvgTemp;
    } else {
      heatingFluidTypeId = formCurrValues.ddlPreheatFluidType;
      heatingFluidConcenId = formCurrValues.ddlPreheatFluidConcentration;
      // heatingFluidEntTemp = formCurrValues.txbPreheatHWCFluidEntTemp;
      // heatingFluidLvgTemp = formCurrValues.txbPreheatHWCFluidLvgTemp;
    }

    if (Number(getValues('ddlReheatComp')) === IDs.intCompIdElecHeater) {
      isVoltageSPP = formCurrValues.ckbReheatElecHeaterVoltageSPP;
    } else if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdElecHeater) {
      isVoltageSPP = formCurrValues.ckbHeatingElecHeaterVoltageSPP;
    } else {
      isVoltageSPP = formCurrValues.ckbPreheatElecHeaterVoltageSPP;
    }


    const oUnitInputs = {
      oUser: {
        intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
        intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
      },
      oUnit: {
        intJobId: projectId,
        intUnitNo: edit ? unitId : 0,
        intProdTypeId: intProductTypeID,
        intUnitTypeId: intUnitTypeID,
        strTag: formCurrValues.txbTag,
        intQty: formCurrValues.txbQty,
        intUnitVoltageId: Number(formCurrValues.ddlUnitVoltage),
        // intIsVoltageSPP: Number(formCurrValues.ckbVoltageSPP) === 1 ? 1 : 0,
        intIsVoltageSPP: Number(isVoltageSPP),
        intIsPHI: Number(formCurrValues.ckbPHI) === 1 ? 1 : 0,
        intIsBypass: Number(formCurrValues.ckbBypass) === 1 ? 1 : 0,
        intUnitModelId: Number(formCurrValues.ddlUnitModel),
        intSelectionTypeId: 0,
        intLocationId: Number(formCurrValues.ddlLocation),
        intIsDownshot: Number(formCurrValues.ckbDownshot) === 1 ? 1 : 0,
        intOrientationId: Number(formCurrValues.ddlOrientation),
        intControlsPreferenceId: Number(formCurrValues.ddlControlsPref),
        intControlViaId: Number(formCurrValues.ddlControlVia),
        strConfigNotes: formCurrValues.txbConfigNotes !== null ? formCurrValues.txbConfigNotes : '',
      },
      oUnitAirflow: {
        intJobId: projectId,
        intUnitNo: edit ? unitId : 0,
        intProdTypeId: intProductTypeID,
        intUnitTypeId: intUnitTypeID,
        intAltitude: formCurrValues.txbAltitude,
        intSummerSupplyAirCFM: formCurrValues.txbSummerSupplyAirCFM,
        intSummerReturnAirCFM: formCurrValues.txbSummerReturnAirCFM,
        intWinterSupplyAirCFM: formCurrValues.txbSummerSupplyAirCFM,
        intWinterReturnAirCFM: formCurrValues.txbSummerReturnAirCFM,
        // dblSummerOutdoorAirDB: formCurrValues.txbSummerOutdoorAirDB,
        // dblSummerOutdoorAirWB: formCurrValues.txbSummerOutdoorAirWB,
        // dblSummerOutdoorAirRH: formCurrValues.txbSummerOutdoorAirRH,
        // dblWinterOutdoorAirDB: formCurrValues.txbWinterOutdoorAirDB,
        // dblWinterOutdoorAirWB: formCurrValues.txbWinterOutdoorAirWB,
        // dblWinterOutdoorAirRH: formCurrValues.txbWinterOutdoorAirRH,
        // dblSummerReturnAirDB: formCurrValues.txbSummerReturnAirDB,
        // dblSummerReturnAirWB: formCurrValues.txbSummerReturnAirWB,
        // dblSummerReturnAirRH: formCurrValues.txbSummerReturnAirRH,
        // dblWinterReturnAirDB: formCurrValues.txbWinterReturnAirDB,
        // dblWinterReturnAirWB: formCurrValues.txbWinterReturnAirWB,
        // dblWinterReturnAirRH: formCurrValues.txbWinterReturnAirRH,
        dblSummerOutdoorAirDB: unitInfo?.dbtSavedJob?.[0]?.summer_outdoor_air_db,
        dblSummerOutdoorAirWB: unitInfo?.dbtSavedJob?.[0]?.summer_outdoor_air_wb,
        dblSummerOutdoorAirRH: unitInfo?.dbtSavedJob?.[0]?.summer_outdoor_air_rh,
        dblWinterOutdoorAirDB: unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_db,
        dblWinterOutdoorAirWB: unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_wb,
        dblWinterOutdoorAirRH: unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_rh,
        dblSummerReturnAirDB: unitInfo?.dbtSavedJob?.[0]?.summer_return_air_db,
        dblSummerReturnAirWB: unitInfo?.dbtSavedJob?.[0]?.summer_return_air_wb,
        dblSummerReturnAirRH: unitInfo?.dbtSavedJob?.[0]?.summer_return_air_rh,
        dblWinterReturnAirDB: unitInfo?.dbtSavedJob?.[0]?.winter_return_air_db,
        dblWinterReturnAirWB: unitInfo?.dbtSavedJob?.[0]?.winter_return_air_wb,
        dblWinterReturnAirRH: unitInfo?.dbtSavedJob?.[0]?.winter_return_air_rh,
        dblMixSummerOA_CFMPct: Number(formCurrValues.txbMixSummerOA_CFMPct),
        dblMixWinterOA_CFMPct: Number(formCurrValues.txbMixWinterOA_CFMPct),
        intIsMixUseProjectDefault: Number(formCurrValues.ckbMixUseProjectDefault) === 1 ? 1 : 0,
        dblMixSummerOutdoorAirDB: formCurrValues.txbMixSummerOA_DB,
        dblMixSummerOutdoorAirWB: formCurrValues.txbMixSummerOA_WB,
        dblMixSummerOutdoorAirRH: formCurrValues.txbMixSummerOA_RH,
        dblMixWinterOutdoorAirDB: formCurrValues.txbMixWinterOA_DB,
        dblMixWinterOutdoorAirWB: formCurrValues.txbMixWinterOA_WB,
        dblMixWinterOutdoorAirRH: formCurrValues.txbMixWinterOA_RH,
        dblMixSummerReturnAirDB: formCurrValues.txbMixSummerRA_DB,
        dblMixSummerReturnAirWB: formCurrValues.txbMixSummerRA_WB,
        dblMixSummerReturnAirRH: formCurrValues.txbMixSummerRA_RH,
        dblMixWinterReturnAirDB: formCurrValues.txbMixWinterRA_DB,
        dblMixWinterReturnAirWB: formCurrValues.txbMixWinterRA_WB,
        dblMixWinterReturnAirRH: formCurrValues.txbMixWinterRA_RH,
        dblSupplyAirESP: formCurrValues.txbSupplyAirESP,
        dblExhaustAirESP: formCurrValues.txbExhaustAirESP,
      },
      oUnitCompOpt: {
        intJobId: projectId,
        intUnitNo: edit ? unitId : 0,
        intProdTypeId: intProductTypeID,
        intUnitTypeId: intUnitTypeID,
        intOAFilterModelId: Number(formCurrValues.ddlOA_FilterModel),
        intSAFinalFilterModelId: 0,
        intRAFilterModelId: Number(formCurrValues.ddlRA_FilterModel),
        intFilterConditionId: Number(formCurrValues.ddlFilterCondition),
        dblOAFilterPD: Number(formCurrValues.txbOA_FilterPD),
        dblRAFilterPD: Number(formCurrValues.txbRA_FilterPD),
        intIsMixingBox: Number(formCurrValues.ckbMixingBox) === 1 ? 1 : 0,
       
        intPreheatCompId: Number(formCurrValues.ddlPreheatComp),
        intPreheatElecHeaterInstallationId: Number(formCurrValues.ddlPreheatElecHeaterInstall),
        intPreheatElecHeaterVoltageId: Number(formCurrValues.ddlPreheatElecHeaterVoltage),
        intIsPreheatElecHeaterVoltageSPP: Number(formCurrValues.ckbPreheatElecHeaterVoltageSPP) === 1 ? 1 : 0,
        intPreheatFluidTypeId: formCurrValues.ddlPreheatFluidType,
        intPreheatFluidConcentId: formCurrValues.ddlPreheatFluidConcentration,
        dblPreheatFluidEntTemp: formCurrValues.txbPreheatHWCFluidEntTemp,
        dblPreheatFluidLvgTemp: formCurrValues.txbPreheatHWCFluidLvgTemp,
        dblPreheatSetpointDB: formCurrValues.txbWinterPreheatSetpointDB,
        intIsPreheatAutoSize: Number(formCurrValues.ckbPreheatAutoSize) === 1 ? 1 : 0,
        intIsPreheatValveAndActuatorIncluded: Number(formCurrValues.ckbPreheatHWCValveAndActuator) === 1 ? 1 : 0,
        intPreheatValveTypeId: Number(formCurrValues.ddlPreheatHWCValveType),
        intPreheatElecHeaterStdCoilNo: 0,
        intPreheatHWCValveAndActuatorId: 0,
        intIsPreheatElecHeatBackupOnly: Number(formCurrValues.ckbMixUseProjectDefault) === 1 ? 1 : 0,
       
        intHeatExchCompId: Number(formCurrValues.ddlHeatExchComp),
       
        intCoolingCompId: Number(formCurrValues.ddlCoolingComp),
        intIsHeatPump: Number(formCurrValues.ckbHeatPump) === 1 ? 1 : 0, // Do not use formValues.ckbHeatPump === true
        intIsDehumidification: Number(formCurrValues.ckbDehumidification) === 1 ? 1 : 0, // Do not use formValues.ckbDehumidification === true
        intCoolingFluidTypeId: Number(formCurrValues.ddlCoolingFluidType),
        intCoolingFluidConcentId: Number(formCurrValues.ddlCoolingFluidConcentration),
        dblCoolingFluidEntTemp: formCurrValues.txbCoolingCWCFluidEntTemp,
        dblCoolingFluidLvgTemp: formCurrValues.txbCoolingCWCFluidLvgTemp,
        intIsDaikinVRV: Number(formCurrValues.ckbDaikinVRV) === 1 ? 1 : 0, // Do not use formValues.ckbDaikinVRV === true
        intEKEXVKitInstallId: Number(formCurrValues.ddlEKEXVKitInstallation),
        dblRefrigSuctionTemp: formCurrValues.txbRefrigSuctionTemp,
        dblRefrigLiquidTemp: formCurrValues.txbRefrigLiquidTemp,
        dblRefrigSuperheatTemp: formCurrValues.txbRefrigSuperheatTemp,
        dblCoolingSetpointDB: formCurrValues.txbSummerCoolingSetpointDB,
        dblCoolingSetpointWB: formCurrValues.txbSummerCoolingSetpointWB,
        intIsCoolingValveAndActuatorIncluded: Number(formCurrValues.ckbCoolingCWCValveAndActuator) === 1 ? 1 : 0,
        intCoolingValveTypeId: Number(formCurrValues.ddlCoolingCWCValveType),
        intCoolingCWCValveAndActuatorId: 0,
        intCoolingDX_VRVKitQty: 0,
        dblCoolingDX_VRVKitTonnage: 0,


        intHeatingCompId: Number(formCurrValues.ddlHeatingComp),
        intHeatingElecHeaterInstallationId: formCurrValues.ddlHeatingElecHeaterInstall,
        intHeatingElecHeaterVoltageId: Number(formCurrValues.ddlHeatingElecHeaterVoltage),
        intIsHeatingElecHeaterVoltageSPP: Number(formCurrValues.ckbHeatingElecHeaterVoltageSPP) === 1 ? 1 : 0,
        intHeatingFluidTypeId: formCurrValues.ddlHeatingFluidType,
        intHeatingFluidConcentId: formCurrValues.ddlHeatingFluidConcentration,
        dblHeatingFluidEntTemp: formCurrValues.txbHeatingHWCFluidEntTemp,
        dblHeatingFluidLvgTemp: formCurrValues.txbHeatingHWCFluidLvgTemp,
        dblHeatingSetpointDB: formCurrValues.txbWinterHeatingSetpointDB,
        intIsHeatingValveAndActuatorIncluded: Number(formCurrValues.ckbHeatingHWCValveAndActuator) === 1 ? 1 : 0,
        intHeatingValveTypeId: Number(formCurrValues.ddlHeatingHWCValveType),
        intHeatingElecHeaterStdCoilNo: 0,
        intHeatingHWCValveAndActuatorId: 0,

        intReheatCompId: Number(formCurrValues.ddlReheatComp),
        intReheatElecHeaterInstallationId: formCurrValues.ddlReheatElecHeaterInstall,    
        intReheatElecHeaterVoltageId: Number(formCurrValues.ddlReheatElecHeaterVoltage),
        intIsReheatElecHeaterVoltageSPP: Number(formCurrValues.ckbReheatElecHeaterVoltageSPP) === 1 ? 1 : 0,
        intReheatFluidTypeId: formCurrValues.ddlReheatFluidType,
        intReheatFluidConcentId: formCurrValues.ddlReheatFluidConcentration,
        dblReheatFluidEntTemp: formCurrValues.txbReheatHWCFluidEntTemp,
        dblReheatFluidLvgTemp: formCurrValues.txbReheatHWCFluidLvgTemp,
        dblRefrigCondensingTemp: formCurrValues.txbRefrigCondensingTemp,
        dblRefrigVaporTemp: formCurrValues.txbRefrigVaporTemp,
        dblRefrigSubcoolingTemp: formCurrValues.txbRefrigSubcoolingTemp,
        dblReheatSetpointDB: formCurrValues.txbSummerReheatSetpointDB,
        intIsReheatValveAndActuatorIncluded: Number(formCurrValues.ckbReheatHWCValveAndActuator) === 1 ? 1 : 0,
        intReheatValveTypeId: Number(formCurrValues.ddlReheatHWCValveType),
        intReheatElecHeaterStdCoilNo: 0,
        intReheatHWCValveAndActuatorId: 0,
        intReheatHGRC_VRVKitQty: 0,
        dblReheatHGRC_VRVKitTonnage: 0,

        intIsBackupHeating: Number(formCurrValues.ckbBackupHeating) === 1 ? 1 : 0,
        dblBackupHeatingSetpointDB:  formCurrValues.txbBackupHeatingSetpointDB,


        // intHeatingElecHeaterInstallationId:
        //   Number(getValues('ddlReheatComp')) === IDs.intCompIdElecHeater
        //     ? formCurrValues.ddlReheatElecHeaterInstall
        //     : formCurrValues.ddlHeatingElecHeaterInstall,

        // intHeatingFluidTypeId: heatingFluidTypeId,
        // intHeatingFluidConcentId: heatingFluidConcenId,
        // dblHeatingFluidEntTemp: heatingFluidEntTemp,
        // dblHeatingFluidLvgTemp: heatingFluidLvgTemp,

        // intIsValveAndActuatorIncluded: Number(formCurrValues.ckbValveAndActuator) === 1 ? 1 : 0,
        // intValveTypeId: Number(formCurrValues.ddlValveType),
        intDamperAndActuatorId: Number(formCurrValues.ddlDamperAndActuator),
        intIsDrainPan: Number(formCurrValues.ckbDrainPan) === 1 ? 1 : 0,
        intIsHeatExchEA_Warning: 0,
        intElecHeaterQty:0,
      },
      oUnitCompOptCust: {
        intJobId: projectId,
        intUnitNo: edit ? unitId : 0,
        intProdTypeId: intProductTypeID,
        intUnitTypeId: intUnitTypeID,
        intIsPreheatHWCUseCap: Number(formCurrValues.ckbPreheatHWCUseCap) === 1 ? 1 : 0,
        dblPreheatHWCCap: formCurrValues.txbPreheatHWCCap,
        intIsPreheatHWCUseFlowRate: Number(formCurrValues.ckbPreheatHWCUseFluidFlowRate) === 1 ? 1 : 0,
        dblPreheatHWCFlowRate: formCurrValues.txbPreheatHWCFluidFlowRate,
        intIsCoolingCWCUseCap: Number(formCurrValues.ckbCoolingCWCUseCap) === 1 ? 1 : 0,
        dblCoolingCWCCap: formCurrValues.txbCoolingCWCCap,
        intIsCoolingCWCUseFlowRate: Number(formCurrValues.ckbCoolingCWCUseFluidFlowRate) === 1 ? 1 : 0,
        dblCoolingCWCFlowRate: formCurrValues.txbCoolingCWCFluidFlowRate,
        intIsHeatingHWCUseCap: Number(formCurrValues.ckbHeatingHWCUseCap) === 1 ? 1 : 0,
        dblHeatingHWCCap: formCurrValues.txbHeatingHWCCap,
        intIsHeatingHWCUseFlowRate: Number(formCurrValues.ckbHeatingHWCUseFluidFlowRate) === 1 ? 1 : 0,
        dblHeatingHWCFlowRate: formCurrValues.txbHeatingHWCFluidFlowRate,
        intIsReheatHWCUseCap: Number(formCurrValues.ckbReheatHWCUseCap) === 1 ? 1 : 0,
        dblReheatHWCCap: formCurrValues.txbReheatHWCCap,
        intIsReheatHWCUseFlowRate: Number(formCurrValues.ckbReheatHWCUseFluidFlowRate) === 1 ? 1 : 0,
        dblReheatHWCFlowRate: formCurrValues.txbReheatHWCFluidFlowRate,
      },
      oUnitLayout: {
        intJobId: projectId,
        intUnitNo: edit ? unitId : 0,
        intProdTypeId: intProductTypeID,
        intUnitTypeId: intUnitTypeID,
        intHandingId: Number(formCurrValues.ddlHanding),
        intPreheatCoilHandingId: formCurrValues.ddlPreheatCoilHanding,
        intCoolingCoilHandingId: formCurrValues.ddlCoolingCoilHanding,
        intHeatingCoilHandingId: formCurrValues.ddlHeatingCoilHanding,
        intSAOpeningId: formCurrValues.ddlSupplyAirOpening,
        strSAOpening: formCurrValues.ddlSupplyAirOpeningText,
        intEAOpeningId: formCurrValues.ddlExhaustAirOpening,
        strEAOpening: formCurrValues.ddlExhaustAirOpeningText,
        intOAOpeningId: formCurrValues.ddlOutdoorAirOpening,
        strOAOpening: formCurrValues.ddlOutdoorAirOpeningText,
        intRAOpeningId: formCurrValues.ddlReturnAirOpening,
        strRAOpening: formCurrValues.ddlReturnAirOpeningText,
        intMixOADamperPosId: formCurrValues.ddlMixOADamperPos,
        intMixRADamperPosId: formCurrValues.ddlMixRADamperPos,
      },
    };

    return oUnitInputs;
  };


  // --------------------------- Submit (Save) -----------------------------
  const onSubmit = useCallback(async () => {

    try {
      const oUC: any = getUnitInputs();
      if(oUC.oUnit.strTag){
      setIsSaving(true);
      // const data = await api.project.saveUnitInfo(getAllFormData1());
      // formValues = getValues();
      // const oUC = getAllFormData1(formValues);
      const data = await api.project.saveUnit(oUC);
      if (onSuccess) {
        onSuccess(true);
        unitId = data?.intUnitNo;
        push(PATH_APP.selectionUnit(projectId?.toString() || '0', unitId?.toString() || '0'));
        // <Selection
        // intJobId={Number(projectId)}
        // intUnitNo={Number(unitId)}
        // intProdTypeId={0}
        // />
      }
      if (setIsSavedUnit) setIsSavedUnit(data?.intUnitNo || 0);

      push(PATH_APP.selectionUnit(projectId?.toString() || '0', unitId?.toString() || '0'));
      moveNextStep();
    }
  else{
    setIsTagValue(true)
  }
  } catch (e) {
      console.log(e);
      if (onError) onError(true);
    }
    setIsSaving(false);
  }, [edit, onSuccess, onError, getAllFormData, setIsSavedUnit]);



  // let imgLayoutPathAndFile = "";

  // const [phiInfo, setPHIInfo] = useState<any>([]);
  // const [isCheckedMixingBox, setIsCheckedMixingBox] = useState<boolean>(false);

  const [phiIsVisible, setPHIIsVisible] = useState<boolean>(false);
  const [phiIsEnabled, setPHIIsEnabled] = useState<boolean>(false);
  const [phiIsChecked, setPHIIsChecked] = useState<boolean>(false);
  const [bypassIsVisible, setBypassIsVisible] = useState<boolean>(false);
  const [bypassIsEnabled, setBypassIsEnabled] = useState<boolean>(false);
  const [bypassIsChecked, setBypassIsChecked] = useState<boolean>(false);
  const [bypassMsg, setBypassMsg] = useState<string>('');
  const [voltageSPPIsVisible, setVoltageSPPIsVisible] = useState<boolean>(false);
  const [voltageSPPIsEnabled, setVoltageSPPIIsEnabled] = useState<boolean>(false);
  const [voltageSPPIsChecked, setVoltageSPPIIsChecked] = useState<boolean>(false);

  const [filterCondtionOptions, setFilterCondtionOptions] = useState<any>([]);
  const [filterConditionId, setFilterConditionId] = useState<number>(0);

  const [preheatHWCValveTypeOptions, setPreheatHWCValveTypeOptions] = useState<any>([]);
  const [coolingCWCValveTypeOptions, setCoolingCWCValveTypeOptions] = useState<any>([]);
  const [heatingHWCValveTypeOptions, setHeatingHWCValveTypeOptions] = useState<any>([]);
  const [reheatHWCValveTypeOptions, setReheatHWCValveTypeOptions] = useState<any>([]);

  const [preheatElecHeaterVoltageTable, setPreheatElecHeaterVoltageTable] = useState<any>([]);
  const [isVisibleDdlPreheatElecHeaterVoltage, setIsVisibleDdlPreheatElecHeaterVoltage] = useState<any>([]);
  const [isEnabledDdlPreheatElecHeaterVoltage, setIsEnabledDdlPreheatElecHeaterVoltage] = useState<any>([]);

  const [isVisibleDdlPreheatHWCValveType, setIsVisibleDdlPreheatHWCValveType] = useState<boolean>(false);
  const [isVisibleDdlCoolingCWCValveType, setIsVisibleDdlCoolingCWCValveType] = useState<boolean>(false);
  const [isVisibleDdlHeatingHWCValveType, setIsVisibleDdlHeatingHWCValveType] = useState<boolean>(false);
  const [isVisibleDdlReheatHWCValveType, setIsVisibleDdlReheatHWCValveType] = useState<boolean>(false);

  
  const [heatingElecHeaterVoltageTable, setHeatingElecHeaterVoltageTable] = useState<any>([]);
  const [isVisibleDdlHeatingElecHeaterVoltage, setIsVisibleDdlHeatingElecHeaterVoltage] = useState<any>([]);
  const [isEnabledDdlHeatingElecHeaterVoltage, setIsEnabledDdlHeatingElecHeaterVoltage] = useState<any>([]);

  const [reheatElecHeaterVoltageTable, setReheatElecHeaterVoltageTable] = useState<any>([]);
  const [isVisibleDdlReheatElecHeaterVoltage, setIsVisibleDdlReheatElecHeaterVoltage] = useState<any>([]);
  const [isEnabledDdlReheatElecHeaterVoltage, setIsEnabledDdlReheatElecHeaterVoltage] = useState<any>([]);

  const [ckbPreheatHWCUseFluidLvgTempValue, setCkbPreheatHWCUseFluidLvgTempValue] = useState<number>(0);
  const [ckbPreheatHWCUseFluidFlowRateValue, setCkbPreheatHWCUseFluidFlowRateValue] = useState<number>(0);
  const [isTxbPreheatHWCFluidLvgTempEnabled, setIsTxbPreheatHWCFluidLvgTempEnabled] = useState<boolean>(false);
  const [isTxbPreheatHWCFluidFlowRateEnabled, setIsTxbPreheatHWCFluidFlowRateEnabled] = useState<boolean>(false);

  const [isTxbPreheatSetpointEnabled, setIsTxbPreheatSetpointEnabled] = useState<boolean>(false);

  const [ckbCoolingCWCUseFluidLvgTempValue, setCkbCoolingCWCUseFluidLvgTempValue] = useState<boolean>(false);
  const [ckbCoolingCWCUseFluidFlowRateValue, setCkbCoolingCWCUseFluidFlowRateValue] = useState<boolean>(false);
  const [isTxbCoolingCWCFluidLvgTempEnabled, setIsTxbCoolingCWCFluidLvgTempEnabled] = useState<boolean>(false);
  const [isTxbCoolingCWCFluidFlowRateEnabled, setIsTxbCoolingCWCFluidFlowRateEnabled] = useState<boolean>(false);


  const [ckbHeatingHWCUseFluidLvgTempValue, setCkbHeatingHWCUseFluidLvgTempValue] = useState<boolean>(false);
  const [ckbHeatingHWCUseFluidFlowRateValue, setCkbHeatingHWCUseFluidFlowRateValue] = useState<boolean>(false);
  const [isTxbHeatingHWCFluidLvgTempEnabled, setIsTxbHeatingHWCFluidLvgTempEnabled] = useState<boolean>(false);
  const [isTxbHeatingHWCFluidFlowRateEnabled, setIsTxbHeatingHWCFluidFlowRateEnabled] = useState<boolean>(false);

  const [ckbReheatHWCUseFluidLvgTempValue, setCkbReheatHWCUseFluidLvgTempValue] = useState<boolean>(false);
  const [ckbReheatHWCUseFluidFlowRateValue, setCkbReheatHWCUseFluidFlowRateValue] = useState<boolean>(false);
  const [isTxbReheatHWCFluidLvgTempEnabled, setIsTxbReheatHWCFluidLvgTempEnabled] = useState<boolean>(false);
  const [isTxbReheatHWCFluidFlowRateEnabled, setIsTxbReheatHWCFluidFlowRateEnabled] = useState<boolean>(false);

  const [ekexvKitInstallTable, setEkexvKitInstallTable] = useState<any>([]);
  const [ekexvKitInstallIsVisible, setEkexvKitInstallIsVisible] = useState<any>([]);
  const [ekexvKitInstallIsEnabled, setEkexvKitInstallIsEnabled] = useState<any>([]);

  const [isPreheatSetpointVisible, setIsPreheatSetpointVisible] = useState<any>([]);
  const [isHeatingSectionVisible, setIsHeatingSectionVisible] = useState<any>([]);
  const [isHeatingSetpointVisible, setIsHeatingSetpointVisible] = useState<any>([]);

  const [isVisibleDdlPreheatCoilHanding, setIsVisibleDdlPreheatCoilHanding] = useState<boolean>(false);
  const [isVisibleDdlCoolingCoilHanding, setIsVisibleDdlCoolingCoilHanding] = useState<boolean>(false);
  const [isVisibleDdlHeatingCoilHanding, setIsVisibleDdlHeatingCoilHanding] = useState<boolean>(false);
  const [isVisibleDdlReheatCoilHanding, setIsVisibleDdlReheatCoilHanding] = useState<boolean>(false);

  const [isVisibleDdlSupplyAirOpeningVisible, setIsVisibleDdlSupplyAirOpeningVisible] = useState<boolean>(false);
  const [isVisibleDdlOutdoorAirOpeningVisible, setIsVisibleDdlOutdoorAirOpeningVisible] = useState<boolean>(false);
  const [isVisibleDdlReturnAirOpeningVisible, setIsVisibleDdlReturnAirOpeningVisible] = useState<boolean>(false);
  const [isVisibleDdlExhaustAirOpeningVisible, setIsVisibleDdlExhaustAirOpeningVisible] = useState<boolean>(false);

  const [imgLayoutPathAndFile, setImgLayoutPathAndFile] = useState<any>([]);

  const getUMC = () => {
    let umc;
    let fdtUnitModel = [];

    if (Number(getValues('ddlUnitModel')) > 0) {
    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeIdNova:
        fdtUnitModel = db.dbtSelNovaUnitModel;
        break;
      case IDs.intProdTypeIdVentum:
        fdtUnitModel = db.dbtSelVentumHUnitModel;
        break;
      case IDs.intProdTypeIdVentumLite:
        fdtUnitModel = db.dbtSelVentumLiteUnitModel;
        break;
      case IDs.intProdTypeIdVentumPlus:
        fdtUnitModel = db.dbtSelVentumPlusUnitModel;
        break;
      case IDs.intProdTypeIdTerra:
        fdtUnitModel = db.dbtSelTerraUnitModel;
        break;
      default:
        break;
    }

    const unitModelValue = fdtUnitModel?.filter((item: {id: number}) => item.id === Number(getValues('ddlUnitModel')))?.[0]?.value;

    umc = getUnitModelCodes(unitModelValue, intProductTypeID, intUnitTypeID, getValues('ddlLocation'),
                                  getValues('ddlOrientation'), Number(getValues('ckbBypass')), db);
    }

    return umc
  };


  const getSupplyAirCFM = () => {
    // const jsonData = '{"name":"John", "age":30, "city":"London"}';
    // let oUnitInputs;

      let intSummerSupplyAirCFM = Number(getValues('txbSummerSupplyAirCFM'));
      const intUAL = typeof window !== 'undefined' && Number(localStorage?.getItem('UAL')) || 0;

      switch (intProductTypeID) {
        case IDs.intProdTypeIdNova:
          if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
              intUAL === IDs.intUAL_IntLvl_2 || intUAL === IDs.intUAL_IntLvl_1
          ) {
            if (intSummerSupplyAirCFM < intNOVA_MIN_CFM) {
              intSummerSupplyAirCFM = intNOVA_MIN_CFM;
            } else if (intSummerSupplyAirCFM > intNOVA_MAX_CFM) {
              intSummerSupplyAirCFM = intNOVA_MAX_CFM;
            }
          } else if (intSummerSupplyAirCFM < intNOVA_INT_USERS_MIN_CFM) {
            intSummerSupplyAirCFM = intNOVA_INT_USERS_MIN_CFM;
          } else if (intSummerSupplyAirCFM > intNOVA_INT_USERS_MAX_CFM) {
            intSummerSupplyAirCFM = intNOVA_INT_USERS_MAX_CFM;
          }
          break;
        case IDs.intProdTypeIdVentum:
          if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
              intUAL === IDs.intUAL_IntLvl_2 || intUAL === IDs.intUAL_IntLvl_1
          ) {
            if (Number(getValues('ckbPHI')) === 1) {
              if (intSummerSupplyAirCFM < intVEN_MIN_CFM_PHI) {
                intSummerSupplyAirCFM = intVEN_MIN_CFM_PHI;
              } else if (intSummerSupplyAirCFM > intVEN_MAX_CFM_PHI) {
                intSummerSupplyAirCFM = intVEN_MAX_CFM_PHI;
              }
            } else if (Number(getValues('ckbBypass')) === 1) {
              if (intSummerSupplyAirCFM < intVEN_INT_USERS_MIN_CFM_WITH_BYPASS) {
                intSummerSupplyAirCFM = intVEN_INT_USERS_MIN_CFM_WITH_BYPASS;
              } else if (intSummerSupplyAirCFM > intVEN_INT_USERS_MAX_CFM_WITH_BYPASS) {
                intSummerSupplyAirCFM = intVEN_INT_USERS_MAX_CFM_WITH_BYPASS;
              }
            } else if (intSummerSupplyAirCFM < intVEN_INT_USERS_MIN_CFM_NO_BYPASS) {
              intSummerSupplyAirCFM = intVEN_INT_USERS_MIN_CFM_NO_BYPASS;
            } else if (intSummerSupplyAirCFM > intVEN_INT_USERS_MAX_CFM_NO_BYPASS) {
              intSummerSupplyAirCFM = intVEN_INT_USERS_MAX_CFM_NO_BYPASS;
            }
          } else if (Number(getValues('ckbBypass')) === 1) {
            if (intSummerSupplyAirCFM < intVEN_MIN_CFM_WITH_BYPASS) {
              intSummerSupplyAirCFM = intVEN_MIN_CFM_WITH_BYPASS;
            } else if (intSummerSupplyAirCFM > intVEN_MAX_CFM_WITH_BYPASS) {
              intSummerSupplyAirCFM = intVEN_MAX_CFM_WITH_BYPASS;
            }
          } else if (intSummerSupplyAirCFM < intVEN_MIN_CFM_NO_BYPASS) {
            intSummerSupplyAirCFM = intVEN_MIN_CFM_NO_BYPASS;
          } else if (intSummerSupplyAirCFM > intVEN_MAX_CFM_NO_BYPASS) {
            intSummerSupplyAirCFM = intVEN_MAX_CFM_NO_BYPASS;
          }
          break;
        case IDs.intProdTypeIdVentumLite:
          if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
              intUAL === IDs.intUAL_IntLvl_2 || intUAL === IDs.intUAL_IntLvl_1
          ) {
            if (Number(getValues('ckbBypass')) === 1) {
              if (intSummerSupplyAirCFM < intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS) {
                intSummerSupplyAirCFM = intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS;
              } else if (intSummerSupplyAirCFM > intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS) {
                intSummerSupplyAirCFM = intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS;
              }
            } else if (intSummerSupplyAirCFM < intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS) {
              intSummerSupplyAirCFM = intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS;
            } else if (intSummerSupplyAirCFM > intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS) {
              intSummerSupplyAirCFM = intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS;
            }
          } else if (Number(getValues('ckbBypass')) === 1) {
            if (intSummerSupplyAirCFM < intVENLITE_MIN_CFM_WITH_BYPASS) {
              intSummerSupplyAirCFM = intVENLITE_MIN_CFM_WITH_BYPASS;
            } else if (intSummerSupplyAirCFM > intVENLITE_MAX_CFM_WITH_BYPASS) {
              intSummerSupplyAirCFM = intVENLITE_MAX_CFM_WITH_BYPASS;
            }
          } else if (intSummerSupplyAirCFM < intVENLITE_MIN_CFM_NO_BYPASS) {
            intSummerSupplyAirCFM = intVENLITE_MIN_CFM_NO_BYPASS;
          } else if (intSummerSupplyAirCFM > intVENLITE_MAX_CFM_NO_BYPASS) {
            intSummerSupplyAirCFM = intVENLITE_MAX_CFM_NO_BYPASS;
          }
          break;
        case IDs.intProdTypeIdVentumPlus:
          if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
              intUAL === IDs.intUAL_IntLvl_2 || intUAL === IDs.intUAL_IntLvl_1
          ) {
            if (Number(getValues('ckbPHI')) === 1) {
              if (intSummerSupplyAirCFM < intVENPLUS_MIN_CFM_PHI) {
                intSummerSupplyAirCFM = intVENPLUS_MIN_CFM_PHI;
              } else if (intSummerSupplyAirCFM > intVENPLUS_MAX_CFM_PHI) {
                intSummerSupplyAirCFM = intVENPLUS_MAX_CFM_PHI;
              }
            } else if (Number(getValues('ckbBypass')) === 1) {
              if (intSummerSupplyAirCFM < intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS) {
                intSummerSupplyAirCFM = intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS;
              } else if (intSummerSupplyAirCFM > intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS) {
                intSummerSupplyAirCFM = intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS;
              }
            } else if (intSummerSupplyAirCFM < intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS) {
              intSummerSupplyAirCFM = intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS;
            } else if (intSummerSupplyAirCFM > intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS) {
              intSummerSupplyAirCFM = intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS;
            }
          } else if (Number(getValues('ckbBypass')) === 1) {
            if (intSummerSupplyAirCFM < intVENPLUS_MIN_CFM_WITH_BYPASS) {
              intSummerSupplyAirCFM = intVENPLUS_MIN_CFM_WITH_BYPASS;
            } else if (intSummerSupplyAirCFM > intVENPLUS_MAX_CFM_WITH_BYPASS) {
              intSummerSupplyAirCFM = intVENPLUS_MAX_CFM_WITH_BYPASS;
            }
          } else if (intSummerSupplyAirCFM < intVENPLUS_MIN_CFM_NO_BYPASS) {
            intSummerSupplyAirCFM = intVENPLUS_MIN_CFM_NO_BYPASS;
          } else if (intSummerSupplyAirCFM > intVENPLUS_MAX_CFM_NO_BYPASS) {
            intSummerSupplyAirCFM = intVENPLUS_MAX_CFM_NO_BYPASS;
          }
          break;
        case IDs.intProdTypeIdTerra:
          if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin || 
              intUAL === IDs.intUAL_IntLvl_2 || intUAL === IDs.intUAL_IntLvl_1
          ) {
            if (Number(getValues('ckbBypass')) === 1) {
              if (intSummerSupplyAirCFM < intTERA_INT_USERS_MIN_CFM_WITH_BYPASS) {
                intSummerSupplyAirCFM = intTERA_INT_USERS_MIN_CFM_WITH_BYPASS;
              } else if (intSummerSupplyAirCFM > intTERA_INT_USERS_MAX_CFM_WITH_BYPASS) {
                intSummerSupplyAirCFM = intTERA_INT_USERS_MAX_CFM_WITH_BYPASS;
              }
            } else if (intSummerSupplyAirCFM < intTERA_INT_USERS_MIN_CFM_NO_BYPASS) {
              intSummerSupplyAirCFM = intTERA_INT_USERS_MIN_CFM_NO_BYPASS;
            } else if (intSummerSupplyAirCFM > intTERA_INT_USERS_MAX_CFM_NO_BYPASS) {
              intSummerSupplyAirCFM = intTERA_INT_USERS_MAX_CFM_NO_BYPASS;
            }
          } else if (Number(getValues('ckbBypass')) === 1) {
            if (intSummerSupplyAirCFM < intTERA_MIN_CFM_WITH_BYPASS) {
              intSummerSupplyAirCFM = intTERA_MIN_CFM_WITH_BYPASS;
            } else if (intSummerSupplyAirCFM > intTERA_MAX_CFM_WITH_BYPASS) {
              intSummerSupplyAirCFM = intTERA_MAX_CFM_WITH_BYPASS;
            }
          } else if (intSummerSupplyAirCFM < intTERA_MIN_CFM_NO_BYPASS) {
            intSummerSupplyAirCFM = intTERA_MIN_CFM_NO_BYPASS;
          } else if (intSummerSupplyAirCFM > intTERA_MAX_CFM_NO_BYPASS) {
            intSummerSupplyAirCFM = intTERA_MAX_CFM_NO_BYPASS;
          }
          break;
        default:
          break;
      }


    return intSummerSupplyAirCFM;
  };


  const getReturnAirCFM = () => {

    let intSummerReturnAirCFM = Number(getValues('txbSummerReturnAirCFM'));
    const intSummerSupplyAirCFM = Number(getValues('txbSummerSupplyAirCFM'));
    const intUAL = typeof window !== 'undefined' && Number(localStorage?.getItem('UAL')) || 0;


    if ( getValues('ddlOrientation') === IDs.intOrientationIdHorizontal && intSummerReturnAirCFM > intNOVA_HORIZONTAL_MAX_CFM) {
      intSummerReturnAirCFM = intNOVA_HORIZONTAL_MAX_CFM;
    }
  
    let dtModel: any = [];
    switch (intProductTypeID) {
      case IDs.intProdTypeIdNova:
        if (intSummerReturnAirCFM < intNOVA_MIN_CFM) {
          intSummerReturnAirCFM = intNOVA_MIN_CFM;
        } else if (intSummerReturnAirCFM > intNOVA_MAX_CFM) {
          intSummerReturnAirCFM = intNOVA_MAX_CFM;
        }
        break;
      case IDs.intProdTypeIdVentum:
        dtModel = db?.dbtSelVentumHUnitModel?.filter((item: { id: number }) => item.id === Number(getValues('ddlUnitModel')));
  
        if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin || 
            intUAL === IDs.intUAL_IntLvl_2 ||  intUAL === IDs.intUAL_IntLvl_1
        ) {
          if (Number(getValues('ckbPHI')) === 1) {
            if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVEN_MIN_CFM_PHI)) {
              intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVEN_MIN_CFM_PHI));
            } else if (intSummerReturnAirCFM > Math.min(Number(intSummerSupplyAirCFM) * 2, intVEN_MAX_CFM_PHI)) {
              intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVEN_MAX_CFM_PHI));
            }
          } else if (Number(getValues('ckbBypass')) === 1) {
            if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVEN_INT_USERS_MIN_CFM_WITH_BYPASS)) {
              intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVEN_INT_USERS_MIN_CFM_WITH_BYPASS));
            } else if (intSummerReturnAirCFM > Math.min(Number(intSummerSupplyAirCFM) * 2, intVEN_INT_USERS_MAX_CFM_WITH_BYPASS)) {
              intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVEN_INT_USERS_MAX_CFM_WITH_BYPASS));
            }
          } else if (intSummerReturnAirCFM < Math.max(Number(intSummerSupplyAirCFM) * 0.5, intVEN_INT_USERS_MIN_CFM_NO_BYPASS)) {
            intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVEN_INT_USERS_MIN_CFM_NO_BYPASS));
          } else if (intSummerReturnAirCFM > Math.min(intSummerSupplyAirCFM * 2, intVEN_INT_USERS_MAX_CFM_NO_BYPASS) ) {
            intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVEN_INT_USERS_MAX_CFM_NO_BYPASS));
          }
        } else if (Number(getValues('ckbBypass')) === 1) {
          if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
            intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
          } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
            intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
          }
        } else if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
        } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
        }
        break;
      case IDs.intProdTypeIdVentumLite:
        dtModel = db?.dbtSelVentumLiteUnitModel?.filter((item: { id: number }) => item.id === Number(getValues('ddlUnitModel')));
  
        if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
            intUAL === IDs.intUAL_IntLvl_2 || intUAL === IDs.intUAL_IntLvl_1) {
          if (Number(getValues('ckbPHI')) === 1) {
            if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS)) {
              intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS));
            } else if (intSummerReturnAirCFM >Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS)) {
              intSummerReturnAirCFM = Number( Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS));
            }
          } else if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS)) {
            intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS));
          } else if (intSummerReturnAirCFM > Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS)) {
            intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS));
          }
        } else if (Number(getValues('ckbBypass')) === 1) {
          if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
            intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
          } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
            intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
          }
        } else if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
        } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
        }
        break;
      case IDs.intProdTypeIdVentumPlus:
        dtModel = db?.dbtSelVentumPlusUnitModel?.filter((item: { id: number }) => item.id === Number(getValues('ddlUnitModel')));
  
        if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
            intUAL === IDs.intUAL_IntLvl_2 || intUAL === IDs.intUAL_IntLvl_1
        ) {
          if (Number(getValues('ckbPHI')) === 1) {
            if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_MIN_CFM_PHI)) {
              intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_MIN_CFM_PHI));
            } else if (intSummerReturnAirCFM > Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_MAX_CFM_PHI)) {
              intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_MAX_CFM_PHI));
            }
          } else if (Number(getValues('ckbBypass')) === 1) {
            if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS)) {
              intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS));
            } else if (intSummerReturnAirCFM > Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS)) {
              intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS));
            }
          } else if (intSummerReturnAirCFM < Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS)) {
            intSummerReturnAirCFM = Number(Math.max(intSummerSupplyAirCFM * 0.5, intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS));
          } else if (intSummerReturnAirCFM > Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS)) {
            intSummerReturnAirCFM = Number(Math.min(intSummerSupplyAirCFM * 2, intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS));
          }
        } else if (Number(getValues('ckbBypass')) === 1) {
          if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
            intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
          } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
            intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
          }
        } else if (intSummerReturnAirCFM < Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_min_ext_users);
        } else if (intSummerReturnAirCFM > Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users)) {
          intSummerReturnAirCFM = Number(dtModel.Rows?.[0]?.erv_cfm_max_ext_users);
        }
        break;
      default:
        break;
    }
  
    if ((intProductTypeID === IDs.intProdTypeIdVentum || intProductTypeID === IDs.intProdTypeIdVentumLite ||
        intProductTypeID === IDs.intProdTypeIdVentumPlus) && intUnitTypeID === IDs.intUnitTypeIdHRV) {
      if (intSummerReturnAirCFM < intSummerSupplyAirCFM * 0.5) {
        intSummerReturnAirCFM = Math.ceil(intSummerSupplyAirCFM * 0.5);
      } else if (intSummerReturnAirCFM > Number(intSummerSupplyAirCFM) * 2) {
        intSummerReturnAirCFM = Math.ceil(intSummerSupplyAirCFM * 2);
      }
    } else if (
      (intProductTypeID === IDs.intProdTypeIdVentum || intProductTypeID === IDs.intProdTypeIdVentumLite ||
       intProductTypeID === IDs.intProdTypeIdVentumPlus) && intUnitTypeID === IDs.intUnitTypeIdERV
    ) {
      switch (intProductTypeID) {
        case IDs.intProdTypeIdVentum:
          if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
              intUAL === IDs.intUAL_IntLvl_2 || intUAL === IDs.intUAL_IntLvl_1
          ) {
            if (Number(getValues('ckbBypass')) === 1) {
              if (intSummerReturnAirCFM < intVEN_INT_USERS_MIN_CFM_WITH_BYPASS) {
                intSummerReturnAirCFM = intVEN_INT_USERS_MIN_CFM_WITH_BYPASS;
              } else if (intSummerReturnAirCFM > intVEN_INT_USERS_MAX_CFM_WITH_BYPASS) {
                intSummerReturnAirCFM = intVEN_INT_USERS_MAX_CFM_WITH_BYPASS;
              }
            } else if (intSummerReturnAirCFM < intVEN_INT_USERS_MIN_CFM_NO_BYPASS) {
              intSummerReturnAirCFM = intVEN_INT_USERS_MIN_CFM_NO_BYPASS;
            } else if (intSummerReturnAirCFM > intVEN_INT_USERS_MAX_CFM_NO_BYPASS) {
              intSummerReturnAirCFM = intVEN_INT_USERS_MAX_CFM_NO_BYPASS;
            }
          } else if (Number(getValues('ckbBypass')) === 1) {
            if (intSummerReturnAirCFM < intVEN_MIN_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVEN_MIN_CFM_WITH_BYPASS;
            } else if (intSummerReturnAirCFM > intVEN_MAX_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVEN_MAX_CFM_WITH_BYPASS;
            }
          } else if (intSummerReturnAirCFM < intVEN_MIN_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVEN_MIN_CFM_NO_BYPASS;
          } else if (intSummerReturnAirCFM > intVEN_MAX_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVEN_MAX_CFM_NO_BYPASS;
          }
  
          break;
        case IDs.intProdTypeIdVentumLite:
          if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
              intUAL === IDs.intUAL_IntLvl_2 || intUAL === IDs.intUAL_IntLvl_1
          ) {
            if (Number(getValues('ckbBypass')) === 1) {
              if (intSummerReturnAirCFM < intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS) {
                intSummerReturnAirCFM = intVENLITE_INT_USERS_MIN_CFM_WITH_BYPASS;
              } else if (intSummerReturnAirCFM > intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS) {
                intSummerReturnAirCFM = intVENLITE_INT_USERS_MAX_CFM_WITH_BYPASS;
              }
            } else if (intSummerReturnAirCFM < intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS) {
              intSummerReturnAirCFM = intVENLITE_INT_USERS_MIN_CFM_NO_BYPASS;
            } else if (intSummerReturnAirCFM > intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS) {
              intSummerReturnAirCFM = intVENLITE_INT_USERS_MAX_CFM_NO_BYPASS;
            }
          } else if (Number(getValues('ckbBypass')) === 1) {
            if (intSummerReturnAirCFM < intVENLITE_MIN_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVENLITE_MIN_CFM_WITH_BYPASS;
            } else if (intSummerReturnAirCFM > intVENLITE_MAX_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVENLITE_MAX_CFM_WITH_BYPASS;
            }
          } else if (intSummerReturnAirCFM < intVENLITE_MIN_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVENLITE_MIN_CFM_NO_BYPASS;
          } else if (intSummerReturnAirCFM > intVENLITE_MAX_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVENLITE_MAX_CFM_NO_BYPASS;
          }
  
          break;
        case IDs.intProdTypeIdVentumPlus:
          if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
              intUAL === IDs.intUAL_IntLvl_2 || intUAL === IDs.intUAL_IntLvl_1
          ) {
            if (Number(getValues('ckbBypass')) === 1) {
              if (intSummerReturnAirCFM < intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS) {
                intSummerReturnAirCFM = intVENPLUS_INT_USERS_MIN_CFM_WITH_BYPASS;
              } else if (intSummerReturnAirCFM > intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS) {
                intSummerReturnAirCFM = intVENPLUS_INT_USERS_MAX_CFM_WITH_BYPASS;
              }
            } else if (intSummerReturnAirCFM < intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS) {
              intSummerReturnAirCFM = intVENPLUS_INT_USERS_MIN_CFM_NO_BYPASS;
            } else if (intSummerReturnAirCFM > intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS) {
              intSummerReturnAirCFM = intVENPLUS_INT_USERS_MAX_CFM_NO_BYPASS;
            }
          } else if (Number(getValues('ckbBypass')) === 1) {
            if (intSummerReturnAirCFM < intVENPLUS_MIN_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVENPLUS_MIN_CFM_WITH_BYPASS;
            } else if (intSummerReturnAirCFM > intVENPLUS_MAX_CFM_WITH_BYPASS) {
              intSummerReturnAirCFM = intVENPLUS_MAX_CFM_WITH_BYPASS;
            }
          } else if (intSummerReturnAirCFM < intVENPLUS_MIN_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVENPLUS_MIN_CFM_NO_BYPASS;
          } else if (intSummerReturnAirCFM > intVENPLUS_MAX_CFM_NO_BYPASS) {
            intSummerReturnAirCFM = intVENPLUS_MAX_CFM_NO_BYPASS;
          }
          break;
        default:
          break;
      }
    }

    return intSummerReturnAirCFM;
  };


  // -----------------------  ---------------------------
  const [internCompInfo, setInternCompInfo] = useState<any>([]);
  useMemo(() => {
    const info: { isOADesignCondVisible: boolean; isRADesignCondVisible: boolean; isCustomCompVisible: boolean; isHandingValveVisible: boolean; } = 
                { isOADesignCondVisible: false, isRADesignCondVisible: false, isCustomCompVisible: false, isHandingValveVisible: false,};
                
    const intUAL = typeof window !== 'undefined' && Number(localStorage?.getItem('UAL')) || 0;

    switch (intUAL) {
      case IDs.intUAL_Admin:
      case IDs.intUAL_AdminLvl_1:
          info.isOADesignCondVisible = true;
        info.isRADesignCondVisible = true;
        info.isCustomCompVisible = true;
        info.isHandingValveVisible = true;
        break;
      case IDs.intUAL_IntAdmin:
      case IDs.intUAL_IntLvl_1:
      case IDs.intUAL_IntLvl_2:
        info.isOADesignCondVisible = false;
        info.isRADesignCondVisible = false;
        info.isCustomCompVisible = true;
        info.isHandingValveVisible = true;
        break;
      default:
        info.isOADesignCondVisible = false;
        info.isRADesignCondVisible = false;
        info.isCustomCompVisible = false;
        info.isHandingValveVisible = false;
        break;
    }

    setInternCompInfo(info);

  }, []);


  useEffect(() => {
    if (Number(formCurrValues.txbQty) < 1 ) {
      setValue('txbQty', 1);
    }

}, [getValues('txbQty')]);


const ddlFilterConditionChanged = useCallback((e: any) => {
  setValue('ddlFilterCondition', e.target.value);
  setFilterConditionId(Number(e.target.value));
}, []);

const ckbPreheatHWCUseFluidLvgTempChanged = useCallback((e: any) => {
  setValue('ckbPreheatHWCUseFluidLvgTemp', e.target.value);
  // setCkbPreheatHWCUseFluidLvgTempValue(Number(e.target.checked));
}, []);

const ckbPreheatHWCUseFluidFlowRateChanged = useCallback((e: any) => {
  setValue('ckbPreheatHWCUseFluidFlowRate', e.target.value);
  // setCkbPreheatHWCUseFluidFlowRateValue(Number(e.target.checked));
  // setCkbPreheatHWCUseFluidFlowRateValue(Number(getValues('ckbPreheatHWCUseFluidFlowRate') === 'true' ? 1 : 0));
}, []);


const txbPreheatHWCFluidEntTempChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 80 && value <= 180) {
    setValueWithCheck1(e, 'txbPreheatHWCFluidEntTemp'); 
  } else if (value < 80) {
    setValueWithCheck1({ ...e, target: { value: 80 } }, 'txbPreheatHWCFluidEntTemp'); 
  } else if (value > 180) {
    setValueWithCheck1({ ...e, target: { value: 180 } }, 'txbPreheatHWCFluidEntTemp');
  }
}, []);


const txbPreheatHWCFluidLvgTempChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 40 && value <= 180) {
    setValueWithCheck1(e, 'txbPreheatHWCFluidLvgTemp'); 
  } else if (value < 40) {
    setValueWithCheck1({ ...e, target: { value: 40 } }, 'txbPreheatHWCFluidLvgTemp'); 
  } else if (value > 180) {
    setValueWithCheck1({ ...e, target: { value: 180 } }, 'txbPreheatHWCFluidLvgTemp');
  }
}, []);


const txbPreheatHWCFluidFlowRateChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 0.1 && value <= 50) {
    setValueWithCheck1(e, 'txbPreheatHWCFluidFlowRate'); 
  } else if (value < 0.1) {
    setValueWithCheck1({ ...e, target: { value: 0.1 } }, 'txbPreheatHWCFluidFlowRate'); 
  } else if (value > 50) {
    setValueWithCheck1({ ...e, target: { value: 50 } }, 'txbPreheatHWCFluidFlowRate');
  }
}, []);


const txbWinterPreheatSetpointDBChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);

  if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX && Number(getValues('ddlReheatComp')) === IDs.intCompIdHGRH) {
    if (value < 17) {
      setValueWithCheck1({ ...e, target: { value: 17 } }, 'txbWinterPreheatSetpointDB'); 
    }   
  } else if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX) {
    if (value < 23) {
      setValueWithCheck1({ ...e, target: { value: 23 } }, 'txbWinterPreheatSetpointDB'); 
    }   
  } 
  else if (value - Number(unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_db) > 50) {
    setValue('txbWinterPreheatSetpointDB', (Number(unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_db) + 50));
  }

}, []);


const ckbCoolingCWCUseFluidLvgTempChanged = useCallback((e: any) => {
  setValue('ckbCoolingCWCUseFluidLvgTemp', e.target.value);
  // setCkbCoolingCWCUseFluidLvgTempValue(e.target.value);
}, []);


const ckbCoolingCWCUseFluidFlowRateChanged = useCallback((e: any) => {
  setValue('ckbCoolingCWCUseFluidFlowRate', e.target.value);
  // setCkbCoolingCWCUseFluidFlowRateValue(e.target.value);
}, []);


const txbCoolingCWCFluidEntTempChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 20 && value <= 120) {
    setValueWithCheck1(e, 'txbCoolingCWCFluidEntTemp'); 
  } else if (value < 20) {
    setValueWithCheck1({ ...e, target: { value: 20 } }, 'txbCoolingCWCFluidEntTemp'); 
  } else if (value > 120) {
    setValueWithCheck1({ ...e, target: { value: 120 } }, 'txbCoolingCWCFluidEntTemp');
  }
}, []);


const txbCoolingCWCFluidLvgTempChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 20 && value <= 120) {
    setValueWithCheck1(e, 'txbCoolingCWCFluidLvgTemp'); 
  } else if (value < 20) {
    setValueWithCheck1({ ...e, target: { value: 20 } }, 'txbCoolingCWCFluidLvgTemp'); 
  } else if (value > 120) {
    setValueWithCheck1({ ...e, target: { value: 120 } }, 'txbCoolingCWCFluidLvgTemp');
  }
}, []);


const txbCoolingCWCFluidFlowRateChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 0.1 && value <= 50) {
    setValueWithCheck1(e, 'txbCoolingCWCFluidFlowRate'); 
  } else if (value < 0.1) {
    setValueWithCheck1({ ...e, target: { value: 0.1 } }, 'txbCoolingCWCFluidFlowRate'); 
  } else if (value > 50) {
    setValueWithCheck1({ ...e, target: { value: 50 } }, 'txbCoolingCWCFluidFlowRate');
  }
}, []);



const txbSummerCoolingSetpointDBChanged = useCallback((e: any) => {

  const value = parseFloat(e.target.value);
  if (value >= 45 && value <= 75) {
    setValueWithCheck1(e, 'txbSummerCoolingSetpointDB'); 
  } else if (value < 45) {
    setValueWithCheck1({ ...e, target: { value: 45 } }, 'txbSummerCoolingSetpointDB'); 
  } else if (value > 75) {
    setValueWithCheck1({ ...e, target: { value: 75 } }, 'txbSummerCoolingSetpointDB');
  }

  setValue('txbSummerCoolingSetpointWB', value);

  // if (setValueWithCheck1(e, 'txbSummerCoolingSetpointDB')) {
  //   setValue('txbSummerCoolingSetpointDB', parseFloat(e.target.value).toFixed(1));
  // }
}, []);


const ckbHeatingHWCUseFluidLvgTempChanged = useCallback((e: any) => {
  setValue('ckbHeatingHWCUseFluidLvgTemp', e.target.value);
  // setCkbHeatingHWCUseFluidLvgTempValue(e.target.value);
}, []);


const ckbHeatingHWCUseFluidFlowRateChanged = useCallback((e: any) => {
  setValue('ckbHeatingHWCUseFluidFlowRate', e.target.value);
  // setCkbHeatingHWCUseFluidFlowRateValue(e.target.value);
}, []);


const txbHeatingHWCFluidEntTempChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 80 && value <= 180) {
    setValueWithCheck1(e, 'txbHeatingHWCFluidEntTemp'); 
  } else if (value < 80) {
    setValueWithCheck1({ ...e, target: { value: 80 } }, 'txbHeatingHWCFluidEntTemp'); 
  } else if (value > 180) {
    setValueWithCheck1({ ...e, target: { value: 180 } }, 'txbHeatingHWCFluidEntTemp');
  }
}, []);


const txbHeatingHWCFluidLvgTempChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 40 && value <= 180) {
    setValueWithCheck1(e, 'txbHeatingHWCFluidLvgTemp'); 
  } else if (value < 40) {
    setValueWithCheck1({ ...e, target: { value: 40 } }, 'txbHeatingHWCFluidLvgTemp'); 
  } else if (value > 180) {
    setValueWithCheck1({ ...e, target: { value: 180 } }, 'txbHeatingHWCFluidLvgTemp');
  }
}, []);


const txbHeatingHWCFluidFlowRateChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 0.1 && value <= 50) {
    setValueWithCheck1(e, 'txbHeatingHWCFluidFlowRate'); 
  } else if (value < 0.1) {
    setValueWithCheck1({ ...e, target: { value: 0.1 } }, 'txbHeatingHWCFluidFlowRate'); 
  } else if (value > 50) {
    setValueWithCheck1({ ...e, target: { value: 50 } }, 'txbHeatingHWCFluidFlowRate');
  }
}, []);


const ckbReheatHWCUseFluidLvgTempChanged = useCallback((e: any) => {
  setValue('ckbReheatHWCUseFluidLvgTemp', e.target.value);
  // setCkbPreheatHWCUseFluidLvgTempValue(e.target.value);
}, []);


const ckbReheatHWCUseFluidFlowRateChanged = useCallback((e: any) => {
  setValue('ckbReheatHWCUseFluidFlowRate', e.target.value);
  // setCkbReheatHWCUseFluidFlowRateValue(e.target.value);
}, []);


const txbReheatHWCFluidEntTempChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 80 && value <= 180) {
    setValueWithCheck1(e, 'txbReheatHWCFluidEntTemp'); 
  } else if (value < 80) {
    setValueWithCheck1({ ...e, target: { value: 80 } }, 'txbReheatHWCFluidEntTemp'); 
  } else if (value > 180) {
    setValueWithCheck1({ ...e, target: { value: 180 } }, 'txbReheatHWCFluidEntTemp');
  }
}, []);


const txbReheatHWCFluidLvgTempChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 40 && value <= 180) {
    setValueWithCheck1(e, 'txbReheatHWCFluidLvgTemp'); 
  } else if (value < 40) {
    setValueWithCheck1({ ...e, target: { value: 40 } }, 'txbReheatHWCFluidLvgTemp'); 
  } else if (value > 180) {
    setValueWithCheck1({ ...e, target: { value: 180 } }, 'txbReheatHWCFluidLvgTemp');
  }
}, []);


const txbReheatHWCFluidFlowRateChanged = useCallback((e: any) => {
  const value = parseFloat(e.target.value);
  if (value >= 0.1 && value <= 50) {
    setValueWithCheck1(e, 'txbReheatHWCFluidFlowRate'); 
  } else if (value < 0.1) {
    setValueWithCheck1({ ...e, target: { value: 0.1 } }, 'txbReheatHWCFluidFlowRate'); 
  } else if (value > 50) {
    setValueWithCheck1({ ...e, target: { value: 50 } }, 'txbReheatHWCFluidFlowRate');
  }
}, []);



useEffect(() => {
  switch (Number(getValues('ddlLocation'))) {
    case IDs.intLocationIdIndoor:
      setValue('ckbDownshot', 0);
      break;
    // case IDs.intLocationIdOutdoor:
    //   break;
    default:
      break;
  }
  
}, [getValues('ddlLocation')]);
  

const [unitVoltageInfo, setUnitVoltageInfo] = useState<any>([]);
useEffect(() => {
  const info: { fdtUnitVoltage: any; defaultId: number } = { fdtUnitVoltage: [], defaultId: 0,};
  // let controlsPrefProdTypeLink: any = [];

  const umc = getUMC();

  let modelVoltageLink = [];

  switch (intProductTypeID) {
    case IDs.intProdTypeIdNova:
      modelVoltageLink = db?.dbtSelNovaUnitModelVoltageLink;
      break;
    case IDs.intProdTypeIdVentum:
      modelVoltageLink = db?.dbtSelVentumHUnitModelVoltageLink;
      break;
    case IDs.intProdTypeIdVentumLite:
      modelVoltageLink = db?.dbtSelVentumLiteUnitModelVoltageLink;
      break;
    case IDs.intProdTypeIdVentumPlus:
      modelVoltageLink = db?.dbtSelVentumPlusUnitModelVoltageLink;
      break;
    case IDs.intProdTypeIdTerra:
      modelVoltageLink = db?.dbtSelTerraUnitModelVoltageLink;
      break;
    default:
      break;
  }

  const dtLink =modelVoltageLink?.filter((item: { unit_model_value: any }) => item.unit_model_value === umc?.strUnitModelValue) || [];
  info.fdtUnitVoltage = db?.dbtSelElectricalVoltage;

  if (intProductTypeID === IDs.intProdTypeIdTerra) {
    info.fdtUnitVoltage = db?.dbtSelElectricalVoltage?.filter((item: { terra_spp: number }) => item.terra_spp === 1);
  }

  info.fdtUnitVoltage = info.fdtUnitVoltage?.filter((e: { id: any }) => dtLink?.filter((e_link: { voltage_id: any }) => e.id === e_link.voltage_id)?.length > 0);



  setUnitVoltageInfo(info);
  info.defaultId = info.fdtUnitVoltage?.[0]?.id;
  setValue('ddlUnitVoltage', info.fdtUnitVoltage?.[0]?.id);

}, [getValues('ddlUnitModel')]);


useEffect(() => {
  const supplyCFM = getSupplyAirCFM();
  setValue('txbSummerSupplyAirCFM', supplyCFM);
  setValue('txbSummerReturnAirCFM', supplyCFM);

  const returnCFM = getReturnAirCFM();
  setValue('txbSummerSupplyAirCFM', returnCFM);  

  switch (Number(getValues('ckbPHI'))) {
    case 1:
      setValue('ckbBypass', 1);
      setBypassIsEnabled(false);
      break;
    case 0:
      setValue('ckbBypass', 0);
      setBypassIsEnabled(true);
      break;
    default:
      break;
  }

}, [getValues('ckbPHI')]);


// useEffect(() => {
//   let dtFilterCondition = db?.dbtSelFilterCondition;
//   dtFilterCondition = dtFilterCondition?.filter((item: { id: number }) => item.id === Number(filterConditionId));
//   const filtercondPD = dtFilterCondition?.[0]?.pd_value;

//   setValue('txbOA_FilterPD', parseFloat(filtercondPD).toFixed(2));
//   setValue('txbRA_FilterPD', parseFloat(filtercondPD).toFixed(2));
// }, [filterConditionId]);


useEffect(() => {
  let dtFilterCondition = db?.dbtSelFilterCondition;
  dtFilterCondition = dtFilterCondition?.filter((item: { id: number }) => item.id === Number(getValues('ddlFilterCondition')));
  const filtercondPD = dtFilterCondition?.[0]?.pd_value;

  setValue('txbOA_FilterPD', parseFloat(filtercondPD).toFixed(2));
  setValue('txbRA_FilterPD', parseFloat(filtercondPD).toFixed(2));
}, [getValues('ddlFilterCondition')]);


useEffect(() => {
  if (Number(getValues('ckbMixingBox')) === 1) {
    setValue('txbMixSummerOA_CFM', (Number(getValues('txbSummerSupplyAirCFM')) * Number(getValues('txbMixSummerOA_CFMPct'))) / 100);
    setValue('txbMixWinterOA_CFM', (Number(getValues('txbSummerSupplyAirCFM')) * Number(getValues('txbMixWinterOA_CFMPct'))) / 100);
    setValue('txbMixSummerRA_CFMPct', (100 - Number(getValues('txbMixSummerOA_CFMPct'))));
    setValue('txbMixWinterRA_CFMPct', (100 - Number(getValues('txbMixWinterOA_CFMPct'))));
    setValue('txbMixSummerRA_CFM', (Number(getValues('txbSummerSupplyAirCFM')) * Number(getValues('txbMixSummerRA_CFMPct'))) / 100);
    setValue('txbMixWinterRA_CFM', (Number(getValues('txbSummerSupplyAirCFM')) * Number(getValues('txbMixWinterRA_CFMPct'))) / 100);
    setValue('ckbMixUseProjectDefault', true);
  }
}, [getValues('ckbMixingBox'), getValues('txbSummerSupplyAirCFM')]);


useEffect(() => {
    setValue('txbMixSummerOA_CFM', (Number(getValues('txbSummerSupplyAirCFM')) * Number(getValues('txbMixSummerOA_CFMPct'))) / 100);
    setValue('txbMixSummerRA_CFMPct', (100 - Number(getValues('txbMixSummerOA_CFMPct'))));
    setValue('txbMixSummerRA_CFM', (Number(getValues('txbSummerSupplyAirCFM')) * Number(getValues('txbMixSummerRA_CFMPct'))) / 100);
}, [getValues('txbMixSummerOA_CFMPct')]);


useEffect(() => {
    setValue('txbMixWinterOA_CFM', (Number(getValues('txbSummerSupplyAirCFM')) * Number(getValues('txbMixWinterOA_CFMPct'))) / 100);
    setValue('txbMixWinterRA_CFMPct', (100 - Number(getValues('txbMixWinterOA_CFMPct'))));
    setValue('txbMixWinterRA_CFM', (Number(getValues('txbSummerSupplyAirCFM')) * Number(getValues('txbMixWinterRA_CFMPct'))) / 100);
}, [getValues('txbMixWinterOA_CFMPct')]);


useEffect(() => {
  if (Number(getValues('ckbMixUseProjectDefault')) === 1) {
      setValue('txbMixSummerOA_DB', unitInfo?.dbtSavedJob?.[0]?.summer_outdoor_air_db);
      setValue('txbMixSummerOA_WB', unitInfo?.dbtSavedJob?.[0]?.summer_outdoor_air_wb);
      setValue('txbMixSummerOA_RH', unitInfo?.dbtSavedJob?.[0]?.summer_outdoor_air_rh);
      setValue('txbMixWinterOA_DB', unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_db);
      setValue('txbMixWinterOA_WB', unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_wb);
      setValue('txbMixWinterOA_RH', unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_rh);
      setValue('txbMixSummerRA_DB', unitInfo?.dbtSavedJob?.[0]?.summer_return_air_db);
      setValue('txbMixSummerRA_WB', unitInfo?.dbtSavedJob?.[0]?.summer_return_air_wb);
      setValue('txbMixSummerRA_RH', unitInfo?.dbtSavedJob?.[0]?.summer_return_air_rh);
      setValue('txbMixWinterRA_DB', unitInfo?.dbtSavedJob?.[0]?.winter_return_air_db);
      setValue('txbMixWinterRA_WB', unitInfo?.dbtSavedJob?.[0]?.winter_return_air_wb);
      setValue('txbMixWinterRA_RH', unitInfo?.dbtSavedJob?.[0]?.winter_return_air_rh);
  }
}, [getValues('ckbMixUseProjectDefault')]);


useEffect(() => {
  switch (Number(getValues('ddlPreheatComp'))) {
    case IDs.intCompIdNA:
    case IDs.intCompIdHWC:
      setIsEnabledDdlPreheatElecHeaterVoltage(true);
      setValue('ckbPreheatElecHeaterVoltageSPP', 0);
      setValue('ckbPreheatAutoSize', 0);
      break;
    case IDs.intCompIdElecHeater:
      setValue('ckbPreheatAutoSize', 1);
      break;
    default:
      break;
  }

}, [getValues('ddlPreheatComp')]);


useEffect(() => {
  switch (Number(getValues('ckbPreheatElecHeaterVoltageSPP'))) {
    case 1:
      setValue('ddlPreheatElecHeaterVoltage', getValues('ddlUnitVoltage'));
      setIsEnabledDdlPreheatElecHeaterVoltage(false);
      break;
    case 0:
      setIsEnabledDdlPreheatElecHeaterVoltage(true);
      break;
    default:
      break;
  }

}, [getValues('ckbPreheatElecHeaterVoltageSPP')]);


// // ddlElecHeaterVoltage
// useEffect(() => {
//   if (Number(formCurrValues.ddlPreheatComp) === IDs.intCompIdElecHeater) {
//     switch (Number(getValues('ckbPreheatElecHeaterVoltageSPP'))) {
//       case 1:
//         setValue('ddlPreheatElecHeaterVoltage', formCurrValues?.ddlUnitVoltage)
//         setIsEnabledDdlPreheatElecHeaterVoltage(false);
//         break;
//       case 0:
//         setIsEnabledDdlPreheatElecHeaterVoltage(true);
//         break;
//       default:
//         break;
//     }
//   }
// }, [getValues('ckbPreheatElecHeaterVoltageSPP')]);


// useEffect(() => {
//   if (Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdElecHeater) {
//     switch (Number(getValues('ckbHeatingElecHeaterVoltageSPP'))) {
//       case 1:
//         setValue('ddlHeatingElecHeaterVoltage', formCurrValues?.ddlUnitVoltage)
//         setIsEnabledDdlHeatingElecHeaterVoltage(false);
//         break;
//       case 0:
//         setIsEnabledDdlHeatingElecHeaterVoltage(true);
//         break;
//       default:
//         break;
//     }
//     }
//   }, [getValues('ckbHeatingElecHeaterVoltageSPP')]);


//   useEffect(() => {
//     if (Number(formCurrValues.ddlReheatComp) === IDs.intCompIdElecHeater) {
//     switch (Number(getValues('ckbReheatElecHeaterVoltageSPP'))) {
//     case 1:
//       setValue('ddlReheatElecHeaterVoltage', formCurrValues?.ddlUnitVoltage)
//       setIsEnabledDdlReheatElecHeaterVoltage(false);
//       break;
//     case 0:
//       setIsEnabledDdlReheatElecHeaterVoltage(true);
//       break;
//     default:
//       break;
//     }
//     }
// }, [getValues('ckbReheatElecHeaterVoltageSPP')]);



useEffect(() => {
  switch (Number(getValues('ckbPreheatHWCUseFluidLvgTemp'))) {
    case 1:
      setIsTxbPreheatHWCFluidLvgTempEnabled(true);
      if (Number(getValues('txbPreheatHWCFluidLvgTemp')) === 0) {
        setValue('txbPreheatHWCFluidLvgTemp', Number(getValues('txbPreheatHWCFluidEntTemp')) - 20);
      }

      setValue('ckbPreheatHWCUseFluidFlowRate', 0)
      setIsTxbPreheatHWCFluidFlowRateEnabled(false);
      setValue('txbPreheatHWCFluidFlowRate', '0');
      break;
    case 0:
      setIsTxbPreheatHWCFluidLvgTempEnabled(false);
      setValue('txbPreheatHWCFluidLvgTemp', '0');

      setValue('ckbPreheatHWCUseFluidFlowRate', 1)
      setValue('txbPreheatHWCFluidFlowRate', '5');
      setIsTxbPreheatHWCFluidFlowRateEnabled(true);
      break;
    default:
      break;
  }
  
}, [getValues('ckbPreheatHWCUseFluidLvgTemp')]);


useEffect(() => {
  switch (Number(getValues('ckbPreheatHWCUseFluidFlowRate'))) {
    case 1:
      setIsTxbPreheatHWCFluidFlowRateEnabled(true);
      if (Number(getValues('txbPreheatHWCFluidFlowRate')) === 0) {
        setValue('txbPreheatHWCFluidFlowRate', '5');
      }

      setValue('ckbPreheatHWCUseFluidLvgTemp', 0)
      setIsTxbPreheatHWCFluidLvgTempEnabled(false);
      setValue('txbPreheatHWCFluidLvgTemp', '0');
      break;
    case 0:
      // setCkbPreheatHWCUseFluidLvgTempValue(true);
      setIsTxbPreheatHWCFluidFlowRateEnabled(false);
      setValue('txbPreheatHWCFluidFlowRate', '0');
      
      setValue('ckbPreheatHWCUseFluidLvgTemp', 1)
      setValue('txbPreheatHWCFluidLvgTemp', Number(getValues('txbPreheatHWCFluidEntTemp')) - 20);
      setIsTxbPreheatHWCFluidLvgTempEnabled(true);
      break;
    default:
      break;
  }

}, [getValues('ckbPreheatHWCUseFluidFlowRate')]);


// useEffect(() => {

// if (Number(getValues('ckbPreheatAutoSize') === 1)) {

//   if (Number(getValues('txbWinterPreheatSetpointDB')) < 17) {
//     setValue('txbWinterPreheatSetpointDB', '17');
//   }

//   if (Number(getValues('txbWinterPreheatSetpointDB')) < 23) {
//     setValue('txbWinterPreheatSetpointDB', '23');
//   }


//   if (Number(getValues('txbWinterPreheatSetpointDB')) - Number(unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_db) > 50) {
//     setValue('txbWinterPreheatSetpointDB', (Number(unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_db) + 50));
//   }
// }

// }, [getValues('txbWinterPreheatSetpointDB'), getValues('ckbPreheatAutoSize')]);


useEffect(() => {
  switch (Number(getValues('ckbPreheatAutoSize'))) {
    case 1:
      setIsTxbPreheatSetpointEnabled(false);
      // if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX && Number(getValues('ddlReheatComp')) === IDs.intCompIdHGRH) {
      //   setValue('txbWinterPreheatSetpointDB', '17');
      // } else if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX) {
      //   setValue('txbWinterPreheatSetpointDB', '23');
      // } else {
      //   setValue('txbWinterPreheatSetpointDB', '0');
      // }
      break;
    case 0:
      setIsTxbPreheatSetpointEnabled(true);
      // Below code Not working. See txbWinterPreheatSetpointDBChanged
      // if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX && Number(getValues('ddlReheatComp')) === IDs.intCompIdHGRH) {
      //   if (parseFloat(getValues('txbWinterPreheatSetpointDB')) < 17) {
      //     setValue('txbWinterPreheatSetpointDB', 17);
      //   } 
      // } else if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX) {
      //   if (parseFloat(getValues('txbWinterPreheatSetpointDB')) < 23) {
      //     setValue('txbWinterPreheatSetpointDB', 23);
      //   }
      // } 
      // else if (parseFloat(getValues('txbWinterPreheatSetpointDB')) - Number(unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_db) > 50) {
      //     setValue('txbWinterPreheatSetpointDB', (Number(unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_db) + 50));
      // }
      break;
    default:
      setValue('txbWinterPreheatSetpointDB', '0');
      break;
  }

}, [getValues('ckbPreheatAutoSize')]);



useEffect(() => {
  if (intProductTypeID === IDs.intProdTypeIdTerra && Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX && Number(getValues('ddlReheatComp')) === IDs.intCompIdHGRH) {
    setValue('txbWinterPreheatSetpointDB', '17');
  } else if (intProductTypeID === IDs.intProdTypeIdTerra && Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX) {
    setValue('txbWinterPreheatSetpointDB', '23');
  } else if (Number(getValues('txbWinterPreheatSetpointDB')) - Number(unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_db) > 50) {
    setValue('txbWinterPreheatSetpointDB', (Number(unitInfo?.dbtSavedJob?.[0]?.winter_outdoor_air_db) + 50));
  }
}, [getValues('ddlCoolingComp'), getValues('ddlReheatComp'), intProductTypeID]);


useEffect(() => {
  let fdtValveType = db?.dbtSelValveType;

  switch (Number(getValues('ckbPreheatHWCValveAndActuator'))) {
    case 1:
      setIsVisibleDdlPreheatHWCValveType(true);
      fdtValveType = fdtValveType?.filter((item: { enabled: number; id: number }) => item.enabled === 1 && item.id !== IDs.intValveTypeIdNA);
      break;
    case 0:
      setIsVisibleDdlPreheatHWCValveType(false);
      fdtValveType = fdtValveType?.filter((item: { id: number }) => item.id === IDs.intValveTypeIdNA);
      break;
    default:
      break;
  }

  setPreheatHWCValveTypeOptions(fdtValveType);
  setValue('ddlPreheatHWCValveType', fdtValveType?.[0]?.id);

}, [getValues('ckbPreheatHWCValveAndActuator')]);


useEffect(() => {
  switch (Number(getValues('ckbCoolingCWCUseFluidLvgTemp'))) {
    case 1:
      setIsTxbCoolingCWCFluidLvgTempEnabled(true);
      if (Number(getValues('txbCoolingCWCFluidLvgTemp')) === 0) {
        setValue('txbCoolingCWCFluidLvgTemp', Number(getValues('txbCoolingCWCFluidEntTemp')) + 10);
      }

      setValue('ckbCoolingCWCUseFluidFlowRate', 0)
      setIsTxbCoolingCWCFluidFlowRateEnabled(false);
      setValue('txbCoolingCWCFluidFlowRate', '0');
      break;
    case 0:
      setIsTxbCoolingCWCFluidLvgTempEnabled(false);

      setValue('ckbCoolingCWCUseFluidFlowRate', 1)
      setValue('txbCoolingCWCFluidFlowRate', '5');
      setIsTxbCoolingCWCFluidFlowRateEnabled(true);
      setValue('txbCoolingCWCFluidLvgTemp', '0');
      break;
    default:
      break;
  }
  
}, [getValues('ckbCoolingCWCUseFluidLvgTemp')]);


useEffect(() => {
  switch (Number(getValues('ckbCoolingCWCUseFluidFlowRate'))) {
    case 1:
      setIsTxbCoolingCWCFluidFlowRateEnabled(true);
      if (Number(getValues('txbCoolingCWCFluidFlowRate')) === 0) {
        setValue('txbCoolingCWCFluidFlowRate', '5');
      }

      setValue('ckbCoolingCWCUseFluidLvgTemp', 0);
      setIsTxbCoolingCWCFluidLvgTempEnabled(false);
      setValue('txbCoolingCWCFluidLvgTemp', '0');
      break;
    case 0:
      setIsTxbCoolingCWCFluidFlowRateEnabled(false);
      setValue('txbCoolingCWCFluidFlowRate', '0');

      setValue('ckbCoolingCWCUseFluidLvgTemp', 1);
      setValue('txbCoolingCWCFluidLvgTemp', Number(getValues('txbCoolingCWCFluidEntTemp')) + 10);
      setIsTxbCoolingCWCFluidLvgTempEnabled(true);
      break;
    default:
      break;
  }
}, [getValues('ckbCoolingCWCUseFluidFlowRate')]);


useEffect(() => {
  setValue('ckbHeatPump', getValues('ckbDaikinVRV'));
  setValue('ckbDehumidification', getValues('ckbDaikinVRV'));

}, [getValues('ckbDaikinVRV')]);


useEffect(() => {
  let fdtValveType = db?.dbtSelValveType;

  switch (Number(getValues('ckbCoolingCWCValveAndActuator'))) {
    case 1:
      setIsVisibleDdlCoolingCWCValveType(true);
      fdtValveType = fdtValveType?.filter((item: { enabled: number; id: number }) => item.enabled === 1 && item.id !== IDs.intValveTypeIdNA);
      break;
    case 0:
      setIsVisibleDdlCoolingCWCValveType(false);
      fdtValveType = fdtValveType?.filter((item: { id: number }) => item.id === IDs.intValveTypeIdNA);
      break;
    default:
      break;
  }

  setCoolingCWCValveTypeOptions(fdtValveType);
  setValue('ddlCoolingCWCValveType', fdtValveType?.[0]?.id);

}, [getValues('ckbCoolingCWCValveAndActuator')]);


useEffect(() => {
  switch (Number(getValues('ddlHeatingComp'))) {
    case IDs.intCompIdNA:
    case IDs.intCompIdHWC:
      setIsEnabledDdlHeatingElecHeaterVoltage(true);
      setValue('ckbHeatingElecHeaterVoltageSPP', 0);
      break;
    case IDs.intCompIdElecHeater:
      break;
    default:
      break;
  }

}, [getValues('ddlHeatingComp')]);


useEffect(() => {
  switch (Number(getValues('ckbHeatingElecHeaterVoltageSPP'))) {
    case 1:
      setValue('ddlHeatingElecHeaterVoltage', getValues('ddlUnitVoltage'));
      setIsEnabledDdlHeatingElecHeaterVoltage(false);
      break;
    case 0:
      setIsEnabledDdlHeatingElecHeaterVoltage(true);
      break;
    default:
      break;
  }

  setValue('ckbReheatElecHeaterVoltageSPP', getValues('ckbHeatingElecHeaterVoltageSPP'));
}, [getValues('ckbHeatingElecHeaterVoltageSPP')]);


useEffect(() => {
  switch (Number(getValues('ckbHeatingHWCUseFluidLvgTemp'))) {
    case 1:
      setIsTxbHeatingHWCFluidLvgTempEnabled(true);
      if (Number(getValues('txbHeatingHWCFluidLvgTemp')) === 0) {
        setValue('txbHeatingHWCFluidLvgTemp', Number(getValues('txbHeatingHWCFluidEntTemp')) - 20);
      }

      setValue('ckbHeatingHWCUseFluidFlowRate', 0)
      setIsTxbHeatingHWCFluidFlowRateEnabled(false);
      setValue('txbHeatingHWCFluidFlowRate', '0');
      break;
    case 0:
      setIsTxbHeatingHWCFluidLvgTempEnabled(false);
      setValue('txbHeatingHWCFluidLvgTemp', '0');

      setValue('ckbHeatingHWCUseFluidFlowRate', 1)
      setIsTxbHeatingHWCFluidFlowRateEnabled(true);
      break;
    default:
      break;
  }
  
}, [getValues('ckbHeatingHWCUseFluidLvgTemp')]);


useEffect(() => {
  switch (Number(getValues('ckbHeatingHWCUseFluidFlowRate'))) {
    case 1:
      setIsTxbHeatingHWCFluidFlowRateEnabled(true);
      if (Number(getValues('txbHeatingHWCFluidFlowRate')) === 0) {
        setValue('txbHeatingHWCFluidFlowRate', '5');
      }

      setValue('ckbHeatingHWCUseFluidLvgTemp', 0)
      setIsTxbHeatingHWCFluidLvgTempEnabled(false);
      setValue('txbHeatingHWCFluidLvgTemp', '0');
      break;
    case 0:
      setIsTxbHeatingHWCFluidLvgTempEnabled(true);
      setValue('txbHeatingHWCFluidLvgTemp', Number(getValues('txbHeatingHWCFluidEntTemp')) - 20);

      setValue('ckbHeatingHWCUseFluidLvgTemp', 1)
      setIsTxbHeatingHWCFluidFlowRateEnabled(false);
      setValue('txbHeatingHWCFluidFlowRate', '0');
      break;
    default:
      break;
  }
}, [getValues('ckbHeatingHWCUseFluidFlowRate')]);


useEffect(() => {
  switch (Number(getValues('ckbReheatElecHeaterVoltageSPP'))) {
    case 1:
      setValue('ddlReheatElecHeaterVoltage', getValues('ddlUnitVoltage'));
      setIsEnabledDdlReheatElecHeaterVoltage(false);
      break;
    case 0:
      setIsEnabledDdlReheatElecHeaterVoltage(true);
      break;
    default:
      break;
  }

  setValue('ckbHeatingElecHeaterVoltageSPP', getValues('ckbReheatElecHeaterVoltageSPP'));
}, [getValues('ckbReheatElecHeaterVoltageSPP')]);


useEffect(() => {
  let fdtValveType = db?.dbtSelValveType;

  switch (Number(getValues('ckbHeatingHWCValveAndActuator'))) {
    case 1:
      setIsVisibleDdlHeatingHWCValveType(true);
      fdtValveType = fdtValveType?.filter((item: { enabled: number; id: number }) => item.enabled === 1 && item.id !== IDs.intValveTypeIdNA);
      break;
    case 0:
      setIsVisibleDdlHeatingHWCValveType(false);
      fdtValveType = fdtValveType?.filter((item: { id: number }) => item.id === IDs.intValveTypeIdNA);
      break;
    default:
      break;
  }

  setHeatingHWCValveTypeOptions(fdtValveType);
  setValue('ddlHeatingHWCValveType', fdtValveType?.[0]?.id);

}, [getValues('ckbHeatingHWCValveAndActuator')]);


useEffect(() => {
  switch (Number(getValues('ddlReheatComp'))) {
    case IDs.intCompIdNA:
    case IDs.intCompIdHWC:
    case IDs.intCompIdHGRH:
      setIsEnabledDdlReheatElecHeaterVoltage(true);
      setValue('ckbReheatElecHeaterVoltageSPP', 0);
      break;
    case IDs.intCompIdElecHeater:
      break;
    default:
      break;
  }

}, [getValues('ddlReheatComp')]);


useEffect(() => {
  switch (Number(getValues('ckbReheatHWCUseFluidLvgTemp'))) {
    case 1:
      setIsTxbReheatHWCFluidLvgTempEnabled(true);
      if (Number(getValues('txbReheatHWCFluidLvgTemp')) === 0) {
        setValue('txbReheatHWCFluidLvgTemp', Number(getValues('txbReheatHWCFluidEntTemp')) - 20);
      }

      setValue('ckbReheatHWCUseFluidFlowRate', 0)
      setIsTxbReheatHWCFluidFlowRateEnabled(false);
      setValue('txbReheatHWCFluidFlowRate', '0');
      break;
    case 0:
      setIsTxbReheatHWCFluidLvgTempEnabled(false);
      setValue('txbReheatHWCFluidLvgTemp', '0');

      setValue('ckbReheatHWCUseFluidFlowRate', 1)
      setValue('txbReheatHWCFluidFlowRate', '5');
      setIsTxbReheatHWCFluidFlowRateEnabled(true);
      break;
    default:
      break;
  }
  
}, [getValues('ckbReheatHWCUseFluidLvgTemp')]);


useEffect(() => {
  switch (Number(getValues('ckbReheatHWCUseFluidFlowRate'))) {
    case 1:
      setIsTxbReheatHWCFluidFlowRateEnabled(true);
      if (Number(getValues('txbReheatHWCFluidFlowRate')) === 0) {
        setValue('txbReheatHWCFluidFlowRate', '5');
      }

      setValue('ckbReheatHWCUseFluidLvgTemp', 0)
      setIsTxbReheatHWCFluidLvgTempEnabled(false);
      setValue('txbReheatHWCFluidLvgTemp', '0');
      break;
    case 0:
      setIsTxbReheatHWCFluidFlowRateEnabled(false);
      setValue('txbReheatHWCFluidFlowRate', '0');

      setValue('ckbReheatHWCUseFluidLvgTemp', 1)
      setValue('txbReheatHWCFluidLvgTemp', Number(getValues('txbReheatHWCFluidEntTemp')) - 20);
      setIsTxbReheatHWCFluidLvgTempEnabled(true);
      break;
    default:
      break;
  }
}, [getValues('ckbReheatHWCUseFluidFlowRate')]);


useEffect(() => {
  let fdtValveType = db?.dbtSelValveType;

  switch (Number(getValues('ckbReheatHWCValveAndActuator'))) {
    case 1:
      setIsVisibleDdlReheatHWCValveType(true);
      fdtValveType = fdtValveType?.filter((item: { enabled: number; id: number }) => item.enabled === 1 && item.id !== IDs.intValveTypeIdNA);
      break;
    case 0:
      setIsVisibleDdlReheatHWCValveType(false);
      fdtValveType = fdtValveType?.filter((item: { id: number }) => item.id === IDs.intValveTypeIdNA);
      break;
    default:
      break;
  }

  setReheatHWCValveTypeOptions(fdtValveType);
  setValue('ddlReheatHWCValveType', fdtValveType?.[0]?.id);

}, [getValues('ckbReheatHWCValveAndActuator')]);


  const [locationInfo, setLocationInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtLocation: any; defaultId: number } = { fdtLocation: [], defaultId: 0,};
    // let controlsPrefProdTypeLink: any = [];
    info.fdtLocation = db?.dbtSelGeneralLocation;

    const dtProdUnitLocLink = db?.dbtSelProdTypeUnitTypeLocLink?.filter((item: { prod_type_id: any; unit_type_id: any }) =>
      item.prod_type_id === intProductTypeID && item.unit_type_id === intUnitTypeID);

    info.fdtLocation = info.fdtLocation?.filter((e: { id: any }) =>
      dtProdUnitLocLink?.filter((e_link: { location_id: any }) => e_link.location_id === e.id)?.length > 0);

    setLocationInfo(info);
    info.defaultId = info.fdtLocation?.[0]?.id;
    setValue('ddlLocation', info.fdtLocation?.[0]?.id);

  }, [db, intProductTypeID, intUnitTypeID]);


  const [orientationInfo, setOrientationInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtOrientation: any; defaultId: number } = { fdtOrientation: [], defaultId: 0,};
    // let controlsPrefProdTypeLink: any = [];
    info.fdtOrientation = db?.dbtSelGeneralOrientation;

    const dtLocOriLink = db?.dbtSelLocOriLink?.filter((item: { prod_type_id: any; unit_type_id: any; location_id: any }) => 
      item.prod_type_id === intProductTypeID &&
      item.unit_type_id === intUnitTypeID &&
      item.location_id === Number(getValues('ddlLocation'))
    );

    // let dtOrientation = getFromLink(data?.generalOrientation, 'orientation_id', dtLocOri, 'max_cfm');
    info.fdtOrientation = info.fdtOrientation?.filter((e: { id: any }) => 
      dtLocOriLink?.filter((e_link: { orientation_id: any}) => e.id === e_link.orientation_id)?.length > 0);

    info.fdtOrientation?.sort((a: any, b: any) => a.max_cfm- b.max_cfm);



    if (intProductTypeID === IDs.intProdTypeIdNova) {
      info.fdtOrientation = info.fdtOrientation?.filter((item: { max_cfm: number}) => item.max_cfm >= Number(getValues('txbSummerSupplyAirCFM')));
    }

    setOrientationInfo(info);
    info.defaultId = info.fdtOrientation?.[0]?.id;
    setValue('ddlOrientation', info.fdtOrientation?.[0]?.id);

  }, [formCurrValues.ddlLocation, formCurrValues.txbSummerSupplyAirCFM]);


  useEffect(() => {

    let imgLayout = "layout";

    switch (intProductTypeID) {
      case IDs.intProdTypeIdNova:
        imgLayout += '_nova';
        break;
      case IDs.intProdTypeIdVentum:
        imgLayout += '_ventum';
        break;
      case IDs.intProdTypeIdVentumLite:
        imgLayout += '_ventumlite';
        break;
      case IDs.intProdTypeIdVentumPlus:
        imgLayout += '_ventumplus';
        break;
      case IDs.intProdTypeIdTerra:
        imgLayout += '_terra';
        break;
      default:
        break;
    }


    switch (Number(getValues('ddlLocation'))) {
      case IDs.intLocationIdIndoor:
        imgLayout += '_in';
        break;
      case IDs.intLocationIdOutdoor:
        imgLayout += '_out';
        break;
      default:
        break;
    }


    switch (intProductTypeID) {
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentum:
      case IDs.intProdTypeIdVentumLite:
      case IDs.intProdTypeIdTerra:
        switch (Number(getValues('ddlOrientation'))) {
          case IDs.intOrientationIdHorizontal:
            imgLayout += '_h';
            break;
          case IDs.intOrientationIdVertical:
            imgLayout += '_v';
            break;
          default:
            break;
        }
        break;
      case IDs.intProdTypeIdVentumPlus:
        break;
      default:
        break;
    }


    switch (Number(getValues('ddlHanding'))) {
      case IDs.intFanPlacementIdRightID:
        imgLayout += '_rh';
        break;
      case IDs.intFanPlacementIdLeftID:
        imgLayout += '_lh';
        break;
      default:
        break;
    }


    if (intProductTypeID === IDs.intProdTypeIdNova && Number(getValues('ckbDownshot')) === 1) {
      imgLayout += "_ds";
    }

    // const fdtOrientation = db?.dbtSelOpeningsERV_EA;
    // filterCondtion = filterCondtion?.filter((item: { id: number }) => item.id !== IDs.intFilterConditionIdNA);

    switch (intProductTypeID) {
      case IDs.intProdTypeIdVentum:
      case IDs.intProdTypeIdVentumLite:
        // switch (getValues("ddlSupplyAirOpening")) {
          switch (getValues("ddlSupplyAirOpeningText")) {
          case "1":
          case "1A":
            imgLayout += "_sa_1";
            break;
          case "2":
          case "2A":
            imgLayout += "_sa_2";
            break;
          default:
            break;
        }
        break;
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentumPlus:
      case IDs.intProdTypeIdTerra:
        if (Number(getValues('ckbMixingBox')) === 1) {
          imgLayout += "_mix";
        }
        break;
      default:
        break;
    }


    imgLayout += '.png';
    imgLayout = `/assets/images/layouts/${imgLayout}`;
    setImgLayoutPathAndFile(imgLayout);

  }, [intProductTypeID, getValues('ddlLocation'), getValues('ddlOrientation'), getValues('ckbMixingBox'),
    getValues('ckbDownshot'), getValues('ddlHanding'), getValues('ddlSupplyAirOpening')]);



// // ckbBypass
// useEffect(() => {
//   switch (Number(getValues('ckbPHI'))) {
//     case 1:
//       setValue('ckbBypass', 1);
//       setBypassIsEnabled(false);
//       break;
//     case 0:
//       setValue('ckbBypass', 0);
//       setBypassIsEnabled(true);
//       break;
//     default:
//       break;
//   }
// }, [getValues('ckbPHI')]);


  const [bypassInfo, setBypassInfo] = useState<any>([]);
  useEffect(() => {
    const info: { isVisible: boolean; isChecked: boolean; isEnabled: boolean; defaultId: number; bypassMsg: string } = {
                  isVisible: false,   isChecked: false,   isEnabled: false,   defaultId: 0,      bypassMsg: '',};

    let dtUnitModel = db?.dbtSelNovaUnitModel;

    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeIdNova:
        info.isVisible = true;
        dtUnitModel = dtUnitModel?.filter((item: { id: number }) => item.id === Number(formCurrValues.ddlUnitModel));
          if (Number(dtUnitModel?.[0]?.bypass_exist) === 1) {
            info.isEnabled = true;
            info.bypassMsg = '';
          } else {
            info.isChecked = false;
            info.isEnabled = false;
      
            if (Number(getValues('ddlUnitModel')) === IDs.intNovaUnitModelIdC70IN || 
                Number(getValues('ddlUnitModel')) === IDs.intNovaUnitModelIdC70OU) {

              info.bypassMsg = ' Contact Oxygen8 applications for Bypass model';

            } else {

              info.bypassMsg = ' Not available for selected model';
            }
          }
      
          if (Number(formCurrValues.ddlOrientation) === IDs.intOrientationIdHorizontal) {
            dtUnitModel = dtUnitModel?.filter((item: { bypass_exist_horizontal_unit: number }) => item.bypass_exist_horizontal_unit === 1);
      
            if (dtUnitModel && dtUnitModel?.length > 0) {
              info.isEnabled = true;
              info.bypassMsg = '';
            } else {
              info.isEnabled = false;
              info.isChecked = false;
              info.bypassMsg = ' Not available for selected model';
            }
          }
        break;
      case IDs.intProdTypeIdVentum:
      case IDs.intProdTypeIdVentumPlus:
        info.isVisible = true;

        if (Number(formCurrValues.ckbPHI) === 1) {
          info.isChecked = true;
          info.isEnabled = false;
        } else {
          // info.isChecked = false;
          info.isEnabled = true;
        }
        break;
      case IDs.intProdTypeIdVentumLite:
      case IDs.intProdTypeIdTerra:
        info.isVisible = false;
        info.isChecked = false;
        break;
      default:
        break;
    }

    // setBypassInfo(info);
    setBypassIsVisible(info.isVisible);
    setBypassIsEnabled(info.isEnabled);
    setBypassIsChecked(info.isChecked);
    setBypassMsg(info.bypassMsg);

  }, [formCurrValues.ddlUnitModel, formCurrValues.ddlOrientation, formCurrValues.ckbPHI]);



  const [unitModelInfo, setUnitModelInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtUnitModel: any; defaultId: number } = { fdtUnitModel: [], defaultId: 0,};
    // let controlsPrefProdTypeLink: any = [];

    // const dtProdUnitLocLink = db?.dbtSelProdTypeUnitTypeLocLink?.filter((item: { prod_type_id: any; unit_type_id: any }) =>
    //   item.prod_type_id === intProductTypeID && item.unit_type_id === intUnitTypeID);

    // info.fdtLocation = db?.db?.dbtSelGeneralLocation?.filter((e: { id: any }) =>
    //   dtProdUnitLocLink?.filter((e_link: { location_id: any }) => e_link.location_id === e.id)?.length > 0);

    const intUAL = typeof window !== 'undefined' && Number(localStorage.getItem('UAL')) || 0;
    const customerId = typeof window !== 'undefined' && Number(localStorage?.getItem('customerId')) || 0;
    let dtNovaUnitModelLink = db?.dbtSelNovaUnitModelLocOriLink;
    const dtLocation = db?.dbtSelGeneralLocation?.filter((item: { id: any }) => item.id === Number(formCurrValues.ddlLocation));
    const dtOrientation = db?.dbtSelGeneralOrientation?.filter((item: { id: any }) => item.id === Number(formCurrValues.ddlOrientation));
    const summerSupplyAirCFM = Number(formCurrValues.txbSummerSupplyAirCFM);

    switch (intProductTypeID) {
      case IDs.intProdTypeIdNova:
        dtNovaUnitModelLink = dtNovaUnitModelLink?.filter(
          (item: { location_value: any; orientation_value: any }) =>
            item.location_value === dtLocation?.[0]?.value.toString() &&
            item.orientation_value === dtOrientation?.[0]?.value.toString()
        );

        if (intUAL === IDs.intUAL_External || intUAL === IDs.intUAL_ExternalSpecial) {
          // unitModel = unitModelFilter(data?.novaUnitModel, summerSupplyAirCFM, 'cfm_min_ext_users', 'cfm_max_ext_users', unitModelId);
          // unitModel = data?.novaUnitModel?.filter((item) => item.terra_spp === 1);
          // unitModel = data?.novaUnitModel?.filter((item) => (item['cfm_min_ext_users'] >= summerSupplyAirCFM && summerSupplyAirCFM <= item['cfm_max_ext_users']) ).sort((a, b) => a.cfm_max - b.cfm_max);
          info.fdtUnitModel = db?.dbtSelNovaUnitModel?.filter(
              (item: { cfm_min_ext_users: number; cfm_max_ext_users: number }) =>
                item.cfm_min_ext_users <= summerSupplyAirCFM &&
                item.cfm_max_ext_users >= summerSupplyAirCFM
            ) || [];
        } else {
          // unitModel = unitModelFilter(data?.novaUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
          info.fdtUnitModel = db?.dbtSelNovaUnitModel?.filter(
            (item: { cfm_min: number; cfm_max: number }) => item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM);
        }

        if (intUAL === IDs.intUAL_External || intUAL === IDs.intUAL_ExternalSpecial) {
          info.fdtUnitModel = info.fdtUnitModel?.filter((item: { enabled_ext_users: number }) => item.enabled_ext_users === 1);
        }

        // unitModel = getFromLink(unitModel, 'unit_model_id', unitModelLink, 'cfm_max');

        info.fdtUnitModel = info.fdtUnitModel?.filter((e: { id: any}) => dtNovaUnitModelLink?.filter((e_link: { unit_model_id: any}) => e.id === e_link.unit_model_id)?.length > 0);
        info.fdtUnitModel?.sort((a: any, b: any) => a.cfm_max- b.cfm_max);


        // unitModel = sortColume(unitModel, 'cfm_max');


        if (Number(formCurrValues.ckbBypass) === 1) {
          const drUnitModelBypass = info.fdtUnitModel?.filter((item: { bypass_exist: number }) => item.bypass_exist === 1);
          const unitModelBypass = drUnitModelBypass || [];

          if (unitModelBypass?.length > 0) {
            info.fdtUnitModel = info.fdtUnitModel?.filter((item: { bypass_exist: number }) => item.bypass_exist === 1);

            if (Number(formCurrValues.ddlOrientation) === IDs.intOrientationIdHorizontal) {
              const drUnitModelBypassHorUnit = info.fdtUnitModel?.filter(
                (item: { bypass_exist_horizontal_unit: number }) => item.bypass_exist_horizontal_unit === 1);

              const unitModelBypassHorUnit = drUnitModelBypassHorUnit || [];

              if (unitModelBypassHorUnit?.length > 0) {
                info.fdtUnitModel = info.fdtUnitModel?.filter((item: { bypass_exist_horizontal_unit: number }) => item.bypass_exist_horizontal_unit === 1);
              } else {
                // ckbBypassVal = 0;
              }
            }
          }
        }
        break;
      case IDs.intProdTypeIdVentum:
        // if (Number(getValues('ckbBypass')) === 1) {
        //   summerSupplyAirCFM = summerSupplyAirCFM > intVEN_MAX_CFM_WITH_BYPASS ? intVEN_MAX_CFM_WITH_BYPASS : summerSupplyAirCFM;
        // }
        info.fdtUnitModel = db?.dbtSelVentumHUnitModel;

        // if (intUAL === IDs.intUAL_External || intUAL === IDs.intUAL_ExternalSpecial) {
        //   if (intUnitTypeID === IDs.intUnitTypeIdERV) {
        //     // unitModel = unitModelFilter(data?.ventumHUnitModel,summerSupplyAirCFM,'erv_cfm_min_ext_users','erv_cfm_max_ext_users',unitModelId);
        //     info.fdtUnitModel = info.fdtUnitModel?.filter((item: { erv_cfm_min_ext_users: number; erv_cfm_max_ext_users: number }) =>
        //           item.erv_cfm_min_ext_users <= summerSupplyAirCFM &&
        //           item.erv_cfm_max_ext_users >= summerSupplyAirCFM) || [];

        //       info.fdtUnitModel = info.fdtUnitModel.map((item: { model_erv: any }) => ({
        //       ...item,
        //       items: item.model_erv,
        //     }));
        //   } else if (intUnitTypeID === IDs.intUnitTypeIdHRV) {
        //     // unitModel = unitModelFilter(data?.ventumHUnitModel,summerSupplyAirCFM,'hrv_cfm_min_ext_users','hrv_cfm_max_ext_users', unitModelId);
        //     info.fdtUnitModel = db?.dbtSelVentumHUnitModel?.filter(
        //         (item: { hrv_cfm_min_ext_users: number; hrv_cfm_max_ext_users: number }) =>
        //           item.hrv_cfm_min_ext_users <= summerSupplyAirCFM &&
        //           item.hrv_cfm_max_ext_users >= summerSupplyAirCFM) || [];

        //           info.fdtUnitModel = info.fdtUnitModel.map((item: { model_hrv: any }) => ({
        //       ...item,
        //       items: item.model_hrv,
        //     }));
        //   }
        // } else {
        //   // unitModel = unitModelFilter(data?.ventumHUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
        //   info.fdtUnitModel = db?.dbtSelVentumHUnitModel?.filter(
        //       (item: { cfm_min: number; cfm_max: number }) => item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM) || [];
        // }
        if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
          intUAL === IDs.intUAL_IntLvl_1 || intUAL === IDs.intUAL_IntLvl_2 ||
          customerId === IDs.intCustomerIdPHI) {
            if (Number(formCurrValues?.ckbPHI)) {
              info.fdtUnitModel = info.fdtUnitModel?.filter((item: any) => item.phi_erv_cfm_min <= summerSupplyAirCFM && summerSupplyAirCFM <= item.phi_erv_cfm_max).sort((a: any, b: any) => a.cfm_max - b.cfm_max);
            } else {
              info.fdtUnitModel = info.fdtUnitModel?.filter((item: any) => item.cfm_min <= summerSupplyAirCFM && summerSupplyAirCFM <= item.cfm_max).sort((a: any, b: any) => a.cfm_max - b.cfm_max);
            }
      } else if (intUAL === IDs.intUAL_External || intUAL === IDs.intUAL_ExternalSpecial) {
        switch (intUnitTypeID) {
          case IDs.intUnitTypeIdERV:
            info.fdtUnitModel =  info.fdtUnitModel?.filter((item: any) => item.erv_cfm_min_ext_users <= summerSupplyAirCFM && summerSupplyAirCFM <= item.erv_cfm_max_ext_users).sort((a: any, b: any) => a.erv_cfm_max_ext_users - b.erv_cfm_max_ext_users);
            break;
          case IDs.intUnitTypeIdHRV:
            info.fdtUnitModel =  info.fdtUnitModel?.filter((item: any) => item.hrv_cfm_min_ext_users <= summerSupplyAirCFM && summerSupplyAirCFM <= item.hrv_cfm_min_ext_users).sort((a: any, b: any) => a.hrv_cfm_min_ext_users - b.hrv_cfm_min_ext_users);
            break;
          default:
           break;
         }
      }

      switch (intUnitTypeID) {
       case IDs.intUnitTypeIdERV:
        if (Number(formCurrValues?.ckbPHI)) {
          info.fdtUnitModel = info.fdtUnitModel.map((item: { items: any; phi_model_erv: any; }) => ({...item, items: `${item.phi_model_erv}`,}));
        } else {
          info.fdtUnitModel = info.fdtUnitModel.map((item: { items: any; model_erv: any; }) => ({...item, items: `${item.model_erv}`,}));
        }
        break;
       case IDs.intUnitTypeIdHRV:
        info.fdtUnitModel = info.fdtUnitModel.map((item: { items: any; model_hrv: any; }) => ({...item, items: `${item.model_hrv}`,}));
        break;
       default:
        break;
      }
        info.fdtUnitModel = info.fdtUnitModel?.filter((item: { bypass: any }) => item.bypass === Number(formCurrValues.ckbBypass));

        // getReheatInfo();    //Only for Ventum - H05 has no HGRH option
        break;
      case IDs.intProdTypeIdVentumLite:
        // ckbBypassVal = 0;

        if (intUAL === IDs.intUAL_IntLvl_1 || intUAL === IDs.intUAL_IntLvl_2) {
          if (intUnitTypeID === IDs.intUnitTypeIdERV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'cfm_min','cfm_max', unitModelId);
            info.fdtUnitModel = db?.dbtSelVentumLiteUnitModel?.filter((item: { cfm_min: number; cfm_max: number }) => item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM ) || [];

            // info.fdtUnitModel = info.fdtUnitModel.map((item: { model_erv: any }) => ({ ...item, items: item.model_erv, }));
          } else if (intUnitTypeID === IDs.intUnitTypeIdHRV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'cfm_min','cfm_max',unitModelId);
            info.fdtUnitModel = db?.dbtSelVentumLiteUnitModel?.filter((item: { cfm_min: number; cfm_max: number }) => item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM) || [];

            // info.fdtUnitModel = info.fdtUnitModel.map((item: { model_hrv: any }) => ({ ...item,items: item.model_hrv,}));
          }
        } else if (intUAL === IDs.intUAL_External || intUAL === IDs.intUAL_ExternalSpecial) {
          if (intUnitTypeID === IDs.intUnitTypeIdERV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'erv_cfm_min_ext_users','erv_cfm_max_ext_users',unitModelId);
            info.fdtUnitModel = db?.dbtSelVentumLiteUnitModel?.filter(
                  (item: { erv_cfm_min_ext_users: number; erv_cfm_max_ext_users: number }) =>
                  item.erv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.erv_cfm_max_ext_users >= summerSupplyAirCFM
              ) || [];
            //   info.fdtUnitModel = info.fdtUnitModel.map((item: { model_erv: any }) => ({...item, items: item.model_erv,
            // }));
          } else if (intUnitTypeID === IDs.intUnitTypeIdHRV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel, summerSupplyAirCFM,'hrv_cfm_min_ext_users','hrv_cfm_max_ext_users',unitModelId);
            info.fdtUnitModel = db?.dbtSelVentumLiteUnitModel?.filter(
                (item: { hrv_cfm_min_ext_users: number; hrv_cfm_max_ext_users: number }) =>
                  item.hrv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.hrv_cfm_max_ext_users >= summerSupplyAirCFM
              ) || [];
            //   info.fdtUnitModel = info.fdtUnitModel.map((item: { model_hrv: any }) => ({...item, items: item.model_hrv,
            // }));
          }

          const drUnitModel = info.fdtUnitModel?.filter((item: { enabled_ext_users: number }) => item.enabled_ext_users === 1);
          info.fdtUnitModel = drUnitModel || [];
        } else {
          // unitModel = unitModelFilter(data?.ventumLiteUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
          info.fdtUnitModel = db?.dbtSelVentumLiteUnitModel?.filter(
              (item: { cfm_min: number; cfm_max: number }) => item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM) || [];
        }

        info.fdtUnitModel = info.fdtUnitModel?.filter((item: { enabled: number; bypass: any }) => item.enabled === 1 && item.bypass === Number(getValues('ckbBypass')));

        if (intUnitTypeID === IDs.intUnitTypeIdERV) {
          info.fdtUnitModel = info.fdtUnitModel.map((item: { model_erv: any }) => ({...item, items: item.model_erv,}));
        } else if (intUnitTypeID === IDs.intUnitTypeIdHRV) {
          info.fdtUnitModel = info.fdtUnitModel.map((item: { model_hrv: any }) => ({...item, items: item.model_hrv, }));
        }
        break;
      case IDs.intProdTypeIdVentumPlus:
        info.fdtUnitModel =  db?.dbtSelVentumPlusUnitModel;

      // if (Number(getValues('ckbBypass')) === 1) {
      //     summerSupplyAirCFM = summerSupplyAirCFM > intVENPLUS_MAX_CFM_WITH_BYPASS ? intVENPLUS_MAX_CFM_WITH_BYPASS : summerSupplyAirCFM;
      // }
        // if (summerSupplyAirCFM < 1200) {
        //   summerSupplyAirCFM = 1200;
        // }


        if (intUAL === IDs.intUAL_Admin || intUAL === IDs.intUAL_IntAdmin ||
            intUAL === IDs.intUAL_IntLvl_1 || intUAL === IDs.intUAL_IntLvl_2 ||
            customerId === IDs.intCustomerIdPHI) {
              if (Number(formCurrValues?.ckbPHI)) {
                info.fdtUnitModel = info.fdtUnitModel?.filter((item: any) => item.phi_erv_cfm_min <= summerSupplyAirCFM && summerSupplyAirCFM <= item.phi_erv_cfm_max).sort((a: any, b: any) => a.cfm_max - b.cfm_max);
              } else {
                info.fdtUnitModel = info.fdtUnitModel?.filter((item: any) => item.cfm_min <= summerSupplyAirCFM && summerSupplyAirCFM <= item.cfm_max).sort((a: any, b: any) => a.cfm_max - b.cfm_max);
              }
        } else if (intUAL === IDs.intUAL_External || intUAL === IDs.intUAL_ExternalSpecial) {
          switch (intUnitTypeID) {
            case IDs.intUnitTypeIdERV:
              info.fdtUnitModel =  info.fdtUnitModel?.filter((item: any) => item.erv_cfm_min_ext_users <= summerSupplyAirCFM && summerSupplyAirCFM <= item.erv_cfm_max_ext_users).sort((a: any, b: any) => a.erv_cfm_max_ext_users - b.erv_cfm_max_ext_users);
              break;
            case IDs.intUnitTypeIdHRV:
              info.fdtUnitModel =  info.fdtUnitModel?.filter((item: any) => item.hrv_cfm_min_ext_users <= summerSupplyAirCFM && summerSupplyAirCFM <= item.hrv_cfm_min_ext_users).sort((a: any, b: any) => a.hrv_cfm_min_ext_users - b.hrv_cfm_min_ext_users);
              break;
            default:
             break;
           }
        }

        info.fdtUnitModel = info.fdtUnitModel?.filter((item: { location_id_key: any; enabled: number; bypass: any }) =>
          item.location_id_key === dtLocation?.[0]?.id_key && item.enabled === 1 && item.bypass === Number(getValues('ckbBypass')));

        switch (intUnitTypeID) {
         case IDs.intUnitTypeIdERV:
          if (Number(formCurrValues?.ckbPHI)) {
            info.fdtUnitModel = info.fdtUnitModel.map((item: { items: any; phi_model_erv: any; }) => ({...item, items: `${item.phi_model_erv}`,}));
          } else {
            info.fdtUnitModel = info.fdtUnitModel.map((item: { items: any; model_erv: any; }) => ({...item, items: `${item.model_erv}`,}));
          }
          break;
         case IDs.intUnitTypeIdHRV:
          info.fdtUnitModel = info.fdtUnitModel.map((item: { items: any; model_hrv: any; }) => ({...item, items: `${item.model_hrv}`,}));
          break;
         default:
          break;
        }

        break;
      case IDs.intProdTypeIdTerra:
        if (intUAL === IDs.intUAL_External || intUAL === IDs.intUAL_ExternalSpecial) {
          // unitModel = unitModelFilter(data?.terraUnitModel,summerSupplyAirCFM,'cfm_min_ext_users','cfm_max_ext_users',unitModelId);
          info.fdtUnitModel = db?.dbtSelTerraUnitModel?.filter(
              (item: { cfm_min_ext_users: number; cfm_max_ext_users: number }) =>
                item.cfm_min_ext_users <= summerSupplyAirCFM &&
                item.cfm_max_ext_users >= summerSupplyAirCFM
            ) || [];

          const drUnitModel = info.fdtUnitModel?.filter((item: { enabled_ext_users: number }) => item.enabled_ext_users === 1);
          info.fdtUnitModel = drUnitModel || [];
        } else {
          // unitModel = unitModelFilter(data?.terraUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
          info.fdtUnitModel = db?.dbtSelTerraUnitModel?.filter((item: { cfm_min: number; cfm_max: number }) =>item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM) || [];
        }

        break;
      default:
        break;
    }



    setUnitModelInfo(info);
    info.defaultId = info.fdtUnitModel?.[0]?.id;
    setValue('ddlUnitModel', info.fdtUnitModel?.[0]?.id);

  }, [formCurrValues.txbSummerSupplyAirCFM, formCurrValues.ddlLocation, formCurrValues.ddlOrientation, formCurrValues.ckbBypass]);

  

  const [unitTypeInfo, setUnitTypeInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtUnitType: any; isVisible: boolean; defaultId: number } = {
      fdtUnitType: [],
      isVisible: false,
      defaultId: 0,
    };

    info.fdtUnitType = db?.dbtSelUnitType;

    setUnitTypeInfo(info);
    setValue('ddlUnitType', intUnitTypeID);

  }, []);



  const [drainPanInfo, setDrainPanInfo] = useState<any>([]);
  useMemo(() => {
    const info: { isVisible: boolean; defaultId: number } = {
      isVisible: false,
      defaultId: 0,
    };

    switch (intProductTypeID) {
      case IDs.intProdTypeIdNova:
        info.isVisible = false;
        setValue('ckbDrainPan', 0); //
        break;
      case IDs.intProdTypeIdVentum:
      case IDs.intProdTypeIdVentumLite:
      case IDs.intProdTypeIdVentumPlus:
      case IDs.intProdTypeIdTerra:
        switch (intUnitTypeID) {
          case IDs.intUnitTypeIdERV:
            info.isVisible = false;
            setValue('ckbDrainPan', 0); //
            break;
          case IDs.intUnitTypeIdHRV:
            info.isVisible = true;
            setValue('ckbDrainPan', 1); //
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

    setDrainPanInfo(info);

  }, []);


  const [controlsPrefInfo, setControlsPrefInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtControlsPref: any; isVisible: boolean; defaultId: number } = {
      fdtControlsPref: [],
      isVisible: false,
      defaultId: 0,
    };
    // let controlsPrefProdTypeLink: any = [];
    let controlsPrefProdTypeLink: any = [];
    controlsPrefProdTypeLink = db?.dbtSelControlsPrefProdTypeLink?.filter((item: { prod_type_id: number }) => item.prod_type_id === intProductTypeID
    );

    info.fdtControlsPref = db?.dbtSelControlsPref?.filter(
      (e: { id: any }) => controlsPrefProdTypeLink?.filter((e_link: { controls_id: any }) => e.id === e_link.controls_id)?.length > 0
    );

    setControlsPrefInfo(info);
    info.defaultId = info.fdtControlsPref?.[0]?.id;
    setValue('ddlControlsPref', info.fdtControlsPref?.[0]?.id);
  }, []);


  const [controlViaInfo, setControlViaInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtControlVia: any; isVisible: boolean; defaultId: number } = {
      fdtControlVia: [],
      isVisible: false,
      defaultId: 0,
    };
    // let controlsPrefProdTypeLink: any = [];
    info.fdtControlVia = db?.dbtSelControlVia;

    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentum:
      case IDs.intProdTypeIdVentumLite:
      case IDs.intProdTypeIdVentumPlus:
        if (Number(getValues('ddlControlsPref')) === IDs.intContPrefIdDCV_CO2) {
          info.fdtControlVia = info.fdtControlVia?.filter(
            (item: { id: number }) => item.id === IDs.intContViaIdShipLooseCO2Sensor
          );

          info.isVisible = true;
        } else {
          info.fdtControlVia = info.fdtControlVia?.filter(
            (item: { id: number }) => item.id === IDs.intContViaIdNA
          );

          info.isVisible = false;
        }
        break;
      case IDs.intProdTypeIdTerra:
        info.fdtControlVia = info.fdtControlVia?.filter(
          (item: { id: number }) => item.id !== IDs.intContViaIdNA
        );

        info.isVisible = false;
        break;
      default:
        break;
    }

    setControlViaInfo(info);

    info.defaultId = info.fdtControlVia?.[0]?.id;
    setValue('ddlControlVia', info.defaultId);
  }, [getValues('ddlControlsPref')]);

  



  const [outdoorAirFilterInfo, setOutdoorAirFilterInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtOutdoorAirFilter: any; isVisible: boolean; defaultId: number } = {
      fdtOutdoorAirFilter: [],
      isVisible: false,
      defaultId: 0,
    };
    info.fdtOutdoorAirFilter = db?.dbtSelFilterModel;
    info.fdtOutdoorAirFilter = info.fdtOutdoorAirFilter?.filter((item: { outdoor_air: number }) => item.outdoor_air === 1);

    switch (intProductTypeID) {
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentum:
      case IDs.intProdTypeIdVentumLite:
        info.fdtOutdoorAirFilter =
          info.fdtOutdoorAirFilter?.filter((e: { depth: any }) => e.depth === 2) || [];
        info.defaultId = IDs.intFilterModelId2in_85_MERV_13;
        break;
      case IDs.intProdTypeIdTerra:
        // info.fdtOutdoorAirFilter = info.fdtOutdoorAirFilter?.filter((item: { depth: number }) => item.depth !== 2);
        info.fdtOutdoorAirFilter = info.fdtOutdoorAirFilter?.filter(
          (item: { id: number }) => item.id === IDs.intFilterModelId2in_85_MERV_13
        );
        info.defaultId = IDs.intFilterModelId2in_85_MERV_13;
        break;
      case IDs.intProdTypeIdVentumPlus:
        info.fdtOutdoorAirFilter = info.fdtOutdoorAirFilter?.filter(
          (item: { depth: number }) => item.depth === 4
        );
        info.defaultId = IDs.intFilterModelId4in_85_MERV_13;
        break;
      default:
        break;
    }

    // info1.fdtOutdoorAirFilter = dt;
    setOutdoorAirFilterInfo(info);

    setValue('ddlOA_FilterModel', info.defaultId);
  }, []);


  const [returnAirFilterInfo, setReturnAirFilterInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtReturnAirFilter: any; isVisible: boolean; defaultId: number } = {
      fdtReturnAirFilter: [],
      isVisible: false,
      defaultId: 0,
    };
    info.fdtReturnAirFilter = db?.dbtSelFilterModel;
    info.fdtReturnAirFilter = info.fdtReturnAirFilter?.filter((item: { return_air: number }) => item.return_air === 1);

    switch (intProductTypeID) {
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentum:
      case IDs.intProdTypeIdVentumLite:
        info.fdtReturnAirFilter =
          info.fdtReturnAirFilter?.filter((e: { depth: any }) => e.depth === 2) || [];
          info.defaultId = IDs.intFilterModelId2in_85_MERV_8;
          info.isVisible = true;
        break;
      case IDs.intProdTypeIdTerra:
        info.fdtReturnAirFilter = info.fdtReturnAirFilter?.filter(
          (item: { id: number }) => item.id === IDs.intFilterModelIdNA
        );
        info.defaultId = IDs.intFilterModelIdNA;
        info.isVisible = false;
        break;
      case IDs.intProdTypeIdVentumPlus:
        info.fdtReturnAirFilter =
          info.fdtReturnAirFilter?.filter((item: { depth: number }) => item.depth === 4) || [];
          info.defaultId = IDs.intFilterModelId4in_85_MERV_8
          info.isVisible = true;
        break;
      default:
        break;
    }

    setReturnAirFilterInfo(info);

    setValue('ddlRA_FilterModel', info.defaultId);
  }, []);


  useMemo(() => {
     let filterCondtion = db?.dbtSelFilterCondition;
     filterCondtion = filterCondtion?.filter((item: { id: number }) => item.id !== IDs.intFilterConditionIdNA);
     const defaultId = IDs.intFilterConditionIdMidLife
    setFilterCondtionOptions(filterCondtion);
    setFilterConditionId(defaultId);

    setValue('ddlFilterCondition', defaultId);
  }, [db]);


  const [mixOADamperPosInfo, setMixOADamperPosInfo] = useState<any>([]);
  const [mixOADamperPos, setMixOADamperPos] = useState<any>([]);
  const [mixRADamperPosInfo, setMixRADamperPosInfo] = useState<any>([]);
  const [mixRADamperPos, setMixRADamperPos] = useState<any>([]);
  useMemo(() => {
    const info: { ftdMixOADamperPos: any; isVisible: boolean; defaultId: number } = {

      ftdMixOADamperPos: [],
      isVisible: false,
      defaultId: 0,
    };

    info.ftdMixOADamperPos = db?.dbtSelDamperPosition;
    let SelId = 0;

    if (formCurrValues.ckbMixingBox) {
      info.ftdMixOADamperPos = info.ftdMixOADamperPos?.filter((e: { id: any }) => e.id !== IDs.intDamperPosIdNA) || [];
    }
    else {
      info.ftdMixOADamperPos = info.ftdMixOADamperPos?.filter((e: { id: any }) => e.id === IDs.intDamperPosIdNA) || [];
    }

    setMixOADamperPosInfo(info);
    setValue('ddlMixOADamperPos', info.ftdMixOADamperPos?.[0]?.id);


    if (Number(formCurrValues.ddlMixOADamperPos) !==  IDs.intDamperPosIdNA &&
        Number(formCurrValues.ddlMixOADamperPos) === Number(formCurrValues.ddlMixRADamperPos)) {
    // if (Number(mixOADamperPos) !==  IDs.intDamperPosIdNA &&
    //   Number(mixOADamperPos) === Number(mixRADamperPos)) {

      const index = info.ftdMixOADamperPos.findIndex((x: { id: Number }) => x.id === Number(formCurrValues.ddlMixOADamperPos));

     if (index < info.ftdMixOADamperPos.length - 1) {
      SelId = info.ftdMixOADamperPos?.[index + 1]?.id;
     } else {
      SelId = info.ftdMixOADamperPos?.[0]?.id;
     }

     setValue('ddlMixOADamperPos', SelId);
    }

  }, [formCurrValues.ckbMixingBox, formCurrValues.ddlMixRADamperPos]);


  useMemo(() => {
    const info: { ftdMixRADamperPos: any; isVisible: boolean; defaultId: number } = {

      ftdMixRADamperPos: [],
      isVisible: false,
      defaultId: 0,
    };

    info.ftdMixRADamperPos = db?.dbtSelDamperPosition;
    let SelId = 0;

    if (formCurrValues.ckbMixingBox) {
      info.ftdMixRADamperPos = info.ftdMixRADamperPos?.filter((e: { id: any }) => e.id !== IDs.intDamperPosIdNA) || [];
    } else {
      info.ftdMixRADamperPos = info.ftdMixRADamperPos?.filter((e: { id: any }) => e.id === IDs.intDamperPosIdNA) || [];
    }

    setMixRADamperPosInfo(info);
    setValue('ddlMixRADamperPos', info.ftdMixRADamperPos?.[0]?.id);


    if (Number(formCurrValues.ddlMixRADamperPos) !==  IDs.intDamperPosIdNA &&
      Number(formCurrValues.ddlMixRADamperPos) === Number(formCurrValues.ddlMixOADamperPos)) {
  
      const index = info.ftdMixRADamperPos.findIndex((x: { id: Number }) => x.id === Number(formCurrValues.ddlMixRADamperPos));
    
      if (index < info.ftdMixRADamperPos.length - 1) {
        SelId = info.ftdMixRADamperPos?.[index + 1]?.id;
        // setValue('ddlMixRADamperPos', SelId);
      } else {
        SelId = info.ftdMixRADamperPos?.[0]?.id;
        // setValue('ddlMixRADamperPos', SelId);
      }

      setValue('ddlMixRADamperPos', SelId);
    }

  }, [formCurrValues.ckbMixingBox, formCurrValues.ddlMixOADamperPos]);



  useMemo(() => {
    if (formCurrValues.ckbMixingBox) {
      setValue('ddlMixRADamperPos', IDs.intDamperPosIdSide);
      setValue('ddlMixRADamperPos', IDs.intDamperPosIdTop);
    } else {
      setValue('ddlMixRADamperPos', IDs.intDamperPosIdNA);
      setValue('ddlMixRADamperPos', IDs.intDamperPosIdNA);
    }
  
  }, [formCurrValues.ckbMixingBox]);





  // Use this method since getValues('') for dependencies don't work. Extract all fieled from getValues into a constant first.
  const oMixSummerOA_RH = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbMixSummerOA_DB || any,
      dblWB: formCurrValues.txbMixSummerOA_WB || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbMixSummerOA_DB, formCurrValues.txbMixSummerOA_WB]);


  const oMixSummerOA_WB = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbMixSummerOA_DB || any,
      dblRH: formCurrValues.txbMixSummerOA_RH || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbMixSummerOA_DB, formCurrValues.txbMixSummerOA_RH]);


  const oMixWinterOA_RH = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbMixWinterOA_DB || any,
      dblWB: formCurrValues.txbMixWinterOA_WB || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbMixWinterOA_DB, formCurrValues.txbMixWinterOA_WB]);


  const oMixWinterOA_WB = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbMixWinterOA_DB || any,
      dblRH: formCurrValues.txbMixWinterOA_RH || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbMixWinterOA_DB, formCurrValues.txbMixWinterOA_RH]);


  const oMixSummerRA_RH = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbMixSummerRA_DB || any,
      dblWB: formCurrValues.txbMixSummerRA_WB || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbMixSummerRA_DB, formCurrValues.txbMixSummerRA_WB]);


  const oMixSummerRA_WB = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbMixSummerRA_DB || any,
      dblRH: formCurrValues.txbMixSummerRA_RH || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbMixSummerRA_DB, formCurrValues.txbMixSummerRA_RH]);


  const oMixWinterRA_RH = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbMixWinterRA_DB || any,
      dblWB: formCurrValues.txbMixWinterRA_WB || any,
    };
    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbMixWinterRA_DB, formCurrValues.txbMixWinterRA_WB]);


  const oMixWinterRA_WB = useMemo(() => {
    const inputs: any = {
      dblAlt: formCurrValues.txbAltitude || any,
      dblDB: formCurrValues.txbMixWinterRA_DB || any,
      dblRH: formCurrValues.txbMixWinterRA_RH || any,
    };

    return inputs;
  }, [formCurrValues.txbAltitude, formCurrValues.txbMixWinterRA_DB, formCurrValues.txbMixWinterRA_RH]);


  const [preheatCompInfo, setPreheatCompInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtPreheatComp: any; isVisible: boolean; defaultId: number } = { fdtPreheatComp: [], isVisible: false, defaultId: 0,};
  
    info.fdtPreheatComp = db?.dbtSelUnitCoolingHeating;
    info.isVisible = true;
  
    if (intUnitTypeID === IDs.intUnitTypeIdERV) {
      info.fdtPreheatComp = info.fdtPreheatComp?.filter((e: { erv_preheat: number }) => Number(e.erv_preheat) === 1) || [];
  
      if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
        info.fdtPreheatComp = info.fdtPreheatComp ?.filter((item: { id: number }) => Number(item.id) !== IDs.intCompIdHWC ) || [];
      }
  
    } else if (intUnitTypeID === IDs.intUnitTypeIdHRV) {
      info.fdtPreheatComp = info.fdtPreheatComp?.filter((e: { hrv_preheat: number }) => Number(e.hrv_preheat) === 1) || [];
  
      if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
        info.fdtPreheatComp = info.fdtPreheatComp?.filter((e: { id: any }) => parseInt(e.id, 10) !== IDs.intCompIdHWC);        
      }
  
    } else if (intUnitTypeID === IDs.intUnitTypeIdAHU) {
      info.fdtPreheatComp = info.fdtPreheatComp?.filter((e: { fc_preheat: number }) => Number(e.fc_preheat) === 1) || [];
    }

    setPreheatCompInfo(info);
    // info.defaultId = info.fdtPreheatComp?.[0]?.id;
    info.defaultId = formCurrValues.ddlPreheatComp  > 0 ? formCurrValues.ddlPreheatComp : IDs.intCompIdAuto;

    setValue('ddlPreheatComp', info.defaultId);

  }, []);


  const [heatExchInfo, setHeatExchInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHeatExch: any; isVisible: boolean; defaultId: number } = { fdtHeatExch: [], isVisible: false, defaultId: 0,};
  
    const dtHeatExch = db?.dbtSelUnitHeatExchanger;
  
    switch (intUnitTypeID) {
      case IDs.intUnitTypeIdERV:
        info.fdtHeatExch = dtHeatExch?.filter((e: { erv: number }) => Number(e.erv) === 1) || [];
        break;
      case IDs.intUnitTypeIdHRV:
        info.fdtHeatExch = dtHeatExch?.filter((e: { hrv: number }) => Number(e.hrv) === 1) || [];
        break;
      case IDs.intUnitTypeIdAHU:
        info.fdtHeatExch = dtHeatExch?.filter((e: { fc: number }) => Number(e.fc) === 1) || [];
        break;
      default:
        // code block
        break;
    }


    setHeatExchInfo(info);
    info.defaultId = info.fdtHeatExch?.[0]?.id;
    setValue('ddlHeatExchComp', info.fdtHeatExch?.[0]?.id);

  }, []);


  const [coolingCompInfo, setCoolingCompInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtCoolingComp: any;  isVisible: boolean; defaultId: number } = { fdtCoolingComp: [], isVisible: false, defaultId: 0,};
  
    info.fdtCoolingComp  = db?.dbtSelUnitCoolingHeating;
    info.isVisible = true;
    
    switch (intProductTypeID) {
      case IDs.intProdTypeIdVentumLite:
        // info.ftdHeatingComp = info.ftdHeatingComp?.filter((item: { id: { toString: () => any } }) =>  item.id.toString() !== IDs.intCompIdNA.toString());
        info.fdtCoolingComp  = info.fdtCoolingComp .filter((item: { id: number }) =>  item.id === IDs.intCompIdNA);
        info.defaultId = IDs.intCompIdNA;
        info.isVisible = false;
        break;
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentumPlus:
      case IDs.intProdTypeIdVentum: 
        switch (intUnitTypeID) {
          case IDs.intUnitTypeIdERV:
            info.fdtCoolingComp = info.fdtCoolingComp ?.filter((e: { erv_cooling: number }) => Number(e.erv_cooling) === 1) || [];
            break;
          case IDs.intUnitTypeIdHRV:
            info.fdtCoolingComp = info.fdtCoolingComp ?.filter((e: { hrv_cooling: number }) => Number(e.hrv_cooling) === 1) || [];
            break;
          default:
            // code block
            break;
        }        

        if (intProductTypeID === IDs.intProdTypeIdVentum &&  
          (Number(formCurrValues.ddlUnitModel)  === IDs.intVentumUnitModelIdH05IN_ERV_HRV || Number(formCurrValues.ddlUnitModel)  === IDs.intVentumUnitModelIdH05IN_ERV_HRV_BP))
        {
          info.fdtCoolingComp  = info.fdtCoolingComp .filter((item: { id: number }) =>  item.id !== IDs.intCompIdDX);
        }        
      break;

      case IDs.intProdTypeIdTerra: 
        // info.fdtCoolingComp = info.fdtCoolingComp ?.filter((e: { fc_cooling: number }) => Number(e.fc_cooling) === 1) || [];
        info.fdtCoolingComp = info.fdtCoolingComp ?.filter((e: { id: number }) => Number(e.id) === IDs.intCompIdDX) || [];
        break;
      default:
        // code block
        break;
    }


    // if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
    //   // info.ftdHeatingComp = info.ftdHeatingComp?.filter((item: { id: { toString: () => any } }) =>  item.id.toString() !== IDs.intCompIdNA.toString());
    //   info.fdtCoolingComp  = info.fdtCoolingComp .filter((item: { id: number }) =>  item.id === IDs.intCompIdNA);
    //   info.defaultId = IDs.intCompIdAuto;
    //   info.isVisible = false;
    // } else {
    //   switch (intUnitTypeID) {
    //     case IDs.intUnitTypeIdERV:
    //       info.fdtCoolingComp = info.fdtCoolingComp ?.filter((e: { erv_cooling: number }) => Number(e.erv_cooling) === 1) || [];
    //       break;
    //     case IDs.intUnitTypeIdHRV:
    //       info.fdtCoolingComp = info.fdtCoolingComp ?.filter((e: { hrv_cooling: number }) => Number(e.hrv_cooling) === 1) || [];
    //       break;
    //     case IDs.intUnitTypeIdAHU:
    //       info.fdtCoolingComp = info.fdtCoolingComp ?.filter((e: { fc_cooling: number }) => Number(e.fc_cooling) === 1) || [];
    //       break;
    //     default:
    //       // code block
    //       break;
    //   }
    // }
    setCoolingCompInfo(info);
    // info.defaultId = info.fdtCoolingComp?.[0]?.id;
    // setValue('ddlCoolingComp', info.fdtCoolingComp?.[0]?.id);
    info.defaultId = formCurrValues.ddlCoolingComp  > 0 ? formCurrValues.ddlCoolingComp : info.fdtCoolingComp?.[0]?.id;

    setValue('ddlCoolingComp', info.defaultId);

  }, [getValues('ddlUnitModel')]);
  


  const heatingSectionVisible = useEffect(() => {
    if (intProductTypeID === IDs.intProdTypeIdVentumPlus || Number(formCurrValues.ddlReheatComp) === IDs.intCompIdHGRH) {
      setIsHeatingSectionVisible(false);
    } else {
      setIsHeatingSectionVisible(true);
    }
  }, [intProductTypeID, formCurrValues.ckbHeatPump]);


  const heatingSetpointVisible = useEffect(() => {
    if (Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdElecHeater || 
        Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC || 
        Number(formCurrValues.ckbHeatPump) === 1) {
      setIsHeatingSetpointVisible(true);
    } else {
      setIsHeatingSetpointVisible(false);
    }
  }, [formCurrValues.ddlHeatingComp, formCurrValues.ckbHeatPump]);


  const [heatingCompInfo, setHeatingCompInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHeatingComp: any;  isVisible: boolean; isEnabled: boolean; defaultId: number } = 
                { fdtHeatingComp: [], isVisible: false, isEnabled: false, defaultId: 0, };
    
    info.fdtHeatingComp = db?.dbtSelUnitCoolingHeating;
    // info.isVisible = true;

    switch (intUnitTypeID) {
      case IDs.intUnitTypeIdERV:
        info.fdtHeatingComp = info.fdtHeatingComp?.filter((e: { erv_heating: number }) => Number(e.erv_heating) === 1) || [];
        break;
      case IDs.intUnitTypeIdHRV:
        info.fdtHeatingComp = info.fdtHeatingComp?.filter((e: { hrv_heating: number }) => Number(e.hrv_heating) === 1) || [];
        break;
        case IDs.intUnitTypeIdAHU:
          info.fdtHeatingComp = info.fdtHeatingComp?.filter((e: { fc_heating: number }) => Number(e.fc_heating) === 1) || [];
          break;
      default:
        // code block
        break;
    }

    info.defaultId = info.fdtHeatingComp?.[0]?.id;
    info.isVisible = true;
    info.isEnabled = true;


    switch (intProductTypeID) {
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentum:
        break;
      case IDs.intProdTypeIdVentumLite:
      case IDs.intProdTypeIdTerra:
        // info.ftdHeatingComp = info.ftdHeatingComp?.filter((item: { id: { toString: () => any } }) =>  item.id.toString() !== IDs.intCompIdNA.toString());
        info.fdtHeatingComp = info.fdtHeatingComp?.filter((item: { id: number }) => item.id === IDs.intCompIdNA);
        info.defaultId = IDs.intCompIdNA;
        info.isVisible = false;
        break;
      case IDs.intProdTypeIdVentumPlus:
        if (Number(formCurrValues.ddlCoolingComp) === IDs.intCompIdDX && Number(formCurrValues.ddlReheatComp) === IDs.intCompIdHGRH) {
          info.fdtHeatingComp = info.fdtHeatingComp?.filter((item: { id: number }) => item.id === IDs.intCompIdNA);
          info.defaultId = IDs.intCompIdNA;
          info.isEnabled = false;
        }
        break;
      default:
        break;
    }


   if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX && Number(getValues('ckbDaikinVRV')) === 1) {
      info.isVisible = false;

      // Heating becomes Backup Heating
      if (Number(getValues('ddlReheatComp')) !== IDs.intCompIdHGRH && Number(getValues('ddlReheatComp')) !== IDs.intCompIdNA) {
        info.fdtHeatingComp = info.fdtHeatingComp?.filter((item: { id: number }) => item.id === IDs.intCompIdNA || item.id === Number(getValues('ddlReheatComp')));
      }
      // else {
      //   info.fdtHeatingComp = info.fdtHeatingComp?.filter((item: { id: number }) => item.id === IDs.intCompIdNA || item.id === Number(getValues('ddlReheatComp')));
      // }
    }

    // info.defaultId = formCurrValues.ddlHeatingComp  > 0 ? formCurrValues.ddlHeatingComp : info.fdtHeatingComp?.[0]?.id;
    info.defaultId = info.fdtHeatingComp?.filter((item: { id: number }) => item.id === Number(formCurrValues.ddlHeatingComp)).length > 0 ? formCurrValues.ddlHeatingComp : info.fdtHeatingComp?.[0]?.id;
    // const test = info.fdtHeatingComp.some((item: { id: number }) => item, { id: formCurrValues.ddlHeatingComp });


    setHeatingCompInfo(info);
    setValue('ddlHeatingComp', info.defaultId);

  }, [getValues('ddlCoolingComp'), getValues('ckbDaikinVRV'), getValues('ddlReheatComp')]);


  const [reheatCompInfo, setReheatCompInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtReheatComp: any; isVisible: boolean; defaultId: number } = { fdtReheatComp: [], isVisible: false, defaultId: 0,};
    // let controlsPrefProdTypeLink: any = [];

    info.fdtReheatComp = db?.dbtSelUnitCoolingHeating;
    const intUAL = typeof window !== 'undefined' && Number(localStorage?.getItem('UAL')) || 0;

    switch (intUnitTypeID) {
      case IDs.intUnitTypeIdERV:
        info.fdtReheatComp = info.fdtReheatComp?.filter((e: { erv_reheat: number }) => Number(e.erv_reheat) === 1) || [];
        break;
      case IDs.intUnitTypeIdHRV:
        info.fdtReheatComp = info.fdtReheatComp?.filter((e: { hrv_reheat: number }) => Number(e.hrv_reheat) === 1) || [];
        break;
      case IDs.intUnitTypeIdAHU:
        info.fdtReheatComp = info.fdtReheatComp?.filter((e: { fc_reheat: number }) => Number(e.fc_reheat) === 1) || [];
        break;
      default:
        // code block
        break;
    }

    // if (Number(getValues('ckbDehumidification'))) {
      info.isVisible = true;

      switch (Number(getValues('ddlCoolingComp'))) {
        case IDs.intCompIdCWC:
          info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: { toString: () => any } }) => item.id.toString() !== IDs.intCompIdHGRH.toString());
          // info.defaultId = formCurrValues.ddlReheatComp  > 0 ? formCurrValues.ddlReheatComp : info.fdtReheatComp?.[0]?.id;
          info.defaultId = info.fdtReheatComp?.filter((item: { id: number }) => item.id === Number(formCurrValues.ddlReheatComp)).length > 0 ? formCurrValues.ddlReheatComp : info.fdtReheatComp?.[0]?.id;
          break;
        case IDs.intCompIdDX:
          if (Number(intUAL) === IDs.intUAL_External && (intUnitTypeID === IDs.intUnitTypeIdERV || intUnitTypeID === IDs.intUnitTypeIdHRV)) {
            info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: { toString: () => any } }) => item.id.toString() !== IDs.intCompIdHGRH.toString());
          } else if (intProductTypeID === IDs.intProdTypeIdVentum && 
              (Number(getValues('ddlUnitModel')) === IDs.intVentumUnitModelIdH05IN_ERV_HRV || Number(getValues('ddlUnitModel')) === IDs.intVentumUnitModelIdH05IN_ERV_HRV_BP)) {
            info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: { toString: () => any } }) =>  item.id.toString() !== IDs.intCompIdHGRH.toString());
          }
          // info.defaultId = formCurrValues.ddlReheatComp  > 0 ? formCurrValues.ddlReheatComp : info.fdtReheatComp?.[0]?.id;
          info.defaultId = info.fdtReheatComp?.filter((item: { id: number }) => item.id === Number(formCurrValues.ddlReheatComp)).length > 0 ? formCurrValues.ddlReheatComp : info.fdtReheatComp?.[0]?.id;
          break;
        default:
          info.defaultId = IDs.intCompIdNA;
          info.isVisible = false;
          break;
      } 


      if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdCWC) {
        if (Number(getValues('ddlHeatingComp')) !== IDs.intCompIdNA) {
          info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: Number} ) => item.id === IDs.intCompIdNA || item.id === Number(getValues('ddlHeatingComp')));
        }
        // else {
        //   info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: Number} ) =>  item.id !== IDs.intCompIdHGRH);
        // }
                  
        // info.defaultId = formCurrValues.ddlReheatComp  > 0 ? formCurrValues.ddlReheatComp : info.fdtReheatComp?.[0]?.id;
        info.defaultId = info.fdtReheatComp?.filter((item: { id: number }) => item.id === Number(formCurrValues.ddlReheatComp)).length > 0 ? formCurrValues.ddlReheatComp : info.fdtReheatComp?.[0]?.id;
      } 
      else if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX && Number(getValues('ckbDaikinVRV')) === 0) {
        info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: Number }) =>  item.id !== IDs.intCompIdHGRH);
        // info.defaultId = formCurrValues.ddlReheatComp  > 0 ? formCurrValues.ddlReheatComp : info.fdtReheatComp?.[0]?.id;
        info.defaultId = info.fdtReheatComp?.filter((item: { id: number }) => item.id === Number(formCurrValues.ddlReheatComp)).length > 0 ? formCurrValues.ddlReheatComp : info.fdtReheatComp?.[0]?.id;
  }

      // if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX && Number(getValues('ckbDaikinVRV')) === 1) {
      //   info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: number }) => 
      //     item.id === IDs.intCompIdNA || 
      //     item.id === IDs.intCompIdHGRH);
      //   info.defaultId = formCurrValues.ddlReheatComp  > 0 ? formCurrValues.ddlReheatComp : info.fdtReheatComp?.[0]?.id;
      // }
      // else if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX && Number(getValues('ckbDaikinVRV')) === 0) {
      //   info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: number }) => item.id !== IDs.intCompIdHGRH );
      //   info.defaultId = formCurrValues.ddlReheatComp  > 0 ? formCurrValues.ddlReheatComp : info.fdtReheatComp?.[0]?.id;
      // }




    setReheatCompInfo(info);
    setValue('ddlReheatComp', info.defaultId);

  }, [getValues('ddlUnitModel'), getValues('ddlCoolingComp'), getValues('ckbDehumidification'), getValues('ckbDaikinVRV'), getValues('ddlHeatingComp')]);


  // const [heatPumpInfo, setHeatPumpInfo] = useState<any>([]);
  useEffect(() => {
    // const info: { isChecked: boolean; isVisible: boolean; defaultId: number } = {
    //   isChecked: false,
    //   isVisible: false,
    //   defaultId: 0,
    // };

    if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX) {
      // info.isChecked = true;
      // info.isVisible = true;
      setValue('ckbDaikinVRV', 1);

    } else {
      // info.isChecked = false;
      // info.isVisible = false;
      setValue('ckbDaikinVRV', 0);
    }

    // setHeatPumpInfo(info);
    // setValue('ckbHeatPump', info.isChecked);

  }, [db, getValues('ddlCoolingComp')]);



  // const [dehumInfo, setDehumInfo] = useState<any>([]);
  // useMemo(() => {
  //   const info: { isChecked: boolean; isVisible: boolean; defaultId: number } = {
  //     isChecked: false,
  //     isVisible: false,
  //     defaultId: 0,
  //   };


  //   switch (Number(getValues('ddlCoolingComp'))) {
  //     case IDs.intCompIdCWC:
  //     case IDs.intCompIdDX:
  //       info.isChecked = false;
  //       info.isVisible = true;  
  //       break;
  //     default:
  //       info.isChecked = false;
  //       info.isVisible = false;
  //       break;
  //   }

  //   setDehumInfo(info);
  //   setValue('ckbDehumidification', info.isChecked);

  // }, [db, getValues('ddlCoolingComp')]);





  // Keep preheat elec heater separate even if the logic is same as heating/reheat logic.
  const [preheatElecHeaterInstallInfo, setPreheatElecHeaterInstallInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtElecHeaterInstall: any; isVisible: boolean; defaultId: number } = {
      fdtElecHeaterInstall: [],
      isVisible: false,
      defaultId: 0,
    };

    info.fdtElecHeaterInstall = db?.dbtSelElecHeaterInstallation;
    let dtLink = db?.dbtSelElectricHeaterInstallProdTypeLink;
    dtLink = dtLink?.filter((item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID) || [];

    if (
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdElecHeater ||
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdAuto
    ) {
      info.isVisible = true;
      info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((item: { id: number }) => item.id !== IDs.intElecHeaterInstallIdNA);

      switch (Number(getValues('ddlLocation'))) {
        case IDs.intLocationIdOutdoor:
          switch (intProductTypeID) {
            case IDs.intProdTypeIdNova:
            case IDs.intProdTypeIdVentum:
            case IDs.intProdTypeIdVentumLite:
            case IDs.intProdTypeIdTerra:
              info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((item: { id: any }) => item.id === IDs.intElecHeaterInstallIdInCasingField);
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            case IDs.intProdTypeIdVentumPlus:
              info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((item: { id: any }) => item.id === IDs.intElecHeaterInstallIdInCasingFactory);
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            default:
              break;
          }
          break;
        case IDs.intLocationIdIndoor:
          dtLink = dtLink?.filter((item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID) || [];
          info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((e: { id: any }) => 
            dtLink?.filter((e_link: { elec_heater_install_id: any }) => e.id === e_link.elec_heater_install_id)?.length === 1); // 1: Matching items, 0: Not matching items

          switch (intProductTypeID) {
            case IDs.intProdTypeIdNova:
            case IDs.intProdTypeIdVentum:
              info.defaultId = IDs.intElecHeaterInstallIdInCasingField;
              break;
            case IDs.intProdTypeIdTerra:
              info.defaultId = IDs.intElecHeaterInstallIdInCasing;
              break;
            case IDs.intProdTypeIdVentumPlus:
              info.defaultId = IDs.intElecHeaterInstallIdInCasingFactory;
              break;
            case IDs.intProdTypeIdVentumLite:
              info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((item: { id: any }) => item.id === IDs.intElecHeaterInstallIdDuctMounted);
              info.defaultId = IDs.intElecHeaterInstallIdDuctMounted;
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    } else {
      info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((item: { id: number }) => item.id === IDs.intElecHeaterInstallIdNA);
      info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
    }

    setPreheatElecHeaterInstallInfo(info);
    setValue('ddlPreheatElecHeaterInstall', info.defaultId);
  }, [getValues('ddlLocation'), getValues('ddlPreheatComp')]);


  // Same logic applies for Heating and Reheat since it's the same component
  const [heatingElecHeaterInstallInfo, setHeatingElecHeaterInstallInfo] = useState<any>([]);
  const HeatingElecHeaterInfo = useMemo(() => {
    const info: { fdtElecHeaterInstall: any; isVisible: boolean; defaultId: number } = {
      fdtElecHeaterInstall: [],
      isVisible: false,
      defaultId: 0,
    };
    info.fdtElecHeaterInstall = db?.dbtSelElecHeaterInstallation;
    let dtLink = db?.dbtSelElectricHeaterInstallProdTypeLink;
    dtLink = dtLink?.filter((item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID) || [];

    if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdElecHeater || Number(getValues('ddlReheatComp')) === IDs.intCompIdElecHeater) {
      dtLink = dtLink?.filter((item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID) || [];

      info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((e: { id: any }) => 
        dtLink?.filter((e_link: { elec_heater_install_id: any }) => e.id === e_link.elec_heater_install_id)?.length === 1); // 1: Matching items, 0: Not matching items
      
      info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((item: { id: number }) => item.id !== IDs.intElecHeaterInstallIdNA);

      // switch (Number(getValues('ddlLocation'))) {
      //   case IDs.intLocationIdOutdoor:
      //     switch (intProductTypeID) {
      //       case IDs.intProdTypeIdNova:
      //       case IDs.intProdTypeIdVentum:
      //       case IDs.intProdTypeIdVentumLite:
      //       case IDs.intProdTypeIdTerra:
      //         info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((item: { id: any }) => item.id === IDs.intElecHeaterInstallIdInCasingField);
      //         info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
      //         break;
      //       case IDs.intProdTypeIdVentumPlus:
      //         // info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((item: { id: any }) => item.id === IDs.intElecHeaterInstallIdInCasingFactory);
      //         info.defaultId = IDs.intElecHeaterInstallIdInCasingFactory;
      //         break;
      //       default:
      //         break;
      //     }
      //     break;
      //   case IDs.intLocationIdIndoor:
          switch (intProductTypeID) {
            case IDs.intProdTypeIdNova:
            case IDs.intProdTypeIdVentum:
              info.defaultId = IDs.intElecHeaterInstallIdInCasingField;
              break;
            case IDs.intProdTypeIdTerra:
              info.defaultId = IDs.intElecHeaterInstallIdInCasing;
              break;
            case IDs.intProdTypeIdVentumPlus:
              info.defaultId = IDs.intElecHeaterInstallIdInCasingFactory;
              break;
            case IDs.intProdTypeIdVentumLite:
              info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((item: { id: any }) => item.id === IDs.intElecHeaterInstallIdDuctMounted);
              info.defaultId = IDs.intElecHeaterInstallIdDuctMounted;
              break;
            default:
              break;
          }
      //     break;
      //   default:
      //     break;
      // }
    } else {
      info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter((item: { id: number }) => item.id === IDs.intElecHeaterInstallIdNA);
      info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
    }

    setHeatingElecHeaterInstallInfo(info);

    return info;
  }, [getValues('ddlLocation'), getValues('ddlHeatingComp'), getValues('ddlReheatComp')]);



  const [elecHeaterVoltageInfo, setElecHeaterVoltageInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtElecHeaterVoltage: any; isVisible: boolean; isEnabled: boolean; defaultId: number } = 
                { fdtElecHeaterVoltage: [],  isVisible: false, isEnabled: false, defaultId: 0,};
    // let controlsPrefProdTypeLink: any = [];

    // let dtElecHeaterVoltage = [];
    const umc = getUMC();
    let dtLink = db?.dbtSelNovaElecHeatVoltageUnitModelLink;
    info.fdtElecHeaterVoltage = db?.dbtSelElectricalVoltage;
    info.defaultId  = Number(getValues('ddlUnitVoltage'));
    let bol208V_1Ph = false;

    if (Number(formCurrValues.ddlPreheatComp)  === IDs.intCompIdElecHeater) {
          info.isVisible = true;
  
      // let bol208V_1Ph = false;
      // intProdTypeNovaID
      switch (intProductTypeID) {
        case IDs.intProdTypeIdNova:
          // const dtLink = db?.dbtSelNovaElecHeatVoltageUnitModelLink.filter((x) => x.unit_model_value === strUnitModelValue);
          dtLink = dtLink?.filter((item: { unit_model_value: any }) => item.unit_model_value === umc?.strUnitModelValue) || [];
         
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((e: { id: any }) => 
            dtLink?.filter((e_link: { voltage_id: any }) => e.id === e_link.voltage_id)?.length === 1); // 1: Matching items, 0: Not matching items

          if (Number(getValues('ddlUnitVoltage')) ) {
            info.defaultId = Number(getValues('ddlUnitVoltage'));
          }
  
          info.isEnabled = !formCurrValues.ckbPreheatElecHeaterVoltageSPP;

          // dtElecHeaterVoltage = dtElecHeaterVoltage.map((item) => dtLink.filter((el) => el.voltage_id === item.id)?.length > 0);
        // }
      break;
      case IDs.intProdTypeIdVentum:
        if (Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH05IN_ERV_HRV ||
            Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH10IN_ERV_HRV ||
            Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH05IN_ERV_HRV_BP ||
            Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH10IN_ERV_HRV_BP) {
          bol208V_1Ph = true;
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater_2: number; id: any }) => item.electric_heater_2 === 1);
        } else {
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater: number; id: any }) => item.electric_heater === 1);
        }
  
        // if (bol208V_1Ph) {
        //   info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
        //   info.isEnabled = false;
        // } else {
        //   info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
        // }
  
        if (Number(formCurrValues.ckbPreheatElecHeaterVoltageSPP)) {
          info.defaultId = Number(formCurrValues.ddlUnitVoltage);
          info.isEnabled = false;
        } else {
          info.isEnabled = true;
        }
        // intProdTypeVentumLiteID
      break;
      case IDs.intProdTypeIdVentumLite:
        bol208V_1Ph = true;
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater_3: number; id: any }) => item.electric_heater_3 === 1);
        // info.defaultId = formCurrValues.ddlUnitVoltage  > 0 ? formCurrValues.ddlUnitVoltage : info.fdtElecHeaterVoltage?.[0]?.id;
        info.isEnabled = false;
      break;
      case IDs.intProdTypeIdVentumPlus:
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { ventumplus_elec_heater: number; id: any }) => item.ventumplus_elec_heater === 1);
  
        if (Number(formCurrValues.ckbPreheatElecHeaterVoltageSPP)) {
          info.defaultId = Number(formCurrValues.ddlUnitVoltage);
          info.isVisible = true;
          info.isEnabled = false;
        } else {
          info.isEnabled = true;
        }
  
        // if (info.fdtElecHeaterVoltage?.length > 0) {
        //   if (bol208V_1Ph) {
        //     info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
        //   } else {
        //     info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
        //   }
        // }
        // // intProdTypeTerraID
      break;
      case IDs.intProdTypeIdTerra:
        if (Number(formCurrValues.ckbPreheatElecHeaterVoltageSPP)) {
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_spp: number; id: any }) =>item.terra_spp === 1);
          info.defaultId =Number(formCurrValues.ddlUnitVoltage);
          info.isEnabled = false;
        } else {
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_non_spp: number; id: any }) => item.terra_non_spp === 1);
          info.isEnabled = true;
        }
  
        // if (info.fdtElecHeaterVoltage?.length > 0) {
        //   if (bol208V_1Ph) {
        //     info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
        //   } else {
        //     info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
        //   }
        // }
        break;
        default:
          break;
      }

      // if (formCurrValues.ddlUnitVoltage  > 0) {
      //   info.defaultId = formCurrValues.ddlUnitVoltage;
      // } else if (bol208V_1Ph) {
      //   info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
      // } else {
      //   info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
      //   // info.defaultId = info.fdtElecHeaterVoltage?.[0]?.id;
      // }

      if (Number(formCurrValues.ddlPreheatComp) === IDs.intCompIdAuto &&
          Number(formCurrValues.ddlHeatingComp) !== IDs.intCompIdElecHeater &&
          Number(formCurrValues.ddlReheatComp) !== IDs.intCompIdElecHeater) {
        info.isVisible = false;
      }
    } else {
      if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater_3: number; id: any }) => item.electric_heater_3 === 1);
        // info.defaultId = Number(formCurrValues.ddlUnitVoltage);

        info.isEnabled = false;

      } else if (intProductTypeID === IDs.intProdTypeIdTerra && Number(formCurrValues.ckbPreheatElecHeaterVoltageSPP)) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_spp: number; id: any }) => item.terra_spp === 1);
        // info.defaultId = Number(formCurrValues.ddlUnitVoltage);
        info.isEnabled = false;

      } else if (intProductTypeID === IDs.intProdTypeIdVentumPlus && 
                (Number(formCurrValues.ckbPreheatElecHeaterVoltageSPP) || Number(formCurrValues.ddlPreheatComp) === IDs.intCompIdAuto)) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { ventumplus_elec_heater: number; id: any }) => item.ventumplus_elec_heater === 1);

        // info.defaultId = Number(formCurrValues.ddlUnitVoltage);
        info.isEnabled = false;

      } else {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater: number; id: any }) => item.electric_heater === 1);
        // info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
        info.isEnabled = true;
      }
  
      info.isVisible = false;
    }

    if (formCurrValues.ddlUnitVoltage  > 0) {
      info.defaultId = formCurrValues.ddlUnitVoltage;
    } else if (bol208V_1Ph) {
      info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
    } else {
      info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
      // info.defaultId = info.fdtElecHeaterVoltage?.[0]?.id;
    }


    // setElecHeaterVoltageInfo(info);

    // info.defaultId = info.fdtElecHeaterVoltage?.[0]?.id;
    setPreheatElecHeaterVoltageTable(info.fdtElecHeaterVoltage);
    setIsVisibleDdlPreheatElecHeaterVoltage(info.isVisible);
    setIsEnabledDdlPreheatElecHeaterVoltage(info.isEnabled);
   
    setValue('ddlPreheatElecHeaterVoltage', info.defaultId);

  }, [db, intProductTypeID, formCurrValues.ddlPreheatComp, formCurrValues.ddlHeatingComp, formCurrValues.ddlReheatComp, 
        formCurrValues.ddlUnitVoltage, ]);



  useMemo(() => {
    const info: { fdtElecHeaterVoltage: any; isVisible: boolean; isEnabled: boolean; defaultId: number } =
      { fdtElecHeaterVoltage: [], isVisible: false, isEnabled: false, defaultId: 0, };
    // let controlsPrefProdTypeLink: any = [];

    // let dtElecHeaterVoltage = [];
    const umc = getUMC();
    let dtLink = db?.dbtSelNovaElecHeatVoltageUnitModelLink;
    info.fdtElecHeaterVoltage = db?.dbtSelElectricalVoltage;
    info.defaultId = Number(getValues('ddlUnitVoltage'));
    let bol208V_1Ph = false;

    if (Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdElecHeater) {
      info.isVisible = true;

      // let bol208V_1Ph = false;
      // intProdTypeNovaID
      switch (intProductTypeID) {
        case IDs.intProdTypeIdNova:
          // const dtLink = db?.dbtSelNovaElecHeatVoltageUnitModelLink.filter((x) => x.unit_model_value === strUnitModelValue);
          dtLink = dtLink?.filter((item: { unit_model_value: any }) => item.unit_model_value === umc?.strUnitModelValue) || [];

          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((e: { id: any }) =>
            dtLink?.filter((e_link: { voltage_id: any }) => e.id === e_link.voltage_id)?.length === 1); // 1: Matching items, 0: Not matching items

          if (Number(getValues('ddlUnitVoltage'))) {
            info.defaultId = Number(getValues('ddlUnitVoltage'));
          }

          info.isEnabled = !formCurrValues.ckbHeatingElecHeaterVoltageSPP;

          // dtElecHeaterVoltage = dtElecHeaterVoltage.map((item) => dtLink.filter((el) => el.voltage_id === item.id)?.length > 0);
          // }
          break;
        case IDs.intProdTypeIdVentum:
          if (Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH05IN_ERV_HRV ||
            Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH10IN_ERV_HRV ||
            Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH05IN_ERV_HRV_BP ||
            Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH10IN_ERV_HRV_BP) {
            bol208V_1Ph = true;
            info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater_2: number; id: any }) => item.electric_heater_2 === 1);
          } else {
            info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater: number; id: any }) => item.electric_heater === 1);
          }

          // if (bol208V_1Ph) {
          //   info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
          //   info.isEnabled = false;
          // } else {
          //   info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
          // }

          if (Number(formCurrValues.ckbHeatingElecHeaterVoltageSPP)) {
            info.defaultId = Number(formCurrValues.ddlUnitVoltage);
            info.isEnabled = false;
          } else {
            info.isEnabled = true;
          }
          // intProdTypeVentumLiteID
          break;
        case IDs.intProdTypeIdVentumLite:
          bol208V_1Ph = true;
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater_3: number; id: any }) => item.electric_heater_3 === 1);
          // info.defaultId = formCurrValues.ddlUnitVoltage  > 0 ? formCurrValues.ddlUnitVoltage : info.fdtElecHeaterVoltage?.[0]?.id;
          info.isEnabled = false;
          break;
        case IDs.intProdTypeIdVentumPlus:
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { ventumplus_elec_heater: number; id: any }) => item.ventumplus_elec_heater === 1);

          if (Number(formCurrValues.ckbHeatingElecHeaterVoltageSPP)) {
            info.defaultId = Number(formCurrValues.ddlUnitVoltage);
            info.isVisible = true;
            info.isEnabled = false;
          } else {
            info.isEnabled = true;
          }

          // if (info.fdtElecHeaterVoltage?.length > 0) {
          //   if (bol208V_1Ph) {
          //     info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
          //   } else {
          //     info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
          //   }
          // }
          // // intProdTypeTerraID
          break;
        case IDs.intProdTypeIdTerra:
          if (Number(formCurrValues.ckbHeatingElecHeaterVoltageSPP)) {
            info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_spp: number; id: any }) => item.terra_spp === 1);
            info.defaultId = Number(formCurrValues.ddlUnitVoltage);
            info.isEnabled = false;
          } else {
            info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_non_spp: number; id: any }) => item.terra_non_spp === 1);
            info.isEnabled = true;
          }

          // if (info.fdtElecHeaterVoltage?.length > 0) {
          //   if (bol208V_1Ph) {
          //     info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
          //   } else {
          //     info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
          //   }
          // }
          break;
        default:
          break;
      }

      // if (formCurrValues.ddlUnitVoltage  > 0) {
      //   info.defaultId = formCurrValues.ddlUnitVoltage;
      // } else if (bol208V_1Ph) {
      //   info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
      // } else {
      //   info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
      //   // info.defaultId = info.fdtElecHeaterVoltage?.[0]?.id;
      // }

      if (Number(formCurrValues.ddlHeatingComp) !== IDs.intCompIdElecHeater) {
        info.isVisible = false;
      }
    } else {
      if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater_3: number; id: any }) => item.electric_heater_3 === 1);
        // info.defaultId = Number(formCurrValues.ddlUnitVoltage);

        info.isEnabled = false;

      } else if (intProductTypeID === IDs.intProdTypeIdTerra && Number(formCurrValues.ckbHeatingElecHeaterVoltageSPP)) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_spp: number; id: any }) => item.terra_spp === 1);
        // info.defaultId = Number(formCurrValues.ddlUnitVoltage);
        info.isEnabled = false;

      } else if (intProductTypeID === IDs.intProdTypeIdVentumPlus &&
        (Number(formCurrValues.ckbHeatingElecHeaterVoltageSPP) || Number(formCurrValues.ddlPreheatComp) === IDs.intCompIdAuto)) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { ventumplus_elec_heater: number; id: any }) => item.ventumplus_elec_heater === 1);

        // info.defaultId = Number(formCurrValues.ddlUnitVoltage);
        info.isEnabled = false;

      } else {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater: number; id: any }) => item.electric_heater === 1);
        // info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
        info.isEnabled = true;
      }

      info.isVisible = false;
    }

    if (formCurrValues.ddlUnitVoltage > 0) {
      info.defaultId = formCurrValues.ddlUnitVoltage;
    } else if (bol208V_1Ph) {
      info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
    } else {
      info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
      // info.defaultId = info.fdtElecHeaterVoltage?.[0]?.id;
    }


    // setElecHeaterVoltageInfo(info);


    setHeatingElecHeaterVoltageTable(info.fdtElecHeaterVoltage);
    setIsVisibleDdlHeatingElecHeaterVoltage(info.isVisible);
    setIsEnabledDdlHeatingElecHeaterVoltage(info.isEnabled);

    setValue('ddlHeatingElecHeaterVoltage', info.defaultId);

  }, [db, intProductTypeID, formCurrValues.ddlHeatingComp, formCurrValues.ddlUnitVoltage,]);


  useMemo(() => {
    const info: { fdtElecHeaterVoltage: any; isVisible: boolean; isEnabled: boolean; defaultId: number } =
      { fdtElecHeaterVoltage: [], isVisible: false, isEnabled: false, defaultId: 0, };
    // let controlsPrefProdTypeLink: any = [];

    // let dtElecHeaterVoltage = [];
    const umc = getUMC();
    let dtLink = db?.dbtSelNovaElecHeatVoltageUnitModelLink;
    info.fdtElecHeaterVoltage = db?.dbtSelElectricalVoltage;
    info.defaultId = Number(getValues('ddlUnitVoltage'));
    let bol208V_1Ph = false;

    if (Number(formCurrValues.ddlReheatComp) === IDs.intCompIdElecHeater) {
      info.isVisible = true;

      // let bol208V_1Ph = false;
      // intProdTypeNovaID
      switch (intProductTypeID) {
        case IDs.intProdTypeIdNova:
          // const dtLink = db?.dbtSelNovaElecHeatVoltageUnitModelLink.filter((x) => x.unit_model_value === strUnitModelValue);
          dtLink = dtLink?.filter((item: { unit_model_value: any }) => item.unit_model_value === umc?.strUnitModelValue) || [];

          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((e: { id: any }) =>
            dtLink?.filter((e_link: { voltage_id: any }) => e.id === e_link.voltage_id)?.length === 1); // 1: Matching items, 0: Not matching items

          if (Number(getValues('ddlUnitVoltage'))) {
            info.defaultId = Number(getValues('ddlUnitVoltage'));
          }

          info.isEnabled = !formCurrValues.ckbReheatElecHeaterVoltageSPP;

          // dtElecHeaterVoltage = dtElecHeaterVoltage.map((item) => dtLink.filter((el) => el.voltage_id === item.id)?.length > 0);
          // }
          break;
        case IDs.intProdTypeIdVentum:
          if (Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH05IN_ERV_HRV ||
            Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH10IN_ERV_HRV ||
            Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH05IN_ERV_HRV_BP ||
            Number(formCurrValues.ddlUnitModel) === IDs.intVentumUnitModelIdH10IN_ERV_HRV_BP) {
            bol208V_1Ph = true;
            info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater_2: number; id: any }) => item.electric_heater_2 === 1);
          } else {
            info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater: number; id: any }) => item.electric_heater === 1);
          }

          // if (bol208V_1Ph) {
          //   info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
          //   info.isEnabled = false;
          // } else {
          //   info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
          // }

          if (Number(formCurrValues.ckbReheatElecHeaterVoltageSPP)) {
            info.defaultId = Number(formCurrValues.ddlUnitVoltage);
            info.isEnabled = false;
          } else {
            info.isEnabled = true;
          }
          // intProdTypeVentumLiteID
          break;
        case IDs.intProdTypeIdVentumLite:
          bol208V_1Ph = true;
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater_3: number; id: any }) => item.electric_heater_3 === 1);
          // info.defaultId = formCurrValues.ddlUnitVoltage  > 0 ? formCurrValues.ddlUnitVoltage : info.fdtElecHeaterVoltage?.[0]?.id;
          info.isEnabled = false;
          break;
        case IDs.intProdTypeIdVentumPlus:
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { ventumplus_elec_heater: number; id: any }) => item.ventumplus_elec_heater === 1);

          if (Number(formCurrValues.ckbReheatElecHeaterVoltageSPP)) {
            info.defaultId = Number(formCurrValues.ddlUnitVoltage);
            info.isVisible = true;
            info.isEnabled = false;
          } else {
            info.isEnabled = true;
          }

          // if (info.fdtElecHeaterVoltage?.length > 0) {
          //   if (bol208V_1Ph) {
          //     info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
          //   } else {
          //     info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
          //   }
          // }
          // // intProdTypeTerraID
          break;
        case IDs.intProdTypeIdTerra:
          if (Number(formCurrValues.ckbReheatElecHeaterVoltageSPP)) {
            info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_spp: number; id: any }) => item.terra_spp === 1);
            info.defaultId = Number(formCurrValues.ddlUnitVoltage);
            info.isEnabled = false;
          } else {
            info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_non_spp: number; id: any }) => item.terra_non_spp === 1);
            info.isEnabled = true;
          }

          // if (info.fdtElecHeaterVoltage?.length > 0) {
          //   if (bol208V_1Ph) {
          //     info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
          //   } else {
          //     info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
          //   }
          // }
          break;
        default:
          break;
      }

      // if (formCurrValues.ddlUnitVoltage  > 0) {
      //   info.defaultId = formCurrValues.ddlUnitVoltage;
      // } else if (bol208V_1Ph) {
      //   info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
      // } else {
      //   info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
      //   // info.defaultId = info.fdtElecHeaterVoltage?.[0]?.id;
      // }

      if (Number(formCurrValues.ddlReheatComp) !== IDs.intCompIdElecHeater) {
        info.isVisible = false;
      }
    } else {
      if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater_3: number; id: any }) => item.electric_heater_3 === 1);
        // info.defaultId = Number(formCurrValues.ddlUnitVoltage);

        info.isEnabled = false;

      } else if (intProductTypeID === IDs.intProdTypeIdTerra && Number(formCurrValues.ckbReheatElecHeaterVoltageSPP)) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_spp: number; id: any }) => item.terra_spp === 1);
        // info.defaultId = Number(formCurrValues.ddlUnitVoltage);
        info.isEnabled = false;

      } else if (intProductTypeID === IDs.intProdTypeIdVentumPlus &&
        (Number(formCurrValues.ckbReheatElecHeaterVoltageSPP) || Number(formCurrValues.ddlPreheatComp) === IDs.intCompIdAuto)) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { ventumplus_elec_heater: number; id: any }) => item.ventumplus_elec_heater === 1);

        // info.defaultId = Number(formCurrValues.ddlUnitVoltage);
        info.isEnabled = false;

      } else {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater: number; id: any }) => item.electric_heater === 1);
        // info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
        info.isEnabled = true;
      }

      info.isVisible = false;
    }

    if (formCurrValues.ddlUnitVoltage > 0) {
      info.defaultId = formCurrValues.ddlUnitVoltage;
    } else if (bol208V_1Ph) {
      info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
    } else {
      info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
      // info.defaultId = info.fdtElecHeaterVoltage?.[0]?.id;
    }


    // setElecHeaterVoltageInfo(info);

    setReheatElecHeaterVoltageTable(info.fdtElecHeaterVoltage);
    setIsVisibleDdlReheatElecHeaterVoltage(info.isVisible);
    setIsEnabledDdlReheatElecHeaterVoltage(info.isEnabled);

    setValue('ddlReheatElecHeaterVoltage', info.defaultId);

  }, [db, intProductTypeID, formCurrValues.ddlReheatComp,formCurrValues.ddlUnitVoltage,]);


  const [preheatFluidTypeInfo, setPreheatFluidTypeInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtFluidType: any; isVisible: boolean; defaultId: number } = {
      fdtFluidType: [],
      isVisible: false,
      defaultId: 0,
    };
    info.fdtFluidType = db?.dbtSelFluidType;

    if (Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC) {
      info.fdtFluidType = info.fdtFluidType?.filter(
        (item: { id: number }) => item.id !== IDs.intFluidTypeIdNA
      );
    } else {
      info.fdtFluidType = info.fdtFluidType?.filter(
        (item: { id: number }) => item.id === IDs.intFluidTypeIdNA
      );
    }

    setPreheatFluidTypeInfo(info);

    // if (
    //   Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlPreheatFluidType', getValues('ddlHeatingFluidType'));
    //   setValue('ddlPreheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
    //   // setValue('txbPreheatHWCFluidEntTemp', getValues('txbHeatingHWCFluidEntTemp'));
    //   // setValue('txbPreheatHWCFluidLvgTemp', getValues('txbHeatingHWCFluidLvgTemp'));
    // } else if (
    //   Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlPreheatFluidType', getValues('ddlReheatFluidType'));
    //   setValue('ddlPreheatFluidConcentration', getValues('ddlReheatFluidConcentration'));
    //   // setValue('txbPreheatHWCFluidEntTemp', getValues('txbReheatHWCFluidEntTemp'));
    //   // setValue('txbPreheatHWCFluidLvgTemp', getValues('txbReheatHWCFluidLvgTemp'));
    // } else {
      info.defaultId = info.fdtFluidType?.[0]?.id;
      setValue('ddlPreheatFluidType', info.fdtFluidType?.[0]?.id);
    // }
  }, [db, getValues('ddlPreheatComp')]);


  const [preheatFluidConcenInfo, setPreheatFluidConcenInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtFluidConcen: any; isVisible: boolean; defaultId: number } = {
      fdtFluidConcen: [],
      isVisible: false,
      defaultId: 0,
    };

    let fluidConFluidTypLink: any = [];

    if (Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC) {
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter(
        (item: { fluid_type_id: number }) => item.fluid_type_id === Number(getValues('ddlPreheatFluidType')));
    } else {
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter(
        (item: { fluid_type_id: number }) => item.fluid_type_id === preheatFluidTypeInfo?.defaultId);
    }

    info.fdtFluidConcen = db?.dbtSelFluidConcentration?.filter((e: { id: any }) => fluidConFluidTypLink?.filter(
          (e_link: { fluid_concen_id: any }) => e.id === e_link.fluid_concen_id) ?.length > 0);


    info.fdtFluidConcen = info.fdtFluidConcen?.sort((a: any, b: any) => a.items.localeCompare(b.items));;
      

    setPreheatFluidConcenInfo(info);

    // if (
    //   Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlPreheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
    // } else if (
    //   Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlPreheatFluidConcentration', getValues('ddlReheatFluidConcentration'));
    // } else {
      info.defaultId = info.fdtFluidConcen?.[0]?.id;
      setValue('ddlPreheatFluidConcentration', info.fdtFluidConcen?.[0]?.id);
    // }
  }, [db, getValues('ddlPreheatComp'), getValues('ddlPreheatFluidType')]);

  // const [heatingElecHeaterInfo, setHeatingElecHeaterInfo] = useState<any>([])
  // setHeatingElecHeaterInfo is executed
  useMemo(() => {
    if (Number(getValues('ddlReheatComp')) === IDs.intCompIdElecHeater) {
      setValue('ddlHeatingElecHeaterInstall', getValues('ddlReheatElecHeaterInstall'));
    } else {
      setValue('ddlHeatingElecHeaterInstall', HeatingElecHeaterInfo?.defaultId);
    }
  }, [getValues('ddlHeatingComp')]);


  useMemo(() => {
    if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdElecHeater) {
      setValue('ddlReheatElecHeaterInstall', getValues('ddlHeatingElecHeaterInstall'));
    } else {
      setValue('ddlReheatElecHeaterInstall', HeatingElecHeaterInfo?.defaultId);
    }
  }, [getValues('ddlReheatComp')]);


  useEffect(() => {
    if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdElecHeater) {
      if (Number(getValues('ddlReheatComp')) === IDs.intCompIdElecHeater) {
        setValue('ddlReheatElecHeaterInstall', getValues('ddlHeatingElecHeaterInstall'));
      }
    }
  }, [getValues('ddlHeatingElecHeaterInstall')]);


  useEffect(() => {
    if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC) {
      if (Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC) {
        setValue('ddlReheatFluidType', getValues('ddlHeatingFluidType'));
        setValue('ddlReheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
        setValue('ckbReheatHWCValveAndActuator', getValues('ckbHeatingHWCValveAndActuator'));
        setValue('ddlReheatHWCValveType', getValues('ddlHeatingHWCValveType'));
      }
    }
  }, [getValues('ddlHeatingFluidType'), getValues('ddlHeatingFluidConcentration'), getValues('ckbHeatingHWCValveAndActuator'), getValues('ddlHeatingHWCValveType')]);



  useEffect(() => {
    if (Number(getValues('ddlReheatComp')) === IDs.intCompIdElecHeater) {
      if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdElecHeater) {
        setValue('ddlHeatingElecHeaterInstall', getValues('ddlReheatElecHeaterInstall'));
      }
    }
  }, [getValues('ddlReheatElecHeaterInstall')]);


  useEffect(() => {
    if (Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC) {
      if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC) {
        setValue('ddlHeatingFluidType', getValues('ddlReheatFluidType'));
        setValue('ddlHeatingFluidConcentration', getValues('ddlReheatFluidConcentration'));
        setValue('ckbHeatingHWCValveAndActuator', getValues('ckbReheatHWCValveAndActuator'));
        setValue('ddlHeatingHWCValveType', getValues('ddlReheatHWCValveType'));
}
    }
  }, [getValues('ddlReheatFluidType'), getValues('ddlReheatFluidConcentration'), getValues('ckbReheatHWCValveAndActuator'), getValues('ddlReheatHWCValveType')]);




  // useEffect(() => {
  //   if (
  //     Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
  //     Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
  //   ) {
  //     setValue('ddlHeatingFluidType', getValues('ddlPreheatFluidType'));
  //     setValue('ddlHeatingFluidConcentration', getValues('ddlPreheatFluidConcentration'));
  //     // setValue('txbHeatingHWCFluidEntTemp', getValues('txbPreheatHWCFluidEntTemp'));
  //     // setValue('txbHeatingHWCFluidLvgTemp', getValues('txbPreheatHWCFluidLvgTemp'));
  //   }

  //   if (
  //     Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
  //     Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
  //   ) {
  //     setValue('ddlReheatFluidType', getValues('ddlPreheatFluidType'));
  //     setValue('ddlReheatFluidConcentration', getValues('ddlPreheatFluidConcentration'));
  //     // setValue('txbReheatHWCFluidEntTemp', getValues('txbPreheatHWCFluidEntTemp'));
  //     // setValue('txbReheatHWCFluidLvgTemp', getValues('txbPreheatHWCFluidLvgTemp'));
  //   }
  // }, [
  //   getValues('ddlPreheatFluidType'),
  //   getValues('ddlPreheatFluidConcentration'),
  //   // getValues('txbPreheatHWCFluidEntTemp'),
  //   // getValues('txbPreheatHWCFluidLvgTemp'),
  // ]);


  const [coolingFluidTypeInfo, setCoolingFluidTypeInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtFluidType: any; isVisible: boolean; defaultId: number } = {
      fdtFluidType: [],
      isVisible: false,
      defaultId: 0,
    };
    info.fdtFluidType = db?.dbtSelFluidType;

    if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdCWC) {
      info.fdtFluidType = info.fdtFluidType?.filter(
        (item: { id: number }) => item.id !== IDs.intFluidTypeIdNA
      );
    } else {
      info.fdtFluidType = info.fdtFluidType?.filter(
        (item: { id: number }) => item.id === IDs.intFluidTypeIdNA
      );
    }

    setCoolingFluidTypeInfo(info);

    info.defaultId = info.fdtFluidType?.[0]?.id;
    setValue('ddlCoolingFluidType', info.fdtFluidType?.[0]?.id);
  }, [db, getValues('ddlCoolingComp')]);


  const [coolingFluidConcenInfo, setCoolingFluidConcenInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtFluidConcen: any; isVisible: boolean; defaultId: number } = {
      fdtFluidConcen: [],
      isVisible: false,
      defaultId: 0,
    };

    let fluidConFluidTypLink: any = [];

    if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdCWC) {
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter(
        (item: { fluid_type_id: number }) =>
          item.fluid_type_id === Number(getValues('ddlCoolingFluidType'))
      );
    } else {
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter(
        (item: { fluid_type_id: number }) => item.fluid_type_id === coolingFluidTypeInfo?.defaultId
      );
    }

    info.fdtFluidConcen = db?.dbtSelFluidConcentration?.filter(
      (e: { id: any }) =>
        fluidConFluidTypLink?.filter(
          (e_link: { fluid_concen_id: any }) => e.id === e_link.fluid_concen_id
        )?.length > 0
    );


    info.fdtFluidConcen = info.fdtFluidConcen?.sort((a: any, b: any) => a.items.localeCompare(b.items));;

    
    setCoolingFluidConcenInfo(info);

    info.defaultId = info.fdtFluidConcen?.[0]?.id;
    setValue('ddlCoolingFluidConcentration', info.fdtFluidConcen?.[0]?.id);
  }, [db, getValues('ddlCoolingComp'), getValues('ddlCoolingFluidType')]);


  const [heatingFluidTypeInfo, setHeatingFluidTypeInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtFluidType: any; isVisible: boolean; defaultId: number } = {
      fdtFluidType: [],
      isVisible: false,
      defaultId: 0,
    };
    info.fdtFluidType = db?.dbtSelFluidType;

    if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC) {
      info.fdtFluidType = info.fdtFluidType?.filter(
        (item: { id: number }) => item.id !== IDs.intFluidTypeIdNA
      );
      info.isVisible = true;
    } else {
      info.fdtFluidType = info.fdtFluidType?.filter(
        (item: { id: number }) => item.id === IDs.intFluidTypeIdNA
      );
      info.isVisible = false;
    }

    setHeatingFluidTypeInfo(info);

    // if (
    //   Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlHeatingFluidType', getValues('ddlPreheatFluidType'));
    //   setValue('ddlHeatingFluidConcentration', getValues('ddlPreheatFluidConcentration'));
    //   // setValue('txbHeatingHWCFluidEntTemp', getValues('txbPreheatHWCFluidEntTemp'));
    //   // setValue('txbHeatingHWCFluidLvgTemp', getValues('txbPreheatHWCFluidLvgTemp'));
    // } else if (
    //   Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlHeatingFluidType', getValues('ddlReheatFluidType'));
    //   setValue('ddlHeatingFluidConcentration', getValues('ddlReheatFluidConcentration'));
    //   // setValue('txbHeatingHWCFluidEntTemp', getValues('txbReheatHWCFluidEntTemp'));
    //   // setValue('txbHeatingHWCFluidLvgTemp', getValues('txbReheatHWCFluidLvgTemp'));
    // } else {
      info.defaultId = info.fdtFluidType?.[0]?.id;
      setValue('ddlHeatingFluidType', info.fdtFluidType?.[0]?.id);
    // }
  }, [db, getValues('ddlHeatingComp')]);


  const [heatingFluidConcenInfo, setHeatingFluidConcenInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtFluidConcen: any; isVisible: boolean; defaultId: number } = {
      fdtFluidConcen: [],
      isVisible: false,
      defaultId: 0,
    };

    let fluidConFluidTypLink: any = [];

    if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC) {
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter(
        (item: { fluid_type_id: number }) =>
          item.fluid_type_id === Number(getValues('ddlHeatingFluidType'))
      );
    } else {
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter(
        (item: { fluid_type_id: number }) => item.fluid_type_id === heatingFluidTypeInfo?.defaultId
      );
    }

    info.fdtFluidConcen = db?.dbtSelFluidConcentration?.filter(
      (e: { id: any }) =>
        fluidConFluidTypLink?.filter(
          (e_link: { fluid_concen_id: any }) => e.id === e_link.fluid_concen_id
        )?.length > 0
    );


    info.fdtFluidConcen = info.fdtFluidConcen?.sort((a: any, b: any) => a.items.localeCompare(b.items));;


    setHeatingFluidConcenInfo(info);

    // if (
    //   Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlHeatingFluidConcentration', getValues('ddlPreheatFluidConcentration'));
    // } else if (
    //   Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlHeatingFluidConcentration', getValues('ddlReheatFluidConcentration'));
    // } else {
      info.defaultId = info.fdtFluidConcen?.[0]?.id;
      setValue('ddlHeatingFluidConcentration', info.fdtFluidConcen?.[0]?.id);
    // }
  }, [db, getValues('ddlHeatingComp'), getValues('ddlHeatingFluidType')]);

  // Heating Fluid
  // useEffect(() => {
  //   if (
  //     Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
  //     Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
  //   ) {
  //     setValue('ddlPreheatFluidType', getValues('ddlHeatingFluidType'));
  //     setValue('ddlPreheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
  //     // setValue('txbPreheatHWCFluidEntTemp', getValues('txbHeatingHWCFluidEntTemp'));
  //     // setValue('txbPreheatHWCFluidLvgTemp', getValues('txbHeatingHWCFluidLvgTemp'));
  //   }

  //   if (
  //     Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
  //     Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
  //   ) {
  //     setValue('ddlReheatFluidType', getValues('ddlHeatingFluidType'));
  //     setValue('ddlReheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
  //     // setValue('txbReheatHWCFluidEntTemp', getValues('txbHeatingHWCFluidEntTemp'));
  //     // setValue('txbReheatHWCFluidLvgTemp', getValues('txbHeatingHWCFluidLvgTemp'));
  //   }
  // }, [
  //   getValues('ddlHeatingFluidType'),
  //   getValues('ddlHeatingFluidConcentration'),
  //   // getValues('txbHeatingHWCFluidEntTemp'),
  //   // getValues('txbHeatingHWCFluidLvgTemp'),
  // ]);


  const [reheatFluidTypeInfo, setReheatFluidTypeInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtFluidType: any; isVisible: boolean; defaultId: number } = {
      fdtFluidType: [],
      isVisible: false,
      defaultId: 0,
    };
    info.fdtFluidType = db?.dbtSelFluidType;

    if (Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC) {
      info.fdtFluidType = info.fdtFluidType?.filter(
        (item: { id: number }) => item.id !== IDs.intFluidTypeIdNA
      );
    } else {
      info.fdtFluidType = info.fdtFluidType?.filter(
        (item: { id: number }) => item.id === IDs.intFluidTypeIdNA
      );
    }

    setReheatFluidTypeInfo(info);

    // if (
    //   Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlReheatFluidType', getValues('ddlPreheatFluidType'));
    //   setValue('ddlReheatFluidConcentration', getValues('ddlPreheatFluidConcentration'));
    //   // setValue('txbReheatHWCFluidEntTemp', getValues('txbPreheatHWCFluidEntTemp'));
    //   // setValue('txbReheatHWCFluidLvgTemp', getValues('txbPreheatHWCFluidLvgTemp'));
    // } else if (
    //   Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlReheatFluidType', getValues('ddlHeatingFluidType'));
    //   setValue('ddlReheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
    //   // setValue('txbReheatHWCFluidEntTemp', getValues('txbHeatingHWCFluidEntTemp'));
    //   // setValue('txbReheatHWCFluidLvgTemp', getValues('txbHeatingHWCFluidLvgTemp'));
    // } else {
      info.defaultId = info.fdtFluidType?.[0]?.id;
      setValue('ddlReheatFluidType', info.fdtFluidType?.[0]?.id);
    // }
  }, [db, getValues('ddlReheatComp')]);


  const [reheatFluidConcenInfo, setReheatFluidConcenInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtFluidConcen: any; isVisible: boolean; defaultId: number } = {
      fdtFluidConcen: [],
      isVisible: false,
      defaultId: 0,
    };

    let fluidConFluidTypLink: any = [];

    if (Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC) {
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter((item: { fluid_type_id: number }) => item.fluid_type_id === Number(getValues('ddlReheatFluidType')));
    } else {
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter((item: { fluid_type_id: number }) => item.fluid_type_id === reheatFluidTypeInfo?.defaultId);
    }

    info.fdtFluidConcen = db?.dbtSelFluidConcentration?.filter((e: { id: any }) => fluidConFluidTypLink?.filter((e_link: { fluid_concen_id: any }) => e.id === e_link.fluid_concen_id)?.length > 0
    );


    info.fdtFluidConcen = info.fdtFluidConcen?.sort((a: any, b: any) => a.items.localeCompare(b.items));;


    setReheatFluidConcenInfo(info);

    // if (
    //   Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlReheatFluidConcentration', getValues('ddlPreheatFluidConcentration'));
    // } else if (
    //   Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
    //   Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
    // ) {
    //   setValue('ddlReheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
    // } else {
      info.defaultId = info.fdtFluidConcen?.[0]?.id;
      setValue('ddlReheatFluidConcentration', info.fdtFluidConcen?.[0]?.id);
    // }
  }, [db, getValues('ddlReheatComp'), getValues('ddlReheatFluidType')]);




  // useEffect(() => {
  //   if (
  //     Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
  //     Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
  //   ) {
  //     setValue('ddlPreheatFluidType', getValues('ddlReheatFluidType'));
  //     setValue('ddlPreheatFluidConcentration', getValues('ddlReheatFluidConcentration'));
  //     // setValue('txbPreheatHWCFluidEntTemp', getValues('txbReheatHWCFluidEntTemp'));
  //     // setValue('txbPreheatHWCFluidLvgTemp', getValues('txbReheatHWCFluidLvgTemp'));
  //   }

  //   if (
  //     Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
  //     Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
  //   ) {
  //     setValue('ddlHeatingFluidType', getValues('ddlReheatFluidType'));
  //     setValue('ddlHeatingFluidConcentration', getValues('ddlReheatFluidConcentration'));
  //     // setValue('txbHeatingHWCFluidEntTemp', getValues('txbReheatHWCFluidEntTemp'));
  //     // setValue('txbHeatingHWCFluidLvgTemp', getValues('txbReheatHWCFluidLvgTemp'));
  //   }
  // }, [
  //   getValues('ddlReheatFluidType'),
  //   getValues('ddlReheatFluidConcentration'),
  //   // getValues('txbReheatHWCFluidEntTemp'),
  //   // getValues('txbReheatHWCFluidLvgTemp'),
  // ]);


  const [damperActuatorInfo, setDamperActuatorInfo] = useState<any>([]);
  useEffect(() => {
    const info: { fdtDamperActuator: any; isVisible: boolean } = {
      fdtDamperActuator: [],
      isVisible: false,
    };

    let defaultId = 0;

    let damperActuatorProdTypeLink = db?.dbtSelDamperActuatorProdTypeLink;
    damperActuatorProdTypeLink = damperActuatorProdTypeLink?.filter((item: { prod_type_id: number }) => item.prod_type_id === intProductTypeID);

    // info.fdtDamperActuator = db?.dbtSelDamperActuator;
    info.fdtDamperActuator = db?.dbtSelDamperActuator?.filter(
      (e: { id: number }) => damperActuatorProdTypeLink?.filter((e_link: { damper_actuator_id: number }) => e.id === e_link.damper_actuator_id)?.length > 0
    );

    defaultId = info.fdtDamperActuator?.[0]?.id; //

    info.isVisible = true;

    setDamperActuatorInfo(info);

    switch (Number(getValues('ddlLocation'))) {
      case IDs.intLocationIdIndoor:
        switch (intProductTypeID) {
          case IDs.intProdTypeIdNova:
            info.fdtDamperActuator = info.fdtDamperActuator?.filter((item: { id: number }) => item.id !== IDs.intDamperActIdFactMountedAndWired);
            defaultId = info.fdtDamperActuator?.[0]?.id; //
            break;
          case IDs.intProdTypeIdVentum:
          case IDs.intProdTypeIdVentumLite:
          case IDs.intProdTypeIdTerra:
          case IDs.intProdTypeIdVentumPlus:
            break;
          default:
            break;
        }        
        break;
      case IDs.intLocationIdOutdoor:
        info.isVisible = false;

        switch (intProductTypeID) {
          case IDs.intProdTypeIdNova:
            defaultId = IDs.intDamperActIdFactMountedAndWired; //
            break;
          case IDs.intProdTypeIdVentum:
          case IDs.intProdTypeIdVentumLite:
          case IDs.intProdTypeIdTerra:
            defaultId = IDs.intDamperActIdFieldInstAndWired; //
            break;
          case IDs.intProdTypeIdVentumPlus:
            defaultId = IDs.intDamperActIdFactMountedAndWired; //
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

    setValue('ddlDamperAndActuator', defaultId);
  }, [db, intProductTypeID, getValues('ddlLocation')]);


  // const [valveAndActuatorInfo, setValveAndActuatorInfo] = useState<any>([]);
  // useMemo(() => {
  //   const info: { isVisible: boolean; defaultId: number } = {
  //     isVisible: false,
  //     defaultId: 0,
  //   };


  //   if (Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC ||
  //       Number(getValues('ddlCoolingComp'))  === IDs.intCompIdCWC ||
  //       Number(getValues('ddlHeatingComp'))  === IDs.intCompIdHWC ||
  //       Number(getValues('ddlReheatComp'))  === IDs.intCompIdHWC) {
  //       info.isVisible = true;
  //       setValue('ckbValveAndActuator', 1); //
  //     } else {
  //       info.isVisible = false;
  //       setValue('ckbValveAndActuator', 0); //
  //   }

  //   setValveAndActuatorInfo(info);

  // }, [getValues('ddlPreheatComp'), getValues('ddlCoolingComp'), getValues('ddlHeatingComp'), getValues('ddlReheatComp')]);


  const [valveTypeInfo, setValveTypeInfo] = useState<any>([]);
  
  useMemo(() => {
    const info: { fdtValveType: any; isVisible: boolean } = { fdtValveType: [], isVisible: false };

    info.fdtValveType = db?.dbtSelValveType;
    info.fdtValveType = info.fdtValveType?.filter((item: { enabled: number }) => item.enabled === 1);


    switch (Number(getValues('ckbValveAndActuator'))) {
      case 1:
        switch (user?.UAL) {
          case IDs.intUAL_Admin:
          case IDs.intUAL_IntAdmin:
          case IDs.intUAL_IntLvl_1:
          case IDs.intUAL_IntLvl_2:
            info.isVisible = true;
            break;
          default:
            info.isVisible = false;
            break;
        }
        break;
      case 0:
        info.isVisible = false;
        break;
      default:
        break;
    }

    setValveTypeInfo(info);
    setValue('ddlValveType', info.fdtValveType?.[0]?.id); //

  }, [getValues('ckbValveAndActuator')]);


  // const handingInfo = useMemo(() => {
  //   const result = db?.dbtSelHanding;
  //   // if (!edit) setValue('ddlHandingId', defaultValues?.ddlHandingId);
  //   setValue('ddlHanding', db?.dbtSelHanding[0].id);
  //   setValue('ddlPreheatCoilHanding', db?.dbtSelHanding[0].id);
  //   setValue('ddlCoolingCoilHanding', db?.dbtSelHanding[0].id);
  //   setValue('ddlHeatingCoilHanding', db?.dbtSelHanding[0].id);
  //   return result;
  // }, [edit, db, setValue]);



  const [handingInfo, setHandingInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHanding: any; defaultId: number; isVisible: boolean } = { fdtHanding: [], defaultId: 0, isVisible: false };

    info.fdtHanding = db?.dbtSelHanding;
    // info.fdtHanding = info.fdtHanding?.filter((item: { enabled: number }) => item.enabled === 1);

    setHandingInfo(info);
    info.defaultId = info.fdtHanding?.[0]?.id;
    setValue('ddlHanding', info.defaultId); 
    setValue('ddlPreheatCoilHanding', info.defaultId);
    setValue('ddlCoolingCoilHanding', info.defaultId);
    setValue('ddlHeatingCoilHanding', info.defaultId);
    setValue('ddlReheatCoilHanding', info.defaultId);

  }, [db]);



  useEffect(() => {
    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentumPlus:
      case IDs.intProdTypeIdVentumLite:
        switch (Number(getValues('ddlPreheatComp'))) {
          case IDs.intCompIdElecHeater:
            setIsVisibleDdlPreheatCoilHanding(true);
            break;
          case IDs.intCompIdHWC:
            setIsVisibleDdlPreheatCoilHanding(true);
            break;
          case IDs.intCompIdNA:
            setIsVisibleDdlPreheatCoilHanding(false);
            break;
          default:
            break;
        }
        break;
        case IDs.intProdTypeIdVentum:
        case IDs.intProdTypeIdTerra:
          setIsVisibleDdlPreheatCoilHanding(false);
          break;
      default:
        break;
    }

  }, [getValues('ddlPreheatComp'), intProductTypeID]);



  useEffect(() => {
    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentumPlus:
      case IDs.intProdTypeIdVentumLite:
        switch (Number(getValues('ddlCoolingComp'))) {
          case IDs.intCompIdElecHeater:
            setIsVisibleDdlCoolingCoilHanding(true);
            break;
          case IDs.intCompIdHWC:
            setIsVisibleDdlCoolingCoilHanding(true);
            break;
          case IDs.intCompIdNA:
            setIsVisibleDdlCoolingCoilHanding(false);
            break;
          default:
            break;
        }
        break;
        case IDs.intProdTypeIdVentum:
        case IDs.intProdTypeIdTerra:
          setIsVisibleDdlCoolingCoilHanding(false);
          break;
      default:
        break;
    }
    

  }, [getValues('ddlCoolingComp'), intProductTypeID]);


  useEffect(() => {
    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentumPlus:
      case IDs.intProdTypeIdVentumLite:
        switch (Number(getValues('ddlHeatingComp'))) {
          case IDs.intCompIdElecHeater:
            setIsVisibleDdlHeatingCoilHanding(true);
            break;
          case IDs.intCompIdHWC:
            setIsVisibleDdlHeatingCoilHanding(true);
            break;
          case IDs.intCompIdNA:
            setIsVisibleDdlHeatingCoilHanding(false);
            break;
          default:
            break;
        }
        break;
        case IDs.intProdTypeIdVentum:
        case IDs.intProdTypeIdTerra:
          setIsVisibleDdlHeatingCoilHanding(false);
          break;
      default:
        break;
    }

  }, [getValues('ddlHeatingComp'), intProductTypeID]);


  useEffect(() => {
    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentumPlus:
      case IDs.intProdTypeIdVentumLite:
        switch (Number(getValues('ddlReheatComp'))) {
          case IDs.intCompIdElecHeater:
            setIsVisibleDdlReheatCoilHanding(true);
            break;
          case IDs.intCompIdHWC:
            setIsVisibleDdlReheatCoilHanding(true);
            break;
          case IDs.intCompIdNA:
            setIsVisibleDdlReheatCoilHanding(false);
            break;
          default:
            break;
        }
        break;
        case IDs.intProdTypeIdVentum:
        case IDs.intProdTypeIdTerra:
          setIsVisibleDdlReheatCoilHanding(false);
          break;
      default:
        break;
    }

  }, [getValues('ddlReheatComp'), intProductTypeID]);



  // useMemo(() => {
  //   const info: { fdtHanding: any; isVisible: boolean } = { fdtHanding: [], isVisible: false };

  //   info.fdtHanding = db?.dbtSelHanding;

  //   setValue('ckbPreheatHWCUseFluidLvgTemp', 0);

  //   switch (Number(getValues('ddlPreheatComp'))) {
  //     case IDs.intCompIdElecHeater:
  //       setIsVisibleDdlPreheatCoilHanding(true);
  //       break;
  //     case IDs.intCompIdHWC:
  //       setValue('ckbPreheatHWCUseFluidLvgTemp', 1);
  //       setIsVisibleDdlPreheatCoilHanding(true);
  //       break;
  //     case IDs.intCompIdNA:
  //       setIsVisibleDdlPreheatCoilHanding(false);
  //       break;
  //     default:
  //       break;
  //   }

  //   setValue('ddlPreheatCoilHanding', info?.fdtHanding?.[0]?.id);

  // }, [db, getValues('ddlPreheatComp')]);


  // const [coolingCoilHandingInfo, setCoolingCoilHandingInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHanding: any; isVisible: boolean } = { fdtHanding: [], isVisible: false };

    info.fdtHanding = db?.dbtSelHanding;

    setValue('ckbDaikinVRV', 0);
    setValue('ckbCoolingCWCUseFluidLvgTemp', 0);

    switch (Number(getValues('ddlCoolingComp'))) {
      case IDs.intCompIdCWC:
        info.isVisible = true;
        setValue('ckbCoolingCWCUseFluidLvgTemp', 1);
        break;
      case IDs.intCompIdDX:
        info.isVisible = true;
        setValue('ckbDaikinVRV', 1);
        break;
      case IDs.intCompIdNA:
        info.isVisible = false;
        break;
      default:
        break;
    }


    // setCoolingCoilHandingInfo(info);
    setValue('ddlCoolingCoilHanding', info?.fdtHanding?.[0].id);

  }, [db, getValues('ddlCoolingComp')]);


  // const [heatingCoilHandingInfo, setHeatingCoilHandingInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHanding: any; isVisible: boolean } = { fdtHanding: [], isVisible: false };

    info.fdtHanding = db?.dbtSelHanding;
    setValue('ckbHeatingHWCUseFluidLvgTemp', 0);

    switch (Number(getValues('ddlHeatingComp'))) {
      case IDs.intCompIdElecHeater:
      case IDs.intCompIdHWC:
        info.isVisible = true;
        setValue('ckbHeatingHWCUseFluidLvgTemp', 1);
        break;
      case IDs.intCompIdNA:
        info.isVisible = false;
        break;
      default:
        break;
    }



    // setHeatingCoilHandingInfo(info);
    setValue('ddlHeatingCoilHanding', info?.fdtHanding?.[0].id);

  }, [db, getValues('ddlHeatingComp')]);


  // const [reheatCoilHandingInfo, setReheatCoilHandingInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHanding: any; isVisible: boolean } = { fdtHanding: [], isVisible: false };

    info.fdtHanding = db?.dbtSelHanding;
    setValue('ckbReheatHWCUseFluidLvgTemp', 0);

    switch (Number(getValues('ddlReheatComp'))) {
      case IDs.intCompIdHWC:
        setValue('ckbReheatHWCUseFluidLvgTemp', 1);
        info.isVisible = true;
        break;        
      case IDs.intCompIdElecHeater:
      case IDs.intCompIdHGRH:
        info.isVisible = true;
        break;
      case IDs.intCompIdNA:
        info.isVisible = false;
        break;
      default:
        break;
    }

    // setReheatCoilHandingInfo(info);
    setValue('ddlReheatCoilHanding', info?.fdtHanding?.[0]?.id);

  }, [db, getValues('ddlReheatComp')]);


  const [supplyAirOpeningInfo, setSupplyAirOpeningInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtSupplyAirOpening: any; isVisible: boolean; defaultId: number, supplyAirOpeningText: string } = 
                { fdtSupplyAirOpening: [],  isVisible: false,   defaultId: 0, supplyAirOpeningText: '' };

    const dtOriOpeningERV_SA_Link = db?.dbtSelOrientOpeningsERV_SA_Link;
    let dtLink: any[] = [];
  

    switch (intUnitTypeID) {
      case IDs.intUnitTypeIdERV:
      case IDs.intUnitTypeIdHRV:
        info.fdtSupplyAirOpening = db?.dbtSelOpeningsERV_SA;
        dtLink = dtOriOpeningERV_SA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID))
        dtLink = dtLink?.filter((item: { location_id: number }) => item.location_id === Number(getValues('ddlLocation')))
        dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(getValues('ddlOrientation')))
                                                      
         
        info.fdtSupplyAirOpening = info.fdtSupplyAirOpening?.filter((item: { prod_type_id: number })  => item.prod_type_id === Number(intProductTypeID));
    
        info.fdtSupplyAirOpening = info.fdtSupplyAirOpening?.filter((e: { items: any }) =>
            dtLink?.filter((e_link) => e.items === e_link.openings_sa)?.length === 1 // 1: Matching items, 0: Not matching items
        );
        // info.defaultId = info?.fdtSupplyAirOpening[0]?.id;
        // info.supplyAirOpeningText = info?.fdtSupplyAirOpening[0]?.items;

    
        // returnInfo.ddlSupplyAirOpeningDataTbl = dtSelectionFinalTable;
    
        if (Number(getValues('ddlOrientation')) === IDs.intOrientationIdVertical && 
            (Number(getValues('ddlCoolingComp')) > 1 || Number(getValues('ddlHeatingComp')) > 1 || Number(getValues('ddlReheatComp')) > 1)) {
          info.defaultId = IDs.intSA_OpenId2;
        }
    
        // if (isContain(dtSelectionFinalTable, 'items', strSupplyAirOpening)) {
        //   returnInfo.ddlSupplyAirOpeningId = intSupplyAirOpeningId;
        //   returnInfo.ddlSupplyAirOpeningText = strSupplyAirOpening;
        // } else {
        //   returnInfo.ddlSupplyAirOpeningId = dtSelectionFinalTable?.[0]?.id;
        //   returnInfo.ddlSupplyAirOpeningText = dtSelectionFinalTable?.[0]?.items.toString();
        // }
          break;
      case IDs.intUnitTypeIdAHU:
        info.fdtSupplyAirOpening = db?.dbtSelOpeningsFC_SA;
        info.defaultId = info?.fdtSupplyAirOpening?.[0].id;

        // returnInfo.ddlSupplyAirOpeningDataTbl = dtSelectionTable;
        // if (isContain(dtSelectionFinalTable, 'items', strSupplyAirOpening)) {
        //   returnInfo.ddlSupplyAirOpeningId = intSupplyAirOpeningId;
        //   returnInfo.ddlSupplyAirOpeningText = strSupplyAirOpening;
        // } else {
          // returnInfo.ddlSupplyAirOpeningId = dtSelectionFinalTable?.[0]?.id;
          // returnInfo.ddlSupplyAirOpeningText = dtSelectionFinalTable?.[0]?.items.toString();
        // }
          break;
      default:
        break;
    }

    info.defaultId = info?.fdtSupplyAirOpening?.[0]?.id;
    info.supplyAirOpeningText = info?.fdtSupplyAirOpening?.[0]?.items;


    setSupplyAirOpeningInfo(info);
    info.defaultId = info?.fdtSupplyAirOpening?.[0]?.id;
    setValue('ddlSupplyAirOpening', info.defaultId);
    setValue('ddlSupplyAirOpeningText', info?.supplyAirOpeningText);

  }, [db, intUnitTypeID, getValues('ddlLocation'), getValues('ddlOrientation'), getValues('ddlCoolingComp'), getValues('ddlHeatingComp'), getValues('ddlReheatComp')]);


  const [remainingOpeningsInfo, setRemainingOpeningsInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtOutdoorAirOpening: any; outdoorAirOpeningId: number, outdoorAirOpeningText: string; isOutdoorAirOpeningVisible: boolean;
                  fdtReturnAirOpening: any; returnAirOpeningId: number, returnAirOpeningText: string;  isReturnAirOpeningVisible: boolean;
                  fdtExhaustAirOpening: any; exhaustAirOpeningId: number, exhaustAirOpeningText: string; isExhaustAirOpeningVisible: boolean;} = 
                { fdtOutdoorAirOpening: [], outdoorAirOpeningId: 0, outdoorAirOpeningText: '', isOutdoorAirOpeningVisible: false,
                  fdtReturnAirOpening: [], returnAirOpeningId: 0, returnAirOpeningText: '', isReturnAirOpeningVisible: false,
                  fdtExhaustAirOpening: [], exhaustAirOpeningId: 0, exhaustAirOpeningText: '',  isExhaustAirOpeningVisible: false};

    let dtLink: any[] = [];
    const dtOpeningsERV_SA_EA_Link = db?.dbtSelOpeningsERV_SA_EA_Link;
    const dtOpeningsERV_SA_OA_Link = db?.dbtSelOpeningsERV_SA_OA_Link;
    const dtOpeningsERV_SA_RA_Link = db?.dbtSelOpeningsERV_SA_RA_Link;
  // const dtNoSelectionTable : any = [{ id: 0, items: 'NA' }] || [];
  const dtNoSelectionTable : any = [{ id: 0, items: 'NA' }];
  const outdoorAirOpeningText = db?.dbtSelOpeningsERV_SA?.filter((item: { id: number }) => item.id === Number(getValues('ddlSupplyAirOpening')))?.[0]?.items;


    switch (intUnitTypeID) {
      case IDs.intUnitTypeIdERV:
      case IDs.intUnitTypeIdHRV:
      // dtLink = data?.openingERV_SA_EA_Link?.filter((item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID);  
      // dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === strSupplyAirOpening);
      // dtLink1 = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(intOrientationID));
  
      dtLink = dtOpeningsERV_SA_EA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
      dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === outdoorAirOpeningText);
      dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(getValues('ddlOrientation')));  
  
      info.fdtExhaustAirOpening = db?.dbtSelOpeningsERV_EA?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
      info.fdtExhaustAirOpening = info.fdtExhaustAirOpening?.filter((e: { items: any }) => dtLink?.filter((e_link) => e.items === e_link.openings_ea)?.length === 1); // 1: Matching items, 0: Not matching items
      
  
      // info.ddlExhaustAirOpeningDataTbl = dtSelectionFinalTable;
      info.exhaustAirOpeningId = info.fdtExhaustAirOpening?.[0]?.id;
      info.exhaustAirOpeningText = info.fdtExhaustAirOpening?.[0]?.items;
      info.isExhaustAirOpeningVisible = true;
  
   
      dtLink = dtOpeningsERV_SA_OA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === intProductTypeID);
      dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === outdoorAirOpeningText);
      dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(getValues('ddlOrientation')));
  
      
      info.fdtOutdoorAirOpening = db?.dbtSelOpeningsERV_OA;
      info.fdtOutdoorAirOpening = info.fdtOutdoorAirOpening?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
  
      info.fdtOutdoorAirOpening = info.fdtOutdoorAirOpening?.filter((e: { items: any }) => dtLink?.filter((e_link) => e.items === e_link.openings_oa)?.length === 1); // 1: Matching items, 0: Not matching items
  
      // returnInfo.ddlOutdoorAirOpeningDataTbl = dtSelectionFinalTable;
      info.outdoorAirOpeningId = info.fdtOutdoorAirOpening?.[0]?.id;
      info.outdoorAirOpeningText = info.fdtOutdoorAirOpening?.[0]?.items;
      info.isOutdoorAirOpeningVisible = true;
  
  
      dtLink = dtOpeningsERV_SA_RA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === intProductTypeID);
      dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === outdoorAirOpeningText);
      dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(Number(getValues('ddlOrientation'))));
  
  
      
      info.fdtReturnAirOpening = db?.dbtSelOpeningsERV_RA;
      info.fdtReturnAirOpening = info.fdtReturnAirOpening?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
  
      info.fdtReturnAirOpening = info.fdtReturnAirOpening?.filter((e: { items: any }) => dtLink?.filter((e_link) => e.items === e_link.openings_ra)?.length === 1); // 1: Matching items, 0: Not matching items
  
      // returnInfo.ddlReturnAirOpeningDataTbl = dtSelectionFinalTable;
      info.returnAirOpeningId = info.fdtReturnAirOpening?.[0]?.id;
      info.returnAirOpeningText = info.fdtReturnAirOpening?.[0]?.items;
      info.isReturnAirOpeningVisible = true;
          break;
      case IDs.intUnitTypeIdAHU:
        info.fdtOutdoorAirOpening = db?.dbtSelOpeningsFC_OA;
        info.outdoorAirOpeningId = info.fdtReturnAirOpening?.[0]?.id;
        info.outdoorAirOpeningText = info.fdtReturnAirOpening?.[0]?.items;
        info.isOutdoorAirOpeningVisible = true;

    
        info.fdtExhaustAirOpening = dtNoSelectionTable;
        info.exhaustAirOpeningId = 0;
        info.exhaustAirOpeningText = 'NA';
        info.isExhaustAirOpeningVisible = false;
    
        info.fdtReturnAirOpening = dtNoSelectionTable;
        info.returnAirOpeningId = 0;
        info.returnAirOpeningText = 'NA';
        info.isReturnAirOpeningVisible = false;
            break;
      default:
        break;
    }


    setRemainingOpeningsInfo(info);
    setValue('ddlExhaustAirOpening', info?.exhaustAirOpeningId);
    setValue('ddlExhaustAirOpeningText', info?.exhaustAirOpeningText); // Used to store value only - not a field on the form
    setValue('ddlOutdoorAirOpening', info?.outdoorAirOpeningId);
    setValue('ddlOutdoorAirOpeningText', info?.outdoorAirOpeningText); // Used to store value only - not a field on the form
    setValue('ddlReturnAirOpening', info?.returnAirOpeningId);
    setValue('ddlReturnAirOpeningText', info?.returnAirOpeningText); // Used to store value only - not a field on the form

  }, [db, intUnitTypeID, getValues('ddlOrientation'), getValues('ddlSupplyAirOpening'), getValues('ddlExhaustAirOpening'), getValues('ddlOutdoorAirOpening'), getValues('ddlReturnAirOpening')]);


  /* ---------------------------- Start OnChange functions ---------------------------- */
  /* ---------------------------- Start OnChange functions ---------------------------- */
  /* ---------------------------- Start OnChange functions ---------------------------- */
  const ddlLocationChanged = useCallback(
    (e: any) => setValue('ddlLocation', Number(e.target.value)),
    [setValue]
  );


  const ddlOrientationChanged = useCallback(
    (e: any) => setValue('ddlOrientation', Number(e.target.value)),
    [setValue]
  );


  const handleBlurSummerSupplyAirCFM = useCallback((e: any) => {
    
      const supplyCFM = getSupplyAirCFM();
      setValue('txbSummerSupplyAirCFM', supplyCFM);
      setValue('txbSummerReturnAirCFM', supplyCFM);
    }, []
  );


 const handleBlurSummerReturnAirCFM = useCallback((e: any) => {
     
     const returnCFM = getReturnAirCFM();
     setValue('txbSummerReturnAirCFM', returnCFM);  

   }, []
 );


 const handleBlurSupplyAirESP = useCallback(
   (e: any) => {
     // const value = getSupplyAirESPInfo(e.target.value, intProductTypeID, formValues.ddlUnitModel);
     // supplyAirEspInfo;

     switch (intProductTypeID) {
       case IDs.intProdTypeIdNova:
         switch (Number(getValues('ddlUnitModel'))) {
           case IDs.intNovaUnitModelIdA16IN:
           case IDs.intNovaUnitModelIdB20IN:
           case IDs.intNovaUnitModelIdA18OU:
           case IDs.intNovaUnitModelIdB22OU:
             if (Number(getValues('txbSupplyAirESP')) > 2.0) {
               setValue('txbSupplyAirESP', 2.0);
             }
             break;
           default:
             if (Number(getValues('txbSupplyAirESP')) > 3.0) {
               setValue('txbSupplyAirESP', 3.0);
             }
             break;
         }
         break;
       default:
         break;
     }
   },
   [intProductTypeID, getValues('ddlUnitModel'), getValues('txbSupplyAirESP')]
 );


 const handleBlurExhaustAirESP = useCallback(
   (e: any) => {
     // const value = getExhaustAirESP(e.target.value, intProductTypeID, intUnitTypeID, formValues.ddlUnitModel);
     // setValue('txbExhaustAirESP', value);

     switch (intProductTypeID) {
       case IDs.intProdTypeIdNova:
         switch (Number(getValues('ddlUnitModel'))) {
           case IDs.intNovaUnitModelIdA16IN:
           case IDs.intNovaUnitModelIdB20IN:
           case IDs.intNovaUnitModelIdA18OU:
           case IDs.intNovaUnitModelIdB22OU:
             if (Number(getValues('txbExhaustAirESP')) > 2.0) {
               setValue('txbExhaustAirESP', 2.0);
             }
             break;
           default:
             if (Number(getValues('txbExhaustAirESP')) > 3.0) {
               setValue('txbExhaustAirESP', 3.0);
             }
             break;
         }
         break;
       default:
         break;
     }
   },
   [setValue, intProductTypeID, getValues('ddlUnitModel'), getValues('txbExhaustAirESP')]
 );



//  const ckbPHIOnChange = useCallback((e: any) => {
//   setValue('ckbPHI', Number(e.target.value),);

//   switch(Number(formCurrValues.ckbPHI)) {
//     case 1:
//       setValue('ckbBypass', 1);
//       setBypassIsEnabled(false);
//     break;
//     case 0:
//       setValue('ckbBypass', 0);
//       setBypassIsEnabled(true);  
//       break;
//     default:
//       break;
//   };
// },
// []
// );


const ckbBypassOnChange = useCallback((e: any) => 
    setValue('ckbBypass', Number(e.target.value)),
  [setValue]
);


const ddlUnitModelChanged = useCallback((e: any) => {
      setValue('ddlUnitModel', Number(e.target.value));
    },
    [setValue]
);


  const ddlUnitVoltageChanged = useCallback((e: any) => 
    setValue('ddlUnitVoltage', Number(e.target.value)),
  [setValue]
  );


  // Summer Mix Outdoor Air DB
  const handleMixSummerOA_DBChanged = useCallback(
    (e: any) => {
      setValue('txbMixSummerOA_DB', parseFloat(e.target.value).toFixed(1));
      api.project.getRH_By_DB_WB(oMixSummerOA_RH).then((data: any) => {
        setValue('txbMixSummerOA_RH', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixSummerOA_DB]
  );

  // Summer Mix Outdoor Air WB
  const handleMixSummerOA_WBChanged = useCallback(
    (e: any) => {
      setValue('txbMixSummerOA_WB', parseFloat(e.target.value).toFixed(1));
      api.project.getRH_By_DB_WB(oMixSummerOA_RH).then((data: any) => {
        setValue('txbMixSummerOA_RH', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixSummerOA_WB]
  );

  // Summer Mix Outdoor Air RH
  const handleMixSummerOA_RHChanged = useCallback(
    (e: any) => {
      setValue('txbMixSummerOA_RH', parseFloat(e.target.value).toFixed(1));
      api.project.getWB_By_DB_RH(oMixSummerOA_WB).then((data: any) => {
        setValue('txbMixSummerOA_WB', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixSummerOA_RH]
  );

  // Winter Mix Outdoor Air DB
  const handleMixWinterOA_DBChanged = useCallback(
    (e: any) => {
      setValue('txbMixWinterOA_DB', parseFloat(e.target.value).toFixed(1));
      api.project.getRH_By_DB_WB(oMixWinterOA_RH).then((data: any) => {
        setValue('txbMixWinterOA_RH', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixWinterOA_DB]
  );

  // Winter Mix Outdoor Air WB
  const handleMixWinterOA_WBChanged = useCallback(
    (e: any) => {
      setValue('txbMixWinterOA_WB', parseFloat(e.target.value).toFixed(1));
      api.project.getRH_By_DB_WB(oMixWinterOA_RH).then((data: any) => {
        setValue('txbMixWinterOA_RH', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixWinterOA_WB]
  );

  // Winter Mix Outdoor Air RH
  const handleMixWinterOA_RHChanged = useCallback(
    (e: any) => {
      setValue('txbMixWinterOA_RH', parseFloat(e.target.value).toFixed(1));
      api.project.getWB_By_DB_RH(oMixWinterOA_WB).then((data: any) => {
        setValue('txbMixWinterOA_WB', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixWinterOA_RH]
  );

  // Summer Mix Return Air DB
  const handleMixSummerRA_DBChanged = useCallback(
    (e: any) => {
      setValue('txbMixSummerRA_DB', parseFloat(e.target.value).toFixed(1));
      api.project.getRH_By_DB_WB(oMixSummerRA_RH).then((data: any) => {
        setValue('txbMixSummerRA_RH', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixSummerRA_DB]
  );

  // Summer Mix Return Air WB
  const handleMixSummerRA_WBChanged = useCallback(
    (e: any) => {
      setValue('txbMixSummerRA_WB', parseFloat(e.target.value).toFixed(1));
      api.project.getRH_By_DB_WB(oMixSummerRA_RH).then((data: any) => {
        setValue('txbMixSummerRA_RH', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixSummerOA_WB]
  );

  // Summer Mix Return Air RH
  const handleMixSummerRA_RHChanged = useCallback(
    (e: any) => {
      setValue('txbMixSummerRA_RH', parseFloat(e.target.value).toFixed(1));
      api.project.getWB_By_DB_RH(oMixSummerRA_WB).then((data: any) => {
        setValue('txbMixSummerRA_WB', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixSummerOA_RH]
  );

  // Winter Mix Return Air DB
  const handleMixWinterRA_DBChanged = useCallback(
    (e: any) => {
      setValue('txbMixWinterRA_DB', parseFloat(e.target.value).toFixed(1));
      api.project.getRH_By_DB_WB(oMixWinterRA_RH).then((data: any) => {
        setValue('txbMixWinterRA_RH', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixWinterRA_DB]
  );

  // Winter Mix Return Air WB
  const handleMixWinterRA_WBChanged = useCallback(
    (e: any) => {
      setValue('txbMixWinterRA_WB', parseFloat(e.target.value).toFixed(1));
      api.project.getRH_By_DB_WB(oMixWinterRA_RH).then((data: any) => {
        setValue('txbMixWinterRA_RH', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixWinterRA_WB]
  );

  // Winter Mix Return Air RH
  const handleMixWinterRA_RHChanged = useCallback(
    (e: any) => {
      setValue('txbMixWinterRA_RH', parseFloat(e.target.value).toFixed(1));
      api.project.getWB_By_DB_RH(oMixWinterRA_WB).then((data: any) => {
        setValue('txbMixWinterRA_WB', data.toFixed(1));
      });
    },
    [formCurrValues.txbMixWinterRA_RH]
  );


  const ddlPreheatCompChanged = useCallback(
    (e: any) => setValue('ddlPreheatComp', Number(e.target.value)),
    [setValue]
  );


  const ddlCoolingCompChanged = useCallback(
    (e: any) => setValue('ddlCoolingComp', Number(e.target.value)),
    [setValue]
  );


  const ddlPreheatElecHeaterVoltageChanged = useCallback(
    (e: any) => setValue('ddlPreheatElecHeaterVoltage', Number(e.target.value)),
    [setValue]
  );

  const ddlHeatingElecHeaterVoltageChanged = useCallback(
    (e: any) => setValue('ddlHeatingElecHeaterVoltage', Number(e.target.value)),
    [setValue]
  );

  const ddlReheatElecHeaterVoltageChanged = useCallback(
    (e: any) => setValue('ddlReheatElecHeaterVoltage', Number(e.target.value)),
    [setValue]
  );


  const ddlDamperAndActuatorChanged = useCallback(
    (e: any) => setValue('ddlDamperAndActuator', Number(e.target.value)),
    [setValue]
  );


  // const ddlValveTypeChanged = useCallback(
  //   (e: any) => setValue('ddlValveType', Number(e.target.value)),
  //   [setValue]
  // );


  const ddlHandingChanged = useCallback(
    (e: any) => {
      setValue('ddlHanding', Number(e.target.value));
      setValue('ddlPreheatCoilHanding', Number(e.target.value));
      setValue('ddlCoolingCoilHanding', Number(e.target.value));
      setValue('ddlHeatingCoilHanding', Number(e.target.value));
      setValue('ddlReheatCoilHanding', Number(e.target.value));
    },
    [setValue]
  );


  const ddlHeatingCoilHandingChanged = useCallback(
    (e: any) => {
      setValue('ddlHeatingCoilHanding', Number(e.target.value));

      if (getValues('ddlHeatingComp') === getValues('ddlReheatComp')) {
        setValue('ddlReheatCoilHanding', Number(e.target.value));
      }
    },
    [setValue]
  );


  const ddlReheatCoilHandingChanged = useCallback(
    (e: any) => {
      setValue('ddlReheatCoilHanding', Number(e.target.value));

      if (getValues('ddlHeatingComp') === getValues('ddlReheatComp')) {
        setValue('ddlHeatingCoilHanding', Number(e.target.value));
      }
    },
    [setValue]
  );


  const ddlSupplyAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlSupplyAirOpening', Number(e.target.value));
      setValue('ddlSupplyAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );


  const ddlExhaustAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlExhaustAirOpening', Number(e.target.value));
      setValue('ddlExhaustAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );


  const ddlOutdoorAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlOutdoorAirOpening', Number(e.target.value));
      setValue('ddlOutdoorAirOpeningText', e.target.options[e.target.selectedIndex].text); // Used to store value only - not a field on the form
    },
    [setValue]
  );


  const ddlReturnAirOpeningChanged = useCallback(
    (e: any) => {
      setValue('ddlReturnAirOpening', Number(e.target.value));
      setValue('ddlReturnAirOpeningText', e.target.options[e.target.selectedIndex].text);
    },
    [setValue]
  );


  const ddlMixOADamperPosChanged = useCallback(
    (e: any) => {
      setValue('ddlMixOADamperPos', Number(e.target.value));
    },
    [setValue]
  );  


  const ddlMixRADamperPosChanged = useCallback(
    (e: any) => {
      setValue('ddlMixRADamperPos', Number(e.target.value));
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
  const isUnitTypeAHU = useCallback(() => intUnitTypeID === IDs.intUnitTypeIdAHU, [intUnitTypeID]);

  // ------------------------------- Drop Files Option --------------------------------
  const handleDrop = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles?.[0];

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




  // ---------------------------- Get RAFilter Model DDL -----------------------------
  const RAFilterModel = useMemo(() => {
    const info: { dataTable: any } = { dataTable: any };

    info.dataTable = db?.dbtSelFilterModel?.filter((item: any) => item.return_air === 1);

    return info;
  }, [db]);


  // ---------------------------- Initialize QAFilter Model --------------------------
  // useEffect(() => {
  //   if ( OAFilterModel?.filter((item: any) => item?.id === formValues.ddlOA_FilterModel).length === 0) {
  //     setValue('ddlOA_FilterModel', OAFilterModel[0].id);
  //   }

  // }, [setValue, OAFilterModel, formValues.ddlOA_FilterModel]);


  // ---------------------------- Initialize RAFilter Model --------------------------
  useEffect(() => {
    if (
      RAFilterModel?.dataTable?.filter((item: any) => item?.id === formValues.ddlRA_FilterModel)
        .length === 0
    ) {
      setValue('ddlRA_FilterModel', RAFilterModel?.dataTable?.[0]?.id);

      // if (edit) {
      //   setValue('ddlRA_FilterModel', defaultValues?.ddlRA_FilterModel);
      // }
    }
  }, [setValue, RAFilterModel, formValues.ddlRA_FilterModel]);



  // -------------- Get User Authentication Level from LocalStorage ----------------
  // const ualInfo = useMemo(
  //   () => getUALInfo(Number(typeof window !== 'undefined' && localStorage.getItem('UAL'))),
  //   []
  // );


  const [reheatHandingInfo, setReheattHandingInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHanding: any; isVisible: boolean } = { fdtHanding: [], isVisible: false };

    info.fdtHanding = db?.dbtSelHanding;

    switch (Number(getValues('ddlReheatComp'))) {
      case IDs.intCompIdElecHeater:
      case IDs.intCompIdHWC:
      case IDs.intCompIdHGRH:
        info.isVisible = true;
        break;
      case IDs.intCompIdNA:
        info.isVisible = false;
        break;
      default:
        break;
    }

    setReheattHandingInfo(info);

    if (getValues('ddlReheatComp') === getValues('ddlHeatingComp')) {
      setValue('ddlReheatCoilHanding', getValues('ddlHeatingCoilHanding'));
    } else {
      setValue('ddlReheatCoilHanding', info.fdtHanding?.[0]?.id); //
    }
  }, [db, intProductTypeID, formValues.ddlHeatingComp, formValues.ddlReheatComp]);


  const isAvailable = useCallback((value: any[]) => !!value && value.length > 0, []);
  if (edit && setFunction) setFunction(handleSubmit(onSubmit));



// ddlEKEXVKitInstallation

useEffect(() => {
  let fdtEKEXVKitInstall: any;

  switch (formCurrValues.ddlCoolingComp) {
    case IDs.intCompIdDX:
      fdtEKEXVKitInstall = db?.dbtSelEKEXVKitInstallation?.filter((item: { id: number }) => item.id === IDs.intEKEXVKitInstallIdCustomer);
      break;
    default:
      fdtEKEXVKitInstall = db?.dbtSelEKEXVKitInstallation?.filter((item: { id: number }) => item.id === IDs.intEKEXVKitInstallIdNA);
      break;
  }

  setEkexvKitInstallTable(fdtEKEXVKitInstall);
  setValue('ddlEKEXVKitInstallation', fdtEKEXVKitInstall?.[0]?.id);

}, [formCurrValues.ddlCoolingComp]);


useEffect(() => {
  switch (formCurrValues.ddlCoolingComp) {
    case IDs.intCompIdDX:
      // setValue('ddlEKEXVKitInstallation', 1);
      setEkexvKitInstallIsVisible(true);
      break;
    default:
      setValue('ddlEKEXVKitInstallation', IDs.intEKEXVKitInstallIdNA);
      setEkexvKitInstallIsVisible(false);
      break;
  }
}, [formCurrValues.ddlCoolingComp]);


  // Load saved Values
  useEffect(() => {
    if (unitInfo !== null) {
      setValue('txbQty', unitInfo?.oUnit?.intQty > 0 ?  unitInfo?.oUnit?.intQty : 1);

      setValue('ddlLocation', unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0 ?  unitInfo?.oUnit?.intLocationId : getValues('ddlLocation'));

      setValue('ddlOrientation', unitInfo?.oUnit?.intOrientationId > 0 ?  unitInfo?.oUnit?.intOrientationId : getValues('ddlOrientation'));

      setValue('ddlControlsPref', unitInfo?.oUnit?.intControlsPreferenceId > 0 ?  unitInfo?.oUnit?.intControlsPreferenceId : getValues('ddlControlsPref'));

      setValue('txbSummerSupplyAirCFM', Number(unitInfo?.oUnitAirflow?.intSummerSupplyAirCFM) > 0 ?  unitInfo?.oUnitAirflow?.intSummerSupplyAirCFM : getValues('txbSummerSupplyAirCFM'));

      setValue('txbSummerReturnAirCFM', Number(unitInfo?.oUnitAirflow?.intSummerReturnAirCFM) > 0 ?  unitInfo?.oUnitAirflow?.intSummerReturnAirCFM : getValues('txbSummerReturnAirCFM'));

      setValue('txbSupplyAirESP', Number.parseFloat(unitInfo?.oUnitAirflow?.dblSupplyAirESP) > 0.0 ?  unitInfo?.oUnitAirflow?.dblSupplyAirESP : '0.75');

      setValue('txbExhaustAirESP', Number.parseFloat(unitInfo?.oUnitAirflow?.dblExhaustAirESP) > 0.0 ?  unitInfo?.oUnitAirflow?.dblExhaustAirESP : '0.75');

      setValue('ckbPHI', unitInfo?.oUnit?.intIsPHI > 0 ?  unitInfo?.oUnit?.intIsPHI : 0);

      setValue('ckbBypass', unitInfo?.oUnit?.intIsBypass > 0 ?  unitInfo?.oUnit?.intIsBypass : 0);

      setValue('ddlUnitModel', unitInfo?.oUnit?.intUnitModelId > 0 ?  unitInfo?.oUnit?.intUnitModelId : getValues('ddlUnitModel'));

      setValue('ddlUnitVoltage', unitInfo?.oUnit?.intUnitVoltageId > 0 ?  unitInfo?.oUnit?.intUnitVoltageId : getValues('ddlUnitVoltage'));

      // setValue('ckbVoltageSPP', unitInfo?.oUnit?.intIsVoltageSPP > 0 ?  unitInfo?.oUnit?.intIsVoltageSPP : 0);
      
      setValue('ddlOA_FilterModel', unitInfo?.oUnitCompOpt?.intOAFilterModelId > 0 ?  unitInfo?.oUnitCompOpt?.intOAFilterModelId : getValues('ddlOA_FilterModel'));

      setValue('ddlRA_FilterModel', unitInfo?.oUnitCompOpt?.intRAFilterModelId > 0 ?  unitInfo?.oUnitCompOpt?.intRAFilterModelId : getValues('ddlRA_FilterModel'));

      // setValue('ddlFilterCondition', unitInfo?.oUnitCompOpt?.intFilterConditionId > 0 ?  unitInfo?.oUnitCompOpt?.intFilterConditionId : getValues('ddlFilterCondition'));
    
      if (unitInfo?.oUnitCompOpt?.intFilterConditionId > 0) {
        setValue('ddlFilterCondition', unitInfo?.oUnitCompOpt?.intFilterConditionId);
        setFilterConditionId(unitInfo?.oUnitCompOpt?.intFilterConditionId);
      }

      setValue('txbOA_FilterPD', unitInfo?.oUnitCompOpt?.dblOAFilterPD > 0 ?  unitInfo?.oUnitCompOpt?.dblOAFilterPD : getValues('txbOA_FilterPD'));

      setValue('txbRA_FilterPD', unitInfo?.oUnitCompOpt?.dblRAFilterPD > 0 ?  unitInfo?.oUnitCompOpt?.dblRAFilterPD : getValues('txbRA_FilterPD'));


      setValue('txbMixSummerOA_CFMPct', Number(unitInfo?.oUnitAirflow?.dblMixSummerOA_CFMPct) > 0 ?  unitInfo?.oUnitAirflow?.dblMixSummerOA_CFMPct : '30');
      setValue('txbMixWinterOA_CFMPct', Number(unitInfo?.oUnitAirflow?.dblMixWinterOA_CFMPct) > 0 ?  unitInfo?.oUnitAirflow?.dblMixWinterOA_CFMPct : '30');
      setValue('ckbMixUseProjectDefault', Number(unitInfo?.oUnitAirflow?.intIsMixUseProjectDefault));
      setValue('txbMixSummerOA_DB', Number(unitInfo?.oUnitAirflow?.dblMixSummerOutdoorAirDB) > 0 ?  unitInfo?.oUnitAirflow?.dblMixSummerOutdoorAirDB : getValues('txbMixSummerOA_DB'));
      setValue('txbMixSummerOA_WB', Number(unitInfo?.oUnitAirflow?.dblMixSummerOutdoorAirWB) > 0 ?  unitInfo?.oUnitAirflow?.dblMixSummerOutdoorAirWB : getValues('txbMixSummerOA_WB'));
      setValue('txbMixSummerOA_RH', Number(unitInfo?.oUnitAirflow?.dblMixSummerOutdoorAirRH) > 0 ?  unitInfo?.oUnitAirflow?.dblMixSummerOutdoorAirRH : getValues('txbMixSummerOA_RH'));
      setValue('txbMixWinterOA_DB', Number(unitInfo?.oUnitAirflow?.dblMixWinterOutdoorAirDB) > 0 ?  unitInfo?.oUnitAirflow?.dblMixWinterOutdoorAirDB : getValues('txbMixWinterOA_DB'));
      setValue('txbMixWinterOA_WB', Number(unitInfo?.oUnitAirflow?.dblMixWinterOutdoorAirWB) > 0 ?  unitInfo?.oUnitAirflow?.dblMixWinterOutdoorAirWB : getValues('txbMixWinterOA_WB'));
      setValue('txbMixWinterOA_RH', Number(unitInfo?.oUnitAirflow?.dblMixWinterOutdoorAirRH) > 0 ?  unitInfo?.oUnitAirflow?.dblMixWinterOutdoorAirRH : getValues('txbMixWinterOA_RH'));
      setValue('txbMixSummerRA_DB', Number(unitInfo?.oUnitAirflow?.dblMixSummerReturnAirDB) > 0 ?  unitInfo?.oUnitAirflow?.dblMixSummerReturnAirDB : getValues('txbMixSummerRA_DB'));
      setValue('txbMixSummerRA_WB', Number(unitInfo?.oUnitAirflow?.dblMixSummerReturnAirWB) > 0 ?  unitInfo?.oUnitAirflow?.dblMixSummerReturnAirWB : getValues('txbMixSummerRA_WB'));
      setValue('txbMixSummerRA_RH', Number(unitInfo?.oUnitAirflow?.dblMixSummerReturnAirRH) > 0 ?  unitInfo?.oUnitAirflow?.dblMixSummerReturnAirRH : getValues('txbMixSummerRA_RH'));
      setValue('txbMixWinterRA_DB', Number(unitInfo?.oUnitAirflow?.dblMixWinterReturnAirDB) > 0 ?  unitInfo?.oUnitAirflow?.dblMixWinterReturnAirDB : getValues('txbMixWinterRA_DB'));
      setValue('txbMixWinterRA_WB', Number(unitInfo?.oUnitAirflow?.dblMixWinterReturnAirWB) > 0 ?  unitInfo?.oUnitAirflow?.dblMixWinterReturnAirWB : getValues('txbMixWinterRA_WB'));
      setValue('txbMixWinterRA_RH', Number(unitInfo?.oUnitAirflow?.dblMixWinterReturnAirRH) > 0 ?  unitInfo?.oUnitAirflow?.dblMixWinterReturnAirRH : getValues('txbMixWinterRA_RH'));

     
      setValue('ckbMixingBox', Number(unitInfo?.oUnitCompOpt?.intIsMixingBox) > 0 ?  unitInfo?.oUnitCompOpt?.intIsMixingBox : getValues('ckbMixingBox'));

      setValue('ddlPreheatComp', unitInfo?.oUnitCompOpt?.intPreheatCompId > 0 ?  unitInfo?.oUnitCompOpt?.intPreheatCompId : getValues('ddlPreheatComp'));

      setValue('txbWinterPreheatSetpointDB', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblPreheatSetpointDB) > 0.0 ?  unitInfo?.oUnitCompOpt?.dblPreheatSetpointDB : '40');
      
      // setValue('ckbPreheatAutoSize', unitInfo?.oUnitCompOpt?.intIsPreheatAutoSize);
            
      if (unitInfo?.oUnitCompOpt?.intIsPreheatAutoSize === 0) {
        setValue('ckbPreheatAutoSize', unitInfo?.oUnitCompOpt?.intIsPreheatAutoSize);
        setIsTxbPreheatSetpointEnabled(true);
      }

      setValue('ckbBackupHeating', unitInfo?.oUnitCompOpt?.intIsBackupHeating > 0 ?  unitInfo?.oUnitCompOpt?.intIsBackupHeating : 0);

      setValue('txbBackupHeatingSetpointDB', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblBackupHeatingSetpontDB) > 0.0 ?  unitInfo?.oUnitCompOpt?.dblBackupHeatingSetpontDB : '40');

      setValue('ddlPreheatCoilHanding',unitInfo?.oUnitLayout?.intPreheatCoilHandingId > 0 ?  unitInfo?.oUnitLayout?.intPreheatCoilHandingId : getValues('ddlLocation'));

      setValue('ddlPreheatElecHeaterInstall', unitInfo?.oUnitCompOpt?.intPreheatElecHeaterInstallationId > 0 ? unitInfo?.oUnitCompOpt?.intPreheatElecHeaterInstallationId : getValues('ddlPreheatElecHeaterInstall'));

      setValue('ddlPreheatElecHeaterVoltage', unitInfo?.oUnitCompOpt?.intPreheatElecHeaterVoltageId > 0 ?  unitInfo?.oUnitCompOpt?.intPreheatElecHeaterVoltageId : getValues('ddlPreheatElecHeaterVoltage'));
      setValue('ckbPreheatElecHeaterVoltageSPP', unitInfo?.oUnitCompOpt?.intIsPreheatElecHeaterVoltageSPP > 0 ? unitInfo?.oUnitCompOpt?.intIsPreheatElecHeaterVoltageSPP : getValues('ckbPreheatElecHeaterVoltageSPP'));

      setValue('ddlPreheatFluidType', unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0 ? unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId : getValues('ddlPreheatFluidType'));

      setValue('ddlPreheatFluidConcentration', unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId > 0 ? unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId : getValues('ddlPreheatFluidConcentration'));

      setValue('txbPreheatHWCFluidEntTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblPreheatFluidEntTemp) > 0.0 ? unitInfo?.oUnitCompOpt?.dblPreheatFluidEntTemp : '140');

      // setValue('ckbPreheatHWCUseFluidLvgTemp', getValues('ckbPreheatHWCUseFluidLvgTemp'));
      
      setValue('txbPreheatHWCFluidLvgTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblPreheatFluidLvgTemp) > 0.0 ? unitInfo?.oUnitCompOpt?.dblPreheatFluidLvgTemp : '120');

      setValue('ckbPreheatHWCUseCap', unitInfo?.oUnitCompOpt?.intIsPreheatHWCUseCap > 0 ? unitInfo?.oUnitCompOpt?.intIsPreheatHWCUseCap : 0);

      setValue('txbPreheatHWCCap', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblPreheatHWCCap) > 0.0 ? unitInfo?.oUnitCompOpt?.dblPreheatHWCCap : '0');

      // setValue('ckbPreheatHWCUseFlowRate', unitInfo?.oUnitCompOpt?.intIsPreheatHWCUseFlowRate != null ? unitInfo?.oUnitCompOpt?.intIsPreheatHWCUseFlowRate : 0);
      
      if (unitInfo?.oUnitCompOptCust?.intIsPreheatHWCUseFlowRate > 0) {
        setValue('ckbPreheatHWCUseFluidFlowRate', unitInfo?.oUnitCompOptCust?.intIsPreheatHWCUseFlowRate);
        setIsTxbPreheatHWCFluidFlowRateEnabled(true);
        setValue('ckbPreheatHWCUseFluidLvgTemp', 0);
        setValue('txbPreheatHWCFluidLvgTemp', '0');
        setIsTxbPreheatHWCFluidLvgTempEnabled(false);
      }

      setValue('txbPreheatHWCFluidFlowRate', Number.parseFloat(unitInfo?.oUnitCompOptCust?.dblPreheatHWCFlowRate) > 0.0 ? unitInfo?.oUnitCompOptCust?.dblPreheatHWCFlowRate : '0');

      setValue('ckbPreheatHWCValveAndActuator', unitInfo?.oUnitCompOpt?.intIsPreheatValveAndActuatorIncluded > 0 ? unitInfo?.oUnitCompOpt?.intIsPreheatValveAndActuatorIncluded : 0);
      setValue('ddlPreheatHWCValveType', unitInfo?.oUnitLayout?.intPreheatValveTypeId > 0 ? unitInfo?.oUnitLayout?.intPreheatValveTypeId : getValues('ddlPreheatHWCValveType'));


      setValue('ddlCoolingComp', unitInfo?.oUnitCompOpt?.intCoolingCompId > 0 ? unitInfo?.oUnitCompOpt?.intCoolingCompId : getValues('ddlCoolingComp'));

      setValue('txbSummerCoolingSetpointDB', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingSetpointDB) > 0.0 ? unitInfo?.oUnitCompOpt?.dblCoolingSetpointDB : '55');

      setValue('txbSummerCoolingSetpointWB', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingSetpointWB) > 0.0 ?  unitInfo?.oUnitCompOpt?.dblCoolingSetpointWB : '54');

      setValue('ckbHeatPump', unitInfo?.oUnitCompOpt?.intIsHeatPump > 0 ? unitInfo?.oUnitCompOpt?.intIsHeatPump : 0 );

      setValue('ckbDehumidification', unitInfo?.oUnitCompOpt?.intIsDehumidification > 0 ? unitInfo?.oUnitCompOpt?.intIsDehumidification : 0);

      setValue('ckbDaikinVRV', unitInfo?.oUnitCompOpt?.intIsDaikinVRV > 0 ? unitInfo?.oUnitCompOpt?.intIsDaikinVRV : 0 );

      setValue('ddlCoolingCoilHanding', unitInfo?.oUnitLayout?.intCoolingCoilHandingId > 0 ? unitInfo?.oUnitLayout?.intCoolingCoilHandingId : getValues('ddlCoolingCoilHanding'));

      setValue('ddlCoolingFluidType', unitInfo?.oUnitCompOpt?.intCoolingFluidTypeId > 0 ? unitInfo?.oUnitCompOpt?.intCoolingFluidTypeId: getValues('ddlCoolingFluidType'));

      setValue('ddlCoolingFluidConcentration', unitInfo?.oUnitCompOpt?.intCoolingFluidConcentId > 0 ? unitInfo?.oUnitCompOpt?.intCoolingFluidConcentId : getValues('ddlCoolingFluidConcentration'));

      setValue('txbCoolingCWCFluidEntTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingFluidEntTemp) > 0.0 ? unitInfo?.oUnitCompOpt?.dblCoolingFluidEntTemp : '45');

      setValue('txbCoolingCWCFluidLvgTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingFluidLvgTemp) > 0.0 ? unitInfo?.oUnitCompOpt?.dblCoolingFluidLvgTemp : '55');


      if (unitInfo?.oUnitCompOptCust?.intIsCoolingCWCUseFlowRate > 0) {
        setValue('ckbCoolingCWCUseFluidFlowRate', unitInfo?.oUnitCompOptCust?.intIsCoolingCWCUseFlowRate);
        setIsTxbCoolingCWCFluidFlowRateEnabled(true);
        setValue('ckbCoolingCWCUseFluidLvgTemp', 0);
        setValue('txbCoolingCWCFluidLvgTemp', '0');
        // setCkbCoolingCWCUseFluidFlowRateValue(unitInfo?.oUnitCompOpt?.intIsCoolingCWCUseFlowRate);
        setIsTxbCoolingCWCFluidLvgTempEnabled(false);
  }
      setValue('txbCoolingCWCFluidFlowRate', Number.parseFloat(unitInfo?.oUnitCompOptCust?.dblCoolingCWCFlowRate) > 0.0 ? unitInfo?.oUnitCompOptCust?.dblCoolingCWCFlowRate : '0');

      // setValue('ckbCoolingCWCUseFluidFlowRate', unitInfo?.oUnitCompOptCust?.intIsCoolingCWCUseFlowRate != null ? unitInfo?.oUnitCompOptCust?.intIsCoolingCWCUseFlowRate : 0);

      setValue('ckbCoolingCWCUseCap', unitInfo?.oUnitCompOpt?.intIsCoolingHWCUseCap != null ? unitInfo?.oUnitCompOpt?.intIsCoolingCWCUseCap : 0);

      setValue('txbCoolingCWCCap', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingWCCap) > 0.0 ? unitInfo?.oUnitCompOpt?.dblCoolingWCCap : '0');


      setValue('txbRefrigSuctionTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigSuctionTemp) > 0.0 ? unitInfo?.oUnitCompOpt?.dblRefrigSuctionTemp: '43');

      setValue('txbRefrigLiquidTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigLiquidTemp) > 0.0 ? unitInfo?.oUnitCompOpt?.dblRefrigLiquidTemp : '77');

      setValue('txbRefrigSuperheatTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigSuperheatTemp) > 0.0 ? unitInfo?.oUnitCompOpt?.dblRefrigSuperheatTemp : '9');


      setValue('ckbCoolingCWCValveAndActuator', unitInfo?.oUnitCompOpt?.intIsCoolingValveAndActuatorIncluded > 0 ? unitInfo?.oUnitCompOpt?.intIsCoolingValveAndActuatorIncluded : 0);
      setValue('ddlCoolingCWCValveType', unitInfo?.oUnitLayout?.intCoolingValveTypeId > 0 ? unitInfo?.oUnitLayout?.intCoolingValveTypeId : getValues('ddlCoolingCWCValveType'));


      setValue('ddlHeatingComp', unitInfo?.oUnitCompOpt?.intHeatingCompId > 0 ? unitInfo?.oUnitCompOpt?.intHeatingCompId : getValues('ddlHeatingComp'));

      setValue('txbWinterHeatingSetpointDB', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingSetpointDB) > 0.0 ? unitInfo?.oUnitCompOpt?.dblHeatingSetpointDB  : '72');

      setValue('ddlHeatingCoilHanding', unitInfo?.oUnitLayout?.intHeatingCoilHandingId > 0 ? unitInfo?.oUnitLayout?.intHeatingCoilHandingId : getValues('ddlHeatingCoilHanding'));

      setValue('ddlHeatingElecHeaterInstall', unitInfo?.oUnitCompOpt?.intHeatingElecHeaterInstallationId > 0 ? unitInfo?.oUnitCompOpt?.intHeatingElecHeaterInstallationId : getValues('ddlHeatingElecHeaterInstall'));

      setValue('ddlHeatingElecHeaterVoltage', unitInfo?.oUnitCompOpt?.intHeatingElecHeaterVoltageId > 0 ?  unitInfo?.oUnitCompOpt?.intHeatingElecHeaterVoltageId : getValues('ddlHeatingElecHeaterVoltage'));
      setValue('ckbHeatingElecHeaterVoltageSPP', unitInfo?.oUnitCompOpt?.intIsHeatingElecHeaterVoltageSPP > 0 ? unitInfo?.oUnitCompOpt?.intIsHeatingElecHeaterVoltageSPP : getValues('ckbHeatingElecHeaterVoltageSPP'));

      setValue('ddlHeatingFluidType', unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0 ? unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId : getValues('ddlHeatingFluidType'));

      setValue('ddlHeatingFluidConcentration', unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId > 0 ? unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId : getValues('ddlHeatingFluidConcentration'));

      setValue('txbHeatingHWCFluidEntTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp) > 0.0 ? unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp : '140');

      setValue('txbHeatingHWCFluidLvgTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp) > 0.0 ? unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp : '120');

      setValue('ckbHeatingHWCUseCap', unitInfo?.oUnitCompOpt?.intIsHeatingHWCUseCap != null ? unitInfo?.oUnitCompOpt?.intIsHeatingHWCUseCap : 0);

      setValue('txbHeatingHWCCap', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingHWCCap) > 0.0 ? unitInfo?.oUnitCompOpt?.dblHeatingHWCCap : '0');

      if (unitInfo?.oUnitCompOptCust?.intIsHeatingHWCUseFlowRate > 0) {
        setValue('ckbHeatingHWCUseFluidFlowRate', unitInfo?.oUnitCompOptCust?.intIsHeatingHWCUseFlowRate);
        setIsTxbHeatingHWCFluidFlowRateEnabled(true);
        setValue('ckbHeatingHWCUseFluidLvgTemp', 0);
        setValue('txbHeatingHWCFluidLvgTemp', '0');
        setIsTxbHeatingHWCFluidLvgTempEnabled(false);
      }

      // setValue('ckbHeatingHWCUseFluidFlowRate', unitInfo?.oUnitCompOptCust?.intIsHeatingHWCUseFlowRate != null ? unitInfo?.oUnitCompOptCust?.intIsHeatingHWCUseFlowRate : 0);
      
      setValue('txbHeatingHWCFluidFlowRate', Number.parseFloat(unitInfo?.oUnitCompOptCust?.dblHeatingHWCFlowRate) > 0.0 ? unitInfo?.oUnitCompOptCust?.dblHeatingHWCFlowRate : '0');

      setValue('ckbHeatingHWCValveAndActuator', unitInfo?.oUnitCompOpt?.intIsHeatingValveAndActuatorIncluded > 0 ? unitInfo?.oUnitCompOpt?.intIsHeatingValveAndActuatorIncluded : 0);
      setValue('ddlHeatingHWCValveType', unitInfo?.oUnitLayout?.intHeatingValveTypeId > 0 ? unitInfo?.oUnitLayout?.intHeatingValveTypeId : getValues('ddlHeatingHWCValveType'));
      
      setValue('ddlReheatComp', unitInfo?.oUnitCompOpt?.intReheatCompId > 0 ? unitInfo?.oUnitCompOpt?.intReheatCompId : getValues('ddlReheatComp'));

      setValue('txbSummerReheatSetpointDB', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblReheatSetpointDB) > 0.0 ? unitInfo?.oUnitCompOpt?.dblReheatSetpointDB : '70');

      setValue('ddlReheatCoilHanding', unitInfo?.oUnitLayout?.intHeatingCoilHandingId > 0 ? unitInfo?.oUnitLayout?.intHeatingCoilHandingId : getValues('ddlReheatCoilHanding'));

      setValue('ddlReheatElecHeaterInstall', unitInfo?.oUnitCompOpt?.intHeatingElecHeaterInstallationId > 0 ? unitInfo?.oUnitCompOpt?.intHeatingElecHeaterInstallationId : getValues('ddlReheatElecHeaterInstall'));

      setValue('ddlReheatElecHeaterVoltage', unitInfo?.oUnitCompOpt?.intReheatElecHeaterVoltageId > 0 ?  unitInfo?.oUnitCompOpt?.intReheatElecHeaterVoltageId : getValues('ddlReheatElecHeaterVoltage'));
      setValue('ckbReheatElecHeaterVoltageSPP', unitInfo?.oUnitCompOpt?.intIsReheatElecHeaterVoltageSPP > 0 ? unitInfo?.oUnitCompOpt?.intIsReheatElecHeaterVoltageSPP : getValues('ckbReheatElecHeaterVoltageSPP'));

      setValue('ddlReheatFluidType', unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0 ?  unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId : getValues('ddlReheatFluidType'));

      setValue('ddlReheatFluidConcentration', unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId > 0 ?  unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId : getValues('ddlReheatFluidConcentration'));

      setValue('txbReheatHWCFluidEntTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblReheatFluidEntTemp) > 0.0 ?  unitInfo?.oUnitCompOpt?.dblReheatFluidEntTemp : '140');

      setValue('txbReheatHWCFluidLvgTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblReheatFluidLvgTemp) > 0.0 ?  unitInfo?.oUnitCompOpt?.dblReheatFluidLvgTemp : '120');


      if (unitInfo?.oUnitCompOptCust?.intIsReheatHWCUseFlowRate > 0) {
        setValue('ckbReheatHWCUseFluidFlowRate', unitInfo?.oUnitCompOptCust?.intIsReheatHWCUseFlowRate);
        setIsTxbReheatHWCFluidFlowRateEnabled(true);
        setValue('ckbReheatHWCUseFluidLvgTemp', 0);
        setValue('txbReheatHWCFluidLvgTemp', '0');
        setIsTxbReheatHWCFluidLvgTempEnabled(false);
      }

      // setValue('ckbReheatHWCUseFluidFlowRate', unitInfo?.oUnitCompOptCust?.intIsReheatHWCUseFlowRate > 0 ?  unitInfo?.oUnitCompOptCust?.intIsReheatHWCUseFlowRate : 0);
      setValue('txbReheatHWCFluidFlowRate', Number.parseFloat(unitInfo?.oUnitCompOptCust?.dblReheatHWCFlowRate) > 0.0 ? unitInfo?.oUnitCompOptCust?.dblReheatHWCFlowRate : '0');

      setValue('ckbReheatHWCUseCap', unitInfo?.oUnitCompOpt?.intIsReheatHWCUseCap > 0 ?  unitInfo?.oUnitCompOpt?.intIsReheatHWCUseCap : 0);

      setValue('txbReheatHWCCap', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblReheatHWCCap) > 0.0 ?  unitInfo?.oUnitCompOpt?.dblReheatHWCCap : '0');

      setValue('txbRefrigCondensingTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigCondensingTemp) > 0.0  ? unitInfo?.oUnitCompOpt?.dblRefrigCondensingTemp : '115');

      setValue('txbRefrigVaporTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigVaporTemp) > 0.0 ?  unitInfo?.oUnitCompOpt?.dblRefrigVaporTemp : '140');

      setValue('txbRefrigSubcoolingTemp', Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigSubcoolingTemp) > 0.0 ?  unitInfo?.oUnitCompOpt?.dblRefrigSubcoolingTemp : '5.4');

      setValue('ckbReheatHWCValveAndActuator', unitInfo?.oUnitCompOpt?.intIsReheatValveAndActuatorIncluded > 0 ? unitInfo?.oUnitCompOpt?.intIsReheatValveAndActuatorIncluded : 0);
      setValue('ddlReheatHWCValveType', unitInfo?.oUnitLayout?.intReheatValveTypeId > 0 ? unitInfo?.oUnitLayout?.intReheatValveTypeId : getValues('ddlReheatHWCValveType'));

      setValue('ddlDamperAndActuator', unitInfo?.oUnitCompOpt?.intDamperAndActuatorId > 0 ?  unitInfo?.oUnitCompOpt?.intDamperAndActuatorId : getValues('ddlDamperAndActuator'));

      setValue('ddlPreheatElecHeaterVoltage', unitInfo?.oUnitCompOpt?.intPreheatElecHeaterVoltageId > 0 ?  unitInfo?.oUnitCompOpt?.intPreheatElecHeaterVoltageId : getValues('ddlPreheatElecHeaterVoltage'));
      setValue('ddlHeatingElecHeaterVoltage', unitInfo?.oUnitCompOpt?.intHeatingElecHeaterVoltageId > 0 ?  unitInfo?.oUnitCompOpt?.intHeatingElecHeaterVoltageId : getValues('ddlHeatingElecHeaterVoltage'));
      setValue('ddlReheatElecHeaterVoltage', unitInfo?.oUnitCompOpt?.intReheatElecHeaterVoltageId > 0 ?  unitInfo?.oUnitCompOpt?.intReheatElecHeaterVoltageId : getValues('ddlReheatElecHeaterVoltage'));
   
      setValue('ckbValveAndActuator', unitInfo?.oUnitCompOpt?.intIsValveAndActuatorIncluded > 0 ?  unitInfo?.oUnitCompOpt?.intIsValveAndActuatorIncluded : 0);

      setValue('ddlValveType', unitInfo?.oUnitCompOpt?.intValveTypeId > 0 ?  unitInfo?.oUnitCompOpt?.intValveTypeId: getValues('ddlValveType'));

      setValue('ddlHanding', unitInfo?.oUnitLayout?.intHandingId > 0 ?  unitInfo?.oUnitLayout?.intHandingId : getValues('ddlHanding'));

      setValue('ddlSupplyAirOpening', unitInfo?.oUnitLayout?.intSAOpeningId > 0 ?  unitInfo?.oUnitLayout?.intSAOpeningId : getValues('ddlSupplyAirOpening'));

      setValue('ddlExhaustAirOpening', unitInfo?.oUnitLayout?.intEAOpeningId > 0 ?  unitInfo?.oUnitLayout?.intEAOpeningId : getValues('ddlExhaustAirOpening'));

      setValue('ddlOutdoorAirOpening', unitInfo?.oUnitLayout?.intOAOpeningId > 0 ?  unitInfo?.oUnitLayout?.intOAOpeningId : getValues('ddlOutdoorAirOpening'));

      setValue('ddlReturnAirOpening', unitInfo?.oUnitLayout?.intRAOpeningId > 0 ?  unitInfo?.oUnitLayout?.intRAOpeningId : getValues('ddlReturnAirOpening'));
   
      setValue('ddlMixOADamperPos', unitInfo?.oUnitLayout?.intMixOADamperPosId > 0 ?  unitInfo?.oUnitLayout?.intMixOADamperPosId : getValues('ddlMixOADamperPos'));
      
      setValue('ddlMixRADamperPos', unitInfo?.oUnitLayout?.intMixRADamperPosId > 0 ?  unitInfo?.oUnitLayout?.intMixRADamperPosId : getValues('ddlMixRADamperPos'));

    }
  }, []); // <-- empty dependency array - This will only trigger when the component mounts and no-render

// Always keep below loading saved value
useEffect(() => {

    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeIdNova:
        setValue('ckbMixingBox', 0);
        setVoltageSPPIsVisible(true);
        break;
      case IDs.intProdTypeIdVentum:
        setValue('ckbMixingBox', 0);
        setVoltageSPPIsVisible(true);
        break;
      case IDs.intProdTypeIdVentumPlus:
        setValue('ckbMixingBox', 0);
        setVoltageSPPIsVisible(true);
        break;
      case IDs.intProdTypeIdVentumLite:
        setValue('ckbMixingBox', 0);
        break;
      case IDs.intProdTypeIdTerra:
        setVoltageSPPIsVisible(true);
        break;
      default:
        setValue('ckbPreheatElecHeaterVoltageSPP', 0)
        setValue('ckbHeatingElecHeaterVoltageSPP', 0)
        setValue('ckbReheatElecHeaterVoltageSPP', 0)
        // setVoltageSPPIsVisible(false);
        setIsVisibleDdlPreheatElecHeaterVoltage(false);
        setIsVisibleDdlHeatingElecHeaterVoltage(false);
        setIsVisibleDdlReheatElecHeaterVoltage(false);
        break;
    }
  }, [intProductTypeID]);


  useEffect(() => {
    switch (intUnitTypeID) {
      case IDs.intUnitTypeIdERV:
      case IDs.intUnitTypeIdHRV:
        setIsVisibleDdlSupplyAirOpeningVisible(true);
        setIsVisibleDdlOutdoorAirOpeningVisible(true);
        setIsVisibleDdlReturnAirOpeningVisible(true);
        setIsVisibleDdlExhaustAirOpeningVisible(true);
      break;
      case IDs.intUnitTypeIdAHU:
        setIsVisibleDdlSupplyAirOpeningVisible(false);
        setIsVisibleDdlOutdoorAirOpeningVisible(false);
        setIsVisibleDdlReturnAirOpeningVisible(false);
        setIsVisibleDdlExhaustAirOpeningVisible(false);
        break;
      default:
        break;
    }

  }, [intUnitTypeID]);


// // ckbVoltageSPP
// useEffect(() => {
//   switch (intProductTypeID) {
//     case IDs.intProdTypeIdNova:
//     case IDs.intProdTypeIdVentum:
//     case IDs.intProdTypeIdVentumPlus:
//     case IDs.intProdTypeIdTerra:
//       setVoltageSPPIsVisible(true);
//       break;
//     default:
//       setValue('ckbVoltageSPP', 0)
//       setVoltageSPPIsVisible(false);
//       break;
//   }
// }, [intProductTypeID]);



  useEffect(() => {
    if (user?.UAL === IDs.intUAL_External || user?.UAL === IDs.intUAL_ExternalSpecial) {
      setPHIIsVisible(false);
      setValue('ckbPHI', 0);
    }
    else {
      switch (Number(intProductTypeID)) {
        case IDs.intProdTypeIdVentum:
        case IDs.intProdTypeIdVentumPlus:
          switch (intUnitTypeID) {
            case IDs.intUnitTypeIdERV:
              // info.isVisible = true;
              // info.isChecked = true;
              setPHIIsVisible(true);
              setValue('ckbPHI', 0);
              break;
            case IDs.intUnitTypeIdHRV:
              // info.isVisible = false;
              // info.isChecked = false;
              setPHIIsVisible(false);
              setValue('ckbPHI', 0);
              break;
            default:
              break;
          }
          break;
        case IDs.intProdTypeIdNova:
        case IDs.intProdTypeIdVentumLite:
        case IDs.intProdTypeIdTerra:
          // info.isVisible = false;
          // info.isChecked = false;
          setPHIIsVisible(false);
          setValue('ckbPHI', 0);
          break;
        default:
          break;
      }
    }

    // // setPHIInfo(info);
    // setPHIIsVisible(info.isVisible);
    // setPHIIsEnabled(info.isEnabled);
    // setPHIIsChecked(info.isChecked);

  }, [intProductTypeID, intUnitTypeID]);




  const onClickUnitInfo = () => {
    // setCurrentStep(1);
    push(PATH_APP.selectionUnit(projectId?.toString() || '0', unitId?.toString() || '0'));
  };
  const { data: jobSelTables, isLoading: isLoadingProjectInitInfo, refetch } = useGetJobSelTables();
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openFail, setOpenFail] = useState<boolean>(false);
  const [newProjectDialogOpen, setNewProjectDialog] = useState<boolean>(false);
  const {
    data: savedJob,
    isLoading: isLoadingProject,
    refetch: refetchProject,
    isRefetching: isRefetchingProject,
  } = useGetSavedJob(
    { intJobId: projectId },
    {
      enabled: !!projectId,
    }
  );
// ------------------------------------------------------------------------------------------------------------------------------------------------

  return (
    <>

  {isLoadingProjectInitInfo ||
      isLoadingProject ||
      !projectId ||
      !savedJob ||
      isRefetchingProject ? (
        <></>
      ):
      ( <ProjectInfoDialog
          loadProjectStep="SHOW_ALL_DIALOG"
          open={newProjectDialogOpen}
          onClose={() => {
            // onClose();
            setNewProjectDialog(false);
          }}
          setOpenSuccess={() => setOpenSuccess(true)}
          savedJob = {savedJob}
          setOpenFail={() => setOpenFail(true)}
          // initialInfo={projects?.jobInitInfo}
          initialInfo={jobSelTables}
          // projectList={[]}
          refetch={() => {
            refetch();
            refetchProject();
          }}
          // savedJob={savedJob}
        />
  )}
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ marginBottom: '150px' }}>
        {Number(unitId) > 0 ? (
         <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            <Typography variant="h3" color="primary.main" sx={{ flexGrow: 1, textAlign: 'center' }}>
              {getValues('txbTag')}
            </Typography>

            <Button variant="outlined" color="primary" onClick={() => setNewProjectDialog(!newProjectDialogOpen)}>
              Edit Project Details
            </Button>
          </Box>
        ) : (
          <Stack direction="row" alignContent="center" justifyContent="center">
            <Typography variant="h3" color="primary.main">
              {unitTypeData?.txbProductType || ''}/{unitTypeData?.txbUnitType || ''}
            </Typography>
          </Stack>
        )}
        {/* <Accordion  // GENERAL
          expanded={expanded.panel1}
          onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
        > */}
          <AccordionSummary
            // expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              GENERAL
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFTextField size="small" name="txbTag" label="Unit Tag" />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbQty"
                      label="Quantity"
                      onChange={(e: any) => { setValueWithCheck1(e, 'txbQty'); }}

                    // onChange={(e: any) => {
                    //   setValueWithCheck(e, 'txbQty');
                    // }}
                    />
                  </Stack>
                  <Stack>
                  <RHFTextField
                      size="small"
                      name="txbAreaServed"
                      label="Area Served"
                      // onChange={(e: any) => { setValueWithCheck1(e, 'txbAreaServed'); }}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlLocation"
                      label="Installation Location"
                      placeholder=""
                      onChange={ddlLocationChanged}
                    >
                      {locationInfo?.fdtLocation?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlOrientation"
                      label="Orientation"
                      placeholder=""
                      onChange={ddlOrientationChanged}
                    >
                      {orientationInfo?.fdtOrientation?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlUnitType"
                      label="Unit Type"
                      placeholder=""
                      disabled
                    >
                      {unitTypeInfo?.fdtUnitType?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                <Stack>
                    <RHFCheckbox
                      sx={{ ...getInlineDisplay(formValues.ddlLocation === IDs.intLocationIdOutdoor) }}
                      label="Downshot"
                      name="ckbDownshot"
                      // checked={formValues.ckbDownshot}
                      // onChange={() => setCkbDownshotVal(!formValues.ckbDownshotVal)}
                      onChange={(e: any) => setValue('ckbDownshot', Number(e.target.checked))}
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        {/* </Accordion> */}
        {/* <Accordion  // UNIT
          expanded={expanded.panel1}
          onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
        > */}
          <AccordionSummary
            // expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              UNIT
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbSummerSupplyAirCFM"
                      label="Supply Airflow (CFM)"
                      // onChange={(e: any) => {setValueWithCheck(e, 'txbSummerSupplyAirCFM');}}
                      onBlur={handleBlurSummerSupplyAirCFM}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbSupplyAirESP"
                      label="Supply Air ESP (inH2O)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbSupplyAirESP');
                      }}
                      onBlur={handleBlurSupplyAirESP}
                    />
                  </Stack>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlUnitModel"
                      label="Unit Model"
                      // sx={getDisplay(unitModelInfo?.isVisible)}
                      onChange={ddlUnitModelChanged}
                    >
                      {unitModelInfo?.fdtUnitModel?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbSummerReturnAirCFM"
                      label="Exhaust Airflow (CFM)"
                      sx={getDisplay(!isUnitTypeAHU())}
                      onChange={(e: any) => {
                        setValueWithCheck(e, 'txbSummerReturnAirCFM');
                      }}
                      onBlur={handleBlurSummerReturnAirCFM}
                    />
                  </Stack>
                  <Stack>
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
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      label={`Passive House Certification: `}
                      name="ckbPHI"
                      sx={getInlineDisplay(phiIsVisible)}
                      // sx={{color: ckbBypassInfo.text !== '' ? colors.red[500] : 'text.primary', size: 'small', }}
                      // checked={phiInfo?.isChecked}
                      // disabled={!phiInfo?.isEnabled}
                      onChange={(e: any) => { setValue('ckbPHI', Number(e.target.value)); }}

                    // onChange={ckbPHIOnChange}
                    />
                    <RHFCheckbox
                      label={`Economizer Bypass Damper ${bypassMsg}`}
                      name="ckbBypass"
                      sx={getInlineDisplay(bypassIsVisible)}
                      // sx={{color: ckbBypassInfo.text !== '' ? colors.red[500] : 'text.primary', size: 'small', }}
                      checked={bypassIsChecked}
                      disabled={!bypassIsEnabled}
                      // onChange={() => setCkbBypassVal(!formValues.ckbBypassVal)}
                      // onChange={(e: any) => setValue('ckbBypass', Number(e.target.checked))}

                      onChange={ckbBypassOnChange}
                    />
                    <RHFCheckbox
                      label="Mixing Section"
                      name="ckbMixingBox"
                      // checked={isCheckedMixingBox}
                      onChange={(e: any) => setValue('ckbMixingBox', Number(e.target.checked))}
                      sx={getDisplay(intProductTypeID === IDs.intProdTypeIdTerra)}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                Unit Electrical
              </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlUnitVoltage"
                      label="Unit Voltage"
                      onChange={ddlUnitVoltageChanged}
                    >
                      {unitVoltageInfo?.fdtUnitVoltage?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        {/* </Accordion> */}
        {/* <Accordion  // FILTRATION
          expanded={expanded.panel1}
          onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
        > */}
          <AccordionSummary
            // expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              FILTRATION
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlOA_FilterModel"
                    label="Outdoor Air Filter"
                    onChange={(e: any) => setValue('ddlOA_FilterModel', Number(e.target.value))}
                    disabled
                  >
                    {outdoorAirFilterInfo?.fdtOutdoorAirFilter?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  </Stack>
                  <Stack>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlFilterCondition"
                    label="Filter Condition"
                    // onChange={(e: any) => setValue('ddlOA_FilterCondition', Number(e.target.value))}
                    onChange={ddlFilterConditionChanged}
                    // disabled
                  >
                    {filterCondtionOptions?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                    {/* <option>Clean</option> */}
                  </RHFSelect>            
                  </Stack>
                  <Stack>
                  <RHFTextField
                    size="small"
                    name="txbOA_FilterPD"
                    label="Outdoor Air Filter PD (inH2O)"
                    onChange={(e: any) => { setValueWithCheck1(e, 'txbOA_FilterPD'); }}
                    onBlur={handleBlurSupplyAirESP}
                  />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={getDisplay(returnAirFilterInfo?.isVisible)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' },  }}>
                <Stack>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlRA_FilterModel"
                    label="Return Air Filter"
                    onChange={(e: any) => setValue('ddlRA_FilterModel', Number(e.target.value))}
                    disabled
                  >
                    {returnAirFilterInfo?.fdtReturnAirFilter?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                  </Stack>
                  <Stack>
                    {}
                  </Stack>        
                  <Stack>
                  <RHFTextField
                    size="small"
                    name="txbRA_FilterPD"
                    label="Return Air Filter PD (inH2O)"
                    onChange={(e: any) => { setValueWithCheck1(e, 'txbRA_FilterPD'); }}
                    onBlur={handleBlurExhaustAirESP}
                  />
                 
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        {/* </Accordion> */}
          <Stack sx={getInlineDisplay(getValues('ckbMixingBox'))}>
            <Accordion  // MIXING SECTION
              expanded={expanded.panel2}
              onChange={() => setExpanded({ ...expanded, panel2: !expanded.panel2 })}
              sx={getDisplay(getValues('ckbMixingBox'))}
              >
              <AccordionSummary
                expandIcon={<Iconify icon="il:arrow-down" />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
              <Typography color="primary.main" variant="h6">
                MIXING SECTION
              </Typography>
              </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Stack><Typography color="primary.main" variant="subtitle2" /></Stack>
                        <Stack><Typography color="primary.main" variant="subtitle2">SUMMER</Typography></Stack>
                        <Stack><Typography color="primary.main" variant="subtitle2" /></Stack>
                        <Stack><Typography color="primary.main" variant="subtitle2">WINTER</Typography></Stack>
                      </Box>
                    </Grid>
                      <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Stack><Typography color="primary.main" variant="subtitle2">Outdoor Air (% / CFM)</Typography></Stack>
                        <Stack>
                          <RHFTextField
                            size="small"
                            name="txbMixSummerOA_CFMPct"
                            label="%"
                            autoComplete="off"
                            onChange={(e: any) => { setValueWithCheck1(e, 'txbMixSummerOA_CFMPct'); }}
                          />
                        </Stack>
                        <Stack>
                          <RHFTextField
                            size="small"
                            name="txbMixSummerOA_CFM"
                            label="CFM"
                            disabled
                          />
                        </Stack>
                        <Stack>
                          <RHFTextField
                            size="small"
                            name="txbMixWinterOA_CFMPct"
                            label="%"
                            autoComplete="off"
                            onChange={(e: any) => {
                              setValueWithCheck1(e, 'txbMixWinterOA_CFMPct');
                            }}
                          />
                        </Stack>
                        <Stack>
                          <RHFTextField
                            size="small"
                            name="txbMixWinterOA_CFM"
                            label="CFM"
                            disabled
                          />
                        </Stack>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Stack><Typography color="primary.main" variant="subtitle2">Return Air (% / CFM)</Typography></Stack>
                        <Stack>
                          <RHFTextField
                            size="small"
                            name="txbMixSummerRA_CFMPct"
                            label="%"
                            autoComplete="off"
                            disabled
                            onChange={(e: any) => { setValueWithCheck1(e, 'txbMixSummerRA_CFMPct'); }}
                          />
                        </Stack>
                        <Stack>
                          <RHFTextField
                            size="small"
                            name="txbMixSummerRA_CFM"
                            label="CFM"
                            disabled
                          />
                        </Stack>
                        <Stack>
                          <RHFTextField
                            size="small"
                            name="txbMixWinterRA_CFMPct"
                            label="%"
                            autoComplete="off"
                            disabled
                            onChange={(e: any) => {
                              setValueWithCheck1(e, 'txbMixWinterRA_CFMPct');
                            }}
                          />
                        </Stack>
                        <Stack>
                          <RHFTextField
                            size="small"
                            name="txbMixWinterRA_CFM"
                            label="CFM"
                            disabled
                          />
                        </Stack>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Stack>
                          <RHFCheckbox
                            label="Use Project Default"
                            name="ckbMixUseProjectDefault"
                            onChange={(e: any) => setValue('ckbMixUseProjectDefault', Number(e.target.checked))}
                          />
                        </Stack>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                          <Stack><Typography color="primary.main" variant="subtitle2">OUTDOOR AIR</Typography></Stack>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Typography color="primary.main" variant="subtitle2">Dry Bulb Temperature (F)</Typography>
                        <Stack>
                          <RHFTextField
                            size="small"
                            name="txbMixSummerOA_DB"
                            label=""
                            disabled={getValues('ckbMixUseProjectDefault')}
                            onChange={(e: any) => { setValueWithCheck1(e, 'txbMixSummerOA_DB'); }}
                            onBlur={handleMixSummerOA_DBChanged}
                          />
                        </Stack>
                        <Stack><Typography color="primary.main" variant="subtitle2" /></Stack>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixWinterOA_DB"
                            label=""
                            onChange={(e: any) => { setValueWithCheck1(e, 'txbMixWinterOA_DB'); }}
                            onBlur={handleMixWinterOA_DBChanged}
                          />
                        </Stack>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Typography color="primary.main" variant="subtitle2">Wet Bulb Temperature (F)</Typography>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixSummerOA_WB"
                            label=""
                            onChange={(e: any) => { setValueWithCheck1(e, 'txbMixSummerOA_WB'); }}
                            onBlur={handleMixSummerOA_WBChanged}
                          />
                        </Stack>
                        <Stack><Typography color="primary.main" variant="subtitle2" /></Stack>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixWinterOA_WB"
                            label=""
                            onChange={(e: any) => { setValueWithCheck1(e, 'txbMixWinterOA_WB'); }}
                            onBlur={handleMixWinterOA_WBChanged}
                          />
                        </Stack>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Typography color="primary.main" variant="subtitle2">Relative Humidity (%)</Typography>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixSummerOA_RH"
                            label=""
                            onChange={(e: any) => {
                              setValueWithCheck1(e, 'txbMixSummerOA_RH');
                            }}
                            onBlur={handleMixSummerOA_RHChanged}
                          />
                        </Stack>
                        <Stack><Typography color="primary.main" variant="subtitle2" /></Stack>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixWinterOA_RH"
                            label=""
                            onChange={(e: any) => {
                              setValueWithCheck1(e, 'txbMixWinterOA_RH');
                            }}
                            onBlur={handleMixWinterOA_RHChanged}
                          />
                        </Stack>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Stack><Typography color="primary.main" variant="subtitle2">RETURN AIR</Typography></Stack>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Typography color="primary.main" variant="subtitle2">Dry Bulb Temperature (F)</Typography>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixSummerRA_DB"
                            label=""
                            onChange={(e: any) => {
                              setValueWithCheck1(e, 'txbMixSummerRA_DB');
                            }}
                            onBlur={handleMixSummerRA_DBChanged}
                          />
                        </Stack>
                        <Stack><Typography color="primary.main" variant="subtitle2" /></Stack>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixWinterRA_DB"
                            label=""
                            onChange={(e: any) => {
                              setValueWithCheck1(e, 'txbMixWinterRA_DB');
                            }}
                            onBlur={handleMixWinterRA_DBChanged}
                          />
                        </Stack>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Typography color="primary.main" variant="subtitle2">Wet Bulb Temperature (F)</Typography>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixSummerRA_WB"
                            label=""
                            onChange={(e: any) => {
                              setValueWithCheck1(e, 'txbMixSummerRA_WB');
                            }}
                            onBlur={handleMixSummerRA_WBChanged}
                          />
                        </Stack>
                        <Stack><Typography color="primary.main" variant="subtitle2" /></Stack>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixWinterRA_WB"
                            label=""
                            onChange={(e: any) => {
                              setValueWithCheck1(e, 'txbMixWinterRA_WB');
                            }}
                            onBlur={handleMixWinterRA_WBChanged}
                          />
                        </Stack>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                      <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1, gridTemplateColumns: { xs: 'repeat(6, 1fr)' }, }}>
                        <Typography color="primary.main" variant="subtitle2">Relative Humidity (%)</Typography>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixSummerRA_RH"
                            label=""
                            onChange={(e: any) => {
                              setValueWithCheck1(e, 'txbMixSummerRA_RH');
                            }}
                            onBlur={handleMixSummerRA_RHChanged}
                          />
                        </Stack>
                        <Stack><Typography color="primary.main" variant="subtitle2" /></Stack>
                        <Stack>
                          <RHFTextField
                            disabled={getValues('ckbMixUseProjectDefault')}
                            size="small"
                            name="txbMixWinterRA_RH"
                            label=""
                            onChange={(e: any) => { setValueWithCheck1(e, 'txbMixWinterRA_RH'); }}
                            onBlur={handleMixWinterRA_RHChanged}
                          />
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
            </Accordion>
          </Stack>
        <Accordion  // PRE-HEAT
          expanded={expanded.panel2}
          sx={getDisplay(preheatCompInfo?.isVisible)}
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlPreheatComp"
                      label="Preheat"
                      sx={getDisplay(preheatCompInfo?.isVisible)}
                      onChange={ddlPreheatCompChanged}
                    >
                      {preheatCompInfo?.fdtPreheatComp?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlPreheatElecHeaterInstall"
                      label="Preheat Elec. Heater Installation"
                      placeholder=""
                      sx={getInlineDisplay(Number(formValues.ddlPreheatComp) === IDs.intCompIdElecHeater)}
                      onChange={(e: any) => setValue('ddlPreheatElecHeaterInstall', Number(e.target.value))}
                    >
                      {preheatElecHeaterInstallInfo?.fdtElecHeaterInstall?.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formValues.ddlPreheatComp) === IDs.intCompIdElecHeater) }}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Heater Electrical
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                <RHFSelect
                    native
                    size="small"
                    name="ddlPreheatElecHeaterVoltage"
                    label="Electric Heater Voltage"
                    placeholder=""
                    sx={getInlineDisplay(isVisibleDdlPreheatElecHeaterVoltage)}
                    disabled={!isEnabledDdlPreheatElecHeaterVoltage}
                    onChange={ddlPreheatElecHeaterVoltageChanged}
                  >
                    {preheatElecHeaterVoltageTable?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  <RHFCheckbox
                    label="Single Point Power Connection"
                    name="ckbPreheatElecHeaterVoltageSPP"
                    // checked={}
                    onChange={(e: any) => setValue('ckbPreheatElecHeaterVoltageSPP', Number(e.target.value))}
                    sx={getDisplay(voltageSPPIsVisible)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ ...getDisplay(formValues.ddlPreheatComp === IDs.intCompIdHWC) }}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Fluid Properties
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlPreheatFluidType"
                      label="Heating Fluid Type"
                    >
                      {preheatFluidTypeInfo?.fdtFluidType?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlPreheatFluidConcentration"
                      label="Heating Fluid %"
                    >
                      {preheatFluidConcenInfo?.fdtFluidConcen?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>

                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(Number(formCurrValues.ddlPreheatComp) === IDs.intCompIdHWC && internCompInfo?.isCustomCompVisible)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <></>
                  </Stack>
                  <Stack>
                  <RHFCheckbox
                      label="Use Fluid Outlet Temperature"
                      name="ckbPreheatHWCUseFluidLvgTemp"
                      // sx={getInlineDisplay(customInputs.divPreheatHWC_UseFlowRateVisible)}
                      // checked={ckbPreheatHWCUseFluidLvgTempValue}
                      // onChange={(e: any) =>setValue('ckbPreheatHWCUseFlowRate', Number(e.target.checked))}
                      onClick={ckbPreheatHWCUseFluidLvgTempChanged}
                    />
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      label="Use Fluid Flow Rate"
                      name="ckbPreheatHWCUseFluidFlowRate"
                      // sx={getInlineDisplay(customInputs.divPreheatHWC_UseFlowRateVisible)}
                      // checked={ckbPreheatHWCUseFluidFlowRateValue}
                      // defaultChecked={formValues.ckbValveAndActuator}
                      // onChange={(e: any) => setValue('ckbPreheatHWCUseFlowRate', Number(e.target.checked))}
                      onClick={ckbPreheatHWCUseFluidFlowRateChanged}
                    />
                  </Stack>           
                </Box>
              {/* </Grid>
              <Grid item xs={12} md={12} sx={{ ...getDisplay(formValues.ddlPreheatComp === IDs.intCompIdHWC) }}> */}
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                  <RHFTextField
                        size="small"
                        name="txbPreheatHWCFluidEntTemp"
                        label="Heating Fluid Ent Temp (F)"
                        // InputProps={{ inputProps: { min: 80, max: 180 } }}
                        onBlur={txbPreheatHWCFluidEntTempChanged}
                      />
                  </Stack>
                  <Stack>
                  <RHFTextField
                    size="small"
                    name="txbPreheatHWCFluidLvgTemp"
                    label="Heating Fluid Lvg Temp (F)"
                    InputProps={{ inputProps: { min: 40, max: 180 } }}
                    disabled={!isTxbPreheatHWCFluidLvgTempEnabled}
                    onBlur={txbPreheatHWCFluidLvgTempChanged}
                  />
                  </Stack>
                  <Stack>
                  <RHFTextField
                        size="small"
                        name="txbPreheatHWCFluidFlowRate"
                        label="Preheat HWC Flow Rate (GPM)"
                        InputProps={{ inputProps: { min: 0.1, max: 50 } }}
                        disabled={!isTxbPreheatHWCFluidFlowRateEnabled}
                        onBlur={txbPreheatHWCFluidFlowRateChanged}
                      />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(false)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    <RHFCheckbox
                      label="Preheat HWC Use Capacity"
                      name="ckbPreheatHWCUseCap"
                      // sx={getInlineDisplay(internCompInfo?.isCutomVisible)}
                      checked={formValues.ckbPreheatHWCUseCap}
                      onChange={(e: any) => setValue('ckbPreheatHWCUseCap', Number(e.target.checked))}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbPreheatHWCCap"
                      label="Preheat HWC Capacity (MBH)"
                      // sx={getDisplay(formValues.ddlPreheatCompId === IDs.intCompHWC_ID)}
                      // disabled={preheatHWCCapInfo.isDisabled}
                      // value={preheatHWCUseCapInfo.resetCapacity}
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbPreheatHWCCap');
                      }}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(Number(formValues.ddlPreheatComp) === IDs.intCompIdAuto ||
                               Number(formValues.ddlPreheatComp) === IDs.intCompIdElecHeater || 
                               Number(formValues.ddlPreheatComp) === IDs.intCompIdHWC)}
              >
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
              Air Properties
            </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbWinterPreheatSetpointDB"
                      label="Preheat LAT Setpoint DB (F):"
                      disabled={!isTxbPreheatSetpointEnabled}
                      sx={getDisplay(isPreheatSetpointVisible)}
                      // onBlur={(e: any) => { setValueWithCheck1(e, 'txbWinterPreheatSetpointDB'); }}
                      onBlur={txbWinterPreheatSetpointDBChanged}
                    /> 
                  </Stack>
                  <Stack>
                  <RHFCheckbox
                  label="Auto Size Pre-heat"
                  name="ckbPreheatAutoSize"
                  // sx={getDisplay(valveAndActuatorInfo.isVisible)}
                  // defaultChecked={Number(formValues.ddlPreheatComp) === IDs.intCompIdElecHeater}
                  // onChange={() => setCkbValveAndActuatorVal(!formValues.ckbValveAndActuatorVal)}
                  onChange={(e: any) => setValue('ckbPreheatAutoSize', Number(e.target.checked))}
                />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(Number(formValues.ddlPreheatComp) === IDs.intCompIdHWC)}              
              >
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
              Accessories
            </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                  <RHFCheckbox
                  label="Control Valve"
                  name="ckbPreheatHWCValveAndActuator"
                  // sx={getDisplay(valveAndActuatorInfo.isVisible)}
                  // defaultChecked={formValues.ckbValveAndActuator}
                  // onChange={() => setCkbValveAndActuatorVal(!formValues.ckbValveAndActuatorVal)}
                  onChange={(e: any) => setValue('ckbPreheatHWCValveAndActuator', Number(e.target.checked))}
                />
                  </Stack>
                  <Stack spacing={1}>
                <RHFSelect
                  native
                  size="small"
                  name="ddlPreheatHWCValveType"
                  label="Valve Type"
                  sx={getDisplay(isVisibleDdlPreheatHWCValveType)}
                  onChange={(e: any) => setValue('ddlPreheatHWCValveType', Number(e.target.value))}
                >
                  {preheatHWCValveTypeOptions?.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.items}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion  // COOLING
          expanded={expanded.panel3}
          sx={getDisplay(coolingCompInfo?.isVisible)}
          onChange={() => setExpanded({ ...expanded, panel3: !expanded.panel3 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              {Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX ? "DX - COOLING" : "COOLING"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlCoolingComp"
                      label="Cooling"
                      // sx={getDisplay(coolingCompInfo?.isVisible)}
                      onChange={ddlCoolingCompChanged}
                    >
                      {coolingCompInfo?.fdtCoolingComp?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      label="Dehumidification"
                      name="ckbDehumidification"
                      // sx={getDisplay(dehumInfo?.isVisible)}
                      sx={{ display: 'none' }}
                      // checked={dehumInfo?.isChecked}
                      // onChange={(e: any) => setCkbDehumidificationVal(e.target.checked)}
                      onChange={(e: any) => setValue('ckbDehumidification', Number(e.target.checked))}
                    />
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      label="Heat Pump"
                      name="ckbHeatPump"
                      // sx={{ display: heatPumpInfo?.isVisible ? 'block' : 'none' }}
                      sx={{ display: 'none' }}
                      // checked={heatPumpInfo?.isChecked}
                      // onChange={ckbHeatPumpChanged}
                      onChange={(e: any) => setValue('ckbHeatPump', Number(e.target.checked))}
                    />
                  </Stack>
                  <Stack>
                    { }
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={{ ...getDisplay(Number(formValues.ddlCoolingComp) === IDs.intCompIdCWC) }}>
                  <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                    Fluid Properties
                  </Typography>

                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    {isAvailable(db?.dbtSelFluidType) && (
                      <RHFSelect
                        native
                        size="small"
                        name="ddlCoolingFluidType"
                        label="Cooling Fluid Type"
                      >
                        {coolingFluidTypeInfo?.fdtFluidType?.map((item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        ))}
                      </RHFSelect>
                    )}
                  </Stack>
                  <Stack>
                    {isAvailable(db?.dbtSelFluidConcentration) && (
                      <RHFSelect
                        native
                        size="small"
                        name="ddlCoolingFluidConcentration"
                        label="Cooling Fluid %"
                      >
                        {coolingFluidConcenInfo?.fdtFluidConcen?.map((item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        ))}
                      </RHFSelect>
                    )}
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(Number(formCurrValues.ddlCoolingComp) === IDs.intCompIdCWC && internCompInfo?.isCustomCompVisible)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                   <> </>
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      label="Use Fluid Outlet Temperature"
                      name="ckbCoolingCWCUseFluidLvgTemp"
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      // checked={formValues.ckbCoolingCWCUseFlowRate}
                      // onChange={(e: any) => setValue('ckbCoolingCWCUseFluidLvgTemp', Number(e.target.checked)) }
                      onClick={ckbCoolingCWCUseFluidLvgTempChanged}
                    />
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      label="Use Fluid Flow Rate"
                      name="ckbCoolingCWCUseFluidFlowRate"
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      // checked={formValues.ckbCoolingCWCUseFluidFlowRate}
                      // onChange={(e: any) =>setValue('ckbCoolingCWCUseFlowRate', Number(e.target.checked)) }
                      onClick={ckbCoolingCWCUseFluidFlowRateChanged}
                    />
                  </Stack>

                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={{ ...getDisplay(Number(formValues.ddlCoolingComp) === IDs.intCompIdCWC) }}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbCoolingCWCFluidEntTemp"
                      label="Cooling Fluid Ent Temp (F)"
                      // InputProps={{ inputProps: { min: 20, max: 120 } }}
                      onBlur={txbCoolingCWCFluidEntTempChanged}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbCoolingCWCFluidLvgTemp"
                      label="Cooling Fluid Lvg Temp (F)"
                      // InputProps={{ inputProps: { min: 20, max: 120 } }}
                      disabled={!isTxbCoolingCWCFluidLvgTempEnabled}
                      onBlur={txbCoolingCWCFluidLvgTempChanged}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbCoolingCWCFluidFlowRate"
                      label="Cooling CWC Flow Rate (GPM)"
                      // InputProps={{ inputProps: { min: 0.1, max: 50 } }}
                      disabled={!isTxbCoolingCWCFluidFlowRateEnabled}
                      onBlur={txbCoolingCWCFluidFlowRateChanged}
                    />
                  </Stack>                
                  </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(false)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFCheckbox
                      label="Cooling CWC Use Capacity"
                      name="ckbCoolingCWCUseCap"
                      // sx={{...getInlineDisplay(customInputs.divCoolingCWC_UseCapVisible),margin: 0,}}
                      checked={formValues.ckbCoolingCWCUseCap}
                      onChange={(e: any) => setValue('ckbCoolingCWCUseCap', Number(e.target.checked))}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbCoolingCWCCap"
                      label="Cooling CWC Capacity (MBH)"
                      // disabled={coolingCWCCapInfo.isDisabled}
                      // sx={getDisplay(customInputs.divCoolingCWC_UseCapVisible)}
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbCoolingCWCCap');
                      }}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(Number(formCurrValues.ddlCoolingComp) === IDs.intCompIdDX)}>
                <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Refrigerant
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' },}}>
                  <Stack>
                  <RHFSelect
                        native
                        size="small"
                        name="ddlRefrigerant"
                        label="Refrigerant"
                        disabled
                      >
                          <option>
                            R-410a
                          </option>
                      </RHFSelect>
                  </Stack>
                  <Stack>                    
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      label="Daikin VRV"
                      name="ckbDaikinVRV"
                      checked
                      onChange={(e: any) => setValue('ckbDaikinVRV', Number(e.target.checked))}
                    />
                  </Stack>
                  <Stack>                
                  <RHFSelect
                    native
                    size="small"
                    name="ddlEKEXVKitInstallation"
                    label="EKEXV Valves and Controllers"
                    sx={getDisplay(ekexvKitInstallIsVisible)}
                    onChange={(e: any) => { setValue('ddlEKEXVKitInstallation', Number(e.target.value)); }}
                    placeholder=""
                    disabled
                  >
                    {ekexvKitInstallTable?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                  </Stack>
                  <Stack>{}</Stack>
                  </Box>
              </Grid>
              <Grid item xs={12} md={12}
              sx={getDisplay(Number(formCurrValues.ddlCoolingComp) === IDs.intCompIdDX)}>
              <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' },}}>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbRefrigSuctionTemp"
                      label="Suction Temp (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbRefrigSuctionTemp');
                      }}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbRefrigLiquidTemp"
                      label="Liquid Temp (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbRefrigLiquidTemp');
                      }}
                    />

                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbRefrigSuperheatTemp"
                      label="Superheat Temp (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbRefrigSuperheatTemp');
                      }}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={getDisplay(Number(formValues.ddlCoolingComp) === IDs.intCompIdCWC || Number(formValues.ddlCoolingComp) === IDs.intCompIdDX)}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                Air Properties
              </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbSummerCoolingSetpointDB"
                      label="Cooling LAT Setpoint (F):"
                      // autoComplete="off"
                      // InputProps={{ inputProps: { min: 45, max: 75 } }}
                      // onChange={(e: any) => { setValueWithCheck1(e, 'txbSummerCoolingSetpointDB'); }}
                      onBlur={txbSummerCoolingSetpointDBChanged}
                    />
                  </Stack>
                  <Stack                   
                    sx={getDisplay(false)}
                  >
                    <RHFTextField
                      size="small"
                      name="txbSummerCoolingSetpointWB"
                      label="Cooling LAT Setpoint WB (F):"
                      // autoComplete="off"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbSummerCoolingSetpointWB');
                      }}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(Number(formValues.ddlCoolingComp) === IDs.intCompIdCWC)}
              >
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
              Accessories
            </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                  <RHFCheckbox
                  label="Control Valve"
                  name="ckbCoolingCWCValveAndActuator"
                  // sx={getDisplay(valveAndActuatorInfo.isVisible)}
                  // defaultChecked={formValues.ckbValveAndActuator}
                  // onChange={() => setCkbValveAndActuatorVal(!formValues.ckbValveAndActuatorVal)}
                  onChange={(e: any) => setValue('ckbCoolingCWCValveAndActuator', Number(e.target.checked))}
                />
                  </Stack>
                  <Stack spacing={1}>
                <RHFSelect
                  native
                  size="small"
                  name="ddlCoolingCWCValveType"
                  label="Valve Type"
                  sx={getDisplay(isVisibleDdlCoolingCWCValveType)}
                  onChange={(e: any) => setValue('ddlCoolingCWCValveType', Number(e.target.value))}
                >
                  {coolingCWCValveTypeOptions?.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.items}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
                </Box>
              </Grid>

            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion  // DX - HEATPUMP
          expanded={expanded.panel3}
          sx={getDisplay(Number(formValues.ddlCoolingComp) === IDs.intCompIdDX && Number(formValues.ckbDaikinVRV) === 1)}
          onChange={() => setExpanded({ ...expanded, panel3: !expanded.panel3 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              DX - HEATING
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Refrigerant
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' },}}>
                  <Stack>
                  <RHFSelect
                        native
                        size="small"
                        name="ddlRefrigerant"
                        label="Refrigerant"
                        disabled
                      >
                          <option>
                            R-410a
                          </option>
                      </RHFSelect>
                  </Stack>
                  </Box>
              </Grid>
              <Grid item xs={12} md={12}
              sx={getDisplay(Number(formCurrValues.ddlCoolingComp) === IDs.intCompIdDX)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    <RHFTextField
                      size="small"
                      name="txbRefrigCondensingTemp"
                      label="Condensing Temp (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbRefrigCondensingTemp');
                      }}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbRefrigVaporTemp"
                      label="Vapor Temp (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbRefrigVaporTemp');
                      }}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbRefrigSubcoolingTemp"
                      label="Subcooling Temp (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbRefrigSubcoolingTemp');
                      }}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                Air Properties
              </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                  <RHFTextField
                      size="small"
                      name="txbWinterHeatingSetpointDB"
                      label="Heating LAT Setpoint DB (F):"
                      autoComplete="off"
                      sx={getDisplay(isHeatingSetpointVisible)}
                      onChange={(e: any) => { setValueWithCheck1(e, 'txbWinterHeatingSetpointDB'); }}
                    /> 

                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion  // HEATING
          expanded={expanded.panel4}
          // sx={getDisplay(isHeatingSectionVisible)}
          onChange={() => setExpanded({ ...expanded, panel4: !expanded.panel4 })}
          sx={getDisplay(heatingCompInfo?.isVisible)}
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
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlHeatingComp"
                      label="Heating"
                      disabled={!heatingCompInfo.isEnabled}
                      // sx={getDisplay(heatingCompInfo?.isVisible)}
                    // onChange={ddlHeatingCompChanged}
                    >
                      {heatingCompInfo?.fdtHeatingComp?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                    </Stack>
                    <Stack>
                    <RHFSelect
                    native
                    label="Heating Elec. Heater Installation"
                    name="ddlHeatingElecHeaterInstall"
                    size="small"
                    placeholder=""
                    sx={{ ...getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdElecHeater), }}

                  // onChange={(e: any) => setValue('ddlHeatingElecHeaterInstall', Number(e.target.value)) }
                  >
                    {heatingElecHeaterInstallInfo?.fdtElecHeaterInstall?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  </Stack>
                </Box>
              </Grid>
              {/* <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdElecHeater), }}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(4, 1fr)' }, }}>

                </Box>
              </Grid> */}
              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdElecHeater) }}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Heater Electrical
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingElecHeaterVoltage"
                    label="Electric Heater Voltage"
                    placeholder=""
                    sx={getInlineDisplay(isVisibleDdlHeatingElecHeaterVoltage)}
                    disabled={!isEnabledDdlHeatingElecHeaterVoltage}
                    onChange={ddlHeatingElecHeaterVoltageChanged}
                  >
                    {heatingElecHeaterVoltageTable?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  <RHFCheckbox
                    label="Single Point Power Connection"
                    name="ckbHeatingElecHeaterVoltageSPP"
                    // checked={}
                    onChange={(e: any) => setValue('ckbHeatingElecHeaterVoltageSPP', Number(e.target.value))}
                    // onChange={ckbHeatingElecHeaterVoltageSPPChanged}

                    sx={getDisplay(voltageSPPIsVisible)}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC) }}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Fluid Properties
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlHeatingFluidType"
                      label="Heating Fluid Type"
                    >
                      {heatingFluidTypeInfo?.fdtFluidType?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlHeatingFluidConcentration"
                      label="Heating Fluid %"
                    >
                      {heatingFluidConcenInfo?.fdtFluidConcen?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC && internCompInfo?.isCustomCompVisible)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                      <></>
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      label="Use Fluid Outlet Temp"
                      name="ckbHeatingHWCUseFluidLvgTemp"
                      // checked={formValues.ckbHeatingHWCUseFlowRate}
                      // onChange={(e: any) => setValue('ckbHeatingHWCUseFluidLvgTemp', Number(e.target.checked))}
                      onClick={ckbHeatingHWCUseFluidLvgTempChanged}
                    />
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      label="Use Fluid Flow Rate"
                      name="ckbHeatingHWCUseFluidFlowRate"
                      // checked={formValues.ckbHeatingHWCUseFluidFlowRate}
                      // onChange={(e: any) => setValue('ckbHeatingHWCUseFlowRate', Number(e.target.checked))}
                      onClick={ckbHeatingHWCUseFluidFlowRateChanged}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formValues.ddlHeatingComp) === IDs.intCompIdHWC) }}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbHeatingHWCFluidEntTemp"
                      label="Heating Fluid Ent Temp (F)"
                      // InputProps={{ inputProps: { min: 80, max: 180 } }}
                      onBlur={txbHeatingHWCFluidEntTempChanged}
                      />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbHeatingHWCFluidLvgTemp"
                      label="Heating Fluid Lvg Temp (F)"
                      // InputProps={{ inputProps: { min: 40, max: 180 } }}
                      disabled={!isTxbHeatingHWCFluidLvgTempEnabled}
                      onBlur={txbHeatingHWCFluidLvgTempChanged}
                      />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbHeatingHWCFluidFlowRate"
                      label="Heating HWC Flow Rate (GPM)"
                      InputProps={{ inputProps: { min: 0.1, max: 50 } }}
                      disabled={!isTxbHeatingHWCFluidFlowRateEnabled}
                      // sx={getDisplay(customInputs.divHeatingHWC_UseFlowRateVisible)}
                      onBlur={txbHeatingHWCFluidFlowRateChanged}
                    />
                  </Stack>                
                  </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(false)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      label="Heating HWC Use Capacity"
                      name="ckbHeatingHWCUseCap"
                      checked={formCurrValues.ckbHeatingHWCUseCap}
                      onChange={(e: any) => setValue('ckbHeatingHWCUseCap', Number(e.target.checked))}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbHeatingHWCCap"
                      label="Heating HWC Capacity (MBH)"
                      // sx={getDisplay(customInputs.divHeatingHWC_UseCapVisible)}
                      // disabled={heatingHWCCapInfo.isDisabled}
                      onChange={(e: any) => { setValueWithCheck1(e, 'txbHeatingHWCCap'); }}
                    />
                  </Stack>
                  {/* <Stack>
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      label="Heating HWC Use Flow Rate"
                      name="ckbHeatingHWCUseFlowRate"
                      checked={formValues.ckbHeatingHWCUseFluidFlowRate}
                      onChange={(e: any) => setValue('ckbHeatingHWCUseFluidFlowRate', Number(e.target.checked))}
                    />
                  </Stack> */}

                </Box>
              </Grid>
              <Grid item xs={12} md={12}                
                sx={getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdElecHeater || 
                               Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC)}
              >
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
              Air Properties
            </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                  <RHFTextField
                      size="small"
                      name="txbWinterHeatingSetpointDB"
                      label="Heating LAT Setpoint DB (F):"
                      autoComplete="off"
                      sx={getDisplay(isHeatingSetpointVisible)}
                      onChange={(e: any) => { setValueWithCheck1(e, 'txbWinterHeatingSetpointDB'); }}
                    /> 
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}                
                sx={getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC)}
              >
                <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                Accessories
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                  <RHFCheckbox
                  label="Control Valve"
                  name="ckbHeatingHWCValveAndActuator"
                  // sx={getDisplay(valveAndActuatorInfo.divValveAndActuatorVisible)}
                  // defaultChecked={formValues.ckbValveAndActuator}
                  // onChange={() => setCkbValveAndActuatorVal(!formValues.ckbValveAndActuatorVal)}
                  onChange={(e: any) => setValue('ckbHeatingHWCValveAndActuator', Number(e.target.checked))}
                />
                  </Stack>

                <Stack spacing={1}>
                <RHFSelect
                  native
                  size="small"
                  name="ddlHeatingHWCValveType"
                  label="Valve Type"
                  sx={getDisplay(isVisibleDdlHeatingHWCValveType)}
                  onChange={(e: any) => setValue('ddlHeatingHWCValveType', Number(e.target.value))}
                >
                  {heatingHWCValveTypeOptions?.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.items}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>

                </Box>
              </Grid>

            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion  // REHEAT
          sx={getDisplay(reheatCompInfo?.isVisible)}
          expanded={expanded.panel5}
          onChange={() => setExpanded({ ...expanded, panel5: !expanded.panel5 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              REHEAT - DEHUMIDIFICATION
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlReheatComp"
                      label="Reheat"
                      placeholder=""
                    // sx={getDisplay(reheatCompInfo?.isVisible)}
                    // onChange={ddlReheatCompChanged}
                    >
                      {reheatCompInfo?.fdtReheatComp?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack>
                  <RHFSelect
                      native
                      size="small"
                      name="ddlReheatElecHeaterInstall"
                      label="Reheat Elec. Heater Installation"
                      // onChange={(e: any) => setValue('ddlReheatElecHeaterInstall', Number(e.target.value))}

                      placeholder=""
                      sx={getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdElecHeater)}
                    >
                      {heatingElecHeaterInstallInfo?.fdtElecHeaterInstall?.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  </Stack>
                </Box>
              </Grid>
              {/* <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdElecHeater) }}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(4, 1fr)' }, }}>
                  <Stack spacing={1}>
                  </Stack>
                </Box>
              </Grid> */}
              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdElecHeater) }}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Heater Electrical
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                <RHFSelect
                    native
                    size="small"
                    name="ddlReheatElecHeaterVoltage"
                    label="Electric Heater Voltage"
                    placeholder=""
                    sx={getInlineDisplay(isVisibleDdlReheatElecHeaterVoltage)}
                    disabled={!isEnabledDdlReheatElecHeaterVoltage}
                    onChange={ddlReheatElecHeaterVoltageChanged}
                  >
                    {reheatElecHeaterVoltageTable?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  <RHFCheckbox
                    label="Single Point Power Connection"
                    name="ckbReheatElecHeaterVoltageSPP"
                    // checked={}
                    onChange={(e: any) => setValue('ckbReheatElecHeaterVoltageSPP', Number(e.target.value))}
                    // onChange={ckbReheatElecHeaterVoltageSPPChanged}
                    sx={getDisplay(voltageSPPIsVisible)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdHWC) }}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Fluid Properties
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlReheatFluidType"
                      label="Reheat Fluid Type"
                    >
                      {reheatFluidTypeInfo?.fdtFluidType?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlReheatFluidConcentration"
                      label="Reheat Fluid %"
                    >
                      {reheatFluidConcenInfo?.fdtFluidConcen?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(Number(formCurrValues.ddlReheatComp) === IDs.intCompIdHWC && internCompInfo?.isCustomCompVisible)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <></>
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      label="Use Fluid Outlet Temperature"
                      name="ckbReheatHWCUseFluidLvgTemp"
                      // sx={getInlineDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                      // checked={formValues.ckbReheatHWCUseFlowRate}
                      // onChange={(e: any) =>setValue('ckbReheatHWCUseFlowRate', Number(e.target.checked))}
                      onClick={ckbReheatHWCUseFluidLvgTempChanged}
                    />
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      label="Use Fluid Flow Rate"
                      name="ckbReheatHWCUseFluidFlowRate"
                      // sx={getInlineDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                      // checked={formValues.ckbReheatHWCUseFlowRate}
                      // onChange={(e: any) => setValue('ckbReheatHWCUseFlowRate', Number(e.target.checked))}
                      onClick={ckbReheatHWCUseFluidFlowRateChanged}
                    />
                  </Stack>

                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdHWC) }}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbReheatHWCFluidEntTemp"
                      label="Reheat Fluid Ent Temp (F)"
                      // InputProps={{ inputProps: { min: 80, max: 180 } }}
                      onBlur={txbReheatHWCFluidEntTempChanged}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbReheatHWCFluidLvgTemp"
                      label="Reheat Fluid Lvg Temp (F)"
                      // InputProps={{ inputProps: { min: 40, max: 180 } }}
                      disabled={!isTxbReheatHWCFluidLvgTempEnabled}
                      onBlur={txbReheatHWCFluidLvgTempChanged}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbReheatHWCFluidFlowRate"
                      label="Reheat HWC Flow Rate (GPM)"
                      // InputProps={{ inputProps: { min: 0.1, max: 50 } }}
                      // sx={getDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                      disabled={!isTxbReheatHWCFluidFlowRateEnabled}
                      onBlur={txbReheatHWCFluidFlowRateChanged}
                    />
                  </Stack>                
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(false)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    <RHFCheckbox
                      label="Reheat HWC Use Capacity"
                      name="ckbReheatHWCUseCap"
                      // sx={getInlineDisplay(customInputs.divReheatHWC_UseCapVisible)}
                      checked={formValues.ckbReheatHWCUseCap}
                      onChange={(e: any) => setValue('ckbReheatHWCUseCap', Number(e.target.checked))}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbReheatHWCCap"
                      label="Reheat HWC Capacity (MBH)"
                      // sx={getDisplay(customInputs.divReheatHWC_UseCapVisible)}
                      // disabled={reheatHWCCapInfo.isDisabled}
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbReheatHWCCap');
                      }}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdHGRH) }}>
                <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Refrigerant
                </Typography>

                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    <RHFTextField
                      size="small"
                      name="txbRefrigCondensingTemp"
                      label="Condensing Temp (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbRefrigCondensingTemp');
                      }}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbRefrigVaporTemp"
                      label="Condensing Temp (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbRefrigVaporTemp');
                      }}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbRefrigSubcoolingTemp"
                      label="Subcooling Temp (F)"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbRefrigSubcoolingTemp');
                      }}
                    />
                  </Stack>
                  <Stack sx={ {display:"none"} }>
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
              </Grid>
              <Grid item xs={12} md={12}                
                sx={getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdElecHeater ||
                               Number(formValues.ddlReheatComp) === IDs.intCompIdHWC ||
                              Number(formValues.ddlReheatComp) === IDs.intCompIdHGRH)}
>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Air Properties
                </Typography>
                <Box sx={{display: 'grid', rowGap: 3, columnGap: 3,  gridTemplateColumns: { xs: 'repeat(3, 1fr)' },}}>
                  <Stack spacing={1}>
                    <RHFTextField
                      size="small"
                      name="txbSummerReheatSetpointDB"
                      label="Dehum. Reheat Setpoint DB (F):"
                      autoComplete="off"
                      onChange={(e: any) => {
                        setValueWithCheck1(e, 'txbSummerReheatSetpointDB');
                      }}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdHWC)}
              >
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
              Accessories
            </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                  <RHFCheckbox
                  label="Control Valve"
                  name="ckbReheatHWCValveAndActuator"
                  // sx={getDisplay(valveAndActuatorInfo.isVisible)}
                  defaultChecked={formValues.ckbReheatHWCValveAndActuator}
                  // onChange={() => setCkbValveAndActuatorVal(!formValues.ckbValveAndActuatorVal)}
                  onChange={(e: any) => setValue('ckbReheatHWCValveAndActuator', Number(e.target.checked))}
                />
                  </Stack>
                  <Stack spacing={1}>
                <RHFSelect
                  native
                  size="small"
                  name="ddlReheatHWCValveType"
                  label="Valve Type"
                  sx={getDisplay(isVisibleDdlReheatHWCValveType)}
                  onChange={(e: any) => setValue('ddlReheatHWCValveType', Number(e.target.value))}
                >
                  {reheatHWCValveTypeOptions?.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.items}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion  // HEATING AS BACKUP HEATING - SHOW IN THIS ORDER WHEN COOLING DX AND HEAT PUMP SELECTED
          expanded={expanded.panel4}
          // sx={getDisplay(isHeatingSectionVisible)}
          onChange={() => setExpanded({ ...expanded, panel4: !expanded.panel4 })}
          sx={getDisplay(Number(formCurrValues.ddlCoolingComp) === IDs.intCompIdDX &&
                         Number(formCurrValues.ckbDaikinVRV) === 1 && 
                         intProductTypeID !== IDs.intProdTypeIdTerra)}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              BACKUP HEATING
            </Typography>
          </AccordionSummary>
            <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlHeatingComp"
                      label="Heating"
                      disabled={!heatingCompInfo.isEnabled}
                      // sx={getDisplay(heatingCompInfo?.isVisible)}
                    // onChange={ddlHeatingCompChanged}
                    >
                      {heatingCompInfo?.fdtHeatingComp?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                    </Stack>
                    <Stack>
                    <RHFSelect
                    native
                    label="Heating Elec. Heater Installation"
                    name="ddlHeatingElecHeaterInstall"
                    size="small"
                    placeholder=""
                    sx={{ ...getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdElecHeater), }}

                  // onChange={(e: any) => setValue('ddlHeatingElecHeaterInstall', Number(e.target.value)) }
                  >
                    {heatingElecHeaterInstallInfo?.fdtElecHeaterInstall?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  </Stack>
                </Box>
              </Grid>
              {/* <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formValues.ddlHeatingComp) === IDs.intCompIdElecHeater), }}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(4, 1fr)' }, }}>

                </Box>
              </Grid> */}
              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdElecHeater) }}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Heater Electrical
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingElecHeaterVoltage"
                    label="Electric Heater Voltage"
                    placeholder=""
                    sx={getInlineDisplay(isVisibleDdlHeatingElecHeaterVoltage)}
                    disabled={!isEnabledDdlHeatingElecHeaterVoltage}
                    onChange={ddlHeatingElecHeaterVoltageChanged}
                  >
                    {heatingElecHeaterVoltageTable?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  <RHFCheckbox
                    label="Single Point Power Connection"
                    name="ckbHeatingElecHeaterVoltageSPP"
                    // checked={}
                    onChange={(e: any) => setValue('ckbHeatingElecHeaterVoltageSPP', Number(e.target.value))}
                    // onChange={ckbHeatingElecHeaterVoltageSPPChanged}

                    sx={getDisplay(voltageSPPIsVisible)}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC) }}>
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                  Fluid Properties
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlHeatingFluidType"
                      label="Heating Fluid Type"
                    >
                      {heatingFluidTypeInfo?.fdtFluidType?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                  <Stack>
                    <RHFSelect
                      native
                      size="small"
                      name="ddlHeatingFluidConcentration"
                      label="Heating Fluid %"
                    >
                      {heatingFluidConcenInfo?.fdtFluidConcen?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC && internCompInfo?.isCustomCompVisible)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                      <></>
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      label="Use Fluid Outlet Temp"
                      name="ckbHeatingHWCUseFluidLvgTemp"
                      // checked={formValues.ckbHeatingHWCUseFlowRate}
                      // onChange={(e: any) => setValue('ckbHeatingHWCUseFluidLvgTemp', Number(e.target.checked))}
                      onClick={ckbHeatingHWCUseFluidLvgTempChanged}
                    />
                  </Stack>
                  <Stack>
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      label="Use Fluid Flow Rate"
                      name="ckbHeatingHWCUseFluidFlowRate"
                      // checked={formValues.ckbHeatingHWCUseFluidFlowRate}
                      // onChange={(e: any) => setValue('ckbHeatingHWCUseFlowRate', Number(e.target.checked))}
                      onClick={ckbHeatingHWCUseFluidFlowRateChanged}
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} sx={{ ...getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC) }}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbHeatingHWCFluidEntTemp"
                      label="Heating Fluid Ent Temp (F)"
                      // InputProps={{ inputProps: { min: 80, max: 180 } }}
                      onBlur={txbHeatingHWCFluidEntTempChanged}
                      />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbHeatingHWCFluidLvgTemp"
                      label="Heating Fluid Lvg Temp (F)"
                      // InputProps={{ inputProps: { min: 40, max: 180 } }}
                      disabled={!isTxbHeatingHWCFluidLvgTempEnabled}
                      onBlur={txbHeatingHWCFluidLvgTempChanged}
                      />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbHeatingHWCFluidFlowRate"
                      label="Heating HWC Flow Rate (GPM)"
                      InputProps={{ inputProps: { min: 0.1, max: 50 } }}
                      disabled={!isTxbHeatingHWCFluidFlowRateEnabled}
                      // sx={getDisplay(customInputs.divHeatingHWC_UseFlowRateVisible)}
                      onBlur={txbHeatingHWCFluidFlowRateChanged}
                    />
                  </Stack>                
                  </Box>
              </Grid>
              <Grid item xs={12} md={12}
                sx={getDisplay(false)}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack spacing={1}>
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      label="Heating HWC Use Capacity"
                      name="ckbHeatingHWCUseCap"
                      checked={formCurrValues.ckbHeatingHWCUseCap}
                      onChange={(e: any) => setValue('ckbHeatingHWCUseCap', Number(e.target.checked))}
                    />
                  </Stack>
                  <Stack>
                    <RHFTextField
                      size="small"
                      name="txbHeatingHWCCap"
                      label="Heating HWC Capacity (MBH)"
                      // sx={getDisplay(customInputs.divHeatingHWC_UseCapVisible)}
                      // disabled={heatingHWCCapInfo.isDisabled}
                      onChange={(e: any) => { setValueWithCheck1(e, 'txbHeatingHWCCap'); }}
                    />
                  </Stack>
                  {/* <Stack>
                    <RHFCheckbox
                      // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                      label="Heating HWC Use Flow Rate"
                      name="ckbHeatingHWCUseFlowRate"
                      checked={formCurrValues.ckbHeatingHWCUseFluidFlowRate}
                      onChange={(e: any) => setValue('ckbHeatingHWCUseFluidFlowRate', Number(e.target.checked))}
                    />
                  </Stack> */}

                </Box>
              </Grid>
              <Grid item xs={12} md={12}                
                sx={getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdElecHeater || 
                               Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC)}
              >
              <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
              Air Properties
            </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                  <RHFTextField
                      size="small"
                      name="txbWinterHeatingSetpointDB"
                      label="Heating LAT Setpoint DB (F):"
                      autoComplete="off"
                      sx={getDisplay(isHeatingSetpointVisible)}
                      onChange={(e: any) => { setValueWithCheck1(e, 'txbWinterHeatingSetpointDB'); }}
                    /> 
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}                
                sx={getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC)}
              >
                <Typography  color="primary.main" bgcolor="" variant="subtitle2" marginBottom="10px">
                Accessories
                </Typography>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
                  <Stack>
                  <RHFCheckbox
                  label="Control Valve"
                  name="ckbHeatingHWCValveAndActuator"
                  // sx={getDisplay(valveAndActuatorInfo.divValveAndActuatorVisible)}
                  defaultChecked={formCurrValues.ckbHeatingHWCValveAndActuator}
                  // onChange={() => setCkbValveAndActuatorVal(!formValues.ckbValveAndActuatorVal)}
                  onChange={(e: any) => setValue('ckbHeatingHWCValveAndActuator', Number(e.target.checked))}
                />
                  </Stack>

                <Stack spacing={1}>
                <RHFSelect
                  native
                  size="small"
                  name="ddlHeatingHWCValveType"
                  label="Valve Type"
                  sx={getDisplay(valveTypeInfo?.isVisible)}
                  onChange={(e: any) => setValue('ddlHeatingHWCValveType', Number(e.target.value))}
                >
                  {valveTypeInfo?.fdtValveType?.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.items}
                    </option>
                  ))}
                </RHFSelect>
              </Stack>

                </Box>
              </Grid>

            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion  // BACKUP HEATING
          expanded={expanded.panel2}
          sx={getDisplay(intProductTypeID === IDs.intProdTypeIdTerra)}
          onChange={() => setExpanded({ ...expanded, panel2: !expanded.panel2 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              BACKUP HEATING
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <Box
                  sx={{
                    display: 'grid',
                    rowGap: 3,
                    columnGap: 3,
                    gridTemplateColumns: { xs: 'repeat(3, 1fr)' },
                  }}
                >
                  <Stack spacing={1}>
                    <RHFCheckbox
                      label="Backup Heating"
                      name="ckbBackupHeating"
                      sx={getInlineDisplay(
                        intProductTypeID === IDs.intProdTypeIdTerra &&
                        (formValues.ddlPreheatComp === IDs.intCompIdAuto ||
                          formValues.ddlPreheatComp === IDs.intCompIdElecHeater)
                      )}
                      // checked={formValues.ckbHeatPump}
                      // onChange={ckbHeatPumpChanged}
                      onChange={(e: any) => setValue('ckbBackupHeating', Number(e.target.checked))}
                    />
                    <RHFTextField
                      size="small"
                      name="txbBackupHeatingSetpointDB"
                      label="Backup Heating Setpoint DB (F):"
                      autoComplete="off"
                      sx={getDisplay(formCurrValues.ckbBackupHeating)}
                      onChange={(e: any) => { setValueWithCheck1(e, 'txbBackupHeatingSetpointDB'); }}
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        <Accordion  // CONTROLS
          expanded={expanded.panel1}
          onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="il:arrow-down" />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography color="primary.main" variant="h6">
              CONTROLS
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={5}>
              <Grid item xs={12} md={12}>
              <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(3, 1fr)' }, }}>
              <RHFSelect
                    native
                    size="small"
                    name="ddlTempControl"
                    label="Temperature Control"
                    placeholder=""
                    // sx={getDisplay(controlsPrefInfo?.isVisible)}
                    disabled
                    onChange={(e: any) => { setValue('ddlTempControl', Number(e.target.value)); }}
                  >                    
                    {/* {controlsPrefInfo?.fdtControlsPref?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))} */}
                    <option>TBA</option>
                  </RHFSelect>

                  <RHFSelect
                    native
                    size="small"
                    name="ddlControlsPref"
                    label="Fan Control"
                    placeholder=""
                    // sx={getDisplay(controlsPrefInfo?.isVisible)}
                    onChange={(e: any) => { setValue('ddlControlsPref', Number(e.target.value)); }}
                  >                    
                    {controlsPrefInfo?.fdtControlsPref?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlControlVia"
                    label="Control Via"
                    placeholder=""
                    sx={getDisplay(controlViaInfo?.isVisible)}
                    onChange={(e: any) => { setValue('ddlControlVia', Number(e.target.value)); }}
                  >
                    {controlViaInfo?.fdtControlVia?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3 }}>
                  { }
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion  // ACCESSORIES
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
                gridTemplateColumns: { xs: 'repeat(3, 1fr)' },
              }}
            >
              <Stack spacing={1}>
                <RHFSelect
                  native
                  size="small"
                  name="ddlDamperAndActuator"
                  label="Dampers & Actuator"
                  sx={getDisplay(damperActuatorInfo?.isVisible)}
                  onChange={ddlDamperAndActuatorChanged}
                  placeholder=""
                >
                  {damperActuatorInfo?.fdtDamperActuator?.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.items}
                    </option>
                  ))}
                </RHFSelect>
                {/* {isAvailable(elecHeaterVoltageInfo.ddlElecHeaterVoltageDataTbl) && ( */}
                {/* )} */}
                {/* <FormControlLabel
                  sx={getDisplay(valveAndActuatorInfo.divValveAndActuatorVisible)}
                  control={ */}
                {/* }
                  label="Include Valves & Actuator"
                /> */}
                {/* <FormControlLabel
                  sx={getInlineDisplay(drainPanInfo.divDrainPanVisible)}
                  control={ */}
                <RHFCheckbox
                  label="Drain Pan Required"
                  name="ckbDrainPan"
                  sx={getInlineDisplay(drainPanInfo?.isVisible)}
                  disabled
                  // checked={formValues.ckbDrainPan}
                  // onChange={() => setCkbDrainPanVal(!formValues.ckbDrainPanVal)}
                  onChange={(e: any) => setValue('ckbDrainPan', Number(e.target.checked))}
                />
                {/* }
                  label="Drain Pan Required"
                /> */}
              </Stack>
              <Stack spacing={1}>
                <></>
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion  // LAYOUT
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
              <Grid item xs={2} md={2}>
                <Stack spacing={3}>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHanding"
                    label="Unit Handing"
                    placeholder=""
                    value={getValues('ddlHanding')}
                    onChange={ddlHandingChanged}
                  >
                    {handingInfo?.fdtHanding?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlPreheatCoilHanding"
                    label="Preheat Coil Handing"
                    sx={getDisplay(isVisibleDdlPreheatCoilHanding)}
                    onChange={(e: any) => setValue('ddlPreheatCoilHanding', Number(e.target.value))}
                  >
                    {db?.dbtSelHanding?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCoolingCoilHanding"
                    label="Cooling Coil Handing"
                    sx={getDisplay(isVisibleDdlCoolingCoilHanding)}
                    onChange={(e: any) => setValue('ddlCoolingCoilHanding', Number(e.target.value))}
                  >
                    {db?.dbtSelHanding?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingCoilHanding"
                    label="Heating Coil Handing"
                    sx={getDisplay(isVisibleDdlHeatingCoilHanding)}
                    onChange={ddlHeatingCoilHandingChanged}
                  >
                    {db?.dbtSelHanding?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlReheatCoilHanding"
                    label="Reheat Coil Handing"
                    sx={getDisplay(isVisibleDdlReheatCoilHanding)}
                    onChange={ddlReheatCoilHandingChanged}
                  >
                    {db?.dbtSelHanding?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                </Stack>{' '}
              </Grid>
              <Grid item xs={2} md={2}>
                <Stack spacing={3}>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlSupplyAirOpening"
                    label="Supply Air Opening"
                    placeholder=""
                    sx={getDisplay(isVisibleDdlSupplyAirOpeningVisible)}
                    onChange={ddlSupplyAirOpeningChanged}
                  >
                    {supplyAirOpeningInfo?.fdtSupplyAirOpening?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlExhaustAirOpening"
                    label="Exhaust Air Opening"
                    sx={getDisplay(isVisibleDdlExhaustAirOpeningVisible)}
                    placeholder=""
                    onChange={ddlExhaustAirOpeningChanged}
                  >
                    {remainingOpeningsInfo?.fdtExhaustAirOpening?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlOutdoorAirOpening"
                    label="Outdoor Air Opening"
                    placeholder=""
                    sx={getDisplay(isVisibleDdlOutdoorAirOpeningVisible)}
                    onChange={ddlOutdoorAirOpeningChanged}
                  >
                    {remainingOpeningsInfo?.fdtOutdoorAirOpening?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlReturnAirOpening"
                    label="Return Air Opening"
                    sx={getDisplay(isVisibleDdlReturnAirOpeningVisible)}
                    placeholder=""
                    onChange={ddlReturnAirOpeningChanged}
                  >
                    {remainingOpeningsInfo?.fdtReturnAirOpening?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  </Stack>
                  <Stack spacing={3}>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlMixOADamperPos"
                    label="Mixing Outdoor Air Damper"
                    sx={getDisplay(getValues('ckbMixingBox'))}
                    placeholder=""
                  onChange={ddlMixOADamperPosChanged}
                  >
                    {mixOADamperPosInfo?.ftdMixOADamperPos?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                  <RHFSelect
                    native
                    size="small"
                    name="ddlMixRADamperPos"
                    label="Mixing Return Air Damper"
                    sx={getDisplay(getValues('ckbMixingBox'))}
                    placeholder=""
                  onChange={ddlMixRADamperPosChanged}
                  >
                    {mixRADamperPosInfo?.ftdMixRADamperPos?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                </Stack>
              </Grid>
              <Grid item xs={2} md={2}>
                <></>
              </Grid>
              <Grid item xs={6} md={6}>
                {/* <RHFUpload
                  name="layoutImage"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  /> */}
                <Box sx={{ padding: '0px', width:'600px', alignItems:'center' }}>                        
                  <Image
                    src={imgLayoutPathAndFile }
                    // height="100%" 
                    // width={100}
                    // width={75}
                    // sizes="(width: 76px) 100vw, 33vw"
                  />
                </Box>
              </Grid>  
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion  // CONFIGURATION NOTES
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
              <RHFTextField label="Take a note..." variant="standard" fullWidth name="txbConfigNotes" defaultValue="" />
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Stack direction="row" justifyContent="center" textAlign="center">
          {/* <Box sx={{ width: '150px' }}> */}
          {/* <LoadingButton
              ref={submitButtonRef}
              type="submit"
              variant="contained"
              onClick={() => console.log(getValues())}
              loading={isSubmitting}
              disabled={isSavedUnit && !edit}
              sx={{ visibility: 'hidden' }}
            >
              {edit ? 'Update Unit' : 'Add New Unit'}
            </LoadingButton> */}



          {/* {(Number(isNewUnitSelected) === 1 && Number(unitId) === 0) ? ( */}
          {(Number(unitId) === 0) ? (
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={onSubmit}
              sx={{ width:'10%'}}            
              // disabled={validateContinue()}
            // loading={isSaving}
            >
              Add Unit
            </LoadingButton>
          ) : (
            <>
              {(Number(unitId) > 0) ? (
                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={onSubmit}
                  // fullWidth
                  sx={{width:'10%'}}            
                  // disabled={validateContinue()}
                // loading={isSaving}
                >
                  Update Unit
                </LoadingButton>
              ) : (
                <>
                  {/* {(Number(unitId) > 0 && !isLoading) ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={onClickUnitInfo}
                      // sx={{ display: currentStep === 2 && !isProcessingData ? 'inline-flex' : 'none' }}
                      sx={{ width:'10%'}}            
                      startIcon={<Iconify icon="akar-icons:arrow-left" />}
                    >
                      Unit info
                    </Button>
                  ) : (
                    null
                  )} */}
                </>
              )}
            </>
          )}
          {/* </Box> */}
        </Stack>
      </Stack>
    </FormProvider>
    <Snackbar
          open={isTagValue}
          autoHideDuration={3000}
          onClose={() => setIsTagValue(false)}
        >
          <Alert
            onClose={() => setIsTagValue(false)}
            severity="error"
            sx={{ width: '100%' }}
          >
            Tag field is required
          </Alert>
        </Snackbar>
    </>
    // </>
  );
}
