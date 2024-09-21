import { useMemo } from 'react';
import { intDesignDataIdCooling_004_Heating_996 } from 'src/utils/ids';
import * as Yup from 'yup';

export const useGetDefaultValue = (edit: boolean, unitInfo: any, data: any) => {
const {
    strTag,
    intQty,
    intProdTypeId,
    intUnitTypeId,
    intUnitVoltageId,
    intIsVoltageSPP,
    intIsPHI,
    intIsBypass,
    intUnitModelId,
    intSelectionTypeId,
    intLocationId,
    intIsDownshot,
    intOrientationId,
    intControlsPreferenceId,
    intControlViaId,
    dblUnitHeight,
    dblUnitLength,
    dblUnitWeight,
    dblUnitWidth,
    intIsselectionCompleted,
    dblUnitPrice,
  } = unitInfo?.oUnit || {};


  const {
    intAltitude,
    intSummerSupplyAirCFM,
    intSummerReturnAirCFM,
    intWinterSupplyAirCFM,
    intWinterReturnAirCFM,
    dblSummerOutdoorAirDB,
    dblSummerOutdoorAirWB,
    dblSummerOutdoorAirRH,
    dblWinterOutdoorAirDB,
    dblWinterOutdoorAirWB,
    dblWinterOutdoorAirRH,
    dblSummerReturnAirDB,
    dblSummerReturnAirWB,
    dblSummerReturnAirRH,
    dblWinterReturnAirDB,
    dblWinterReturnAirWB,
    dblWinterReturnAirRH,
    dblMixSummerOA_CFMPct,
    dblMixWinterOA_CFMPct,
    intIsMixUseProjectDefault,
    dblMixSummerOutdoorAirDB,
    dblMixSummerOutdoorAirWB,
    dblMixSummerOutdoorAirRH,
    dblMixWinterOutdoorAirDB,
    dblMixWinterOutdoorAirWB,
    dblMixWinterOutdoorAirRH,
    dblMixSummerReturnAirDB,
    dblMixSummerReturnAirWB,
    dblMixSummerReturnAirRH,
    dblMixWinterReturnAirDB,
    dblMixWinterReturnAirWB,
    dblMixWinterReturnAirRH,
    dblSupplyAirESP,
    dblExhaustAirESP,
  } = unitInfo?.oUnitAirflow || {};

  const {
    intOAFilterModelId,
    intSAFinalFilterModelId,
    intRAFilterModelId,
    intIsMixingBox,
    intPreheatCompId,
    intIsBackupHeating,
    intHeatExchCompId,
    intCoolingCompId,
    intHeatingCompId,
    intReheatCompId,
    intIsHeatPump,
    intIsDehumidification,
    intElecHeaterVoltageId,
    intPreheatElecHeaterInstallationId,
    intHeatingElecHeaterInstallationId,
    intDamperAndActuatorId,
    intIsValveAndActuatorIncluded,
    intValveTypeId,
    intEKEXVInstallId,
    intIsDrainPan,
    dblOAFilterPD,
    dblRAFilterPD,
    dblPreheatSetpointDB,
    dblCoolingSetpointDB,
    dblCoolingSetpointWB,
    dblHeatingSetpointDB,
    dblReheatSetpointDB,
    dblBackupHeatingSetpontDB,
    intCoolingFluidTypeId,
    intCoolingFluidConcentId,
    dblCoolingFluidEntTemp,
    dblCoolingFluidLvgTemp,
    dblRefrigSuctionTemp,
    dblRefrigLiquidTemp,
    dblRefrigSuperheatTemp,
    intHeatingFluidTypeId,
    intHeatingFluidConcentId,
    dblHeatingFluidEntTemp,
    dblHeatingFluidLvgTemp,
    dblRefrigCondensingTemp,
    dblRefrigVaporTemp,
    dblRefrigSubcoolingTemp,
  } = unitInfo?.oUnitCompOpt || {};


  const {
    intIsPreheatHWCUseCap,
    dblPreheatHWCCap,
    intIsPreheatHWCUseFlowRate,
    dblPreheatHWCFlowRate,
    intIsCoolingCWCUseCap,
    dblCoolingCWCCap,
    intIsCoolingCWCUseFlowRate,
    dblCoolingCWCFlowRate,
    intIsHeatingHWCUseCap,
    dblHeatingHWCCap,
    intIsHeatingHWCUseFlowRate,
    dblHeatingHWCFlowRate,
    intIsReheatHWCUseCap,
    dblReheatHWCCap,
    intIsReheatHWCUseFlowRate,
    dblReheatHWCFlowRate,
  } = unitInfo?.oUnitCompOptCust || {};


  const {
    intHandingId,
    intPreheatCoilHandingId,
    intCoolingCoilHandingId,
    intHeatingCoilHandingId,
    intSAOpeningId,
    strSAOpening,
    intEAOpeningId,
    strEAOpening,
    intOAOpeningId,
    strOAOpening,
    intRAOpeningId,
    strRAOpening,
    intMixOADamperPosId,
    intMixRADamperPosId,
  } = unitInfo?.oUnitLayout || {};



  const defaultValues = useMemo(
    () => ({
      // Unit
      intProductTypeID: edit ? intProdTypeId : 0,
      intUnitTypeID: edit ? intUnitTypeId : 0,
      ddlUnitType: edit ? intUnitTypeId : 0,
      txtTag: edit ? strTag: '',
      txbQty: edit ? intQty: 1,
      ddlUnitVoltage: edit ? intUnitVoltageId : 1,
      ckbVoltageSPP: edit ? intIsVoltageSPP : 0,
      ddlUnitModel: edit ? intUnitModelId : 1,
      ddlLocation: edit ? intLocationId : 1,
      ddlOrientation: edit ? intOrientationId : 1,
      ddlTempControl: 0,
      ddlControlsPref: edit ? intControlsPreferenceId : 1,
      ddlControlVia: edit ? intControlViaId : 1,
      ckbDownshot: edit ? intIsDownshot : 0,
      ckbBypass: edit ? intIsBypass : 0,
      ckbPHI: edit ? intIsPHI : 0,

      // Airflow
      txbAltitude: intAltitude || 0,
      txbSummerSupplyAirCFM: edit ? intSummerSupplyAirCFM : 325,
      txbSummerReturnAirCFM: edit ? intSummerReturnAirCFM : 325,
      txbSummerOutdoorAirDB: edit ? dblSummerOutdoorAirDB : 0,
      txbSummerOutdoorAirWB: edit ? dblSummerOutdoorAirWB : 0,
      txbSummerOutdoorAirRH: edit ? dblSummerOutdoorAirRH : 0,
      txbWinterOutdoorAirDB: edit ? dblWinterOutdoorAirDB : 0,
      txbWinterOutdoorAirWB: edit ? dblWinterOutdoorAirWB : 0,
      txbWinterOutdoorAirRH: edit ? dblWinterOutdoorAirRH : 0,
      txbSummerReturnAirDB: edit ? dblSummerReturnAirDB : 0,
      txbSummerReturnAirWB: edit ? dblSummerReturnAirWB : 0,
      txbSummerReturnAirRH: edit ? dblSummerReturnAirRH : 0,
      txbWinterReturnAirDB: edit ? dblWinterReturnAirDB : 0,
      txbWinterReturnAirWB: edit ? dblWinterReturnAirWB : 0,
      txbWinterReturnAirRH: edit ? dblWinterReturnAirRH : 0,
      txbMixSummerOA_CFMPct: edit ? dblMixSummerOA_CFMPct : 70,
      txbMixSummerOA_CFM: 0,
      txbMixSummerRA_CFMPct: 30,
      txbMixSummerRA_CFM: 0,
      txbMixWinterOA_CFMPct: edit ? dblMixWinterOA_CFMPct : 70,
      txbMixWinterOA_CFM: 0,
      txbMixWinterRA_CFMPct: 30,
      txbMixWinterRA_CFM: 0,
      ckbMixUseProjectDefault: edit ? intIsMixUseProjectDefault : 0,
      txbMixSummerOA_DB: edit ? dblMixSummerOutdoorAirDB : 0,
      txbMixSummerOA_WB: edit ? dblMixSummerOutdoorAirWB : 0,
      txbMixSummerOA_RH: edit ? dblMixSummerOutdoorAirRH : 0,
      txbMixWinterOA_DB: edit ? dblMixWinterOutdoorAirDB : 0,
      txbMixWinterOA_WB: edit ? dblMixWinterOutdoorAirWB : 0,
      txbMixWinterOA_RH: edit ? dblMixWinterOutdoorAirRH : 0,
      txbMixSummerRA_DB: edit ? dblMixSummerReturnAirDB : 0,
      txbMixSummerRA_WB: edit ? dblMixSummerReturnAirWB : 0,
      txbMixSummerRA_RH: edit ? dblMixSummerReturnAirRH : 0,
      txbMixWinterRA_DB: edit ? dblMixWinterReturnAirDB : 0,
      txbMixWinterRA_WB: edit ? dblMixWinterReturnAirWB : 0,
      txbMixWinterRA_RH: edit ? dblMixWinterReturnAirRH : 0,
      txbSupplyAirESP: edit ? dblSupplyAirESP : 0.75,
      txbExhaustAirESP: edit ? dblExhaustAirESP : 0.75,
      // Comp Opt
      ddlOA_FilterModel: edit ? intOAFilterModelId : 0,
      ddlOA_FilterCondition: 0,
      ddlRA_FilterModel: edit ? intRAFilterModelId : 0,
      ckbMixingBox: edit ? intIsMixingBox : 0,
      ddlPreheatComp: edit ? intPreheatCompId : 0,
      ckbBackupHeating: edit ? intIsBackupHeating : 0,
      ddlHeatExchComp: edit ? intHeatExchCompId : 0,
      ddlCoolingComp: edit ? intCoolingCompId : 0,
      ckbDehumidification: edit ? intIsDehumidification : 0,
      ckbHeatPump: edit ? intIsHeatPump : 0,
      ddlHeatingComp: edit ? intHeatingCompId : 0,
      ddlReheatComp: edit ? intReheatCompId : 0,
      ddlElecHeaterVoltage: edit ? intElecHeaterVoltageId : 0,
      ddlPreheatElecHeaterInstall: edit ? intPreheatElecHeaterInstallationId : 0,
      ddlHeatingElecHeaterInstall: edit ? intHeatingElecHeaterInstallationId : 0,
      ddlReheatElecHeaterInstall: edit ? intHeatingElecHeaterInstallationId : 0,
      ddlDamperAndActuator: edit ? intDamperAndActuatorId : 0,
      ckbValveAndActuator: edit ? intIsValveAndActuatorIncluded : 0,
      ddlValveType: edit ? intValveTypeId : 0,
      ddlEKEXVKitInstallation: edit ? intEKEXVInstallId : 0,
      ckbDrainPan: edit ? intIsDrainPan : 0,
      txbOA_FilterPD: edit ? dblOAFilterPD : 0.5,
      txbRA_FilterPD: edit ? dblRAFilterPD : 0.5,
      txbWinterPreheatSetpointDB: edit ? dblPreheatSetpointDB : 40,
      txbSummerCoolingSetpointDB: edit ? dblCoolingSetpointDB : 55,
      txbSummerCoolingSetpointWB: edit ? dblCoolingSetpointWB : 55,
      txbWinterHeatingSetpointDB: edit ? dblHeatingSetpointDB : 72,
      txbSummerReheatSetpointDB: edit ? dblReheatSetpointDB : 70,
      txbBackupHeatingSetpointDB: edit ? dblBackupHeatingSetpontDB : 40,
      ddlPreheatFluidType: edit ? intHeatingFluidTypeId : 0,
      ddlPreheatFluidConcentration: edit ? intHeatingFluidConcentId : 0,
      txbPreheatFluidEntTemp: edit ? dblHeatingFluidEntTemp : 140,
      txbPreheatFluidLvgTemp: edit ? dblHeatingFluidLvgTemp : 120,
      ddlCoolingFluidType: edit ? intCoolingFluidTypeId : 0,
      ddlCoolingFluidConcentration: edit ? intCoolingFluidConcentId : 0,
      txbCoolingFluidEntTemp: edit ? dblCoolingFluidEntTemp : 45,
      txbCoolingFluidLvgTemp: edit ? dblCoolingFluidLvgTemp : 55,
      ddlHeatingFluidType: edit ? intHeatingFluidTypeId : 0,
      ddlHeatingFluidConcentration: edit ? intHeatingFluidConcentId : 0,
      txbHeatingFluidEntTemp: edit ? dblHeatingFluidEntTemp : 140,
      txbHeatingFluidLvgTemp: edit ? dblHeatingFluidLvgTemp : 120,
      ddlReheatFluidType: edit ? intHeatingFluidTypeId : 0,
      ddlReheatFluidConcentration: edit ? intHeatingFluidConcentId : 0,
      txbReheatFluidEntTemp: edit ? dblHeatingFluidEntTemp : 140,
      txbReheatFluidLvgTemp: edit ? dblHeatingFluidLvgTemp : 120,
      txbRefrigSuctionTemp: edit ? dblRefrigSuctionTemp : 43,
      txbRefrigLiquidTemp: edit ? dblRefrigLiquidTemp : 77,
      txbRefrigSuperheatTemp: edit ? dblRefrigSuperheatTemp : 9,
      txbRefrigCondensingTemp: edit ? dblRefrigCondensingTemp : 115,
      txbRefrigVaporTemp: edit ? dblRefrigVaporTemp : 140,
      txbRefrigSubcoolingTemp: edit ? dblRefrigSubcoolingTemp : 5.4,
      txbPercentCondensingLoad: 100,
      // Comp Opt Cust
      ckbPreheatHWCUseCap: edit ? intIsPreheatHWCUseCap : 0,
      txbPreheatHWCCap: edit ? dblPreheatHWCCap : 0,
      ckbPreheatHWCUseFlowRate: edit ? intIsPreheatHWCUseFlowRate : 0,
      txbPreheatHWCFlowRate: edit ? dblPreheatHWCFlowRate : 0,
      ckbCoolingCWCUseCap: edit ? intIsCoolingCWCUseCap : 0,
      txbCoolingCWCCap: edit ? dblCoolingCWCCap : 0,
      ckbCoolingCWCUseFlowRate: edit ? intIsCoolingCWCUseFlowRate : 0,
      txbCoolingCWCFlowRate: edit ? dblCoolingCWCFlowRate : 0,
      ckbHeatingHWCUseCap: edit ? intIsHeatingHWCUseCap : 0,
      txbHeatingHWCCap: edit ? dblHeatingHWCCap : 0,
      ckbHeatingHWCUseFlowRate: edit ? intIsHeatingHWCUseFlowRate : 0,
      txbHeatingHWCFlowRate: edit ? dblHeatingHWCFlowRate : 0,
      ckbReheatHWCUseCap: edit ? intIsReheatHWCUseCap : 0,
      txbReheatHWCCap: edit ? dblReheatHWCCap : 0,
      ckbReheatHWCUseFlowRate: edit ? intIsReheatHWCUseFlowRate : 0,
      txbReheatHWCFlowRate: edit ? dblReheatHWCFlowRate : 0,
      txbUnitHeightText: edit ? dblUnitHeight : 0,
      txbUnitLengthText: edit ? dblUnitLength : 0,
      txbUnitWeightText: edit ? dblUnitWeight : 0,
      txbUnitWidthText: edit ? dblUnitWidth : 0,
      // Layout
      ddlHanding: edit ? intHandingId : 0,
      ddlPreheatCoilHanding: edit ? intPreheatCoilHandingId : 0,
      ddlCoolingCoilHanding: edit ? intCoolingCoilHandingId : 0,
      ddlHeatingCoilHanding: edit ? intHeatingCoilHandingId : 0,
      ddlReheatCoilHanding: edit ? intHeatingCoilHandingId : 0,
      ddlSupplyAirOpening: edit ? intSAOpeningId : 0,
      ddlSupplyAirOpeningText: edit ? strSAOpening : '',
      ddlExhaustAirOpening: edit ? intEAOpeningId : 0,
      ddlExhaustAirOpeningText: edit ? strEAOpening : '',
      ddlOutdoorAirOpening: edit ? intOAOpeningId : 0,
      ddlOutdoorAirOpeningText: edit ? strOAOpening : '',
      ddlReturnAirOpening: edit ? intRAOpeningId : 0,
      ddlReturnAirOpeningText: edit ? strRAOpening : '',
      ddlMixOADamperPos: edit ? intMixOADamperPosId : 0,
      ddlMixRADamperPos: edit ? intMixRADamperPosId : 0,
      layoutImage: {},
    }),
    [
      edit,
      intProdTypeId,
      intUnitTypeId,
      strTag,
      intQty,
      intUnitVoltageId,
      intIsVoltageSPP,
      intUnitModelId,
      intLocationId,
      intOrientationId,
      intControlsPreferenceId,
      intControlViaId,
      intIsDownshot,
      intIsPHI,
      intIsBypass,
      // Airflow
      intAltitude,
      intSummerSupplyAirCFM,
      intSummerReturnAirCFM,
      dblSummerOutdoorAirDB,
      dblSummerOutdoorAirWB,
      dblSummerOutdoorAirRH,
      dblWinterOutdoorAirDB,
      dblWinterOutdoorAirWB,
      dblWinterOutdoorAirRH,
      dblSummerReturnAirDB,
      dblSummerReturnAirWB,
      dblSummerReturnAirRH,
      dblWinterReturnAirDB,
      dblWinterReturnAirWB,
      dblWinterReturnAirRH,
      dblMixSummerOA_CFMPct,
      dblMixWinterOA_CFMPct,
      intIsMixUseProjectDefault,
      dblMixSummerOutdoorAirDB,
      dblMixSummerOutdoorAirWB,
      dblMixSummerOutdoorAirRH,
      dblMixWinterOutdoorAirDB,
      dblMixWinterOutdoorAirWB,
      dblMixWinterOutdoorAirRH,
      dblMixSummerReturnAirDB,
      dblMixSummerReturnAirWB,
      dblMixSummerReturnAirRH,
      dblMixWinterReturnAirDB,
      dblMixWinterReturnAirWB,
      dblMixWinterReturnAirRH,  
      dblSupplyAirESP,
      dblExhaustAirESP,
      // Comp Opt
      intOAFilterModelId,
      intRAFilterModelId,
      intIsMixingBox,
      intPreheatCompId,
      intIsBackupHeating,
      intHeatExchCompId,
      intCoolingCompId,
      intIsDehumidification,
      intIsHeatPump,
      intHeatingCompId,
      intReheatCompId,
      intElecHeaterVoltageId,
      intPreheatElecHeaterInstallationId,
      intHeatingElecHeaterInstallationId,
      intDamperAndActuatorId,
      intIsValveAndActuatorIncluded,
      intValveTypeId,
      intEKEXVInstallId,
      intIsDrainPan,
      dblOAFilterPD,
      dblRAFilterPD,
      dblPreheatSetpointDB,
      dblCoolingSetpointDB,
      dblCoolingSetpointWB,
      dblHeatingSetpointDB,
      dblReheatSetpointDB,
      dblBackupHeatingSetpontDB,
      intCoolingFluidTypeId,
      intCoolingFluidConcentId,
      dblCoolingFluidEntTemp,
      dblCoolingFluidLvgTemp,
      intHeatingFluidTypeId,
      intHeatingFluidConcentId,
      dblHeatingFluidEntTemp,
      dblHeatingFluidLvgTemp,
      dblRefrigSuctionTemp,
      dblRefrigLiquidTemp,
      dblRefrigSuperheatTemp,
      dblRefrigCondensingTemp,
      dblRefrigVaporTemp,
      dblRefrigSubcoolingTemp,
      // Comp Opt Cust
      intIsPreheatHWCUseCap,
      dblPreheatHWCCap,
      intIsPreheatHWCUseFlowRate,
      dblPreheatHWCFlowRate,
      intIsCoolingCWCUseCap,
      dblCoolingCWCCap,
      intIsCoolingCWCUseFlowRate,
      dblCoolingCWCFlowRate,
      intIsHeatingHWCUseCap,
      dblHeatingHWCCap,
      intIsHeatingHWCUseFlowRate,
      dblHeatingHWCFlowRate,
      intIsReheatHWCUseCap,
      dblReheatHWCCap,
      intIsReheatHWCUseFlowRate,
      dblReheatHWCFlowRate,
      dblUnitHeight,
      dblUnitLength,
      dblUnitWeight,
      dblUnitWidth,
      // Layout
      intHandingId,
      intPreheatCoilHandingId,
      intCoolingCoilHandingId,
      intHeatingCoilHandingId,
      intSAOpeningId,
      strSAOpening,
      intEAOpeningId,
      strEAOpening,
      intOAOpeningId,
      strOAOpening,
      intRAOpeningId,
      strRAOpening,    
      intMixOADamperPosId,
      intMixRADamperPosId,
    ]
  );

  return defaultValues;
};

export const unitEditFormSchema = Yup.object().shape({
  txtTag: Yup.string().required('This field is required!'),
  txbQty: Yup.number().required('This field is required!'),
  ddlLocation: Yup.number(),
  ddlOrientation: Yup.number(),
  // ddlUnitType: Yup.number().required('This field is required!'),
  ddlUnitType: Yup.number(),
  ddlControlsPreference: Yup.number(),
  ddlControlVia: Yup.number(),
  txbSummerSupplyAirCFM: Yup.number().required('This field is required!'),
  txbSummerReturnAirCFM: Yup.number().required('This field is required!'),
  txbSupplyAirESP: Yup.number().required('This field is required!'),
  txbExhaustAirESP: Yup.number().required('This field is required!'),
  ddlUnitModel: Yup.number(),
  ddlUnitVoltage: Yup.number(),
  txbWinterPreheatSetpointDB: Yup.number().required('This field is required!'),
  txbSummerCoolingSetpointDB: Yup.number().required('This field is required!'),
  txbSummerCoolingSetpointWB: Yup.number().required('This field is required!'),
  txbWinterHeatingSetpointDB: Yup.number().required('This field is required!'),
  txbSummerReheatSetpointDB: Yup.number().required('This field is required!'),
  ddlOA_FilterModel: Yup.number(),
  ddlOA_FilterCondition: Yup.number(),
  ddlRA_FilterModel: Yup.number(),
  ddlPreheatComp: Yup.number(),
  ddlHeatExchComp: Yup.number(),
  ddlCoolingComp: Yup.number(),
  ddlHeatingComp: Yup.number(),
  txbOA_FilterPD: Yup.number().required('This field is required!'),
  txbRA_FilterPD: Yup.number().required('This field is required!'),
  ddlReheatCompId: Yup.number(),
  ddlDamperAndActuator: Yup.number(),
  ddlElecHeaterVoltage: Yup.number(),
  ddlPreheatElecHeaterInstallation: Yup.number(),
  ddlHeatElecHeaterInstallation: Yup.number(),
  ddlReheatElecHeaterInstall: Yup.number(),
  ddlPreheatCoilHanding: Yup.number(),
  ddlCoolingCoilHanding: Yup.number(),
  ddlHeatingCoilHanding: Yup.number(),
  ddlValveType: Yup.number(),
  txbPreheatHWCCap: Yup.number(),
  txbPreheatHWCFlowRate: Yup.number(),
  txbCoolingCWCCap: Yup.number(),
  txbCoolingCWCFlowRate: Yup.number(),
  txbHeatingHWCCap: Yup.number(),
  txbHeatingHWCFlowRate: Yup.number(),
  txbReheatHWCCap: Yup.number(),
  txbReheatHWCFlowRate: Yup.number(),
  ddlCoolingFluidType: Yup.number(),
  ddlCoolingFluidConcentration: Yup.number(),
  txbCoolingFluidEntTemp: Yup.number().required('This field is required!'),
  txbCoolingFluidLvgTemp: Yup.number().required('This field is required!'),
  txbRefrigSuctionTemp: Yup.number().required('This field is required!'),
  txbRefrigLiquidTemp: Yup.number().required('This field is required!'),
  txbRefrigSuperheatTemp: Yup.number().required('This field is required!'),
  ddlHeatingFluidType: Yup.number(),
  ddlHeatingFluidConcentration: Yup.number(),
  txbHeatingFluidEntTemp: Yup.number().required('This field is required!'),
  txbHeatingFluidLvgTemp: Yup.number().required('This field is required!'),
  txbRefrigCondensingTemp: Yup.number().required('This field is required!'),
  txbRefrigVaporTemp: Yup.number().required('This field is required!'),
  txbRefrigSubcoolingTemp: Yup.number().required('This field is required!'),
  txbPercentCondensingLoad: Yup.number().required('This field is required!'),
  txbUnitHeightText: Yup.number().required('This field is required!'),
  txbUnitLengthText: Yup.number().required('This field is required!'),
  txbUnitWeightText: Yup.number().required('This field is required!'),
  txbUnitWidthText: Yup.number().required('This field is required!'),
  ddlHandingId: Yup.number(),
  ddlSupplyAirOpening: Yup.number(),
  ddlSupplyAirOpeningText: Yup.string(),
  ddlExhaustAirOpening: Yup.number(),
  ddlExhaustAirOpeningText: Yup.string(),
  ddlOutdoorAirOpening: Yup.number(),
  ddlOutdoorAirOpeningText: Yup.string(),
  ddlReturnAirOpening: Yup.number(),
  ddlReturnAirOpeningText: Yup.string(),
});
