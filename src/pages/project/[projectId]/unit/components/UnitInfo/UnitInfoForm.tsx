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
  Button
} from '@mui/material';
// hooks
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';

import { useForm } from 'react-hook-form';
import { unitEditFormSchema, useGetDefaultValue } from 'src/hooks/useUnit';
import { PATH_APP } from 'src/routes/paths';
import * as IDs from 'src/utils/ids';
import { useAuthContext } from 'src/auth/useAuthContext';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify';
import { RHFCheckbox, RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useApiContext } from 'src/contexts/ApiContext';
import { any, number } from 'prop-types';
import { flowRight, indexOf } from 'lodash';
// import { useGetAllUnits } from 'src/hooks/useApi';
// import Selection from '../Selection/Selection';

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
import { getUnitModelCodes } from './getUnitNoteCodes';
import { UnitTypeContext } from './unitTypeDataContext';

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
  const isNewUnitSelected = localStorage?.getItem('isNewUnitSelected') || 0;

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

  if (Number(unitTypeData?.intUnitTypeID) > 0)
  {
    intProductTypeID = unitTypeData?.intProductTypeID || 0;
    intUnitTypeID = unitTypeData?.intUnitTypeID || 0;
  }


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

    if (Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC) {
      heatingFluidTypeId = formCurrValues.ddlReheatFluidType;
      heatingFluidConcenId = formCurrValues.ddlReheatFluidConcentration;
      heatingFluidEntTemp = formCurrValues.txbReheatFluidEntTemp;
      heatingFluidLvgTemp = formCurrValues.txbReheatFluidLvgTemp;
    } else if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC) {
      heatingFluidTypeId = formCurrValues.ddlHeatingFluidType;
      heatingFluidConcenId = formCurrValues.ddlHeatingFluidConcentration;
      heatingFluidEntTemp = formCurrValues.txbHeatingFluidEntTemp;
      heatingFluidLvgTemp = formCurrValues.txbHeatingFluidLvgTemp;
    } else {
      heatingFluidTypeId = formCurrValues.ddlPreheatFluidType;
      heatingFluidConcenId = formCurrValues.ddlPreheatFluidConcentration;
      heatingFluidEntTemp = formCurrValues.txbPreheatFluidEntTemp;
      heatingFluidLvgTemp = formCurrValues.txbPreheatFluidLvgTemp;
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
        strTag: formCurrValues.txtTag,
        intQty: formCurrValues.txbQty,
        intUnitVoltageId: Number(formCurrValues.ddlUnitVoltage),
        intIsVoltageSPP: 0,
        intIsPHI: 0,
        intIsBypass: 0,
        intUnitModelId: Number(formCurrValues.ddlUnitModel),
        intSelectionTypeId: 0,
        intLocationId: Number(formCurrValues.ddlLocation),
        intIsDownshot: 0,
        intOrientationId: Number(formCurrValues.ddlOrientation),
        intControlsPreferenceId: Number(formCurrValues.ddlControlsPref),
        intControlViaId: Number(formCurrValues.ddlControlVia),
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
        dblSummerOutdoorAirDB: formCurrValues.txbSummerOutdoorAirDB,
        dblSummerOutdoorAirWB: formCurrValues.txbSummerOutdoorAirWB,
        dblSummerOutdoorAirRH: formCurrValues.txbSummerOutdoorAirRH,
        dblWinterOutdoorAirDB: formCurrValues.txbWinterOutdoorAirDB,
        dblWinterOutdoorAirWB: formCurrValues.txbWinterOutdoorAirWB,
        dblWinterOutdoorAirRH: formCurrValues.txbWinterOutdoorAirRH,
        dblSummerReturnAirDB: formCurrValues.txbSummerReturnAirDB,
        dblSummerReturnAirWB: formCurrValues.txbSummerReturnAirWB,
        dblSummerReturnAirRH: formCurrValues.txbSummerReturnAirRH,
        dblWinterReturnAirDB: formCurrValues.txbWinterReturnAirDB,
        dblWinterReturnAirWB: formCurrValues.txbWinterReturnAirWB,
        dblWinterReturnAirRH: formCurrValues.txbWinterReturnAirRH,
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
        intIsMixingBox: Number(formCurrValues.ckbMixingBox) === 1 ? 1 : 0,
        intPreheatCompId: Number(formCurrValues.ddlPreheatComp),
        intIsPreheatElecHeatBackupOnly: 0,
        intIsBackupHeating: Number(formCurrValues.ckbBackupHeating) === 1 ? 1 : 0,
        intHeatExchCompId: Number(formCurrValues.ddlHeatExchComp),
        intCoolingCompId: Number(formCurrValues.ddlCoolingComp),
        intHeatingCompId: Number(formCurrValues.ddlHeatingComp),
        intReheatCompId: Number(formCurrValues.ddlReheatComp),
        intIsHeatPump: Number(formCurrValues.ckbHeatPump) === 1 ? 1 : 0, // Do not use formValues.ckbHeatPumpVal === true
        intIsDehumidification: Number(formCurrValues.ckbDehumidification) === 1 ? 1 : 0, // Do not use formValues.ckbDehumidificationVal === true
        intElecHeaterVoltageId: Number(formCurrValues.ddlElecHeaterVoltage),
        intPreheatElecHeaterInstallationId: Number(formCurrValues.ddlPreheatElecHeaterInstall),
        intHeatingElecHeaterInstallationId:
          Number(getValues('ddlReheatComp')) === IDs.intCompIdElecHeater
            ? formCurrValues.ddlReheatElecHeaterInstall
            : formCurrValues.ddlHeatingElecHeaterInstall,
        intPreheatElecHeaterStdCoilNo: 0,
        intCoolingDX_VRVKitQty: 0,
        dblCoolingDX_VRVKitTonnage: 0,
        intHeatingElecHeaterStdCoilNo: 0,
        intReheatElecHeaterStdCoilNo: 0,
        intReheatHGRC_VRVKitQty: 0,
        dblReheatHGRC_VRVKitTonnage: 0,
        intDamperAndActuatorId: Number(formCurrValues.ddlDamperAndActuator),
        intisValveAndActuatorIncluded: Number(formCurrValues.ckbValveAndActuator) === 1 ? 1 : 0,
        intPreheatHWCValveAndActuatorId: 0,
        intCoolingCWCValveAndActuatorId: 0,
        intHeatingHWCValveAndActuatorId: 0,
        intReheatHWCValveAndActuatorId: 0,
        intIsDrainPan: Number(formCurrValues.ckbDrainPan) === 1 ? 1 : 0,
        intValveTypeId: Number(formCurrValues.ddlValveType),
        intEKEXVKitInstallId: 0,
        dblOAFilterPD: formCurrValues.txbOA_FilterPD,
        dblRAFilterPD: formCurrValues.txbRA_FilterPD,
        dblPreheatSetpointDB: formCurrValues.txbWinterPreheatSetpointDB,
        dblCoolingSetpointDB: formCurrValues.txbSummerCoolingSetpointDB,
        dblCoolingSetpointWB: formCurrValues.txbSummerCoolingSetpointWB,
        dblHeatingSetpointDB: formCurrValues.txbWinterHeatingSetpointDB,
        dblReheatSetpointDB: formCurrValues.txbSummerReheatSetpointDB,
        dblBackupHeatingSetpontDB:  formCurrValues.txbBackupHeatingSetpointDB,
        intCoolingFluidTypeId: Number(formCurrValues.ddlCoolingFluidType),
        intCoolingFluidConcentId: Number(formCurrValues.ddlCoolingFluidConcentration),
        dblCoolingFluidEntTemp: formCurrValues.txbCoolingFluidEntTemp,
        dblCoolingFluidLvgTemp: formCurrValues.txbCoolingFluidLvgTemp,
        intHeatingFluidTypeId: heatingFluidTypeId,
        intHeatingFluidConcentId: heatingFluidConcenId,
        dblHeatingFluidEntTemp: heatingFluidEntTemp,
        dblHeatingFluidLvgTemp: heatingFluidLvgTemp,
        dblRefrigSuctionTemp: formCurrValues.txbRefrigSuctionTemp,
        dblRefrigLiquidTemp: formCurrValues.txbRefrigLiquidTemp,
        dblRefrigSuperheatTemp: formCurrValues.txbRefrigSuperheatTemp,
        dblRefrigCondensingTemp: formCurrValues.txbRefrigCondensingTemp,
        dblRefrigVaporTemp: formCurrValues.txbRefrigVaporTemp,
        dblRefrigSubcoolingTemp: formCurrValues.txbRefrigSubcoolingTemp,
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
        intIsPreheatHWCUseFlowRate: Number(formCurrValues.ckbPreheatHWCUseFlowRate) === 1 ? 1 : 0,
        dblPreheatHWCFlowRate: formCurrValues.txbPreheatHWCFlowRate,
        intIsCoolingCWCUseCap: Number(formCurrValues.ckbCoolingCWCUseCap) === 1 ? 1 : 0,
        dblCoolingCWCCap: formCurrValues.txbCoolingCWCCap,
        intIsCoolingCWCUseFlowRate: Number(formCurrValues.ckbCoolingCWCUseFlowRate) === 1 ? 1 : 0,
        dblCoolingCWCFlowRate: formCurrValues.txbCoolingCWCFlowRate,
        intIsHeatingHWCUseCap: Number(formCurrValues.ckbHeatingHWCUseCap) === 1 ? 1 : 0,
        dblHeatingHWCCap: formCurrValues.txbHeatingHWCCap,
        intIsHeatingHWCUseFlowRate: Number(formCurrValues.ckbHeatingHWCUseFlowRate) === 1 ? 1 : 0,
        dblHeatingHWCFlowRate: formCurrValues.txbHeatingHWCFlowRate,
        intIsReheatHWCUseCap: Number(formCurrValues.ckbReheatHWCUseCap) === 1 ? 1 : 0,
        dblReheatHWCCap: formCurrValues.txbReheatHWCCap,
        intIsReheatHWCUseFlowRate: Number(formCurrValues.ckbReheatHWCUseFlowRate) === 1 ? 1 : 0,
        dblReheatHWCFlowRate: formCurrValues.txbReheatHWCFlowRate,
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
        // <Selection
        // intJobId={Number(projectId)}
        // intUnitNo={Number(unitId)}
        // intProdTypeId={0}
        // />
      }
      if (setIsSavedUnit) setIsSavedUnit(data?.intUnitNo || 0);

      push(PATH_APP.editUnit(projectId?.toString() || '0', unitId?.toString() || '0'));
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



  // -----------------------  ---------------------------
  const [internCompInfo, setInternCompInfo] = useState<any>([]);
  useMemo(() => {
    const info: { isOADesignCondVisible: boolean; isRADesignCondVisible: boolean; isCustomCompVisible: boolean; isHandingValveVisible: boolean; } = 
                { isOADesignCondVisible: false, isRADesignCondVisible: false, isCustomCompVisible: false, isHandingValveVisible: false,};
                
    const intUAL= Number(localStorage?.getItem('UAL')) || 0;

    switch (intUAL) {
      case IDs.intUAL_Admin:
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
  useMemo(() => {
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

  }, [db, intProductTypeID, intUnitTypeID, getValues('ddlLocation'), getValues('txbSummerSupplyAirCFM')]);


  const [bypassInfo, setBypassInfo] = useState<any>([]);
  useMemo(() => {
    const info: { isVisible: boolean; isChecked: boolean; isEnabled: boolean; defaultId: number; bypassMsg: string } = {
                  isVisible: false,   isChecked: false,   isEnabled: false,   defaultId: 0,      bypassMsg: '',};

    switch (Number(intProductTypeID)) {
      case IDs.intProdTypeIdNova:
        info.isVisible = true;
        break;
      case IDs.intProdTypeIdVentum:
        info.isVisible = false;
        info.isChecked = false;
        break;
      case IDs.intProdTypeIdVentumLite:
        info.isVisible = false;
        info.isChecked = false;
        break;
      case IDs.intProdTypeIdVentumPlus:
        info.isVisible = true;
        info.isChecked = false;
        break;
      case IDs.intProdTypeIdTerra:
        info.isVisible = false;
        info.isChecked = false;
        break;
      default:
        break;
    }

    if (intProductTypeID === IDs.intProdTypeIdNova) {
      const dtUnitModel = db?.dbtSelNovaUnitModel?.filter((item: { id: number }) => item.id === Number(getValues('ddlUnitModel')));
  
      if (Number(dtUnitModel[0]?.bypass_exist) === 1) {
        info.isVisible = true;
        info.isEnabled = true;
        info.bypassMsg = '';
      } else {
        info.isVisible = true;
        info.isChecked = false;
        info.isEnabled = false;
  
        if (Number(getValues('ddlUnitModel')) === IDs.intNovaUnitModelIdC70IN || 
            Number(getValues('ddlUnitModel')) === IDs.intNovaUnitModelIdC70OU
        ) {
          info.bypassMsg = ' Contact Oxygen8 applications for Bypass model';
        } else {
          info.bypassMsg = ' Not available for selected model';
        }
      }
  
      if (Number(getValues('ddlOrientation')) === IDs.intOrientationIdHorizontal) {
        const drUnitModelBypassHorUnit = dtUnitModel?.filter((item: { bypass_exist_horizontal_unit: number }) => item.bypass_exist_horizontal_unit === 1);
  
        if (drUnitModelBypassHorUnit && drUnitModelBypassHorUnit?.length > 0) {
          info.isVisible = true;
          info.isEnabled = true;
          info.bypassMsg = '';
        } else {
          info.isVisible = true;
          info.isEnabled = false;
          info.isChecked = false;
          info.bypassMsg = ' Not available for selected model';
        }
      }
    }



    setBypassInfo(info);

  }, [db, intProductTypeID, getValues('ddlUnitModel'), getValues('ddlOrientation'), ]);


  const [unitModelInfo, setUnitModelInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtUnitModel: any; defaultId: number } = { fdtUnitModel: [], defaultId: 0,};
    // let controlsPrefProdTypeLink: any = [];

    // const dtProdUnitLocLink = db?.dbtSelProdTypeUnitTypeLocLink?.filter((item: { prod_type_id: any; unit_type_id: any }) =>
    //   item.prod_type_id === intProductTypeID && item.unit_type_id === intUnitTypeID);

    // info.fdtLocation = db?.db?.dbtSelGeneralLocation?.filter((e: { id: any }) =>
    //   dtProdUnitLocLink?.filter((e_link: { location_id: any }) => e_link.location_id === e.id)?.length > 0);

    const intUAL= Number(localStorage?.getItem('UAL')) || 0;
    let dtNovaUnitModelLink = db?.dbtSelNovaUnitModelLocOriLink;
    const dtLocation = db?.dbtSelGeneralLocation?.filter((item: { id: any }) => item.id === Number(getValues('ddlLocation')));
    const dtOrientation = db?.dbtSelGeneralOrientation?.filter((item: { id: any }) => item.id === Number(getValues('ddlOrientation')));
    let summerSupplyAirCFM = Number(getValues('txbSummerSupplyAirCFM'));

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


        if (Number(getValues('ckbBypass')) === 1) {
          const drUnitModelBypass = info.fdtUnitModel?.filter((item: { bypass_exist: number }) => item.bypass_exist === 1);
          const unitModelBypass = drUnitModelBypass || [];

          if (unitModelBypass?.length > 0) {
            info.fdtUnitModel = info.fdtUnitModel?.filter((item: { bypass_exist: number }) => item.bypass_exist === 1);

            if (Number(getValues('ddlOrientation')) === IDs.intOrientationIdHorizontal) {
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
        if (Number(getValues('ckbBypass')) === 1) {
          summerSupplyAirCFM = summerSupplyAirCFM > intVEN_MAX_CFM_WITH_BYPASS ? intVEN_MAX_CFM_WITH_BYPASS : summerSupplyAirCFM;
        }

        if (intUAL === IDs.intUAL_External || intUAL === IDs.intUAL_ExternalSpecial) {
          if (intUnitTypeID === IDs.intUnitTypeIdERV) {
            // unitModel = unitModelFilter(data?.ventumHUnitModel,summerSupplyAirCFM,'erv_cfm_min_ext_users','erv_cfm_max_ext_users',unitModelId);
            info.fdtUnitModel = db?.dbtSelVentumHUnitModel?.filter(
                (item: { erv_cfm_min_ext_users: number; erv_cfm_max_ext_users: number }) =>
                  item.erv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.erv_cfm_max_ext_users >= summerSupplyAirCFM) || [];

              info.fdtUnitModel = info.fdtUnitModel.map((item: { model_erv: any }) => ({
              ...item,
              items: item.model_erv,
            }));
          } else if (intUnitTypeID === IDs.intUnitTypeIdHRV) {
            // unitModel = unitModelFilter(data?.ventumHUnitModel,summerSupplyAirCFM,'hrv_cfm_min_ext_users','hrv_cfm_max_ext_users', unitModelId);
            info.fdtUnitModel = db?.dbtSelVentumHUnitModel?.filter(
                (item: { hrv_cfm_min_ext_users: number; hrv_cfm_max_ext_users: number }) =>
                  item.hrv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.hrv_cfm_max_ext_users >= summerSupplyAirCFM) || [];

                  info.fdtUnitModel = info.fdtUnitModel.map((item: { model_hrv: any }) => ({
              ...item,
              items: item.model_hrv,
            }));
          }
        } else {
          // unitModel = unitModelFilter(data?.ventumHUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
          info.fdtUnitModel = db?.dbtSelVentumHUnitModel?.filter(
              (item: { cfm_min: number; cfm_max: number }) => item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM) || [];
        }

        info.fdtUnitModel = info.fdtUnitModel?.filter((item: { bypass: any }) => item.bypass === Number(getValues('ckbBypass')));

        // getReheatInfo();    //Only for Ventum - H05 has no HGRH option
        break;
      case IDs.intProdTypeIdVentumLite:
        // ckbBypassVal = 0;

        if (intUAL === IDs.intUAL_IntLvl_1 || intUAL === IDs.intUAL_IntLvl_2) {
          if (intUnitTypeID === IDs.intUnitTypeIdERV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'cfm_min','cfm_max', unitModelId);
            info.fdtUnitModel = db?.dbtSelVentumLiteUnitModel?.filter((item: { cfm_min: number; cfm_max: number }) => item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM ) || [];

            info.fdtUnitModel = info.fdtUnitModel.map((item: { model_erv: any }) => ({
              ...item,
              items: item.model_erv,
            }));
          } else if (intUnitTypeID === IDs.intUnitTypeIdHRV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'cfm_min','cfm_max',unitModelId);
            info.fdtUnitModel = db?.dbtSelVentumLiteUnitModel?.filter(
                (item: { cfm_min: number; cfm_max: number }) => item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM) || [];

                info.fdtUnitModel = info.fdtUnitModel.map((item: { model_hrv: any }) => ({
              ...item,
              items: item.model_hrv,
            }));
          }
        } else if (intUAL === IDs.intUAL_External || intUAL === IDs.intUAL_ExternalSpecial) {
          if (intUnitTypeID === IDs.intUnitTypeIdERV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel,summerSupplyAirCFM,'erv_cfm_min_ext_users','erv_cfm_max_ext_users',unitModelId);
            info.fdtUnitModel = db?.dbtSelVentumLiteUnitModel?.filter(
                  (item: { erv_cfm_min_ext_users: number; erv_cfm_max_ext_users: number }) =>
                  item.erv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.erv_cfm_max_ext_users >= summerSupplyAirCFM
              ) || [];
              info.fdtUnitModel = info.fdtUnitModel.map((item: { model_erv: any }) => ({...item, items: item.model_erv,
            }));
          } else if (intUnitTypeID === IDs.intUnitTypeIdHRV) {
            // unitModel = unitModelFilter(data?.ventumLiteUnitModel, summerSupplyAirCFM,'hrv_cfm_min_ext_users','hrv_cfm_max_ext_users',unitModelId);
            info.fdtUnitModel = db?.dbtSelVentumLiteUnitModel?.filter(
                (item: { hrv_cfm_min_ext_users: number; hrv_cfm_max_ext_users: number }) =>
                  item.hrv_cfm_min_ext_users <= summerSupplyAirCFM &&
                  item.hrv_cfm_max_ext_users >= summerSupplyAirCFM
              ) || [];
              info.fdtUnitModel = info.fdtUnitModel.map((item: { model_hrv: any }) => ({...item, items: item.model_hrv,
            }));
          }

          const drUnitModel = info.fdtUnitModel?.filter((item: { enabled_ext_users: number }) => item.enabled_ext_users === 1);
          info.fdtUnitModel = drUnitModel || [];
        } else {
          // unitModel = unitModelFilter(data?.ventumLiteUnitModel, summerSupplyAirCFM, 'cfm_min', 'cfm_max', unitModelId);
          info.fdtUnitModel = db?.dbtSelVentumLiteUnitModel?.filter(
              (item: { cfm_min: number; cfm_max: number }) => item.cfm_min <= summerSupplyAirCFM && item.cfm_max >= summerSupplyAirCFM) || [];
        }

        info.fdtUnitModel = info.fdtUnitModel?.filter(
          (item: { enabled: number; bypass: any }) => item.enabled === 1 && item.bypass === Number(getValues('ckbBypass')));
        break;
      case IDs.intProdTypeIdVentumPlus:
        info.fdtUnitModel =  db?.dbtSelVentumPlusUnitModel;

      if (Number(getValues('ckbBypass')) === 1) {
          summerSupplyAirCFM = summerSupplyAirCFM > intVENPLUS_MAX_CFM_WITH_BYPASS ? intVENPLUS_MAX_CFM_WITH_BYPASS : summerSupplyAirCFM;
        }
        if (summerSupplyAirCFM < 1200) {
          summerSupplyAirCFM = 1200;
        }

        if (intUAL === IDs.intUAL_External || intUAL === IDs.intUAL_ExternalSpecial) {
          if (intUnitTypeID === IDs.intUnitTypeIdERV) {
            // info.fdtUnitModel = unitModelFilter(db?.dbtSelVentumPlusUnitModel, summerSupplyAirCFM, 'erv_cfm_min_ext_users', 'erv_cfm_max_ext_users');
            info.fdtUnitModel =  info.fdtUnitModel?.filter((item: any) => item.erv_cfm_min_ext_users <= summerSupplyAirCFM && summerSupplyAirCFM <= item.erv_cfm_max_ext_users).sort((a: any, b: any) => a.erv_cfm_max_ext_users - b.erv_cfm_max_ext_users);

            // info.fdtUnitModel = info.fdtUnitModel.map((item: { model_erv: any }) => ({...item, items: item.model_erv,}));

          } else if (intUnitTypeID === IDs.intUnitTypeIdHRV) {
            // info.fdtUnitModel = unitModelFilter(db?.dbtSelVentumPlusUnitModel, summerSupplyAirCFM,'hrv_cfm_min_ext_users', 'hrv_cfm_max_ext_users');
            info.fdtUnitModel =  info.fdtUnitModel?.filter((item: any) => item.hrv_cfm_min_ext_users <= summerSupplyAirCFM && summerSupplyAirCFM <= item.hrv_cfm_min_ext_users).sort((a: any, b: any) => a.hrv_cfm_min_ext_users - b.hrv_cfm_min_ext_users);
            // info.fdtUnitModel = info.fdtUnitModel.map((item: { model_hrv: any }) => ({...item, items: item.model_hrv, }));
          }
        } else {
          // info.fdtUnitModel = unitModelFilter(db?.dbtSelVentumPlusUnitModel, summerSupplyAirCFM,'cfm_min','cfm_max');
          info.fdtUnitModel = info.fdtUnitModel?.filter((item: any) => item.cfm_min <= summerSupplyAirCFM && summerSupplyAirCFM <= item.cfm_max).sort((a: any, b: any) => a.cfm_max - b.cfm_max);

          // info.fdtUnitModel = info.fdtUnitModel.map((item: { items: any; cfm_min: any; cfm_max: any }) => ({
          //   ...item,
          //   items: `${item.items} - (${item.cfm_min}-${item.cfm_max} CFM)`,
          // }));
          info.fdtUnitModel = info.fdtUnitModel.map((item: { items: any; model_erv: any; }) => ({...item, items: `${item.model_erv}`,}));
        }
        info.fdtUnitModel = info.fdtUnitModel?.filter(
          (item: { location_id_key: any; enabled: number; bypass: any }) =>
            item.location_id_key === dtLocation?.[0]?.id_key &&
            item.enabled === 1 &&
            item.bypass === Number(getValues('ckbBypass'))
        );
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

  }, [db, intProductTypeID, intUnitTypeID, getValues('txbSummerSupplyAirCFM'), getValues('ckbBypass'), getValues('ddlLocation'), getValues('ddlOrientation')]);


  // -------------------- Get String Unit Model Codes ----------------------
  const { strUnitModelValue } = useMemo(() => {
    if (!formValues.ddlUnitModel || formValues.ddlUnitModel === '')
      return { strUnitModelValue: '' };
    let fdtUnitModel = [];

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

    const unitModelValue = fdtUnitModel?.filter((item: any) => item.id === formValues.ddlUnitModel)?.[0]?.value;

    return getUnitModelCodes(
      unitModelValue,
      intProductTypeID,
      intUnitTypeID,
      formValues.ddlLocation,
      formValues.ddlOrientation,
      Number(formValues.ckbBypass),
      db
    );
  }, [
    formValues.ckbBypass,
    db,
    intProductTypeID,
    intUnitTypeID,
    formValues.ddlLocation,
    formValues.ddlOrientation,
    formValues.ddlUnitModel,
  ]);


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

  }, [db, intUnitTypeID]);



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

  }, [db, intProductTypeID, intUnitTypeID]);




  const [controlsPrefInfo, setControlsPrefInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtControlsPref: any; isVisible: boolean; defaultId: number } = {
      fdtControlsPref: [],
      isVisible: false,
      defaultId: 0,
    };
    // let controlsPrefProdTypeLink: any = [];
    let controlsPrefProdTypeLink: any = [];
    controlsPrefProdTypeLink = db?.dbtSelControlsPrefProdTypeLink?.filter(
      (item: { prod_type_id: number }) => item.prod_type_id === intProductTypeID
    );

    info.fdtControlsPref = db?.dbtSelControlsPref?.filter(
      (e: { id: any }) =>
        controlsPrefProdTypeLink?.filter(
          (e_link: { controls_id: any }) => e.id === e_link.controls_id
        )?.length > 0
    );

    setControlsPrefInfo(info);
    info.defaultId = info.fdtControlsPref?.[0]?.id;
    setValue('ddlControlsPref', info.fdtControlsPref?.[0]?.id);
  }, [db, intProductTypeID]);


  const [controlViaInfo, setControlViaInfo] = useState<any>([]);
  useMemo(() => {
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
        } else {
          info.fdtControlVia = info.fdtControlVia?.filter(
            (item: { id: number }) => item.id === IDs.intContViaIdNA
          );
        }
        break;
      case IDs.intProdTypeIdTerra:
        info.fdtControlVia = info.fdtControlVia?.filter(
          (item: { id: number }) => item.id !== IDs.intContViaIdNA
        );
        info.isVisible = true;
        break;
      default:
        break;
    }

    setControlViaInfo(info);

    info.defaultId = info.fdtControlVia?.[0]?.id;
    setValue('ddlControlVia', info.fdtControlVia?.[0]?.id);
  }, [db, intProductTypeID, getValues('ddlControlsPref')]);


  // const [supplyAirEspInfo, setSupplyAirEspInfo] = useState<any>([]);
  // useMemo(() => {
  //   const info: { isVisible: boolean; defaultId: number } = {
  //     isVisible: false,
  //     defaultId: 0,
  //   };


  //   switch (intProductTypeID) {
  //     case IDs.intProdTypeIdNova:
  //       switch (Number(getValues('ddlUnitModel'))) {
  //         case IDs.intNovaUnitModelIdA16IN:
  //         case IDs.intNovaUnitModelIdB20IN:
  //         case IDs.intNovaUnitModelIdA18OU:
  //         case IDs.intNovaUnitModelIdB22OU:
  //           if (Number(getValues('txbSupplyAirESP')) > 2.0) {
  //             setValue('txbSupplyAirESP', 2.0);
  //           }
  //           break;
  //         default:
  //           if (Number(getValues('txbSupplyAirESP')) > 3.0) {
  //             setValue('txbSupplyAirESP', 3.0);
  //           }
  //           break;
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   setSupplyAirEspInfo(info);

  // }, [intProductTypeID, getValues('ddlUnitModel'), getValues('txbSupplyAirESP')]);



  // const [exhaustAirEspInfo, setExhaustAirEspInfo] = useState<any>([]);
  // useMemo(() => {
  //   const info: { isVisible: boolean; defaultId: number } = {
  //     isVisible: false,
  //     defaultId: 0,
  //   };


  //   switch (intProductTypeID) {
  //     case IDs.intProdTypeIdNova:
  //       switch (Number(getValues('ddlUnitModel'))) {
  //         case IDs.intNovaUnitModelIdA16IN:
  //         case IDs.intNovaUnitModelIdB20IN:
  //         case IDs.intNovaUnitModelIdA18OU:
  //         case IDs.intNovaUnitModelIdB22OU:
  //           if (Number(getValues('txbExhaustAirESP')) > 2.0) {
  //             setValue('txbExhaustAirESP', 2.0);
  //           }
  //           break;
  //         default:
  //           if (Number(getValues('txbExhaustAirESP')) > 3.0) {
  //             setValue('txbExhaustAirESP', 3.0);
  //           }
  //           break;
  //       }
  //       break;
  //     default:
  //       break;
  //   }

  //   setExhaustAirEspInfo(info);

  // }, [intProductTypeID, getValues('ddlUnitModel'), getValues('txbExhaustAirESP')]);


  
  const [unitVoltageInfo, setUnitVoltageInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtUnitVoltage: any; defaultId: number } = { fdtUnitVoltage: [], defaultId: 0,};
    // let controlsPrefProdTypeLink: any = [];

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

    const dtLink = modelVoltageLink?.filter((item: { unit_model_value: any }) => item.unit_model_value === strUnitModelValue) || [];
    let dtVoltage = db?.dbtSelElectricalVoltage;

    if (intProductTypeID === IDs.intProdTypeIdTerra) {
      dtVoltage = db?.dbtSelElectricalVoltage?.filter((item: { terra_spp: number }) => item.terra_spp === 1);
    }
  
    info.fdtUnitVoltage = dtVoltage?.filter((e: { id: any }) => dtLink?.filter((e_link: { voltage_id: any }) => e.id === e_link.voltage_id)?.length > 0);



    setUnitVoltageInfo(info);
    info.defaultId = info.fdtUnitVoltage?.[0]?.id;
    setValue('ddlUnitVoltage', info.fdtUnitVoltage?.[0]?.id);

  }, [db, intProductTypeID]);


  const [outdoorAirFilterInfo, setOutdoorAirFilterInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtOutdoorAirFilter: any; isVisible: boolean; defaultId: number } = {
      fdtOutdoorAirFilter: [],
      isVisible: false,
      defaultId: 0,
    };
    info.fdtOutdoorAirFilter = db?.dbtSelFilterModel;

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
  }, [db, intProductTypeID]);


  const [returnAirFilterInfo, setReturnAirFilterInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtReturnAirFilter: any; isVisible: boolean; defaultId: number } = {
      fdtReturnAirFilter: [],
      isVisible: false,
      defaultId: 0,
    };
    info.fdtReturnAirFilter = db?.dbtSelFilterModel;

    switch (intProductTypeID) {
      case IDs.intProdTypeIdNova:
      case IDs.intProdTypeIdVentum:
      case IDs.intProdTypeIdVentumLite:
        info.fdtReturnAirFilter =
          info.fdtReturnAirFilter?.filter((e: { depth: any }) => e.depth === 2) || [];
        info.isVisible = true;
        break;
      case IDs.intProdTypeIdTerra:
        info.fdtReturnAirFilter = info.fdtReturnAirFilter?.filter(
          (item: { id: number }) => item.id === IDs.intFilterModelIdNA
        );
        info.isVisible = false;
        break;
      case IDs.intProdTypeIdVentumPlus:
        info.fdtReturnAirFilter =
          info.fdtReturnAirFilter?.filter((item: { depth: number }) => item.depth === 4) || [];
        info.isVisible = true;
        break;
      default:
        break;
    }

    setReturnAirFilterInfo(info);

    setValue('ddlRA_FilterModel', info.fdtReturnAirFilter?.[0]?.id);
  }, [db, intProductTypeID]);


  const [mixOADamperPosInfo, setMixOADamperPosInfo] = useState<any>([]);
  useMemo(() => {
    const info: { ftdMixOADamperPos: any; isVisible: boolean; defaultId: number } = {

      ftdMixOADamperPos: [],
      isVisible: false,
      defaultId: 0,
    };

    info.ftdMixOADamperPos = db?.dbtSelDamperPosition;

    if (formCurrValues.ckbMixingBox) {
    info.ftdMixOADamperPos = info.ftdMixOADamperPos?.filter((e: { id: any }) => e.id !== IDs.intDamperActuatorIdNA) || [];
    }
    else {
      info.ftdMixOADamperPos = info.ftdMixOADamperPos?.filter((e: { id: any }) => e.id === IDs.intDamperActuatorIdNA) || [];
    }

    setMixOADamperPosInfo(info);

    if (Number(formCurrValues.ddlMixOADamperPos) !==  IDs.intDamperPosIdNA &&
      Number(formCurrValues.ddlMixOADamperPos) === Number(formCurrValues.ddlMixRADamperPos)) {

      const index = info.ftdMixOADamperPos.findIndex((x: { id: Number }) => x.id === Number(formCurrValues.ddlMixOADamperPos));
      let SelId = 0;

     if (index < info.ftdMixOADamperPos.length - 1) {
      SelId = info.ftdMixOADamperPos?.[index + 1]?.id;
     } else {
      SelId = info.ftdMixOADamperPos?.[0]?.id;
     }
      setValue('ddlMixOADamperPos', SelId);
    }
  }, [db,formCurrValues.ckbMixingBox,formCurrValues.ddlMixRADamperPos]);



  const [mixRADamperPosInfo, setMixRADamperPosInfo] = useState<any>([]);
  useMemo(() => {
    const info: { ftdMixRADamperPos: any; isVisible: boolean; defaultId: number } = {

      ftdMixRADamperPos: [],
      isVisible: false,
      defaultId: 0,
    };

    info.ftdMixRADamperPos = db?.dbtSelDamperPosition;

    if (formCurrValues.ckbMixingBox) {
      info.ftdMixRADamperPos = info.ftdMixRADamperPos?.filter((e: { id: any }) => e.id !== IDs.intDamperActuatorIdNA) || [];
    }
    else {
      info.ftdMixRADamperPos = info.ftdMixRADamperPos?.filter((e: { id: any }) => e.id === IDs.intDamperActuatorIdNA) || [];
    }

    setMixRADamperPosInfo(info);

    if (Number(formCurrValues.ddlMixRADamperPos) !==  IDs.intDamperPosIdNA &&
      Number(formCurrValues.ddlMixRADamperPos) === Number(formCurrValues.ddlMixOADamperPos)) {

      const index = info.ftdMixRADamperPos.findIndex((x: { id: Number }) => x.id === Number(formCurrValues.ddlMixRADamperPos));
      let SelId = 0;
    
      if (index < info.ftdMixRADamperPos.length - 1) {
        SelId = info.ftdMixRADamperPos?.[index + 1]?.id;
        // setValue('ddlMixRADamperPos', SelId);
      } else {
        SelId = info.ftdMixRADamperPos?.[0]?.id;
        // setValue('ddlMixRADamperPos', SelId);
      }
      
      setValue('ddlMixRADamperPos', SelId);
    }
  }, [db,formCurrValues.ckbMixingBox,formCurrValues.ddlMixOADamperPos]);


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
        setValue('txbMixSummerOA_DB', unitInfo?.oJob?.dblSummerOA_DB);
        setValue('txbMixSummerOA_WB', unitInfo?.oJob?.dblSummerOA_WB);
        setValue('txbMixSummerOA_RH', unitInfo?.oJob?.dblSummerOA_RH);
        setValue('txbMixWinterOA_DB', unitInfo?.oJob?.dblWinterOA_DB);
        setValue('txbMixWinterOA_WB', unitInfo?.oJob?.dblWinterOA_WB);
        setValue('txbMixWinterOA_RH', unitInfo?.oJob?.dblWinterOA_RH);
        setValue('txbMixSummerRA_DB', unitInfo?.oJob?.dblSummerRA_DB);
        setValue('txbMixSummerRA_WB', unitInfo?.oJob?.dblSummerRA_WB);
        setValue('txbMixSummerRA_RH', unitInfo?.oJob?.dblSummerRA_RH);
        setValue('txbMixWinterRA_DB', unitInfo?.oJob?.dblWinterRA_DB);
        setValue('txbMixWinterRA_WB', unitInfo?.oJob?.dblWinterRA_WB);
        setValue('txbMixWinterRA_RH', unitInfo?.oJob?.dblWinterRA_RH);
    }
  }, [getValues('ckbMixUseProjectDefault')]);


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



  const [preheatCompInfo, setPreheatCompInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtPreheatComp: any; isVisible: boolean; defaultId: number } = { fdtPreheatComp: [], isVisible: false, defaultId: 0,};
  
    let dtPreheatComp = db?.dbtSelUnitCoolingHeating;
    info.isVisible = true;
  
    if (intUnitTypeID === IDs.intUnitTypeIdERV) {
      info.fdtPreheatComp = dtPreheatComp?.filter((e: { erv_preheat: number }) => Number(e.erv_preheat) === 1) || [];
  
      if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
        info.fdtPreheatComp = info.fdtPreheatComp ?.filter((item: { id: number }) => Number(item.id) !== IDs.intCompIdHWC ) || [];
      }
  
    } else if (intUnitTypeID === IDs.intUnitTypeIdHRV) {
      dtPreheatComp = dtPreheatComp?.filter((e: { hrv_preheat: number }) => Number(e.hrv_preheat) === 1) || [];
  
      if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
        info.fdtPreheatComp = info.fdtPreheatComp?.filter((e: { id: any }) => parseInt(e.id, 10) !== IDs.intCompIdHWC);        
      }
  
    } else if (intUnitTypeID === IDs.intUnitTypeIdAHU) {
      info.fdtPreheatComp = dtPreheatComp?.filter((e: { fc_preheat: number }) => Number(e.fc_preheat) === 1) || [];
    }

    setPreheatCompInfo(info);
    info.defaultId = info.fdtPreheatComp?.[0]?.id;
    setValue('ddlPreheatComp', info.fdtPreheatComp?.[0]?.id);

  }, [db, intProductTypeID, intUnitTypeID]);


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

  }, [db, intProductTypeID, intUnitTypeID]);


  const [coolingCompInfo, setCoolingCompInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtCoolingComp: any;  isVisible: boolean; defaultId: number } = { fdtCoolingComp: [], isVisible: false, defaultId: 0,};
  
    info.fdtCoolingComp  = db?.dbtSelUnitCoolingHeating;
    info.isVisible = true;

    if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
      // info.ftdHeatingComp = info.ftdHeatingComp?.filter((item: { id: { toString: () => any } }) =>  item.id.toString() !== IDs.intCompIdNA.toString());
      info.fdtCoolingComp  = info.fdtCoolingComp .filter((item: { id: number }) =>  item.id !== IDs.intCompIdNA);
      info.isVisible = false;
    } else {
      switch (intUnitTypeID) {
        case IDs.intUnitTypeIdERV:
          info.fdtCoolingComp = info.fdtCoolingComp ?.filter((e: { erv_cooling: number }) => Number(e.erv_cooling) === 1) || [];
          break;
        case IDs.intUnitTypeIdHRV:
          info.fdtCoolingComp = info.fdtCoolingComp ?.filter((e: { hrv_cooling: number }) => Number(e.hrv_cooling) === 1) || [];
          break;
        case IDs.intUnitTypeIdAHU:
          info.fdtCoolingComp = info.fdtCoolingComp ?.filter((e: { fc_cooling: number }) => Number(e.fc_cooling) === 1) || [];
          break;
        default:
          // code block
          break;
      }
    }
    setCoolingCompInfo(info);
    info.defaultId = info.fdtCoolingComp?.[0]?.id;
    setValue('ddlCoolingComp', info.fdtCoolingComp?.[0]?.id);

  }, [db, intProductTypeID, intUnitTypeID]);
  

  const [heatingCompInfo, setHeatingCompInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHeatingComp: any;  isVisible: boolean; defaultId: number } = { fdtHeatingComp: [], isVisible: false, defaultId: 0,};
    
    info.fdtHeatingComp = db?.dbtSelUnitCoolingHeating;
    info.isVisible = true;

    if (intProductTypeID === IDs.intProdTypeIdVentumLite){
      // info.ftdHeatingComp = info.ftdHeatingComp?.filter((item: { id: { toString: () => any } }) =>  item.id.toString() !== IDs.intCompIdNA.toString());
      info.fdtHeatingComp = info.fdtHeatingComp?.filter((item: { id: number }) =>  item.id !== IDs.intCompIdNA);
      info.isVisible = false;
    } else {
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
    }


    setHeatingCompInfo(info);
    info.defaultId = info.fdtHeatingComp?.[0]?.id;
    setValue('ddlHeatingComp', info.fdtHeatingComp?.[0]?.id);

  }, [db, intProductTypeID, intUnitTypeID]);


  const [reheatCompInfo, setReheatCompInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtReheatComp: any; isVisible: boolean; defaultId: number } = { fdtReheatComp: [], isVisible: false, defaultId: 0,};
    // let controlsPrefProdTypeLink: any = [];

    info.fdtReheatComp = db?.dbtSelUnitCoolingHeating;
    const intUAL= localStorage?.getItem('UAL') || 0;

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

    if (Number(getValues('ckbDehumidification'))) {

      switch (Number(getValues('ddlCoolingComp'))) {
        case IDs.intCompIdCWC:
          info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: { toString: () => any } }) => item.id.toString() !== IDs.intCompIdHGRH.toString());
          break;
        case IDs.intCompIdDX:
          if (Number(intUAL) === IDs.intUAL_External && (intUnitTypeID === IDs.intUnitTypeIdERV || intUnitTypeID === IDs.intUnitTypeIdHRV)) {
            info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: { toString: () => any } }) => item.id.toString() !== IDs.intCompIdHGRH.toString());
          } else if (intProductTypeID === IDs.intProdTypeIdVentum && 
              (Number(getValues('ddlUnitModel')) === IDs.intVentumUnitModelIdH05IN_ERV || Number(getValues('ddlUnitModel')) === IDs.intVentumUnitModelIdH05IN_HRV)) {
            info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: { toString: () => any } }) =>  item.id.toString() !== IDs.intCompIdHGRH.toString());
          }
          break;
        default:
          break;
      } 
  
      info.isVisible = true;

    } else {
        // info.ftdReheatComp = info.ftdReheatComp?.filter((item: { id: { toString: () => any } }) =>  item.id.toString() !== IDs.intCompIdNA.toString());
        info.fdtReheatComp = info.fdtReheatComp?.filter((item: { id: number }) =>  item.id === IDs.intCompIdNA);
        info.isVisible = false;
      }


    setReheatCompInfo(info);
    info.defaultId = info.fdtReheatComp?.[0]?.id;
    setValue('ddlReheatComp', info.fdtReheatComp?.[0]?.id);

  }, [db, intProductTypeID, intUnitTypeID, getValues('ckbDehumidification'), getValues('ddlCoolingComp'), getValues('ddlUnitModel')]);


  const [heatPumpInfo, setHeatPumpInfo] = useState<any>([]);
  useMemo(() => {
    const info: { isChecked: boolean; isVisible: boolean; defaultId: number } = {
      isChecked: false,
      isVisible: false,
      defaultId: 0,
    };

    if (Number(getValues('ddlCoolingComp')) === IDs.intCompIdDX) {
      info.isChecked = true;
      info.isVisible = true;
    } else {
      info.isChecked = false;
      info.isVisible = false;
    }

    setHeatPumpInfo(info);

    setValue('ckbHeatPump', info.isChecked);
  }, [db, getValues('ddlCoolingComp')]);



  const [dehumInfo, setDehumInfo] = useState<any>([]);
  useMemo(() => {
    const info: { isChecked: boolean; isVisible: boolean; defaultId: number } = {
      isChecked: false,
      isVisible: false,
      defaultId: 0,
    };


    switch (Number(getValues('ddlCoolingComp'))) {
      case IDs.intCompIdCWC:
      case IDs.intCompIdDX:
        info.isChecked = false;
        info.isVisible = true;  
        break;
      default:
        info.isChecked = false;
        info.isVisible = false;
        break;
    }

    setDehumInfo(info);
    setValue('ckbDehumidification', info.isChecked);

  }, [db, getValues('ddlCoolingComp')]);



  // Keep preheat elec heater separate even if the logic is same as heating/reheat logic.
  const [preheatElecHeaterInfo, setPreheatElecHeaterInfo] = useState<any>([]);
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
      info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
        (item: { id: number }) => item.id !== IDs.intElecHeaterInstallIdNA
      );

      switch (Number(getValues('ddlLocation'))) {
        case IDs.intLocationIdOutdoor:
          switch (intProductTypeID) {
            case IDs.intProdTypeIdNova:
            case IDs.intProdTypeIdVentum:
            case IDs.intProdTypeIdVentumLite:
            case IDs.intProdTypeIdTerra:
              info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
                (item: { id: any }) => item.id === IDs.intElecHeaterInstallIdInCasingField
              );
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            case IDs.intProdTypeIdVentumPlus:
              info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
                (item: { id: any }) => item.id === IDs.intElecHeaterInstallIdInCasingFactory
              );
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            default:
              break;
          }
          break;
        case IDs.intLocationIdIndoor:
          dtLink =
            dtLink?.filter(
              (item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID
            ) || [];

          info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
            (e: { id: any }) =>
              dtLink?.filter(
                (e_link: { elec_heater_install_id: any }) => e.id === e_link.elec_heater_install_id
              )?.length === 1
          ); // 1: Matching items, 0: Not matching items

          switch (intProductTypeID) {
            case IDs.intProdTypeIdNova:
            case IDs.intProdTypeIdVentum:
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            case IDs.intProdTypeIdTerra:
            case IDs.intProdTypeIdVentumPlus:
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            case IDs.intProdTypeIdVentumLite:
              info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
                (item: { id: any }) => item.id === IDs.intElecHeaterInstallIdDuctMounted
              );
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    } else {
      info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
        (item: { id: number }) => item.id === IDs.intElecHeaterInstallIdNA
      );
      info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
    }

    setPreheatElecHeaterInfo(info);
    setValue('ddlPreheatElecHeaterInstall', info.defaultId);
  }, [getValues('ddlLocation'), getValues('ddlPreheatComp')]);


  // Same logic applies for Heating and Reheat since it's the same component
  const [heatingElecHeaterInfo, setHeatingElecHeaterInfo] = useState<any>([]);
  const HeatingElecHeaterInfo = useMemo(() => {
    const info: { fdtElecHeaterInstall: any; isVisible: boolean; defaultId: number } = {
      fdtElecHeaterInstall: [],
      isVisible: false,
      defaultId: 0,
    };
    info.fdtElecHeaterInstall = db?.dbtSelElecHeaterInstallation;
    let dtLink = db?.dbtSelElectricHeaterInstallProdTypeLink;
    dtLink =
      dtLink?.filter((item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID) || [];

    if (
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdElecHeater ||
      Number(getValues('ddlReheatComp')) === IDs.intCompIdElecHeater
    ) {
      info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
        (item: { id: number }) => item.id !== IDs.intElecHeaterInstallIdNA
      );

      switch (Number(getValues('ddlLocation'))) {
        case IDs.intLocationIdOutdoor:
          switch (intProductTypeID) {
            case IDs.intProdTypeIdNova:
            case IDs.intProdTypeIdVentum:
            case IDs.intProdTypeIdVentumLite:
            case IDs.intProdTypeIdTerra:
              info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
                (item: { id: any }) => item.id === IDs.intElecHeaterInstallIdInCasingField
              );
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            case IDs.intProdTypeIdVentumPlus:
              info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
                (item: { id: any }) => item.id === IDs.intElecHeaterInstallIdInCasingFactory
              );
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            default:
              break;
          }
          break;
        case IDs.intLocationIdIndoor:
          dtLink =
            dtLink?.filter(
              (item: { prod_type_id: any }) => item.prod_type_id === intProductTypeID
            ) || [];

          info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
            (e: { id: any }) =>
              dtLink?.filter(
                (e_link: { elec_heater_install_id: any }) => e.id === e_link.elec_heater_install_id
              )?.length === 1
          ); // 1: Matching items, 0: Not matching items

          switch (intProductTypeID) {
            case IDs.intProdTypeIdNova:
            case IDs.intProdTypeIdVentum:
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            case IDs.intProdTypeIdTerra:
            case IDs.intProdTypeIdVentumPlus:
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            case IDs.intProdTypeIdVentumLite:
              info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
                (item: { id: any }) => item.id === IDs.intElecHeaterInstallIdDuctMounted
              );
              info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    } else {
      info.fdtElecHeaterInstall = info.fdtElecHeaterInstall?.filter(
        (item: { id: number }) => item.id === IDs.intElecHeaterInstallIdNA
      );
      info.defaultId = info.fdtElecHeaterInstall?.[0]?.id;
    }

    setHeatingElecHeaterInfo(info);

    return info;
  }, [getValues('ddlLocation'), getValues('ddlHeatingComp'), getValues('ddlReheatComp')]);



  const [elecHeaterVoltageInfo, setElecHeaterVoltageInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtElecHeaterVoltage: any; isVisible: boolean; isEnabled: boolean; defaultId: number } = 
                { fdtElecHeaterVoltage: [],  isVisible: false, isEnabled: false, defaultId: 0,};
    // let controlsPrefProdTypeLink: any = [];

    // let dtElecHeaterVoltage = [];
    info.fdtElecHeaterVoltage = db?.dbtSelElectricalVoltage;
    info.defaultId  = Number(getValues('ddlUnitVoltage'));
  
    if (Number(getValues('ddlPreheatComp'))  === IDs.intCompIdElecHeater ||
        Number(getValues('ddlHeatingComp')) === IDs.intCompIdElecHeater ||
        Number(getValues('ddlReheatComp')) === IDs.intCompIdElecHeater) {
          info.isVisible = true;
  
      let bol208V_1Ph = false;
      // intProdTypeNovaID
      if (intProductTypeID === IDs.intProdTypeIdNova) {
        // if (intUnitModelID) {
          // info.fdtElecHeaterVoltage = db?.dbtSelElectricalVoltage;
          // const dtLink = data?.novaElecHeatVoltageLink.filter((x) => x.unit_model_value === strUnitModelValue);
  
          // if (Number(getValues('ddlUnitVoltage')) ) {
          //   info.defaultId = intUnitModelID;
          // }
  
          // dtElecHeaterVoltage = dtElecHeaterVoltage.map(
          //   (item) => dtLink.filter((el) => el.voltage_id === item.id)?.length > 0
          // );
        // }
        // intProdTypeVentumID
      } else if (intProductTypeID === IDs.intProdTypeIdVentum) {
        if (Number(getValues('ddlUnitModel')) === IDs.intVentumUnitModelIdH05IN_ERV ||
            Number(getValues('ddlUnitModel')) === IDs.intVentumUnitModelIdH10IN_ERV ||
            Number(getValues('ddlUnitModel')) === IDs.intVentumUnitModelIdH05IN_HRV ||
            Number(getValues('ddlUnitModel')) === IDs.intVentumUnitModelIdH10IN_HRV) {
          bol208V_1Ph = true;
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter(
            (item: { electric_heater_2: number; id: any }) => item.electric_heater_2 === 1);
        } else {
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater: number; id: any }) =>
            item.electric_heater === 1);
        }
  
        if (bol208V_1Ph) {
          info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
          info.isEnabled = false;
        } else {
          info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
        }
  
        if (Number(getValues('ckbVoltageSPP'))) {
          info.isEnabled = false;
        } else {
          info.isEnabled = true;
        }
        // intProdTypeVentumLiteID
      } else if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
        bol208V_1Ph = true;
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { electric_heater_3: number; id: any }) => item.electric_heater_3 === 1);
  
        if (info.fdtElecHeaterVoltage?.length > 0) {
          if (bol208V_1Ph) {
            info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
          } else {
            info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
          }
        }
        // intProdTypeVentumPlusID
      } else if (intProductTypeID === IDs.intProdTypeIdVentumPlus) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter(
          (item: { ventumplus_elec_heater: number; id: any }) => item.ventumplus_elec_heater === 1);
  
        if (Number(getValues('ckbVoltageSPP'))) {
          info.defaultId = Number(getValues('ddlUnitVoltage'));
          info.isVisible = false;
          info.isEnabled = false;
        } else {
          info.isEnabled = true;
        }
  
        if (info.fdtElecHeaterVoltage?.length > 0) {
          if (bol208V_1Ph) {
            info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
          } else {
            info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
          }
        }
        // intProdTypeTerraID
      } else if (intProductTypeID === IDs.intProdTypeIdTerra) {
        if (Number(getValues('ckbVoltageSPP'))) {
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_spp: number; id: any }) =>item.terra_spp === 1);
          info.defaultId =Number(getValues('ddlUnitVoltage'));
          info.isEnabled = false;
        } else {
          info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_non_spp: number; id: any }) => item.terra_non_spp === 1);
          info.isEnabled = true;
        }
  
        if (info.fdtElecHeaterVoltage?.length > 0) {
          if (bol208V_1Ph) {
            info.defaultId = IDs.intElectricVoltageId208V_1Ph_60Hz;
          } else {
            info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
          }
        }
      }

      if (Number(getValues('ddlPreheatComp')) === IDs.intCompIdAuto &&
          Number(getValues('ddlHeatingComp')) !== IDs.intCompIdElecHeater &&
          Number(getValues('ddlReheatComp')) !== IDs.intCompIdElecHeater) {
        info.isVisible = false;
      }
    } else {
      if (intProductTypeID === IDs.intProdTypeIdVentumLite) {
        info.fdtElecHeaterVoltage = db?.dbtSelElectricalVoltage?.filter(
          (item: { electric_heater_3: number; id: any }) => item.electric_heater_3 === 1);
        info.defaultId = Number(getValues('ddlUnitVoltage'));
        info.isEnabled = false;
      } else if (intProductTypeID === IDs.intProdTypeIdTerra && Number(getValues('ckbVoltageSPP'))) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter((item: { terra_spp: number; id: any }) => item.terra_spp === 1);
          info.defaultId = Number(getValues('ddlUnitVoltage'));
          info.isEnabled = false;
      } else if (intProductTypeID === IDs.intProdTypeIdVentumPlus && (Number(getValues('ckbVoltageSPP')) || Number(getValues('ddlPreheatComp')) === IDs.intCompIdAuto)
      ) {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter(
          (item: { ventumplus_elec_heater: number; id: any }) =>
            item.ventumplus_elec_heater === 1);

        info.defaultId = Number(getValues('ddlUnitVoltage'));
        info.isEnabled = false;
      } else {
        info.fdtElecHeaterVoltage = info.fdtElecHeaterVoltage?.filter(
          (item: { electric_heater: number; id: any }) => item.electric_heater === 1);

        info.defaultId = IDs.intElectricVoltageId208V_3Ph_60Hz;
      }
  
      info.isVisible = false;
    }



    setElecHeaterVoltageInfo(info);
    info.defaultId = info.fdtElecHeaterVoltage?.[0]?.id;
    setValue('ddlElecHeaterVoltage', info.defaultId);

  }, [db, intProductTypeID, getValues('ddlPreheatComp'), getValues('ddlHeatingComp'), getValues('ddlReheatComp'), 
      getValues('ddlUnitVoltage'), getValues('ckbVoltageSPP')]);


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
    if (Number(getValues('ddlReheatComp')) === IDs.intCompIdElecHeater) {
      if (Number(getValues('ddlHeatingComp')) === IDs.intCompIdElecHeater) {
        setValue('ddlHeatingElecHeaterInstall', getValues('ddlReheatElecHeaterInstall'));
      }
    }
  }, [getValues('ddlReheatElecHeaterInstall')]);


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

    if (
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlPreheatFluidType', getValues('ddlHeatingFluidType'));
      setValue('ddlPreheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
      setValue('txbPreheatFluidEntTemp', getValues('txbHeatingFluidEntTemp'));
      setValue('txbPreheatFluidLvgTemp', getValues('txbHeatingFluidLvgTemp'));
    } else if (
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlPreheatFluidType', getValues('ddlReheatFluidType'));
      setValue('ddlPreheatFluidConcentration', getValues('ddlReheatFluidConcentration'));
      setValue('txbPreheatFluidEntTemp', getValues('txbReheatFluidEntTemp'));
      setValue('txbPreheatFluidLvgTemp', getValues('txbReheatFluidLvgTemp'));
    } else {
      info.defaultId = info.fdtFluidType?.[0]?.id;
      setValue('ddlPreheatFluidType', info.fdtFluidType?.[0]?.id);
    }
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
        (item: { fluid_type_id: number }) =>
          item.fluid_type_id === Number(getValues('ddlPreheatFluidType'))
      );
    } else {
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter(
        (item: { fluid_type_id: number }) => item.fluid_type_id === preheatFluidTypeInfo?.defaultId
      );
    }

    info.fdtFluidConcen = db?.dbtSelFluidConcentration?.filter(
      (e: { id: any }) =>
        fluidConFluidTypLink?.filter(
          (e_link: { fluid_concen_id: any }) => e.id === e_link.fluid_concen_id
        )?.length > 0
    );

    setPreheatFluidConcenInfo(info);

    if (
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlPreheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
    } else if (
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlPreheatFluidConcentration', getValues('ddlReheatFluidConcentration'));
    } else {
      info.defaultId = info.fdtFluidConcen?.[0]?.id;
      setValue('ddlPreheatFluidConcentration', info.fdtFluidConcen?.[0]?.id);
    }
  }, [db, getValues('ddlPreheatComp'), getValues('ddlPreheatFluidType')]);


  useEffect(() => {
    if (
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlHeatingFluidType', getValues('ddlPreheatFluidType'));
      setValue('ddlHeatingFluidConcentration', getValues('ddlPreheatFluidConcentration'));
      setValue('txbHeatingFluidEntTemp', getValues('txbPreheatFluidEntTemp'));
      setValue('txbHeatingFluidLvgTemp', getValues('txbPreheatFluidLvgTemp'));
    }

    if (
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlReheatFluidType', getValues('ddlPreheatFluidType'));
      setValue('ddlReheatFluidConcentration', getValues('ddlPreheatFluidConcentration'));
      setValue('txbReheatFluidEntTemp', getValues('txbPreheatFluidEntTemp'));
      setValue('txbReheatFluidLvgTemp', getValues('txbPreheatFluidLvgTemp'));
    }
  }, [
    getValues('ddlPreheatFluidType'),
    getValues('ddlPreheatFluidConcentration'),
    getValues('txbPreheatFluidEntTemp'),
    getValues('txbPreheatFluidLvgTemp'),
  ]);


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

    if (
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlHeatingFluidType', getValues('ddlPreheatFluidType'));
      setValue('ddlHeatingFluidConcentration', getValues('ddlPreheatFluidConcentration'));
      setValue('txbHeatingFluidEntTemp', getValues('txbPreheatFluidEntTemp'));
      setValue('txbHeatingFluidLvgTemp', getValues('txbPreheatFluidLvgTemp'));
    } else if (
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlHeatingFluidType', getValues('ddlReheatFluidType'));
      setValue('ddlHeatingFluidConcentration', getValues('ddlReheatFluidConcentration'));
      setValue('txbHeatingFluidEntTemp', getValues('txbReheatFluidEntTemp'));
      setValue('txbHeatingFluidLvgTemp', getValues('txbReheatFluidLvgTemp'));
    } else {
      info.defaultId = info.fdtFluidType?.[0]?.id;
      setValue('ddlHeatingFluidType', info.fdtFluidType?.[0]?.id);
    }
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

    setHeatingFluidConcenInfo(info);

    if (
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlHeatingFluidConcentration', getValues('ddlPreheatFluidConcentration'));
    } else if (
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlHeatingFluidConcentration', getValues('ddlReheatFluidConcentration'));
    } else {
      info.defaultId = info.fdtFluidConcen?.[0]?.id;
      setValue('ddlHeatingFluidConcentration', info.fdtFluidConcen?.[0]?.id);
    }
  }, [db, getValues('ddlHeatingComp'), getValues('ddlHeatingFluidType')]);

  // Heating Fluid
  useEffect(() => {
    if (
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlPreheatFluidType', getValues('ddlHeatingFluidType'));
      setValue('ddlPreheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
      setValue('txbPreheatFluidEntTemp', getValues('txbHeatingFluidEntTemp'));
      setValue('txbPreheatFluidLvgTemp', getValues('txbHeatingFluidLvgTemp'));
    }

    if (
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlReheatFluidType', getValues('ddlHeatingFluidType'));
      setValue('ddlReheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
      setValue('txbReheatFluidEntTemp', getValues('txbHeatingFluidEntTemp'));
      setValue('txbReheatFluidLvgTemp', getValues('txbHeatingFluidLvgTemp'));
    }
  }, [
    getValues('ddlHeatingFluidType'),
    getValues('ddlHeatingFluidConcentration'),
    getValues('txbHeatingFluidEntTemp'),
    getValues('txbHeatingFluidLvgTemp'),
  ]);


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

    if (
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlReheatFluidType', getValues('ddlPreheatFluidType'));
      setValue('ddlReheatFluidConcentration', getValues('ddlPreheatFluidConcentration'));
      setValue('txbReheatFluidEntTemp', getValues('txbPreheatFluidEntTemp'));
      setValue('txbReheatFluidLvgTemp', getValues('txbPreheatFluidLvgTemp'));
    } else if (
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlReheatFluidType', getValues('ddlHeatingFluidType'));
      setValue('ddlReheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
      setValue('txbReheatFluidEntTemp', getValues('txbHeatingFluidEntTemp'));
      setValue('txbReheatFluidLvgTemp', getValues('txbHeatingFluidLvgTemp'));
    } else {
      info.defaultId = info.fdtFluidType?.[0]?.id;
      setValue('ddlReheatFluidType', info.fdtFluidType?.[0]?.id);
    }
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
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter(
        (item: { fluid_type_id: number }) =>
          item.fluid_type_id === Number(getValues('ddlReheatFluidType'))
      );
    } else {
      fluidConFluidTypLink = db?.dbtSelFluidConcenFluidTypeLink?.filter(
        (item: { fluid_type_id: number }) => item.fluid_type_id === reheatFluidTypeInfo?.defaultId
      );
    }

    info.fdtFluidConcen = db?.dbtSelFluidConcentration?.filter(
      (e: { id: any }) =>
        fluidConFluidTypLink?.filter(
          (e_link: { fluid_concen_id: any }) => e.id === e_link.fluid_concen_id
        )?.length > 0
    );

    setReheatFluidConcenInfo(info);

    if (
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlReheatFluidConcentration', getValues('ddlPreheatFluidConcentration'));
    } else if (
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlReheatFluidConcentration', getValues('ddlHeatingFluidConcentration'));
    } else {
      info.defaultId = info.fdtFluidConcen?.[0]?.id;
      setValue('ddlReheatFluidConcentration', info.fdtFluidConcen?.[0]?.id);
    }
  }, [db, getValues('ddlReheatComp'), getValues('ddlReheatFluidType')]);


  // useCallback(
  //   (e: any) => {
  useEffect(() => {
    if (
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlPreheatFluidType', getValues('ddlReheatFluidType'));
      setValue('ddlPreheatFluidConcentration', getValues('ddlReheatFluidConcentration'));
      setValue('txbPreheatFluidEntTemp', getValues('txbReheatFluidEntTemp'));
      setValue('txbPreheatFluidLvgTemp', getValues('txbReheatFluidLvgTemp'));
    }

    if (
      Number(getValues('ddlReheatComp')) === IDs.intCompIdHWC &&
      Number(getValues('ddlHeatingComp')) === IDs.intCompIdHWC
    ) {
      setValue('ddlHeatingFluidType', getValues('ddlReheatFluidType'));
      setValue('ddlHeatingFluidConcentration', getValues('ddlReheatFluidConcentration'));
      setValue('txbHeatingFluidEntTemp', getValues('txbReheatFluidEntTemp'));
      setValue('txbHeatingFluidLvgTemp', getValues('txbReheatFluidLvgTemp'));
    }
  }, [
    getValues('ddlReheatFluidType'),
    getValues('ddlReheatFluidConcentration'),
    getValues('txbReheatFluidEntTemp'),
    getValues('txbReheatFluidLvgTemp'),
  ]);


  const [damperActuatorInfo, setDamperActuatorInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtDamperActuator: any; isVisible: boolean } = {
      fdtDamperActuator: [],
      isVisible: false,
    };

    let damperActuatorProdTypeLink = db?.dbtSelDamperActuatorProdTypeLink;
    damperActuatorProdTypeLink = damperActuatorProdTypeLink?.filter(
      (item: { prod_type_id: number }) => item.prod_type_id === intProductTypeID
    );

    // info.fdtDamperActuator = db?.dbtSelDamperActuator;
    info.fdtDamperActuator = db?.dbtSelDamperActuator?.filter(
      (e: { id: number }) =>
        damperActuatorProdTypeLink?.filter(
          (e_link: { damper_actuator_id: number }) => e.id === e_link.damper_actuator_id
        )?.length > 0
    );

    info.isVisible = true;

    setDamperActuatorInfo(info);

    switch (Number(getValues('ddlLocation'))) {
      case IDs.intLocationIdIndoor:
        setValue('ddlDamperAndActuator', info.fdtDamperActuator?.[0]?.id); //
        break;
      case IDs.intLocationIdOutdoor:
        info.isVisible = false;

        switch (intProductTypeID) {
          case IDs.intProdTypeIdNova:
            setValue('ddlDamperAndActuator', IDs.intDamperActIdFactMountedAndWired); //
            break;
          case IDs.intProdTypeIdVentum:
          case IDs.intProdTypeIdVentumLite:
          case IDs.intProdTypeIdTerra:
            setValue('ddlDamperAndActuator', IDs.intDamperActIdFieldInstAndWired); //
            break;
          case IDs.intProdTypeIdVentumPlus:
            setValue('ddlDamperAndActuator', IDs.intDamperActIdFactMountedAndWired); //
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }

    setValue('ddlDamperAndActuator', info.fdtDamperActuator?.[0]?.id); //
  }, [db, intProductTypeID, getValues('ddlLocation')]);


  const [valveAndActuatorInfo, setValveAndActuatorInfo] = useState<any>([]);
  useMemo(() => {
    const info: { isVisible: boolean; defaultId: number } = {
      isVisible: false,
      defaultId: 0,
    };


    if (Number(getValues('ddlPreheatComp')) === IDs.intCompIdHWC ||
        Number(getValues('ddlCoolingComp'))  === IDs.intCompIdCWC ||
        Number(getValues('ddlHeatingComp'))  === IDs.intCompIdHWC ||
        Number(getValues('ddlReheatComp'))  === IDs.intCompIdHWC
    ) {
        info.isVisible = true;
        setValue('ckbValveAndActuator', 1); //
      } else {
        info.isVisible = false;
        setValue('ckbValveAndActuator', 0); //
    }

    setValveAndActuatorInfo(info);

  }, [getValues('ddlPreheatComp'), getValues('ddlCoolingComp'), getValues('ddlHeatingComp'), getValues('ddlReheatComp')]);


  const [valveTypeInfo, setValveTypeInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtValveType: any; isVisible: boolean } = { fdtValveType: [], isVisible: false };

    info.fdtValveType = db?.dbtSelValveType;
    info.fdtValveType = info.fdtValveType?.filter((item: { enabled: number }) => item.enabled === 1);


    switch (Number(getValues('ckbValveAndActuator'))) {
      case 1:
        info.isVisible = true;
        break;
      case 0:
        info.isVisible = false;
        break;
      default:
        break;
    }


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

    setValveTypeInfo(info);
    setValue('ddlValveType', info.fdtValveType?.[0]?.id); //

  }, [db, getValues('ckbValveAndActuator')]);


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

  }, [db]);


  const [preheatCoilHandingInfo, setPreheatCoilHandingInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHanding: any; isVisible: boolean } = { fdtHanding: [], isVisible: false };

    info.fdtHanding = db?.dbtSelHanding;


    switch (Number(getValues('ddlPreheatComp'))) {
      case IDs.intCompIdHWC:
      case IDs.intCompIdElecHeater:
        info.isVisible = true;
        break;
      case IDs.intCompIdNA:
        info.isVisible = false;
        break;
      default:
        break;
    }


    setPreheatCoilHandingInfo(info);
    setValue('ddlPreheatCoilHanding', info?.fdtHanding[0]?.id);

  }, [db, getValues('ddlPreheatComp')]);


  const [coolingCoilHandingInfo, setCoolingCoilHandingInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHanding: any; isVisible: boolean } = { fdtHanding: [], isVisible: false };

    info.fdtHanding = db?.dbtSelHanding;


    switch (Number(getValues('ddlCoolingComp'))) {
      case IDs.intCompIdCWC:
      case IDs.intCompIdDX:
        info.isVisible = true;
        break;
      case IDs.intCompIdNA:
        info.isVisible = false;
        break;
      default:
        break;
    }


    setCoolingCoilHandingInfo(info);
    setValue('ddlCoolingCoilHanding', info?.fdtHanding[0].id);

  }, [db, getValues('ddlCoolingComp')]);


  const [heatingCoilHandingInfo, setHeatingCoilHandingInfo] = useState<any>([]);
  useMemo(() => {
    const info: { fdtHanding: any; isVisible: boolean } = { fdtHanding: [], isVisible: false };

    info.fdtHanding = db?.dbtSelHanding;

    switch (Number(getValues('ddlHeatingComp'))) {
      case IDs.intCompIdElecHeater:
      case IDs.intCompIdHWC:
        info.isVisible = true;
        break;
      case IDs.intCompIdNA:
        info.isVisible = false;
        break;
      default:
        break;
    }



    setHeatingCoilHandingInfo(info);
    setValue('ddlHeatingCoilHanding', info?.fdtHanding[0].id);

  }, [db, getValues('ddlHeatingComp')]);


  const [reheatCoilHandingInfo, setReheatCoilHandingInfo] = useState<any>([]);
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

    setReheatCoilHandingInfo(info);
    setValue('ddlReheatCoilHanding', info?.fdtHanding[0].id);

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
        info.defaultId = info?.fdtSupplyAirOpening[0].id;

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

    info.defaultId = info?.fdtSupplyAirOpening[0]?.id;
    info.supplyAirOpeningText = info?.fdtSupplyAirOpening[0]?.items;


    setSupplyAirOpeningInfo(info);
    info.defaultId = info?.fdtSupplyAirOpening[0]?.id;
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
    const dtNoSelectionTable : any = [{ id: 0, items: 'NA' }] || [];
    const outdoorAirOpeningText = db?.dbtSelOpeningsERV_SA?.filter((item: { id: number }) => item.id === Number(getValues('ddlSupplyAirOpening')))[0]?.items;


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
      info.exhaustAirOpeningId = info.fdtExhaustAirOpening[0]?.id;
      info.exhaustAirOpeningText = info.fdtExhaustAirOpening[0]?.items;
      info.isExhaustAirOpeningVisible = true;
  
   
      dtLink = dtOpeningsERV_SA_OA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === intProductTypeID);
      dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === outdoorAirOpeningText);
      dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(getValues('ddlOrientation')));
  
      
      info.fdtOutdoorAirOpening = db?.dbtSelOpeningsERV_OA;
      info.fdtOutdoorAirOpening = info.fdtOutdoorAirOpening?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
  
      info.fdtOutdoorAirOpening = info.fdtOutdoorAirOpening?.filter((e: { items: any }) => dtLink?.filter((e_link) => e.items === e_link.openings_oa)?.length === 1); // 1: Matching items, 0: Not matching items
  
      // returnInfo.ddlOutdoorAirOpeningDataTbl = dtSelectionFinalTable;
      info.outdoorAirOpeningId = info.fdtOutdoorAirOpening[0]?.id;
      info.outdoorAirOpeningText = info.fdtOutdoorAirOpening[0]?.items;
      info.isOutdoorAirOpeningVisible = true;
  
  
      dtLink = dtOpeningsERV_SA_RA_Link?.filter((item: { prod_type_id: number }) => item.prod_type_id === intProductTypeID);
      dtLink = dtLink?.filter((item: { openings_sa: any }) => item.openings_sa === outdoorAirOpeningText);
      dtLink = dtLink?.filter((item: { orientation_id: number }) => item.orientation_id === Number(Number(getValues('ddlOrientation'))));
  
  
      
      info.fdtReturnAirOpening = db?.dbtSelOpeningsERV_RA;
      info.fdtReturnAirOpening = info.fdtReturnAirOpening?.filter((item: { prod_type_id: number }) => item.prod_type_id === Number(intProductTypeID));
  
      info.fdtReturnAirOpening = info.fdtReturnAirOpening?.filter((e: { items: any }) => dtLink?.filter((e_link) => e.items === e_link.openings_ra)?.length === 1); // 1: Matching items, 0: Not matching items
  
      // returnInfo.ddlReturnAirOpeningDataTbl = dtSelectionFinalTable;
      info.returnAirOpeningId = info.fdtReturnAirOpening[0]?.id;
      info.returnAirOpeningText = info.fdtReturnAirOpening[0]?.items;
      info.isReturnAirOpeningVisible = true;
          break;
      case IDs.intUnitTypeIdAHU:
        info.fdtReturnAirOpening = db?.dbtSelOpeningsFC_OA;
        info.outdoorAirOpeningId = info.fdtReturnAirOpening[0]?.id;
        info.outdoorAirOpeningText = info.fdtReturnAirOpening[0]?.items;
        info.isOutdoorAirOpeningVisible = true;

    
        info.fdtOutdoorAirOpening = dtNoSelectionTable;
        info.exhaustAirOpeningId = 0;
        info.exhaustAirOpeningText = 'NA';
        info.isExhaustAirOpeningVisible = false;
    
        info.fdtReturnAirOpening = dtNoSelectionTable;
        info.returnAirOpeningId = 0;
        info.exhaustAirOpeningText = 'NA';
        info.isReturnAirOpeningVisible = false;
            break;
      default:
        break;
    }


    setRemainingOpeningsInfo(info);
    setValue('ddlExhaustAirOpening', info?.exhaustAirOpeningId);
    setValue('ddlExhaustAirOpeningText', info?.exhaustAirOpeningText);
    setValue('ddlOutdoorAirOpening', info?.outdoorAirOpeningId);
    setValue('ddlOutdoorAirOpeningText', info?.outdoorAirOpeningText);
    setValue('ddlReturnAirOpening', info?.returnAirOpeningId);
    setValue('ddlReturnAirOpeningText', info?.returnAirOpeningText);

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


  const ddlUnitModelChanged = useCallback((e: any) => {
      setValue('ddlUnitModel', Number(e.target.value));
    },
    [setValue]
  );


  const ddlUnitVoltageChanged = useCallback((e: any) => 
    setValue('ddlUnitVoltage', Number(e.target.value)),
  [setValue]
  );


  const ddlPreheatCompChanged = useCallback(
    (e: any) => setValue('ddlPreheatComp', Number(e.target.value)),
    [setValue]
  );


  const ddlCoolingCompChanged = useCallback(
    (e: any) => setValue('ddlCoolingComp', Number(e.target.value)),
    [setValue]
  );


  const ddlElecHeaterVoltageChanged = useCallback(
    (e: any) => setValue('ddlElecHeaterVoltage', Number(e.target.value)),
    [setValue]
  );


  const ddlDamperAndActuatorChanged = useCallback(
    (e: any) => setValue('ddlDamperAndActuator', Number(e.target.value)),
    [setValue]
  );


  const ddlValveTypeChanged = useCallback(
    (e: any) => setValue('ddlValveType', Number(e.target.value)),
    [setValue]
  );


  const ddlHandingChanged = useCallback(
    (e: any) => {
      setValue('ddlHanding', Number(e.target.value));
      setValue('ddlPreheatCoilHanding', Number(e.target.value));
      setValue('ddlCoolingCoilHanding', Number(e.target.value));
      setValue('ddlHeatingCoilHanding', Number(e.target.value));
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
      setValue('ddlOutdoorAirOpeningText', e.target.options[e.target.selectedIndex].text);
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



  // ------------------------------ Get Bypass State -------------------------------
  // const ckbBypassInfo = useMemo(() => {
  //   const result = getBypass(
  //     db,
  //     intProductTypeID,
  //     formValues.ddlUnitModel,
  //     formValues.ddlOrientation,
  //     Number(formValues.ckbBypass)
  //   );
  //   setCkbBypassVal(!!result.checked);
  //   return result;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [db, intProductTypeID, formValues.ddlOrientation, formValues.ddlUnitModel]);


  // ---------------------------- Get Orientation Info -----------------------------
  // const orientationInfo = useMemo(() => {
  //   const orientationData = getOrientation(
  //     db,
  //     intProductTypeID,
  //     intUnitTypeID,
  //     formValues.ddlLocation,
  //     Number(formValues.txbSummerSupplyAirCFM)
  //   );

  //   if (
  //     orientationData?.filter((item: any) => item.id && item.id === formValues.ddlOrientation)
  //       .length === 0
  //   ) {
  //     setValue('ddlOrientation', orientationData?.[0]?.id || 0);
  //   }

  //   return orientationData;
  // }, [
  //   db,
  //   intProductTypeID,
  //   intUnitTypeID,
  //   setValue,
  //   formValues.ddlLocation,
  //   formValues.ddlOrientation,
  //   formValues.txbSummerSupplyAirCFM,
  // ]);


  // ---------------------------- Get Orientation Info -----------------------------
  // const locationInfo = useMemo(() => {
  //   const locations = getLocation(db, intProductTypeID, intUnitTypeID);

  //   if (locations?.filter((item: any) => item.id === formValues.ddlLocation)?.length === 0) {
  //     setValue('ddlLocation', locations[0]?.id);
  //   }

  //   return locations;
  // }, [db, intProductTypeID, intUnitTypeID, setValue, formValues.ddlLocation]);


  // ---------------------------- Get Unit Voltage Info -----------------------------
  // const unitVoltage = useMemo(() => {
  //   const { unitVoltageList, ddlUnitVoltageId } = getUnitVoltage(
  //     db,
  //     intProductTypeID,
  //     strUnitModelValue
  //   );
  //   if ( unitVoltageList?.filter((item: any) => item.id === formValues.ddlUnitVoltage)?.length === 0) {
  //     setValue('ddlUnitVoltage', ddlUnitVoltageId);
  //   }
  //   return unitVoltageList;
  // }, [db, intProductTypeID, strUnitModelValue, formValues.ddlUnitVoltage, setValue]);


  // ---------------------------- Get QAFilter Model DDL -----------------------------
  // const OAFilterModel = useMemo(
  //   () => db?.dbtSelFilterModel?.filter((item: any) => item.outdoor_air === 1),
  //   [db]);

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
      setValue('ddlRA_FilterModel', RAFilterModel?.dataTable[0]?.id);

      // if (edit) {
      //   setValue('ddlRA_FilterModel', defaultValues?.ddlRA_FilterModel);
      // }
    }
  }, [setValue, RAFilterModel, formValues.ddlRA_FilterModel]);


  // ------------------------- Get each complete informaiton --------------------------
  // const { dtPreheatComp, dtCoolingComp, dtHeatingComp } = useMemo(
  //   () => getComponentInfo(db, Number(intProductTypeID), Number(intUnitTypeID)),
  //   [db, intProductTypeID, intUnitTypeID]
  // );


  // const { dtReheatComp } = useMemo(
  //   () =>
  //     getReheatInfo(
  //       db,
  //       formValues.ckbDehumidification,
  //       Number(formValues.ddlCoolingComp),
  //       Number(user?.UAL || 0),
  //       Number(intUnitTypeID),
  //       Number(intProductTypeID),
  //       Number(formValues.ddlUnitModel)
  //     ),
  //   [
  //     formValues.ckbDehumidification,
  //     db,
  //     intProductTypeID,
  //     intUnitTypeID,
  //     user?.UAL,
  //     formValues.ddlCoolingComp,
  //     formValues.ddlUnitModel,
  //   ]
  // );


  // ---------------- Get Preheat Elec Heater Installation Info --------------------
  // const preheatElecHeaterInstallationInfo = useMemo(() => {
  //   const result = getPreheatElecHeaterInstallationInfo(
  //     db,
  //     Number(formValues.ddlPreheatComp),
  //     Number(formValues.ddlLocation),
  //     intProductTypeID
  //   );
  //   setValue('ddlPreheatElecHeaterInstall', result?.ddlPreheatElecHeaterInstallationId || 1);

  //   // if (!edit) {
  //   //   setValue('ddlPreheatElecHeaterInstall', result?.ddlPreheatElecHeaterInstallationId || 1);
  //   // }

  //   return result.ddlPreheatElecHeaterInstallationDataTbl;
  // }, [edit, db, setValue, intProductTypeID, formValues.ddlLocation, formValues.ddlPreheatComp]);


  const preheatHWCCapInfo = useMemo(() => {
    const info: { resetCapacity: number; isDisabled: boolean } = {
      resetCapacity: 0,
      isDisabled: true,
    };

    if (Number(formValues.ckbPreheatHWCUseCap) === 0) {
      setValue('txbPreheatHWCCap', '0');
      info.isDisabled = true;
    } else {
      info.isDisabled = false;
    }

    return info;
  }, [formValues.ckbPreheatHWCUseCap]);


  const preheatHWCFlowRateInfo = useMemo(() => {
    const info: { resetCapacity: number; isDisabled: boolean } = {
      resetCapacity: 0,
      isDisabled: true,
    };

    if (Number(formValues.ckbPreheatHWCUseFlowRate) === 0) {
      setValue('txbPreheatHWCFlowRate', '0');
      info.isDisabled = true;
    } else {
      info.isDisabled = false;
    }

    return info;
  }, [formValues.ckbPreheatHWCUseFlowRate]);


  const coolingCWCCapInfo = useMemo(() => {
    const info: { resetCapacity: number; isDisabled: boolean } = {
      resetCapacity: 0,
      isDisabled: true,
    };

    if (Number(formValues.ckbCoolingCWCUseCap) === 0) {
      setValue('txbCoolingCWCCap', '0');
      info.isDisabled = true;
    } else {
      info.isDisabled = false;
    }

    return info;
  }, [formValues.ckbCoolingCWCUseCap]);


  const coolingCWCFlowRateInfo = useMemo(() => {
    const info: { resetCapacity: number; isDisabled: boolean } = {
      resetCapacity: 0,
      isDisabled: true,
    };

    if (Number(formValues.ckbCoolingCWCUseFlowRate) === 0) {
      setValue('txbCoolingCWCFlowRate', '0');
      info.isDisabled = true;
    } else {
      info.isDisabled = false;
    }

    return info;
  }, [formValues.ckbCoolingCWCUseFlowRate]);


  const heatingHWCCapInfo = useMemo(() => {
    const info: { resetCapacity: number; isDisabled: boolean } = {
      resetCapacity: 0,
      isDisabled: true,
    };

    if (Number(formValues.ckbHeatingHWCUseCap) === 0) {
      setValue('txbHeatingHWCCap', '0');
      info.isDisabled = true;
    } else {
      info.isDisabled = false;
    }

    return info;
  }, [formValues.ckbHeatingHWCUseCap]);


  const heatingHWCFlowRateInfo = useMemo(() => {
    const info: { resetCapacity: number; isDisabled: boolean } = {
      resetCapacity: 0,
      isDisabled: true,
    };

    if (Number(formValues.ckbHeatingHWCUseFlowRate) === 0) {
      setValue('txbHeatingHWCFlowRate', '0');
      info.isDisabled = true;
    } else {
      info.isDisabled = false;
    }

    return info;
  }, [formValues.ckbHeatingHWCUseFlowRate]);


  const reheatHWCCapInfo = useMemo(() => {
    const info: { resetCapacity: number; isDisabled: boolean } = {
      resetCapacity: 0,
      isDisabled: true,
    };

    if (Number(formValues.ckbReheatHWCUseCap) === 0) {
      setValue('txbReheatHWCCap', '0');
      info.isDisabled = true;
    } else {
      info.isDisabled = false;
    }

    return info;
  }, [formValues.ckbReheatHWCUseCap]);


  const reheatHWCFlowRateInfo = useMemo(() => {
    const info: { resetCapacity: number; isDisabled: boolean } = {
      resetCapacity: 0,
      isDisabled: true,
    };

    if (Number(formValues.ckbReheatHWCUseFlowRate) === 0) {
      setValue('txbReheatHWCFlowRate', '0');
      info.isDisabled = true;
    } else {
      info.isDisabled = false;
    }

    return info;
  }, [formValues.ckbReheatHWCUseFlowRate]);


  // -------------- Get User Authentication Level from LocalStorage ----------------
  // const ualInfo = useMemo(
  //   () => getUALInfo(Number(typeof window !== 'undefined' && localStorage.getItem('UAL'))),
  //   []
  // );


  // -------------- Get Heating Pump Information ----------------
  // const heatPumpInfo = useMemo(() => {
  //   const result = getHeatPumpInfo(Number(formValues.ddlCoolingComp));
  //   // ckbHeatPumpChanged();
  //   return result;
  // }, [formValues.ddlCoolingComp]);

  // -------------- Get Dehumidification Information ----------------
  // const dehumidificationInfo = useMemo(
  //   () => getDehumidificationInfo(Number(formValues.ddlCoolingComp)),
  //   [formValues.ddlCoolingComp]);

  // -------------- Get Coil Refrigerate Design Condition Information ----------------
  // const dxCoilRefrigDesignCondInfo = useMemo(
  //   () =>
  //     getDXCoilRefrigDesignCondInfo(
  //       Number(typeof window !== 'undefined' && localStorage.getItem('UAL')),
  //       Number(formValues.ddlCoolingComp)
  //     ),
  //   [formValues.ddlCoolingComp]);

  // const heatElecHeaterInstallationInfo = useMemo(
  //   () =>
  //     getHeatElecHeaterInstallationInfo(
  //       db,
  //       Number(formValues.ddlHeatingComp),
  //       Number(formValues.ddlReheatComp)
  //     ),
  //   [db, intProductTypeID, formValues.ddlHeatingComp, formValues.ddlReheatComp]);


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

  // const coolingFluidTypeInfo = useMemo(() => {
  //   const result = getCoolingFluidTypeInfo(db, Number(formValues.ddlCoolingComp));

  //   // if (!edit) {
  //     setValue('ddlCoolingFluidType', result?.defaultId);
  //     // setValue('ddlCoolingFluidConcentrationId', result?.defaultId);
  //   // }

  //   return result;
  // }, [edit,db,setValue,formValues.ddlCoolingComp,]);

  // const coolingFluidConcenInfo = useMemo(() => {
  //   const result = getCoolingFluidConcenInfo(db, Number(formValues.ddlCoolingFluidType),);

  //   // if (!edit) {
  //     setValue('ddlCoolingFluidConcentration', result?.defaultId);
  //   // }

  //   return result;
  // }, [edit,db,setValue,formValues.ddlCoolingFluidType,]);

  // const damperAndActuatorInfo = useMemo(() => {
  //   const result = getDamperAndActuatorInfo(
  //     db,
  //     Number(intProductTypeID),
  //     Number(formValues.ddlLocation)
  //   );
  //   if (!edit) setValue('ddlDamperAndActuator', result?.ddlDamperAndActuatorId);
  //   return result;
  // }, [edit, db, setValue, intProductTypeID, formValues.ddlLocation]);


  // const elecHeaterVoltageInfo = useMemo(() => {
  //   const result = getElecHeaterVoltageInfo(
  //     db,
  //     Number(formValues.ddlPreheatComp),
  //     Number(formValues.ddlHeatingComp),
  //     Number(formValues.ddlReheatComp),
  //     Number(intProductTypeID),
  //     Number(intUnitTypeID),
  //     Number(formValues.ddlElecHeaterVoltage),
  //     Number(formValues.ddlUnitVoltage),
  //     Number(formValues.ckbVoltageSPP),
  //     strUnitModelValue
  //   );

  //   // if (!edit && result?.ddlElecHeaterVoltageDataTbl) {
  //     if (result?.ddlElecHeaterVoltageDataTbl) {
  //     const selectedId = result?.ddlElecHeaterVoltageDataTbl.find(
  //       (item) => item.id === formValues.ddlElecHeaterVoltage
  //     );

  //     if (!selectedId) {
  //       setValue('ddlElecHeaterVoltage', result?.ddlElecHeaterVoltageId);
  //     }
  //   }

  //   return result;
  // }, [
  //   edit,
  //   formValues.ckbVoltageSPP,
  //   db,
  //   setValue,
  //   intProductTypeID,
  //   intUnitTypeID,
  //   formValues.ddlElecHeaterVoltage,
  //   formValues.ddlHeatingComp,
  //   formValues.ddlPreheatComp,
  //   formValues.ddlReheatComp,
  //   formValues.ddlUnitVoltage,
  //   strUnitModelValue,
  // ]);


  // const valveAndActuatorInfo = useMemo(
  //   () =>
  //     getValveAndActuatorInfo(
  //       Number(formValues.ddlCoolingComp),
  //       Number(formValues.ddlPreheatComp),
  //       Number(formValues.ddlHeatingComp),
  //       Number(formValues.ddlReheatComp)
  //     ),
  //   [
  //     formValues.ddlCoolingComp,
  //     formValues.ddlHeatingComp,
  //     formValues.ddlPreheatComp,
  //     formValues.ddlReheatComp,
  //   ]
  // );


  // const drainPanInfo = useMemo(
  //   () => getDrainPanInfo(Number(intProductTypeID), Number(intUnitTypeID)),
  //   [intProductTypeID, intUnitTypeID]
  // );

  // // const handingInfo = useMemo(() => {
  // //   const result = getHandingInfo(db);
  // //   if (!edit) setValue('ddlHandingId', result.ddlHandingId);
  // //   return result;
  // // }, [edit, db, setValue]);




  // const supplyAirOpeningInfo = useMemo(() => {
  //   const result = getSupplyAirOpeningInfo(
  //     db,
  //     Number(intUnitTypeID),
  //     Number(intProductTypeID),
  //     Number(formValues.ddlLocation),
  //     Number(formValues.ddlOrientation),
  //     formValues.ddlSupplyAirOpening,
  //     formValues.ddlSupplyAirOpeningText,
  //     Number(formValues.ddlCoolingComp),
  //     Number(formValues.ddlHeatingComp),
  //     Number(formValues.ddlReheatComp)
  //   );

  //   setValue('ddlSupplyAirOpening',  result?.ddlSupplyAirOpeningId);
  //   setValue('ddlSupplyAirOpeningText', result?.ddlSupplyAirOpeningText);

  //   return result;
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   edit,
  //   db,
  //   setValue,
  //   intProductTypeID,
  //   intUnitTypeID,
  //   formValues.ddlCoolingComp,
  //   formValues.ddlHeatingComp,
  //   formValues.ddlLocation,
  //   formValues.ddlOrientation,
  //   formValues.ddlReheatComp,
  // ]);


  // const [remainingOpeningsInfo, setRemainingOpeningsInfo] = useState<any>({});
  // useEffect(() => {
  //   if (!formValues.ddlOrientation || !formValues.ddlSupplyAirOpeningText || !intProductTypeID)
  //     return;

  //   const result = getRemainingOpeningsInfo(
  //     db,
  //     Number(intUnitTypeID),
  //     Number(intProductTypeID),
  //     formValues.ddlSupplyAirOpeningText,
  //     Number(formValues.ddlOrientation)
  //   );

  //   // if (!edit) setValue('ddlExhaustAirOpeningId', result?.ddlExhaustAirOpeningId);
  //   // if (!edit) setValue('ddlExhaustAirOpeningText', result?.ddlExhaustAirOpeningText);
  //   // if (!edit) setValue('ddlOutdoorAirOpeningId', result?.ddlOutdoorAirOpeningId);
  //   // if (!edit) setValue('ddlOutdoorAirOpeningText', result?.ddlOutdoorAirOpeningText);
  //   // if (!edit) setValue('ddlReturnAirOpeningId', result?.ddlReturnAirOpeningId);
  //   // if (!edit) setValue('ddlReturnAirOpeningText', result?.ddlReturnAirOpeningText);

  //   setValue('ddlExhaustAirOpening', result?.ddlExhaustAirOpeningId);
  //   setValue('ddlExhaustAirOpeningText', result?.ddlExhaustAirOpeningText);
  //   setValue('ddlOutdoorAirOpening', result?.ddlOutdoorAirOpeningId);
  //   setValue('ddlOutdoorAirOpeningText', result?.ddlOutdoorAirOpeningText);
  //   setValue('ddlReturnAirOpening', result?.ddlReturnAirOpeningId);
  //   setValue('ddlReturnAirOpeningText', result?.ddlReturnAirOpeningText);

  //   setRemainingOpeningsInfo(result);
  // }, [
  //   edit,
  //   db,
  //   setValue,
  //   intProductTypeID,
  //   intUnitTypeID,
  //   formValues.ddlOrientation,
  //   formValues.ddlSupplyAirOpeningText,
  // ]);


  // onChange functions
  const handleBlurSummerSupplyAirCFM = useCallback((e: any) => {
      // const value = getSummerSupplyAirCFM(e.target.value, intProductTypeID, Number(user?.UAL || 0), Number(formValues.ckbBypass), Number(formValues.ckbPHI));


      let intSummerSupplyAirCFM = Number(e.target.value);
      const intUAL= Number(localStorage?.getItem('UAL')) || 0;

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
    







      setValue('txbSummerSupplyAirCFM', intSummerSupplyAirCFM);
      setValue('txbSummerReturnAirCFM', intSummerSupplyAirCFM);
    },

    [formValues.ckbBypass, getAllFormData, setValue, user?.UAL || 0]
  );


  const handleBlurSummerReturnAirCFM = useCallback(
    (e: any) => {
      // const value = getSummerReturnAirCFM(e.target.value,getAllFormData(),Number(user?.UAL || 0),db);
      
      let intSummerReturnAirCFM = Number(e.target.value);
      const intSummerSupplyAirCFM = Number(getValues('txbSummerSupplyAirCFM'));
      const intUAL= Number(localStorage?.getItem('UAL')) || 0;


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


      setValue('txbSummerReturnAirCFM', intSummerReturnAirCFM);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [db, getAllFormData, setValue, user?.UAL || 0]
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


  const isAvailable = useCallback((value: any[]) => !!value && value.length > 0, []);
  if (edit && setFunction) setFunction(handleSubmit(onSubmit));

  // Load saved Values
  useEffect(() => {
    if (unitInfo !== null) {
      // if () {
      setValue('ddlLocation', unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0 ? 
                unitInfo?.oUnit?.intLocationId : getValues('ddlLocation'));
      // }

      // if (unitInfo?.oUnit?.intOrientationId > 0) {
      setValue('ddlOrientation', unitInfo?.oUnit?.intOrientationId > 0 ? 
                unitInfo?.oUnit?.intOrientationId : getValues('ddlOrientation'));
      // }

      // if (unitInfo?.oUnit?.intControlsPreferenceId > 0) {
      //   setValue('ddlControlsPreference', unitInfo?.oUnit?.intControlsPreferenceId);
      setValue('ddlControlsPref', unitInfo?.oUnit?.intControlsPreferenceId > 0 ? 
              unitInfo?.oUnit?.intControlsPreferenceId : getValues('ddlControlsPref'));
      // }

      setValue('txbSummerSupplyAirCFM', Number(unitInfo?.oUnitAirflow?.intSummerSupplyAirCFM) > 0 ? 
                unitInfo?.oUnitAirflow?.intSummerSupplyAirCFM : '325');

      setValue('txbSummerReturnAirCFM', Number(unitInfo?.oUnitAirflow?.intSummerReturnAirCFM) > 0 ? 
                unitInfo?.oUnitAirflow?.intSummerReturnAirCFM : '325');

      setValue('txbSupplyAirESP', Number.parseFloat(unitInfo?.oUnitAirflow?.dblSupplyAirESP) > 0.0 ? 
                unitInfo?.oUnitAirflow?.dblSupplyAirESP : '0.75');

      setValue('txbExhaustAirESP', Number.parseFloat(unitInfo?.oUnitAirflow?.dblExhaustAirESP) > 0.0 ? 
                unitInfo?.oUnitAirflow?.dblExhaustAirESP : '0.75');

      // if (unitInfo?.oUnit?.intUnitModelId > 0) {
      setValue('ddlUnitModel', unitInfo?.oUnit?.intUnitModelId > 0 ? 
                unitInfo?.oUnit?.intUnitModelId : getValues('ddlUnitModel'));
      // }

      // if (unitInfo?.oUnit?.intUnitVoltageId > 0) {
      setValue(
        'ddlUnitVoltage',
        unitInfo?.oUnit?.intUnitVoltageId > 0
          ? unitInfo?.oUnit?.intUnitVoltageId
          : getValues('ddlUnitVoltage')
      );
      // }

      // if (unitInfo?.oCompOpt?.intOAFilterModelId > 0) {
      setValue(
        'ddlOA_FilterModel',
        unitInfo?.oCompOpt?.intOAFilterModelId > 0
          ? unitInfo?.oCompOpt?.intOAFilterModelId
          : getValues('ddlOA_FilterModel')
      );
      // }

      // if (unitInfo?.oCompOpt?.intRAFilterModelId > 0) {
      setValue(
        'ddlRA_FilterModel',
        unitInfo?.oCompOpt?.intRAFilterModelId > 0
          ? unitInfo?.oCompOpt?.intRAFilterModelId
          : getValues('ddlRA_FilterModel')
      );
      // }

      // Preheat
      // if (unitInfo?.oUnitCompOpt?.intPreheatCompId > 0) {
      setValue(
        'ddlPreheatComp',
        unitInfo?.oUnitCompOpt?.intPreheatCompId > 0
          ? unitInfo?.oUnitCompOpt?.intPreheatCompId
          : getValues('ddlPreheatComp')
      );
      // }

      setValue(
        'txbWinterPreheatSetpointDB',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblPreheatSetpointDB) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblPreheatSetpointDB
          : '40'
      );

      // if (unitInfo?.oUnitLayout?.intPreheatCoilHandingId > 0) {
      setValue(
        'ddlPreheatCoilHanding',
        unitInfo?.oUnitLayout?.intPreheatCoilHandingId > 0
          ? unitInfo?.oUnitLayout?.intPreheatCoilHandingId
          : getValues('ddlLocation')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intPreheatElecHeaterInstallationId > 0) {
      setValue(
        'ddlPreheatElecHeaterInstall',
        unitInfo?.oUnitCompOpt?.intPreheatElecHeaterInstallationId > 0
          ? unitInfo?.oUnitCompOpt?.intPreheatElecHeaterInstallationId
          : getValues('ddlPreheatElecHeaterInstall')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0) {
      setValue(
        'ddlPreheatFluidType',
        unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0
          ? unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId
          : getValues('ddlPreheatFluidType')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId > 0) {
      setValue(
        'ddlPreheatFluidConcentration',
        unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId > 0
          ? unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId
          : getValues('ddlPreheatFluidConcentration')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp > 0) {
      setValue(
        'txbPreheatFluidEntTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp
          : '140'
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp > 0) {
      setValue(
        'txbPreheatFluidLvgTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp
          : '120'
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intIsPreheatHWCUseCap != null) {
      setValue(
        'ckbPreheatHWCUseCap',
        unitInfo?.oUnitCompOpt?.intIsPreheatHWCUseCap > 0
          ? unitInfo?.oUnitCompOpt?.intIsPreheatHWCUseCap
          : 0
      );
      // }

      setValue(
        'txbPreheatHWCCap',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblPreheatHWCCap) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblPreheatHWCCap
          : '0'
      );

      // if (unitInfo?.oUnitCompOpt?.intIsPreheatHWCUseFlowRate != null) {
      setValue(
        'ckbPreheatHWCUseFlowRate',
        unitInfo?.oUnitCompOpt?.intIsPreheatHWCUseFlowRate != null
          ? unitInfo?.oUnitCompOpt?.intIsPreheatHWCUseFlowRate
          : 0
      );
      // }

      setValue(
        'txbPreheatHWCFlowRate',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblPreheatHWCFlowRate) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblPreheatHWCFlowRate
          : '0'
      );

      // Cooling
      // if (unitInfo?.oUnitCompOpt?.intCoolingCompId > 0) {
      setValue(
        'ddlCoolingComp',
        unitInfo?.oUnitCompOpt?.intCoolingCompId > 0
          ? unitInfo?.oUnitCompOpt?.intCoolingCompId
          : getValues('ddlCoolingComp')
      );
      // }

      setValue(
        'txbSummerCoolingSetpointDB',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingSetpointDB) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblCoolingSetpointDB
          : '55'
      );
      setValue(
        'txbSummerCoolingSetpointWB',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingSetpointWB) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblCoolingSetpointWB
          : '54'
      );

      // if (unitInfo?.oUnitCompOpt?.intIsHeatPump > 0 ) {
      setValue(
        'ckbHeatPump',
        unitInfo?.oUnitCompOpt?.intIsHeatPump > 0 ? unitInfo?.oUnitCompOpt?.intIsHeatPump : 0
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intIsDehumidification > 0) {
      setValue(
        'ckbDehumidification',
        unitInfo?.oUnitCompOpt?.intIsDehumidification > 0
          ? unitInfo?.oUnitCompOpt?.intIsDehumidification
          : 0
      );
      // }

      // if (unitInfo?.oUnitLayout?.intCoolingCoilHandingId > 0) {
      setValue(
        'ddlCoolingCoilHanding',
        unitInfo?.oUnitLayout?.intCoolingCoilHandingId > 0
          ? unitInfo?.oUnitLayout?.intCoolingCoilHandingId
          : getValues('ddlCoolingCoilHanding')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intCoolingFluidTypeId > 0) {
      setValue(
        'ddlCoolingFluidType',
        unitInfo?.oUnitCompOpt?.intCoolingFluidTypeId > 0
          ? unitInfo?.oUnitCompOpt?.intCoolingFluidTypeId
          : getValues('ddlCoolingFluidType')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intCoolingFluidConcentId > 0) {
      setValue(
        'ddlCoolingFluidConcentration',
        unitInfo?.oUnitCompOpt?.intCoolingFluidConcentId > 0
          ? unitInfo?.oUnitCompOpt?.intCoolingFluidConcentId
          : getValues('ddlCoolingFluidConcentration')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.dblCoolingFluidEntTemp > 0) {
      setValue(
        'txbCoolingFluidEntTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingFluidEntTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblCoolingFluidEntTemp
          : '45'
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.dblCoolingFluidLvgTemp > 0) {
      setValue(
        'txbCoolingFluidLvgTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingFluidLvgTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblCoolingFluidLvgTemp
          : '55'
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intIsCoolingHWCUseCap != null) {
      setValue(
        'ckbCoolingCWCUseCap',
        unitInfo?.oUnitCompOpt?.intIsCoolingHWCUseCap != null
          ? unitInfo?.oUnitCompOpt?.intIsCoolingCWCUseCap
          : 0
      );
      // }

      setValue(
        'txbCoolingCWCCap',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingWCCap) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblCoolingWCCap
          : '0'
      );

      // if (unitInfo?.oUnitCompOpt?.intIsCoolingCWCUseFlowRate != null) {
      setValue(
        'ckbCoolingCWCUseFlowRate',
        unitInfo?.oUnitCompOpt?.intIsCoolingCWCUseFlowRate != null
          ? unitInfo?.oUnitCompOpt?.intIsCoolingCWCUseFlowRate
          : 0
      );
      // }

      setValue(
        'txbCoolingCWCFlowRate',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblCoolingCWCFlowRate) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblCoolingCWCFlowRate
          : '0'
      );

      setValue(
        'txbRefrigSuctionTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigSuctionTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblRefrigSuctionTemp
          : '43'
      );
      setValue(
        'txbRefrigLiquidTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigLiquidTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblRefrigLiquidTemp
          : '77'
      );
      setValue(
        'txbRefrigSuperheatTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigSuperheatTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblRefrigSuperheatTemp
          : '9'
      );

      // Heating
      // if (unitInfo?.oUnitCompOpt?.intHeatingCompId > 0) {
      setValue(
        'ddlHeatingComp',
        unitInfo?.oUnitCompOpt?.intHeatingCompId > 0
          ? unitInfo?.oUnitCompOpt?.intHeatingCompId
          : getValues('ddlHeatingComp')
      );
      // }

      setValue(
        'txbWinterHeatingSetpointDB',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingSetpointDB) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblHeatingSetpointDB
          : '72'
      );

      // if (unitInfo?.oUnitLayout?.intHeatingCoilHandingId > 0) {
      setValue(
        'ddlHeatingCoilHanding',
        unitInfo?.oUnitLayout?.intHeatingCoilHandingId > 0
          ? unitInfo?.oUnitLayout?.intHeatingCoilHandingId
          : getValues('ddlHeatingCoilHanding')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intHeatingElecHeaterInstallationId > 0) {
      setValue(
        'ddlHeatingElecHeaterInstall',
        unitInfo?.oUnitCompOpt?.intHeatingElecHeaterInstallationId > 0
          ? unitInfo?.oUnitCompOpt?.intHeatingElecHeaterInstallationId
          : getValues('ddlHeatingElecHeaterInstall')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0) {
      setValue(
        'ddlHeatingFluidType',
        unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0
          ? unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId
          : getValues('ddlHeatingFluidType')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId > 0) {
      setValue(
        'ddlHeatingFluidConcentration',
        unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId > 0
          ? unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId
          : getValues('ddlHeatingFluidConcentration')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp > 0) {
      setValue(
        'txbHeatingFluidEntTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp
          : '140'
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp > 0) {
      setValue(
        'txbHeatingFluidLvgTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp
          : '120'
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intIsHeatingHWCUseCap != null) {
      setValue(
        'ckbHeatingHWCUseCap',
        unitInfo?.oUnitCompOpt?.intIsHeatingHWCUseCap != null
          ? unitInfo?.oUnitCompOpt?.intIsHeatingHWCUseCap
          : 0
      );
      // }

      setValue(
        'txbHeatingHWCCap',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingHWCCap) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblHeatingHWCCap
          : '0'
      );

      // if (unitInfo?.oUnitCompOpt?.intIsHeatingHWCUseFlowRate != null) {
      setValue(
        'ckbHeatingHWCUseFlowRate',
        unitInfo?.oUnitCompOpt?.intIsHeatingHWCUseFlowRate != null
          ? unitInfo?.oUnitCompOpt?.intIsHeatingHWCUseFlowRate
          : 0
      );
      // }

      setValue(
        'txbHeatingHWCFlowRate',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingHWCFlowRate) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblHeatingHWCFlowRate
          : '0'
      );

      // Reheat
      // if (unitInfo?.oUnitCompOpt?.intReheatCompId > 0) {
      setValue(
        'ddlReheatComp',
        unitInfo?.oUnitCompOpt?.intReheatCompId > 0
          ? unitInfo?.oUnitCompOpt?.intReheatCompId
          : getValues('ddlReheatComp')
      );
      // }

      setValue(
        'txbSummerReheatSetpointDB',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblReheatSetpointDB) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblReheatSetpointDB
          : '70'
      );

      // if (unitInfo?.oUnitLayout?.intHeatingCoilHandingId > 0) {
      setValue(
        'ddlReheatCoilHanding',
        unitInfo?.oUnitLayout?.intHeatingCoilHandingId > 0
          ? unitInfo?.oUnitLayout?.intHeatingCoilHandingId
          : getValues('ddlReheatCoilHanding')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intHeatingElecHeaterInstallationId > 0) {
      setValue(
        'ddlReheatElecHeaterInstall',
        unitInfo?.oUnitCompOpt?.intHeatingElecHeaterInstallationId > 0
          ? unitInfo?.oUnitCompOpt?.intHeatingElecHeaterInstallationId
          : getValues('ddlReheatElecHeaterInstall')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0) {
      setValue(
        'ddlReheatFluidType',
        unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId > 0
          ? unitInfo?.oUnitCompOpt?.intHeatingFluidTypeId
          : getValues('ddlReheatFluidType')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId > 0) {
      setValue(
        'ddlReheatFluidConcentration',
        unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId > 0
          ? unitInfo?.oUnitCompOpt?.intHeatingFluidConcentId
          : getValues('ddlReheatFluidConcentration')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp > 0) {
      setValue(
        'txbReheatFluidEntTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblHeatingFluidEntTemp
          : '140'
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp > 0) {
      setValue(
        'txbReheatFluidLvgTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblHeatingFluidLvgTemp
          : '120'
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intIsReheatHWCUseCap > 0 ? ) {
      setValue(
        'ckbReheatHWCUseCap',
        unitInfo?.oUnitCompOpt?.intIsReheatHWCUseCap > 0
          ? unitInfo?.oUnitCompOpt?.intIsReheatHWCUseCap
          : 0
      );
      // }

      setValue(
        'txbReheatHWCCap',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblReheatHWCCap) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblReheatHWCCap
          : '0'
      );

      // if (unitInfo?.oUnitCompOpt?.intIsReheatHWCUseFlowRate > 0 ? ) {
      setValue(
        'ckbReheatHWCUseFlowRate',
        unitInfo?.oUnitCompOpt?.intIsReheatHWCUseFlowRate > 0
          ? unitInfo?.oUnitCompOpt?.intIsReheatHWCUseFlowRate
          : 0
      );
      // }

      setValue(
        'txbReheatHWCFlowRate',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblReheatHWCFlowRate) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblReheatHWCFlowRate
          : '0'
      );

      setValue(
        'txbRefrigCondensingTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigCondensingTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblRefrigCondensingTemp
          : '115'
      );
      setValue(
        'txbRefrigVaporTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigVaporTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblRefrigVaporTemp
          : '140'
      );
      setValue(
        'txbRefrigSubcoolingTemp',
        Number.parseFloat(unitInfo?.oUnitCompOpt?.dblRefrigSubcoolingTemp) > 0.0
          ? unitInfo?.oUnitCompOpt?.dblRefrigSubcoolingTemp
          : '5.4'
      );

      // if (unitInfo?.oUnitCompOpt?.intDamperAndActuatorId > 0) {
      setValue(
        'ddlDamperAndActuator',
        unitInfo?.oUnitCompOpt?.intDamperAndActuatorId > 0
          ? unitInfo?.oUnitCompOpt?.intDamperAndActuatorId
          : getValues('ddlDamperAndActuator')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intElecHeaterVoltageId > 0) {
      setValue(
        'ddlElecHeaterVoltage',
        unitInfo?.oUnitCompOpt?.intElecHeaterVoltageId > 0
          ? unitInfo?.oUnitCompOpt?.intElecHeaterVoltageId
          : getValues('ddlElecHeaterVoltage')
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intIsValveAndActuatorIncluded > 0 ) {
      setValue(
        'ckbValveAndActuator',
        unitInfo?.oUnitCompOpt?.intIsValveAndActuatorIncluded > 0
          ? unitInfo?.oUnitCompOpt?.intIsValveAndActuatorIncluded
          : 0
      );
      // }

      // if (unitInfo?.oUnitCompOpt?.intValveTypeId > 0) {
      setValue(
        'ddlValveType',
        unitInfo?.oUnitCompOpt?.intValveTypeId > 0
          ? unitInfo?.oUnitCompOpt?.intValveTypeId
          : getValues('ddlValveType')
      );
      // }

      // if (unitInfo?.oUnitLayout?.intHandingId > 0) {
      setValue(
        'ddlHanding',
        unitInfo?.oUnitLayout?.intHandingId > 0
          ? unitInfo?.oUnitLayout?.intHandingId
          : getValues('ddlHanding')
      );
      // }

      // if (unitInfo?.oUnitLayout?.intSAOpeningId > 0) {
      setValue(
        'ddlSupplyAirOpening',
        unitInfo?.oUnitLayout?.intSAOpeningId > 0
          ? unitInfo?.oUnitLayout?.intSAOpeningId
          : getValues('ddlSupplyAirOpening')
      );
      // }

      // if (unitInfo?.oUnitLayout?.intEAOpeningId > 0) {
      setValue(
        'ddlExhaustAirOpening',
        unitInfo?.oUnitLayout?.intEAOpeningId > 0
          ? unitInfo?.oUnitLayout?.intEAOpeningId
          : getValues('ddlExhaustAirOpening')
      );
      // }

      // if (unitInfo?.oUnitLayout?.intOAOpeningId > 0) {
      setValue(
        'ddlOutdoorAirOpening',
        unitInfo?.oUnitLayout?.intOAOpeningId > 0
          ? unitInfo?.oUnitLayout?.intOAOpeningId
          : getValues('ddlOutdoorAirOpening')
      );
      // }

      // if (unitInfo?.oUnitLayout?.intRAOpeningId > 0) {
      setValue(
        'ddlReturnAirOpening',
        unitInfo?.oUnitLayout?.intRAOpeningId > 0
          ? unitInfo?.oUnitLayout?.intRAOpeningId
          : getValues('ddlReturnAirOpening')
      );
      // }
    }
  }, []); // <-- empty dependency array - This will only trigger when the component mounts and no-render

  const onClickUnitInfo = () => {
    // setCurrentStep(1);
    push(PATH_APP.editUnit(projectId?.toString() || '0', unitId?.toString() || '0'));
  };


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
                  {isTagValue &&
                  <Typography sx={{color: '#e6382c'}}>Tag is required.</Typography>
                   }
                  <RHFTextField
                    size="small"
                    name="txbQty"
                    label="Quantity"
                    // onChange={(e: any) => {
                    //   setValueWithCheck(e, 'txbQty');
                    // }}
                  />
                  {/* {isAvailable(db?.dbtSelUnitType) && ( */}
                    <RHFSelect
                      native
                      size="small"
                      name="ddlUnitType"
                      label="Unit Type"
                      placeholder=""
                      disabled
                    >
                      {/* {sortedUnits?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.unit_type}
                        </option>
                      ))} */}
                      {unitTypeInfo?.fdtUnitType?.map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  {/* )} */}
                  {/* {isAvailable(locationInfo) && ( */}
                    <RHFSelect
                      native
                      size="small"
                      name="ddlLocation"
                      label="Location"
                      placeholder=""
                      onChange={ddlLocationChanged}
                    >
                      {locationInfo?.fdtLocation?. map((item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                  {/* )} */}
                  {/* <FormControlLabel
                    control={ */}
                  <RHFCheckbox
                    sx={{ ...getDisplay(formValues.ddlLocation === IDs.intLocationIdOutdoor) }}
                    label="Downshot"
                    name="ckbDownshot"
                    checked={formValues.ckbDownshot}
                    // onChange={() => setCkbDownshotVal(!formValues.ckbDownshotVal)}
                    onChange={(e: any) => setValue('ckbDownshot', Number(e.target.checked))}
                  />
                  {/* }
                     label="Downshot"
                   /> */}
                  {/* {isAvailable(orientationInfo) && ( */}
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
                  {/* )} */}
                  
                  <RHFSelect
                    native
                    size="small"
                    name="ddlControlsPref"
                    label="Controls Preference"
                    placeholder=""
                    // sx={getDisplay(controlsPrefInfo?.isVisible)}
                    onChange={(e: any) => {
                      setValue('ddlControlsPref', Number(e.target.value));
                    }}
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
                    onChange={(e: any) => {setValue('ddlControlVia', Number(e.target.value));}}
                  >
                    {controlViaInfo?.fdtControlVia?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>
              </Grid>
              <Grid item xs={4} md={4}>
                <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                  <RHFTextField
                    size="small"
                    name="txbSummerSupplyAirCFM"
                    label="Supply Air (CFM)"
                    // onChange={(e: any) => {setValueWithCheck(e, 'txbSummerSupplyAirCFM');}}
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
                    label={`Passive House Certification: `}
                    name="ckbPHI"
                    sx={getDisplay(intProductTypeID === IDs.intProdTypeIdVentumPlus)}
                    // sx={{color: ckbBypassInfo.text !== '' ? colors.red[500] : 'text.primary', size: 'small', }}
                    checked={formValues.ckbBypass}
                    // onChange={() => setCkbBypassVal(!formValues.ckbBypassVal)}
                    onChange={(e: any) => {
                      setValue('ckbPHI', Number(e.target.checked));
                    }}
                  />
                  <RHFCheckbox
                    label={`Bypass for Economizer: ${bypassInfo?.bypassMsg}`}
                    name="ckbBypass"
                    sx={getDisplay(bypassInfo?.isVisible)}
                    // sx={{color: ckbBypassInfo.text !== '' ? colors.red[500] : 'text.primary', size: 'small', }}
                    checked={bypassInfo?.isChecked}
                    // onChange={() => setCkbBypassVal(!formValues.ckbBypassVal)}
                    onChange={(e: any) => {setValue('ckbBypass', Number(e.target.checked));}}
                    disabled={!bypassInfo?.isEnabled}
                  />
                  {/* }
                    label={`Bypass for Economizer: ${ckbBypassInfo.text}`}
                  /> */}
                  {/* {isAvailable(unitModel) && ( */}
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
                  {/* )} */}
                  {/* {isAvailable(unitVoltage) && ( */}
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
                  {/* )} */}
                  <RHFCheckbox
                    label="Single Point Power Connection"
                    name="ckbVoltageSPP"
                    checked={formValues.ckbVoltageSPP}
                    onChange={(e: any) => setValue('ckbVoltageSPP', Number(e.target.checked))}
                    sx={getDisplay(
                      intProductTypeID === IDs.intProdTypeIdNova ||
                        intProductTypeID === IDs.intProdTypeIdVentum ||
                        intProductTypeID === IDs.intProdTypeIdVentumPlus ||
                        intProductTypeID === IDs.intProdTypeIdTerra
                    )}
                  />
                  {isAvailable(outdoorAirFilterInfo?.fdtOutdoorAirFilter) && (
                    <RHFSelect
                      native
                      size="small"
                      name="ddlOA_FilterModel"
                      label="OA Filter"
                      onChange={(e: any) => setValue('ddlOA_FilterModel', Number(e.target.value))}
                    >
                      {outdoorAirFilterInfo?.fdtOutdoorAirFilter?.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
                  )}
                  <RHFSelect
                    native
                    size="small"
                    name="ddlRA_FilterModel"
                    label="RA Filter"
                    sx={getDisplay(returnAirFilterInfo?.isVisible)}
                    onChange={(e: any) => setValue('ddlRA_FilterModel', Number(e.target.value))}
                  >
                    {returnAirFilterInfo?.fdtReturnAirFilter?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                  <RHFCheckbox
                    label="Mixing Section"
                    name="ckbMixingBox"
                    checked={formValues.ckbVoltageSPP}
                    onChange={(e: any) => setValue('ckbMixingBox', Number(e.target.checked))}
                    sx={getDisplay(intProductTypeID === IDs.intProdTypeIdTerra)}
                  />                
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel2}
          sx={getDisplay(getValues('ckbMixingBox'))}
          onChange={() => setExpanded({ ...expanded, panel2: !expanded.panel2 })}
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
            <Box
              sx={{
                display: 'grid',
                rowGap: 1,
                columnGap: 1,
                gridTemplateColumns: { xs: 'repeat(6, 1fr)' },
              }}
            >
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2">SUMMER</Typography></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2">WINTER</Typography></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2">Outdoor Air (% / CFM)</Typography></Stack>
          <Stack spacing={1}>
            <RHFTextField
              size="small"
                name="txbMixSummerOA_CFMPct"
                label="%"
                autoComplete="off"
                onChange={(e: any) => {
                  setValueWithCheck1(e, 'txbMixSummerOA_CFMPct');
                }}
                />
          </Stack> 
          <Stack spacing={1}>
            <RHFTextField
              size="small"
              name="txbMixSummerOA_CFM"
              label="CFM"
              disabled
            />
          </Stack>  
          {/* <TextField
            name="txbMixSummerOA_CFM"

      /> */}
          <Stack spacing={1}>
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
          <Stack spacing={1}>
            <RHFTextField
              size="small"
              name="txbMixWinterOA_CFM"
              label="CFM"
              disabled
            />
          </Stack> 
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>

          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2">Return Air (% / CFM)</Typography></Stack>
          <Stack spacing={1}>
            <RHFTextField
              size="small"
              name="txbMixSummerRA_CFMPct"
              label="%"
              autoComplete="off"
              disabled
              onChange={(e: any) => {setValueWithCheck1(e, 'txbMixSummerRA_CFMPct');}}
            />
          </Stack>  
          <Stack spacing={1}>
            <RHFTextField
              size="small"
              name="txbMixSummerRA_CFM"
              label="CFM"
              disabled
            />
          </Stack> 
                <Stack spacing={1}>
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
                <Stack spacing={1}>
            <RHFTextField
              size="small"
              name="txbMixWinterRA_CFM"
              label="CFM"
              disabled
            />
          </Stack>           
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>

          <Stack spacing={1}> 
              <RHFCheckbox
                  label="Use Project Default"
                  name="ckbMixUseProjectDefault"
                  onChange={(e: any) => setValue('ckbMixUseProjectDefault', Number(e.target.checked))}
                /> 
          </Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>

          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2">OUTDOOR AIR</Typography></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>

          <Typography color="primary.main" variant="subtitle2">Dry Bulb Temperature (F)</Typography>
          <Stack spacing={1}>
                <RHFTextField
                  size="small"
                  name="txbMixSummerOA_DB"
                  label=""
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  onChange={(e: any) => { setValueWithCheck1(e, 'txbMixSummerOA_DB'); }}
                  onBlur={handleMixSummerOA_DBChanged}
                />
          </Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}>
                <RHFTextField
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  size="small"
                  name="txbMixWinterOA_DB"
                  label=""
                  onChange={(e: any) => { setValueWithCheck1(e, 'txbMixWinterOA_DB');}}
                  onBlur={handleMixWinterOA_DBChanged}
                />
          </Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>

          <Typography color="primary.main" variant="subtitle2">Wet Bulb Temperature (F)</Typography>
          <Stack spacing={1}>
              <RHFTextField
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  size="small"
                  name="txbMixSummerOA_WB"
                  label=""
                  onChange={(e: any) => { setValueWithCheck1(e, 'txbMixSummerOA_WB'); }}
                  onBlur={handleMixSummerOA_WBChanged}
                />
          </Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}>
                <RHFTextField
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  size="small"
                  name="txbMixWinterOA_WB"
                  label=""
                  onChange={(e: any) => { setValueWithCheck1(e, 'txbMixWinterOA_WB'); }}
                  onBlur={handleMixWinterOA_WBChanged}
                />  
          </Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>

          <Typography color="primary.main" variant="subtitle2">Relative Humidity (%)</Typography>
          <Stack spacing={1}>
              <RHFTextField
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  size="small"
                  name="txbMixSummerOA_RH"
                  label=""
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbMixSummerOA_RH');
                  }}
                  onBlur={handleMixSummerOA_RHChanged}
                />
          </Stack> 
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}>
                <RHFTextField
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  size="small"
                  name="txbMixWinterOA_RH"
                  label=""
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbMixWinterOA_RH');
                  }}
                  onBlur={handleMixWinterOA_RHChanged}
                />  
          </Stack>    
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>

          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2">RETURN AIR</Typography></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>

          <Typography color="primary.main" variant="subtitle2">Dry Bulb Temperature (F)</Typography>
          <Stack spacing={1}>
                <RHFTextField
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  size="small"
                  name="txbMixSummerRA_DB"
                  label=""
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbMixSummerRA_DB');
                  }}
                  onBlur={handleMixSummerRA_DBChanged}
                />
          </Stack>  
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}>
                  <RHFTextField
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  size="small"
                  name="txbMixWinterRA_DB"
                  label=""
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbMixWinterRA_DB');
                  }}
                  onBlur={handleMixWinterRA_DBChanged}
                />
          </Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>

          <Typography color="primary.main" variant="subtitle2">Wet Bulb Temperature (F)</Typography>
          <Stack spacing={1}>
              <RHFTextField
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  size="small"
                  name="txbMixSummerRA_WB"
                  label=""
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbMixSummerRA_WB');
                  }}
                  onBlur={handleMixSummerRA_WBChanged}
                />
          </Stack>  
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}>
                <RHFTextField
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  size="small"
                  name="txbMixWinterRA_WB"
                  label=""
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbMixWinterRA_WB');
                  }}
                  onBlur={handleMixWinterRA_WBChanged}
                />  
          </Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>

          <Typography color="primary.main" variant="subtitle2">Relative Humidity (%)</Typography>
          <Stack spacing={1}>
              <RHFTextField
                  disabled= {getValues('ckbMixUseProjectDefault')}
                  size="small"
                  name="txbMixSummerRA_RH"
                  label=""
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbMixSummerRA_RH');
                  }}
                  onBlur={handleMixSummerRA_RHChanged}
                />
          </Stack>  
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}>
            <RHFTextField
              disabled= {getValues('ckbMixUseProjectDefault')}
              size="small"
              name="txbMixWinterRA_RH"
              label=""
              onChange={(e: any) => { setValueWithCheck1(e, 'txbMixWinterRA_RH'); }}
              onBlur={handleMixWinterRA_RHChanged}
            />  
              </Stack>  
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
          <Stack spacing={1}><Typography color="primary.main" variant="subtitle2"/></Stack>
            </Box>
          </AccordionDetails>
        </Accordion>        
        <Accordion
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
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 3,
                gridTemplateColumns: { xs: 'repeat(3, 1fr)' },
              }}
            >
              <Stack spacing={1}>
                {/* {isAvailable(dtPreheatComp) && ( */}
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
                {/* )} */}
                <RHFTextField
                  size="small"
                  name="txbWinterPreheatSetpointDB"
                  label="Preheat LAT Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    formValues.ddlPreheatComp === IDs.intCompIdAuto ||
                      formValues.ddlPreheatComp === IDs.intCompIdElecHeater ||
                      formValues.ddlPreheatComp === IDs.intCompIdHWC
                  )}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbWinterPreheatSetpointDB');
                  }}
                />
                {/* {isAvailable(db?.dbtSelHanding) && ( */}
                  <RHFSelect
                    native
                    size="small"
                    name="ddlPreheatCoilHanding"
                    label="Preheat Coil Handing"
                    sx={getDisplay(preheatCoilHandingInfo?.isVisible)}
                    onChange={(e: any) => setValue('ddlPreheatCoilHanding', Number(e.target.value))}
                  >
                    {preheatCoilHandingInfo?.fdtHanding?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                {/* )} */}
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
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbBackupHeatingSetpointDB');}}
                />
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(Number(formValues.ddlPreheatComp) === IDs.intCompIdElecHeater) }}
              >
                {/* {isAvailable(preheatElecHeaterInstallationInfo) && ( */}
                  <RHFSelect
                    native
                    size="small"
                    name="ddlPreheatElecHeaterInstall"
                    label="Preheat Elec. Heater Installation"
                    placeholder=""
                    // sx={getDisplay()}
                    onChange={(e: any) => setValue('ddlPreheatElecHeaterInstall', Number(e.target.value))}
                  >
                    {preheatElecHeaterInfo?.fdtElecHeaterInstall?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                {/* )} */}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(formValues.ddlPreheatComp === IDs.intCompIdHWC) }}
              >
                {isAvailable(db?.dbtSelFluidType) && (
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
                )}
                {isAvailable(db?.dbtSelFluidConcentration) && (
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
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbHeatingFluidLvgTemp');
                  }}
                />
              </Stack>
              <Stack
                spacing={1}
                // sx={{mb: 3, display: getInlineDisplay(internCompInfo?.isCustomCompVisible),}}
                sx={getDisplay(Number(formCurrValues.ddlPreheatComp) === IDs.intCompIdHWC &&  internCompInfo?.isCustomCompVisible)}

              >
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divPreheatHWC_UseCapVisible)}
                  control={ */}
                <RHFCheckbox
                  label="Preheat HWC Use Capacity"
                  name="ckbPreheatHWCUseCap"
                  // sx={getInlineDisplay(internCompInfo?.isCutomVisible)}
                  checked={formValues.ckbPreheatHWCUseCap}
                  onChange={(e: any) => setValue('ckbPreheatHWCUseCap', Number(e.target.checked))}
                />
                {/* }
                  label="Preheat HWC Use Capacity"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbPreheatHWCCap"
                  label="Preheat HWC Capacity (MBH)"
                  // sx={getDisplay(formValues.ddlPreheatCompId === IDs.intCompHWC_ID)}
                  disabled={preheatHWCCapInfo.isDisabled}
                  // value={preheatHWCUseCapInfo.resetCapacity}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbPreheatHWCCap');
                  }}
                />
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divPreheatHWC_UseFlowRateVisible)}
                  control={ */}
                <RHFCheckbox
                  label="Preheat HWC Use Flow Rate"
                  name="ckbPreheatHWCUseFlowRate"
                  // sx={getInlineDisplay(customInputs.divPreheatHWC_UseFlowRateVisible)}
                  checked={formValues.ckbPreheatHWCUseFlowRate}
                  onChange={(e: any) =>
                    setValue('ckbPreheatHWCUseFlowRate', Number(e.target.checked))
                  }
                />
                {/* }
                  label="Preheat HWC Use Flow Rate"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbPreheatHWCFlowRate"
                  label="Preheat HWC Flow Rate (GPM)"
                  // sx={getDisplay(customInputs.divPreheatHWC_UseFlowRateVisible)}
                  disabled={preheatHWCFlowRateInfo.isDisabled}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbPreheatHWCFlowRate');
                  }}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
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
              COOLING
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
                {/* {isAvailable(dtCoolingComp) && ( */}
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
                {/* )} */}
                <RHFTextField
                  size="small"
                  name="txbSummerCoolingSetpointDB"
                  label="Cooling LAT Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    formValues.ddlCoolingComp === IDs.intCompIdCWC ||
                      formValues.ddlCoolingComp === IDs.intCompIdDX
                  )}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbSummerCoolingSetpointDB');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbSummerCoolingSetpointWB"
                  label="Cooling LAT Setpoint WB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    Number(formValues.ddlCoolingComp) === IDs.intCompIdCWC ||
                      Number(formValues.ddlCoolingComp) === IDs.intCompIdDX
                  )}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbSummerCoolingSetpointWB');
                  }}
                />

                {/* <FormControlLabel
                  sx={getInlineDisplay(formValues.ddlCoolingCompId === IDs.intCompDX_ID)}
                  control={ */}
                <RHFCheckbox
                  label="Heat Pump"
                  name="ckbHeatPump"
                  sx={{ display: heatPumpInfo?.isVisible ? 'block' : 'none' }}
                  // checked={formValues.ckbHeatPump}
                  checked={heatPumpInfo?.isChecked}
                  // onChange={ckbHeatPumpChanged}
                  onChange={(e: any) => setValue('ckbHeatPump', Number(e.target.checked))}
                />

                <RHFCheckbox
                  label="Dehumidification"
                  name="ckbDehumidification"
                  sx={getInlineDisplay(dehumInfo?.isVisible)}
                  checked={dehumInfo?.isChecked}
                  // onChange={(e: any) => setCkbDehumidificationVal(e.target.checked)}
                  onChange={(e: any) => setValue('ckbDehumidification', Number(e.target.checked))}
                />

                {/* {isAvailable(db?.dbtSelHanding) && ( */}
                  <RHFSelect
                    native
                    size="small"
                    name="ddlCoolingCoilHanding"
                    label="Cooling Coil Handing"
                    sx={getDisplay(coolingCoilHandingInfo?.isVisible)}
                    onChange={(e: any) => setValue('ddlCoolingCoilHanding', Number(e.target.value))}
                  >
                    {coolingCoilHandingInfo?.fdtHanding?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                {/* )} */}
              </Stack>
              <Stack
                spacing={1}
                sx={{
                  mb: 3,
                  display: getInlineDisplay(formValues.ddlCoolingComp === IDs.intCompIdDX),
                }}
              >
                <RHFTextField
                  size="small"
                  name="txbRefrigSuctionTemp"
                  label="Suction Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbRefrigSuctionTemp');
                  }}
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
              <Stack
                spacing={1}
                sx={{ ...getDisplay(Number(formValues.ddlCoolingComp) === IDs.intCompIdCWC) }}
              >
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
                <RHFTextField
                  size="small"
                  name="txbCoolingFluidEntTemp"
                  label="Cooling Fluid Ent Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbCoolingFluidEntTemp');
                  }}
                />

                <RHFTextField
                  size="small"
                  name="txbCoolingFluidLvgTemp"
                  label="Cooling Fluid Lvg Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbCoolingFluidLvgTemp');
                  }}
                />
              </Stack>

              <Stack
                spacing={1}
                sx={{mb: 3, display: getInlineDisplay(Number(formValues.ddlCoolingComp) === IDs.intCompIdCWC &&  internCompInfo?.isCustomCompVisible),}}
             >
                <RHFCheckbox
                  label="Cooling CWC Use Capacity"
                  name="ckbCoolingCWCUseCap"
                  // sx={{...getInlineDisplay(customInputs.divCoolingCWC_UseCapVisible),margin: 0,}}
                  checked={formValues.ckbCoolingCWCUseCap}
                  onChange={(e: any) => setValue('ckbCoolingCWCUseCap', Number(e.target.checked))}
                />
                <RHFTextField
                  size="small"
                  name="txbCoolingCWCCap"
                  label="Cooling CWC Capacity (MBH)"
                  disabled={coolingCWCCapInfo.isDisabled}
                  // sx={getDisplay(customInputs.divCoolingCWC_UseCapVisible)}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbCoolingCWCCap');
                  }}
                />
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  control={ */}
                <RHFCheckbox
                  label="Cooling CWC Use Flow Rate"
                  name="ckbCoolingCWCUseFlowRate"
                  // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  checked={formValues.ckbCoolingCWCUseFlowRate}
                  onChange={(e: any) =>
                    setValue('ckbCoolingCWCUseFlowRate', Number(e.target.checked))
                  }
                />
                {/* }
                  label="Cooling CWC Use Flow Rate"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbCoolingCWCFlowRate"
                  label="Cooling CWC Flow Rate (GPM)"
                  // sx={getDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  disabled={coolingCWCFlowRateInfo.isDisabled}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbCoolingCWCFlowRate');
                  }}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.panel4}
          sx={getDisplay(heatingCompInfo?.isVisible)}
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
                gridTemplateColumns: { xs: 'repeat(3, 1fr)' },
              }}
            >
              <Stack spacing={1}>
                {/* {isAvailable(dtHeatingComp) && ( */}
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingComp"
                    label="Heating"
                    // sx={getDisplay(heatingCompInfo?.isVisible)}
                    // onChange={ddlHeatingCompChanged}
                  >
                    {heatingCompInfo?.fdtHeatingComp?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                {/* )} */}
                <RHFTextField
                  size="small"
                  name="txbWinterHeatingSetpointDB"
                  label="Heating LAT Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    Number(formValues.ddlHeatingComp) === IDs.intCompIdElecHeater ||
                      Number(formValues.ddlHeatingComp) === IDs.intCompIdHWC ||
                      formValues.ckbHeatPump
                  )}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbWinterHeatingSetpointDB');
                  }}
                />
                {/* {isAvailable(db?.dbtSelHanding) && ( */}
                  <RHFSelect
                    native
                    size="small"
                    name="ddlHeatingCoilHanding"
                    label="Heating Coil Handing"
                    sx={getDisplay(heatingCoilHandingInfo?.isVisible)}
                    onChange={ddlHeatingCoilHandingChanged}
                  >
                    {heatingCoilHandingInfo?.fdtHanding?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                {/* )} */}
              </Stack>
              <Stack
                spacing={1}
                sx={{
                  ...getDisplay(Number(formValues.ddlHeatingComp) === IDs.intCompIdElecHeater),
                }}
              >
                {isAvailable(heatingElecHeaterInfo?.fdtElecHeaterInstall) && (
                  <RHFSelect
                    native
                    label="Heating Elec. Heater Installation"
                    name="ddlHeatingElecHeaterInstall"
                    size="small"
                    placeholder=""
                    // onChange={(e: any) => setValue('ddlHeatingElecHeaterInstall', Number(e.target.value)) }
                  >
                    {heatingElecHeaterInfo?.fdtElecHeaterInstall?.map(
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
                sx={{ ...getDisplay(Number(formValues.ddlHeatingComp) === IDs.intCompIdHWC) }}
              >
                {isAvailable(db?.dbtSelFluidType) && (
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
                )}
                {isAvailable(db?.dbtSelFluidType && db?.dbtSelFluidConcentration) && (
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
                )}
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidEntTemp"
                  label="Heating Fluid Ent Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbHeatingFluidEntTemp');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbHeatingFluidLvgTemp"
                  label="Heating Fluid Lvg Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbHeatingFluidLvgTemp');
                  }}
                />
              </Stack>
              <Stack
                spacing={1}
                sx={getDisplay(Number(formCurrValues.ddlHeatingComp) === IDs.intCompIdHWC &&  internCompInfo?.isCustomCompVisible)}
              >
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  control={ */}
                <RHFCheckbox
                  // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  label="Heating HWC Use Capacity"
                  name="ckbHeatingHWCUseCap"
                  checked={formValues.ckbHeatingHWCUseCap}
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
                  disabled={heatingHWCCapInfo.isDisabled}
                  onChange={(e: any) => {setValueWithCheck1(e, 'txbHeatingHWCCap');}}
                />
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  control={ */}
                <RHFCheckbox
                  // sx={getInlineDisplay(customInputs.divCoolingCWC_UseFlowRateVisible)}
                  label="Heating HWC Use Flow Rate"
                  name="ckbHeatingHWCUseFlowRate"
                  checked={formValues.ckbHeatingHWCUseFlowRate}
                  onChange={(e: any) => setValue('ckbHeatingHWCUseFlowRate', Number(e.target.checked))}
                />
                {/* }
                  label="Heating HWC Use Flow Rate"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbHeatingHWCFlowRate"
                  label="Heating HWC Flow Rate (GPM)"
                  disabled={heatingHWCFlowRateInfo.isDisabled}
                  // sx={getDisplay(customInputs.divHeatingHWC_UseFlowRateVisible)}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbHeatingHWCFlowRate');
                  }}
                />
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion
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
              REHEAT
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
                {/* {isAvailable(dtReheatComp) && ( */}
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
                {/* )} */}
                <RHFTextField
                  size="small"
                  name="txbSummerReheatSetpointDB"
                  label="Dehum. Reheat Setpoint DB (F):"
                  autoComplete="off"
                  sx={getDisplay(
                    Number(formValues.ddlReheatComp) === IDs.intCompIdElecHeater ||
                      Number(formValues.ddlReheatComp) === IDs.intCompIdHWC ||
                      Number(formValues.ddlReheatComp) === IDs.intCompIdHGRH
                  )}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbSummerReheatSetpointDB');
                  }}
                />
                {/* {isAvailable(db?.dbtSelHanding) && ( */}
                  <RHFSelect
                    native
                    size="small"
                    name="ddlReheatCoilHanding"
                    label="Reheat Coil Handing"
                    sx={getDisplay(reheatCoilHandingInfo?.isVisible)}
                    onChange={ddlReheatCoilHandingChanged}
                  >
                    {reheatCoilHandingInfo?.fdtHanding?.map((item: any, index: number) => (
                      <option key={index} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                  </RHFSelect>
                {/* )} */}
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdElecHeater) }}
              >
                {isAvailable(heatingElecHeaterInfo?.fdtElecHeaterInstall) && (
                  <RHFSelect
                    native
                    size="small"
                    name="ddlReheatElecHeaterInstall"
                    label="Reheat Elec. Heater Installation"
                    // onChange={(e: any) => setValue('ddlReheatElecHeaterInstall', Number(e.target.value))}
                    placeholder=""
                  >
                    {heatingElecHeaterInfo?.fdtElecHeaterInstall?.map(
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
                sx={{ ...getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdHWC) }}
              >
                {isAvailable(db?.dbtSelFluidType) && (
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
                )}
                {isAvailable(db?.dbtSelFluidType && db?.dbtSelFluidConcentration) && (
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
                )}
                <RHFTextField
                  size="small"
                  name="txbReheatFluidEntTemp"
                  label="Reheat Fluid Ent Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbReheatFluidEntTemp');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbReheatFluidLvgTemp"
                  label="Reheat Fluid Lvg Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbReheatFluidLvgTemp');
                  }}
                />
              </Stack>
              <Stack
                spacing={1}
                sx={getDisplay(Number(formCurrValues.ddlReheatComp) === IDs.intCompIdHWC &&  internCompInfo?.isCustomCompVisible)}
                >
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divReheatHWC_UseCapVisible)}
                  control={ */}
                <RHFCheckbox
                  label="Reheat HWC Use Capacity"
                  name="ckbReheatHWCUseCap"
                  // sx={getInlineDisplay(customInputs.divReheatHWC_UseCapVisible)}
                  checked={formValues.ckbReheatHWCUseCap}
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
                  disabled={reheatHWCCapInfo.isDisabled}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbReheatHWCCap');
                  }}
                />
                {/* <FormControlLabel
                  sx={getInlineDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                  control={ */}
                <RHFCheckbox
                  label="Reheat HWC Use Flow Rate"
                  name="ckbReheatHWCUseFlowRate"
                  // sx={getInlineDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                  checked={formValues.ckbReheatHWCUseFlowRate}
                  onChange={(e: any) =>
                    setValue('ckbReheatHWCUseFlowRate', Number(e.target.checked))
                  }
                />
                {/* }
                  label="Reheat HWC Use Flow Rate"
                /> */}
                <RHFTextField
                  size="small"
                  name="txbReheatHWCFlowRate"
                  label="Reheat HWC Flow Rate (GPM)"
                  // sx={getDisplay(customInputs.divReheatHWC_UseFlowRateVisible)}
                  disabled={reheatHWCFlowRateInfo.isDisabled}
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbReheatHWCFlowRate');
                  }}
                />
              </Stack>
              <Stack
                spacing={1}
                sx={{ ...getDisplay(Number(formValues.ddlReheatComp) === IDs.intCompIdHGRH) }}
              >
                <RHFTextField
                  size="small"
                  name="txbRefrigCondensingTemp"
                  label="Condensing Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbRefrigCondensingTemp');
                  }}
                />
                <RHFTextField
                  size="small"
                  name="txbRefrigVaporTemp"
                  label="Condensing Temp (F)"
                  onChange={(e: any) => {
                    setValueWithCheck1(e, 'txbRefrigVaporTemp');
                  }}
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
                  <RHFSelect
                    native
                    size="small"
                    name="ddlElecHeaterVoltage"
                    label="Elec. Heater Voltage"
                    placeholder=""
                    sx={getDisplay(elecHeaterVoltageInfo?.isVisible)}
                    // disabled={elecHeaterVoltageInfo?.isEnabled}
                    onChange={ddlElecHeaterVoltageChanged}
                  >
                    {elecHeaterVoltageInfo?.fdtElecHeaterVoltage?.map(
                      (item: any, index: number) => (
                        <option key={index} value={item.id}>
                          {item.items}
                        </option>
                      )
                    )}
                  </RHFSelect>
                {/* )} */}
                {/* <FormControlLabel
                  sx={getDisplay(valveAndActuatorInfo.divValveAndActuatorVisible)}
                  control={ */}
                <RHFCheckbox
                  label="Include Valves & Actuator"
                  name="ckbValveAndActuator"
                  sx={getDisplay(valveAndActuatorInfo.divValveAndActuatorVisible)}
                  defaultChecked={formValues.ckbValveAndActuator}
                  // onChange={() => setCkbValveAndActuatorVal(!formValues.ckbValveAndActuatorVal)}
                  onChange={(e: any) => setValue('ckbValveAndActuator', Number(e.target.checked))}
                />
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
                <RHFSelect
                  native
                  size="small"
                  name="ddlValveType"
                  label="Valve Type"
                  sx={getDisplay(valveTypeInfo?.isVisible)}
                  onChange={ddlValveTypeChanged}
                >
                  {valveTypeInfo?.fdtValveType?.map((item: any, index: number) => (
                    <option key={index} value={item.id}>
                      {item.items}
                    </option>
                  ))}
                </RHFSelect>
                <RHFSelect
                  native
                  size="small"
                  name="ddlEKEXVKitInstallation"
                  label="EKEXV Valves and Controllers"
                  // sx={getDisplay(!!damperAndActuatorInfo.divDamperAndActuatorVisible)}
                  onChange={(e: any) => {
                    setValue('ddlEKEXVKitInstallation', Number(e.target.value));
                  }}
                  placeholder=""
                >
                  {db?.dbtSelEKEXVKitInstallation?.map((item: any, index: number) => (
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
                    <RHFSelect
                      native
                      size="small"
                      name="ddlHanding"
                      label="Handing"
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
                  {/* {isAvailable(supplyAirOpeningInfo.ddlSupplyAirOpeningDataTbl) && ( */}
                    <RHFSelect
                      native
                      size="small"
                      name="ddlSupplyAirOpening"
                      label="Supply Air Opening"
                      placeholder=""
                      // sx={getDisplay(supplyAirOpeningInfo?.isVisible)}
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
                  {/* )} */}
                  {/* {isAvailable(remainingOpeningsInfo.ddlExhaustAirOpeningDataTbl) && ( */}
                    <RHFSelect
                      native
                      size="small"
                      name="ddlExhaustAirOpening"
                      label="Exhaust Air Opening"
                      sx={getDisplay(remainingOpeningsInfo?.isExhaustAirOpeningVisible)}
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
                  {/* )} */}
                  {/* {isAvailable(remainingOpeningsInfo.ddlOutdoorAirOpeningDataTbl) && ( */}
                    <RHFSelect
                      native
                      size="small"
                      name="ddlOutdoorAirOpening"
                      label="Outdoor Air Opening"
                      placeholder=""
                      sx={getDisplay(remainingOpeningsInfo?.isOutdoorAirOpeningVisible)}           
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
                  {/* )} */}
                  {/* {isAvailable(remainingOpeningsInfo?.ddlReturnAirOpeningDataTbl) && ( */}
                    <RHFSelect
                      native
                      size="small"
                      name="ddlReturnAirOpening"
                      label="Return Air Opening"
                      sx={getDisplay(remainingOpeningsInfo?.isReturnAirOpeningVisible)}
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
                  {/* )} */}
                    <RHFSelect
                      native
                      size="small"
                      name="ddlMixOADamperPos"
                      label="Mixing Outdoor Air Damper"
                      sx={getDisplay(getValues('ckbMixingBox'))}
                      placeholder=""
                      // onChange={ddlReturnAirOpeningChanged}
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
                      // onChange={ddlReturnAirOpeningChanged}
                    >
                      {mixRADamperPosInfo?.ftdMixRADamperPos?.map(
                        (item: any, index: number) => (
                          <option key={index} value={item.id}>
                            {item.items}
                          </option>
                        )
                      )}
                    </RHFSelect>
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
        <Stack direction="row" justifyContent="flex-end" textAlign="right">
          <Box sx={{ width: '150px' }}>
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
                    // disabled={validateContinue()}
                    // loading={isSaving}
                  >
                    Update Unit
                  </LoadingButton>
                ) : (
                  <>
                  {(Number(unitId) > 0 && !isLoading) ? (
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={onClickUnitInfo}
                    // sx={{ display: currentStep === 2 && !isProcessingData ? 'inline-flex' : 'none' }}
                    startIcon={<Iconify icon="akar-icons:arrow-left" />}
                  >
                    Unit info
                  </Button>
                  ) : (
                    null
                  )}
                  </>
                )}
                </>
              )}
          </Box>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
